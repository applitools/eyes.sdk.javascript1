;(function() {
  'use strict'

  var GeneralUtils = require('@applitools/eyes-common-legacy').GeneralUtils
  var CoordinatesType = require('./CoordinatesType').CoordinatesType

  /**
   * Handles matching of output with the expected output (including retry and 'ignore mismatch' when needed).
   *
   * @param {PromiseFactory} promiseFactory An object which will be used for creating deferreds/promises.
   * @param {ServerConnector} serverConnector Our gateway to the agent
   * @param {RunningSession} runningSession The running session in which we should match the window
   * @param {number} retryTimeout The default total time to retry matching (ms).
   * @param {{appOutput: {screenShot64: string, title: string}, screenShot: {imageBuffer: Buffer, width: number, height: number}}} appOutputProvider A callback for getting the application output when performing match
   * @param {Function} waitTimeout - a call back that provides timeout
   * @param {Logger} logger
   * @constructor
   **/
  function MatchWindowTask(
    promiseFactory,
    serverConnector,
    runningSession,
    retryTimeout,
    appOutputProvider,
    waitTimeout,
    logger,
  ) {
    this._promiseFactory = promiseFactory
    this._serverConnector = serverConnector
    this._runningSession = runningSession
    this._defaultRetryTimeout = retryTimeout
    this._getAppOutput = appOutputProvider
    this._matchResult = undefined
    this._waitTimeout = waitTimeout
    this._logger = logger
  }

  MatchWindowTask.prototype.getLastScreenshotBounds = function() {
    return this._lastBounds
  }

  function _finalize(regionProvider, ignoreMismatch, screenshot, resolve) {
    this._logger.verbose('MatchWindowTask.matchWindow - _finalize called')
    this._matchResult.screenshot = screenshot
    if (ignoreMismatch) {
      this._logger.verbose(
        'MatchWindowTask.matchWindow - _finalize is completed because ignoreMismatch is true',
      )
      resolve(this._matchResult)
      return
    }

    if (!regionProvider) {
      if (!screenshot) {
        this._logger.verbose(
          'MatchWindowTask.matchWindow - _finalize sets infinite bounds - no region and no screen shot',
        )
        // We set an "infinite" image size since we don't know what the screenshot size is...
        this._lastBounds = {
          top: 0,
          left: 0,
          width: 1000000000,
          height: 1000000000,
        }
      } else {
        this._logger.verbose(
          'MatchWindowTask.matchWindow - _finalize sets bounds - according to screen shot',
        )

        this._lastBounds = {
          top: 0,
          left: 0,
          width: screenshot.width,
          height: screenshot.height,
        }
      }
    } else {
      this._logger.verbose(
        'MatchWindowTask.matchWindow - _finalize sets bounds - according to region',
      )
      this._lastBounds = regionProvider.getRegion()
    }

    this._logger.verbose('last bounds:', this._lastBounds)

    resolve(this._matchResult)
  }

  function _match(
    regionProvider,
    tag,
    ignoreMismatch,
    imageMatchSettings,
    userInputs,
    lastScreenshot,
    source,
    resolve,
  ) {
    this._logger.verbose('MatchWindowTask.matchWindow - _match calls for app output')
    return this._getAppOutput(regionProvider, lastScreenshot).then(
      function(appOutput) {
        this._logger.verbose('MatchWindowTask.matchWindow - _match retrieved app output')
        var data = {
          userInputs: userInputs,
          appOutput: appOutput.appOutput,
          tag: tag,
          ignoreMismatch: ignoreMismatch,
          options: {
            name: tag,
            userInputs: userInputs,
            imageMatchSettings: imageMatchSettings,
            ignoreMismatch: ignoreMismatch,
            source: source,
          },
        }

        var id = GeneralUtils.guid()
        return this._serverConnector
          .uploadScreenshot(id, appOutput.screenShot.imageBuffer)
          .then(
            function(screenShotUrl) {
              data.appOutput.screenshotUrl = screenShotUrl
              return data
            }.bind(this),
          )
          .then(
            function(data) {
              return this._serverConnector.matchWindow(this._runningSession, data)
            }.bind(this),
          )
          .then(
            function(matchResult) {
              this._logger.verbose(
                'MatchWindowTask.matchWindow - _match received server connector result:',
                matchResult,
              )
              this._matchResult = matchResult
              return _finalize.call(
                this,
                regionProvider,
                ignoreMismatch,
                appOutput.screenShot,
                resolve,
              )
            }.bind(this),
          )
      }.bind(this),
    )
  }

  function _retryMatch(
    start,
    retryTimeout,
    regionProvider,
    tag,
    userInputs,
    lastScreenshot,
    ignoreMismatch,
    imageMatchSettings,
    screenshot,
    source,
    resolve,
  ) {
    var appOutput
    if (new Date().getTime() - start < retryTimeout) {
      this._logger.verbose('MatchWindowTask._retryMatch will retry')
      this._logger.verbose('MatchWindowTask._retryMatch calls for app output')
      return this._getAppOutput(regionProvider, lastScreenshot)
        .then(function(appOutput_) {
          appOutput = appOutput_
          for (var i = 0; i < imageMatchSettings.ignore.length; i++) {
            var ignoreElement = imageMatchSettings.ignore[i]

            var location = {x: ignoreElement.left, y: ignoreElement.top}
            var converted = appOutput.eyesScreenshot.convertLocationFromLocation(
              location,
              CoordinatesType.CONTEXT_RELATIVE,
              CoordinatesType.SCREENSHOT_AS_IS,
            )

            ignoreElement.left = converted.x
            ignoreElement.top = converted.y
          }
        })
        .then(
          function() {
            this._logger.verbose('MatchWindowTask._retryMatch retrieved app output')
            screenshot = appOutput.screenShot
            var data = {
              userInputs: userInputs,
              appOutput: appOutput.appOutput,
              tag: tag,
              ignoreMismatch: true,
              options: {
                name: tag,
                userInputs: userInputs,
                imageMatchSettings: imageMatchSettings,
                ignoreMismatch: true,
                source: source,
              },
            }
            this._logger.verbose('MatchWindowTask._retryMatch calls matchWindow')

            var id = GeneralUtils.guid()
            return this._serverConnector
              .uploadScreenshot(id, appOutput.compressScreenshot || appOutput.screenShot)
              .then(
                function(screenShotUrl) {
                  data.appOutput.screenshotUrl = screenShotUrl
                  return data
                }.bind(this),
              )
              .then(
                function(data) {
                  return this._serverConnector.matchWindow(this._runningSession, data)
                }.bind(this),
              )
              .then(
                function(result) {
                  this._logger.verbose(
                    'MatchWindowTask.matchWindow - _retryMatch received server connector result:',
                    result,
                  )
                  this._matchResult = result

                  if (!this._matchResult.asExpected) {
                    this._logger.verbose(
                      'MatchWindowTask.matchWindow - _retryMatch received failed result -',
                      'timeout and retry',
                    )
                    return this._waitTimeout(500).then(
                      function() {
                        this._logger.verbose(
                          'MatchWindowTask.matchWindow -',
                          '_retryMatch timeout passed -  retrying',
                        )
                        return _retryMatch.call(
                          this,
                          start,
                          retryTimeout,
                          regionProvider,
                          tag,
                          userInputs,
                          lastScreenshot,
                          ignoreMismatch,
                          imageMatchSettings,
                          screenshot,
                          source,
                          resolve,
                        )
                      }.bind(this),
                    )
                  }
                  this._logger.verbose(
                    'MatchWindowTask.matchWindow -',
                    '_retryMatch received success result - finalizing',
                  )
                  return _finalize.call(this, regionProvider, ignoreMismatch, screenshot, resolve)
                }.bind(this),
              )
          }.bind(this),
        )
    }
    this._logger.verbose('MatchWindowTask.matchWindow - _retryMatch exhausted the retry interval')
    if (!this._matchResult || !this._matchResult.asExpected) {
      // Try one last time...
      this._logger.verbose(
        'MatchWindowTask.matchWindow - _retryMatch last attempt because we got failure',
      )
      return _match.call(
        this,
        regionProvider,
        tag,
        ignoreMismatch,
        imageMatchSettings,
        userInputs,
        lastScreenshot,
        source,
        resolve,
      )
    }

    this._logger.verbose(
      'MatchWindowTask.matchWindow - _retryMatch no need for ',
      'last attempt because we got success',
    )
    return _finalize.call(this, regionProvider, ignoreMismatch, screenshot, resolve)
  }

  MatchWindowTask.prototype.matchWindow = function(
    userInputs,
    lastScreenshot,
    regionProvider,
    tag,
    shouldRunOnceOnRetryTimeout,
    ignoreMismatch,
    retryTimeout,
    imageMatchSettings,
    source,
  ) {
    this._logger.verbose(
      'MatchWindowTask.matchWindow called with shouldRunOnceOnRetryTimeout: ',
      shouldRunOnceOnRetryTimeout,
      ', ignoreMismatch:',
      ignoreMismatch,
      ', retryTimeout:',
      retryTimeout,
    )

    if (retryTimeout < 0) {
      retryTimeout = this._defaultRetryTimeout
    }

    return this._promiseFactory.makePromise(
      function(resolve) {
        this._logger.verbose('MatchWindowTask.matchWindow starting to perform the match process')
        if (shouldRunOnceOnRetryTimeout || retryTimeout === 0) {
          if (retryTimeout > 0) {
            this._logger.verbose(
              'MatchWindowTask.matchWindow - running once but after going into timeout',
            )
            return this._waitTimeout(retryTimeout).then(
              function() {
                this._logger.verbose(
                  'MatchWindowTask.matchWindow - back from timeout - calling match',
                )
                return _match.call(
                  this,
                  regionProvider,
                  tag,
                  ignoreMismatch,
                  imageMatchSettings,
                  userInputs,
                  lastScreenshot,
                  source,
                  resolve,
                )
              }.bind(this),
            )
          }
          this._logger.verbose('MatchWindowTask.matchWindow - running once immediately')
          return _match.call(
            this,
            regionProvider,
            tag,
            ignoreMismatch,
            imageMatchSettings,
            userInputs,
            lastScreenshot,
            source,
            resolve,
          )
        }
        // Retry matching and ignore mismatches while the retry timeout does not expires.
        var start = new Date().getTime()
        this._logger.verbose('MatchWindowTask.matchWindow - starting retry sequence. start:', start)
        return _retryMatch.call(
          this,
          start,
          retryTimeout,
          regionProvider,
          tag,
          userInputs,
          lastScreenshot,
          ignoreMismatch,
          imageMatchSettings,
          undefined,
          source,
          resolve,
        )
      }.bind(this),
    )
  }

  exports.MatchWindowTask = MatchWindowTask
})()
