;(function() {
  'use strict'

  var VERSION = require('./../package.json').version

  var LFT = require('leanft'),
    LeanftSdkWeb = require('leanft.sdk.web'),
    EyesSDK = require('eyes.sdk'),
    EyesUtils = require('eyes.utils'),
    EyesWebBrowser = require('./EyesWebBrowser').EyesWebBrowser,
    EyesStdWinWindow = require('./EyesStdWinWindow').EyesStdWinWindow,
    EyesLeanFTUtils = require('./EyesLeanFTUtils').EyesLeanFTUtils,
    EyesWebTestObject = require('./EyesWebTestObject').EyesWebTestObject,
    ScrollPositionProvider = require('./ScrollPositionProvider').ScrollPositionProvider,
    CssTranslatePositionProvider = require('./CssTranslatePositionProvider')
      .CssTranslatePositionProvider,
    ElementPositionProvider = require('./ElementPositionProvider').ElementPositionProvider,
    EyesRegionProvider = require('./EyesRegionProvider').EyesRegionProvider,
    Target = require('./Target').Target
  var Reporter = LFT.Reporter,
    WebBaseDescription = LeanftSdkWeb.Behaviors.WebBaseDescription,
    WebBaseTestObject = LeanftSdkWeb.Behaviors.WebBaseTestObject,
    EyesBase = EyesSDK.EyesBase,
    ContextBasedScaleProviderFactory = EyesSDK.ContextBasedScaleProviderFactory,
    FixedScaleProviderFactory = EyesSDK.FixedScaleProviderFactory,
    NullScaleProvider = EyesSDK.NullScaleProvider,
    Logger = EyesSDK.Logger,
    MutableImage = EyesSDK.MutableImage,
    CoordinatesType = EyesSDK.CoordinatesType,
    ScaleProviderIdentityFactory = EyesSDK.ScaleProviderIdentityFactory,
    PromiseFactory = EyesUtils.PromiseFactory,
    ArgumentGuard = EyesUtils.ArgumentGuard,
    SimplePropertyHandler = EyesUtils.SimplePropertyHandler,
    GeometryUtils = EyesUtils.GeometryUtils

  var DEFAULT_WAIT_BEFORE_SCREENSHOTS = 100, // ms
    UNKNOWN_DEVICE_PIXEL_RATIO = 0,
    DEFAULT_DEVICE_PIXEL_RATIO = 1

  /**
   * @readonly
   * @enum {string}
   */
  var StitchMode = {
    // Uses scrolling to get to the different parts of the page.
    Scroll: 'Scroll',

    // Uses CSS transitions to get to the different parts of the page.
    CSS: 'CSS',
  }

  /**
   * Initializes an Eyes instance.
   * @param {string} [serverUrl] - The Eyes server URL.
   * @param {boolean} [isDisabled] - set to true to disable Applitools Eyes and use the webdriver directly.
   * @augments EyesBase
   * @constructor
   **/
  function Eyes(serverUrl, isDisabled) {
    this._forceFullPage = false
    this._imageRotationDegrees = 0
    this._automaticRotation = true
    this._isLandscape = false
    this._hideScrollbars = null
    this._checkFrameOrElement = false
    this._stitchMode = StitchMode.Scroll
    this._promiseFactory = new PromiseFactory()
    this._waitBeforeScreenshots = DEFAULT_WAIT_BEFORE_SCREENSHOTS
    this._checkWindowIndex = 0

    EyesBase.call(this, this._promiseFactory, serverUrl || EyesBase.DEFAULT_EYES_SERVER, isDisabled)
  }

  Eyes.prototype = new EyesBase()
  Eyes.prototype.constructor = Eyes
  Eyes.prototype._getBaseAgentId = function() {
    return 'leanft-js/' + VERSION
  }

  //noinspection JSUnusedGlobalSymbols
  /**
   * Starts a test.
   * @param {Web.Browser|StdWin.Window} browser - The web driver that controls the browser hosting the application under test.
   * @param {string} appName - The name of the application under test.
   * @param {string} testName - The test name.
   * @param {{width: number, height: number}} viewportSize - The required browser's
   * viewport size (i.e., the visible part of the document's body) or to use the current window's viewport.
   * @return {Promise<EyesWebBrowser|EyesStdWinWindow>} A wrapped WebDriver which enables Eyes trigger recording and frame handling.
   */
  Eyes.prototype.open = function(browser, appName, testName, viewportSize) {
    var that = this

    Reporter.startReportingContext('Applitools.open()')
    var browserClassName = browser.constructor.name
    if (browserClassName === 'Browser') {
      that._driver = new EyesWebBrowser(browser, that, that._logger, that._promiseFactory)
    } else if (browserClassName === 'UiObjectBaseTO') {
      that._driver = new EyesStdWinWindow(browser, that, that._logger, that._promiseFactory)
    } else {
      that._driver = browser
    }

    that._promiseFactory.setFactoryMethods(
      function(asyncAction) {
        return browser._session._promiseManager.syncedBranchThen(function() {
          return new Promise(asyncAction)
        })
      },
      function() {
        var defer = {}
        defer.promise = new Promise(function(resolve, reject) {
          defer.resolve = resolve
          defer.reject = reject
        })
        return defer
      },
    )

    if (this._isDisabled) {
      return that._promiseFactory.makePromise(function(resolve) {
        resolve(that._driver)
      })
    }

    return EyesBase.prototype.open.call(that, appName, testName, viewportSize).then(
      function() {
        that._devicePixelRatio = UNKNOWN_DEVICE_PIXEL_RATIO
        that.setStitchMode(that._stitchMode)
        Reporter.endReportingContext()
        return that._driver
      },
      function(err) {
        Reporter.endReportingContext()
        throw err
      },
    )
  }

  function stepsInfoToArray(stepInfo, parentName) {
    var params = []
    var keys = Object.keys(stepInfo)
    for (var i = 0, l = keys.length; i < l; i++) {
      var name = parentName ? parentName + '.' + keys[i] : keys[i]
      var value = stepInfo[keys[i]]
      if (typeof value === 'object') {
        params.concat(stepsInfoToArray(value, name))
      } else {
        params.push({name: name, value: value})
      }
    }
    return params
  }

  function reportVerifications(testResults) {
    var params = [{name: 'secretToken', value: testResults.secretToken}]
    for (var i = 0, l = testResults.stepsInfo.length; i < l; ++i) {
      var stepInfo = testResults.stepsInfo[i]
      var status = stepInfo.hasCurrentImage && !stepInfo.isDifferent ? 'Passed' : 'Failed'

      Reporter.reportVerification(
        status,
        new Reporter.VerificationData({
          name: stepInfo.name,
          description: 'Result of Applitools visual validation #' + (i + 1),
          parameters: params.concat(stepsInfoToArray(stepInfo)),
        }),
      )
    }
  }

  //noinspection JSUnusedGlobalSymbols
  /**
   * Ends the test.
   * @param [throwEx] If true, an exception will be thrown for failed/new tests.
   * @return {Promise<TestResults>} The test results.
   */
  Eyes.prototype.close = function(throwEx) {
    throwEx = throwEx !== undefined ? throwEx : true

    if (this._isDisabled) {
      return this._promiseFactory.resolve()
    }

    var that = this
    return this._promiseFactory.makePromise(function(resolve, reject) {
      Reporter.startReportingContext('Applitools.close()')
      var testResults, testError
      return EyesBase.prototype.close
        .call(that, throwEx)
        .then(
          function(results) {
            testResults = results
          },
          function(err) {
            testError = err
            testResults = err.results
          },
        )
        .then(function() {
          reportVerifications(testResults)
          Reporter.endReportingContext()

          if (testError) return reject(testError)
          return resolve(testResults)
        })
    })
  }

  //noinspection JSUnusedGlobalSymbols
  /**
   * Aborts the currently running test.
   * @return {Promise<TestResults>} A promise which resolves to the test results.
   */
  Eyes.prototype.abortIfNotClosed = function() {
    var isEyesWasOpen = false
    if (this._isOpen) {
      isEyesWasOpen = true
      Reporter.startReportingContext('Applitools.abortIfNotClosed()')
    }

    return EyesBase.prototype.abortIfNotClosed.call(this).then(
      function(testResults) {
        if (isEyesWasOpen) {
          reportVerifications(testResults)
          Reporter.endReportingContext()
        }
        return testResults
      },
      function(err) {
        if (isEyesWasOpen) {
          Reporter.endReportingContext()
        }
        throw err
      },
    )
  }

  //noinspection JSUnusedGlobalSymbols
  /**
   * Preform visual validation
   * @param {string} name - A name to be associated with the match
   * @param {Target} target - Target instance which describes whether we want a window/region
   * @return {Promise<{asExpected: boolean}>} A promise which is resolved when the validation is finished.
   */
  Eyes.prototype.check = function(name, target) {
    ArgumentGuard.notNullOrEmpty(name, 'Name')
    ArgumentGuard.notNull(target, 'Target')

    var that = this

    var promise = that._promiseFactory.makePromise(function(resolve) {
      that._checkWindowIndex++
      var repName = name || '#' + that._checkWindowIndex
      Reporter.startReportingContext(
        'Applitools.check(' + repName + ')',
        'Applitools visual validation #' + that._checkWindowIndex,
      )
      resolve()
    })

    if (that._isDisabled) {
      that._logger.verbose('match ignored - ', name)
      return promise
    }

    if (target.getIgnoreObjects().length) {
      target.getIgnoreObjects().forEach(function(obj) {
        promise = promise
          .then(function() {
            return findElementByLocator(that, obj.element)
          })
          .then(function(element) {
            if (!isElementObject(element)) {
              throw new Error('Unsupported ignore region type: ' + typeof element)
            }

            return getRegionFromWebElement(element)
          })
          .then(function(region) {
            target.ignore(region)
          })
      })
    }

    if (target.getFloatingObjects().length) {
      target.getFloatingObjects().forEach(function(obj) {
        promise = promise
          .then(function() {
            return findElementByLocator(that, obj.element)
          })
          .then(function(element) {
            if (!isElementObject(element)) {
              throw new Error('Unsupported floating region type: ' + typeof element)
            }

            return getRegionFromWebElement(element)
          })
          .then(function(region) {
            region.maxLeftOffset = obj.maxLeftOffset
            region.maxRightOffset = obj.maxRightOffset
            region.maxUpOffset = obj.maxUpOffset
            region.maxDownOffset = obj.maxDownOffset
            target.floating(region)
          })
      })
    }

    that._logger.verbose(
      'match starting with params',
      name,
      target.getStitchContent(),
      target.getTimeout(),
    )
    var regionObject, regionProvider, originalOverflow, originalPositionProvider

    // if region specified
    if (target.isUsingRegion()) {
      promise = promise
        .then(function() {
          return findElementByLocator(that, target.getRegion())
        })
        .then(function(region) {
          regionObject = region

          if (isElementObject(regionObject)) {
            var regionPromise
            if (target.getStitchContent()) {
              that._checkFrameOrElement = true

              originalPositionProvider = that.getPositionProvider()
              that.setPositionProvider(
                new ElementPositionProvider(
                  that._logger,
                  that._driver,
                  regionObject,
                  that._promiseFactory,
                ),
              )

              // Set overflow to "hidden".
              regionPromise = regionObject
                .getOverflow()
                .then(function(value) {
                  originalOverflow = value
                  return regionObject.setOverflow('hidden')
                })
                .then(function() {
                  return getRegionProviderForElement(that, regionObject)
                })
                .then(function(regionProvider) {
                  that._regionToCheck = regionProvider
                })
            } else {
              regionPromise = getRegionFromWebElement(regionObject)
            }

            return regionPromise.then(function(region) {
              regionProvider = new EyesRegionProvider(
                that._logger,
                that._driver,
                region,
                CoordinatesType.CONTEXT_RELATIVE,
              )
            })
          } else if (GeometryUtils.isRegion(regionObject)) {
            // if regionObject is simple region
            regionProvider = new EyesRegionProvider(
              that._logger,
              that._driver,
              regionObject,
              CoordinatesType.CONTEXT_AS_IS,
            )
          } else {
            throw new Error('Unsupported region type: ' + typeof regionObject)
          }
        })
    }

    return promise
      .then(function() {
        that._logger.verbose('Call to checkWindowBase...')
        var imageMatchSettings = {
          matchLevel: target.getMatchLevel(),
          ignoreCaret: target.getIgnoreCaret(),
          ignore: target.getIgnoreRegions(),
          floating: target.getFloatingRegions(),
          exact: null,
        }
        return EyesBase.prototype.checkWindow.call(
          that,
          name,
          target.getIgnoreMismatch(),
          target.getTimeout(),
          regionProvider,
          imageMatchSettings,
        )
      })
      .then(function(result) {
        that._logger.verbose('Processing results...')
        if (result.asExpected || !that._failureReportOverridden) {
          return result
        } else {
          throw EyesBase.buildTestError(
            result,
            that._sessionStartInfo.scenarioIdOrName,
            that._sessionStartInfo.appIdOrName,
          )
        }
      })
      .then(function() {
        that._logger.verbose('Done!')
        that._logger.verbose('Restoring temporal variables...')

        if (that._regionToCheck) {
          that._regionToCheck = null
        }

        if (that._checkFrameOrElement) {
          that._checkFrameOrElement = false
        }

        // restore initial values
        if (originalPositionProvider !== undefined) {
          that.setPositionProvider(originalPositionProvider)
        }

        if (originalOverflow !== undefined) {
          return regionObject.setOverflow(originalOverflow)
        }
      })
      .then(
        function() {
          Reporter.endReportingContext()
          that._logger.verbose('Done!')
        },
        function(err) {
          Reporter.endReportingContext()
          throw err
        },
      )
  }

  var findElementByLocator = function(that, elementObject) {
    return that._promiseFactory.makePromise(function(resolve) {
      if (isLocatorObject(elementObject)) {
        that._logger.verbose('Trying to find element...', elementObject)
        resolve(that._driver.$(elementObject))
        return
      }

      resolve(elementObject)
    })
  }

  var isElementObject = function(o) {
    return o instanceof EyesWebTestObject || o instanceof WebBaseTestObject
  }

  var isLocatorObject = function(o) {
    return o instanceof WebBaseDescription
  }

  /**
   * Get the region provider for a certain element.
   * @param {Eyes} eyes - The eyes instance.
   * @param {EyesWebTestObject} element - The element to get a region for.
   * @return {Promise<EyesRegionProvider>} The region for a certain element.
   */
  var getRegionProviderForElement = function(eyes, element) {
    var elementLocation, elementSize, borderLeftWidth, borderRightWidth, borderTopWidth

    eyes._logger.verbose('getRegionProviderForElement')
    return element
      .getLocation()
      .then(function(value) {
        elementLocation = value
        return element.getSize()
      })
      .then(function(value) {
        elementSize = value
        return element.getBorderLeftWidth()
      })
      .then(function(value) {
        borderLeftWidth = value
        return element.getBorderRightWidth()
      })
      .then(function(value) {
        borderRightWidth = value
        return element.getBorderTopWidth()
      })
      .then(function(value) {
        borderTopWidth = value
        return element.getBorderBottomWidth()
      })
      .then(function(value) {
        // borderBottomWidth
        var elementRegion = GeometryUtils.createRegion(
          elementLocation.x + borderLeftWidth,
          elementLocation.y + borderTopWidth,
          elementSize.width - borderLeftWidth - borderRightWidth,
          elementSize.height - borderTopWidth - value,
        )

        eyes._logger.verbose('Done! Element region', elementRegion)
        return new EyesRegionProvider(
          eyes._logger,
          eyes._driver,
          elementRegion,
          CoordinatesType.CONTEXT_RELATIVE,
        )
      })
  }

  /**
   * Get the region for a certain web element.
   * @param {EyesWebTestObject} element - The web element to get the region from.
   * @return {Promise<{left: number, top: number, width: number, height: number}>} The region.
   */
  var getRegionFromWebElement = function(element) {
    var elementSize
    return element
      .getSize()
      .then(function(size) {
        elementSize = size
        return element.getLocation()
      })
      .then(function(point) {
        return GeometryUtils.createRegionFromLocationAndSize(point, elementSize)
      })
  }

  //noinspection JSUnusedGlobalSymbols
  /**
   * Takes a snapshot of the application under test and matches it with
   * the expected output.
   * @param {string} tag - An optional tag to be associated with the snapshot.
   * @param {number} matchTimeout - The amount of time to retry matching (Milliseconds).
   * @return {Promise<{asExpected: boolean}>} A promise which is resolved when the validation is finished.
   */
  Eyes.prototype.checkWindow = function(tag, matchTimeout) {
    return this.check(tag, Target.window().timeout(matchTimeout))
  }

  //noinspection JSUnusedGlobalSymbols
  /**
   * Takes a snapshot of the application under test and matches a specific
   * element with the expected region output.
   * @param {EyesWebTestObject} element - The element to check.
   * @param {int|null} matchTimeout - The amount of time to retry matching (milliseconds).
   * @param {string} tag - An optional tag to be associated with the match.
   * @return {Promise<{asExpected: boolean}>} A promise which is resolved when the validation is finished.
   */
  Eyes.prototype.checkElement = function(element, matchTimeout, tag) {
    return this.check(
      tag,
      Target.region(element)
        .timeout(matchTimeout)
        .fully(),
    )
  }

  //noinspection JSUnusedGlobalSymbols
  /**
   * Takes a snapshot of the application under test and matches a specific
   * element with the expected region output.
   * @param {WebBaseDescription} locator - The element to check.
   * @param {int|null} matchTimeout - The amount of time to retry matching (milliseconds).
   * @param {string} tag - An optional tag to be associated with the match.
   * @return {Promise<{asExpected: boolean}>} A promise which is resolved when the validation is finished.
   */
  Eyes.prototype.checkElementBy = function(locator, matchTimeout, tag) {
    return this.check(
      tag,
      Target.region(locator)
        .timeout(matchTimeout)
        .fully(),
    )
  }

  //noinspection JSUnusedGlobalSymbols
  /**
   * Visually validates a region in the screenshot.
   * @param {{left: number, top: number, width: number, height: number}} region - The region to
   * validate (in screenshot coordinates).
   * @param {string} tag - An optional tag to be associated with the screenshot.
   * @param {number} matchTimeout - The amount of time to retry matching.
   * @return {Promise<{asExpected: boolean}>} A promise which is resolved when the validation is finished.
   */
  Eyes.prototype.checkRegion = function(region, tag, matchTimeout) {
    return this.check(tag, Target.region(region).timeout(matchTimeout))
  }

  //noinspection JSUnusedGlobalSymbols
  /**
   * Visually validates a region in the screenshot.
   * @param {EyesWebTestObject} element - The element defining the region to validate.
   * @param {string} tag - An optional tag to be associated with the screenshot.
   * @param {number} matchTimeout - The amount of time to retry matching.
   * @return {Promise<{asExpected: boolean}>} A promise which is resolved when the validation is finished.
   */
  Eyes.prototype.checkRegionByElement = function(element, tag, matchTimeout) {
    return this.check(tag, Target.region(element).timeout(matchTimeout))
  }

  //noinspection JSUnusedGlobalSymbols
  /**
   * Visually validates a region in the screenshot.
   * @param {WebBaseDescription} by - The WebDriver selector used for finding the region to validate.
   * @param {string} tag - An optional tag to be associated with the screenshot.
   * @param {number} matchTimeout - The amount of time to retry matching.
   * @return {Promise<{asExpected: boolean}>} A promise which is resolved when the validation is finished.
   */
  Eyes.prototype.checkRegionBy = function(by, tag, matchTimeout) {
    return this.check(tag, Target.region(by).timeout(matchTimeout))
  }

  /**
   * @protected
   * @return {ScaleProviderFactory}
   */
  Eyes.prototype.updateScalingParams = function() {
    var that = this
    return that._promiseFactory.makePromise(function(resolve) {
      if (
        that._devicePixelRatio === UNKNOWN_DEVICE_PIXEL_RATIO &&
        that._scaleProviderHandler.get() instanceof NullScaleProvider
      ) {
        var factory, enSize, vpSize
        that._logger.verbose('Trying to extract device pixel ratio...')

        return EyesLeanFTUtils.getDevicePixelRatio(that._driver, that._promiseFactory)
          .then(
            function(ratio) {
              that._devicePixelRatio = ratio
            },
            function(err) {
              that._logger.verbose('Failed to extract device pixel ratio! Using default.', err)
              that._devicePixelRatio = DEFAULT_DEVICE_PIXEL_RATIO
            },
          )
          .then(function() {
            that._logger.verbose('Device pixel ratio: ' + that._devicePixelRatio)
            that._logger.verbose('Setting scale provider...')
            return that._positionProvider.getEntireSize()
          })
          .then(function(entireSize) {
            enSize = entireSize
            return that.getViewportSize()
          })
          .then(
            function(viewportSize) {
              vpSize = viewportSize
              factory = new ContextBasedScaleProviderFactory(
                enSize,
                vpSize,
                that._devicePixelRatio,
                that._scaleProviderHandler,
              )
            },
            function(err) {
              // This can happen in Appium for example.
              that._logger.verbose('Failed to set ContextBasedScaleProvider.', err)
              that._logger.verbose('Using FixedScaleProvider instead...')
              factory = new FixedScaleProviderFactory(
                1 / that._devicePixelRatio,
                that._scaleProviderHandler,
              )
            },
          )
          .then(function() {
            that._logger.verbose('Done!')
            resolve(factory)
          })
      }

      // If we already have a scale provider set, we'll just use it, and pass a mock as provider handler.
      resolve(
        new ScaleProviderIdentityFactory(
          that._scaleProviderHandler.get(),
          new SimplePropertyHandler(),
        ),
      )
    })
  }

  //noinspection JSUnusedGlobalSymbols
  /**
   * Get an updated screenshot.
   * @return {Promise<MutableImage>} - The image of the new screenshot.
   */
  Eyes.prototype.getScreenShot = function() {
    var that = this
    if (that._driver instanceof EyesWebBrowser) {
      return that.updateScalingParams().then(function(scaleProviderFactory) {
        return EyesLeanFTUtils.getScreenshot(
          that._driver,
          that._promiseFactory,
          that._viewportSize,
          that._positionProvider,
          scaleProviderFactory,
          that._cutProviderHandler.get(),
          that._forceFullPage,
          that._hideScrollbars,
          that._stitchMode === StitchMode.CSS,
          that._imageRotationDegrees,
          that._automaticRotation,
          that._os === 'Android' ? 90 : 270,
          that._isLandscape,
          that._waitBeforeScreenshots,
          that._checkFrameOrElement,
          that._regionToCheck,
          that._saveDebugScreenshots,
          that._debugScreenshotsPath,
        )
      })
    } else if (that._driver instanceof EyesStdWinWindow) {
      if (that._forceFullPage) {
        throw new Error('Full page screenshot is supported only for browser test object')
      }

      return this._driver.takeScreenshot().then(function(results) {
        return MutableImage.fromBase64(results, that._promiseFactory)
      })
    } else {
      throw new Error('Top level object is of unsupported type')
    }
  }

  //noinspection JSUnusedGlobalSymbols
  Eyes.prototype.getTitle = function() {
    return this._driver.getTitle()
  }

  //noinspection JSUnusedGlobalSymbols
  Eyes.prototype._waitTimeout = function(ms) {
    var that = this
    return this._promiseFactory.makePromise(function(resolve) {
      that._logger.log('Waiting', ms, 'ms...')
      setTimeout(function() {
        that._logger.log('Waiting finished.')
        resolve()
      }, ms)
    })
  }

  //noinspection JSUnusedGlobalSymbols
  Eyes.prototype.getInferredEnvironment = function() {
    return this._driver.getUserAgent().then(function(userAgent) {
      return 'useragent:' + userAgent
    })
  }

  //noinspection JSUnusedGlobalSymbols
  /**
   * Set the failure report.
   * @param mode - Use one of the values in EyesBase.FailureReport.
   */
  Eyes.prototype.setFailureReport = function(mode) {
    if (mode === EyesBase.FailureReport.Immediate) {
      this._failureReportOverridden = true
      mode = EyesBase.FailureReport.OnClose
    }

    EyesBase.prototype.setFailureReport.call(this, mode)
  }

  //noinspection JSUnusedGlobalSymbols
  /**
   * Get the viewport size.
   * @return {*} The viewport size.
   */
  Eyes.prototype.getViewportSize = function() {
    var that = this
    if (this._driver instanceof EyesWebBrowser) {
      return EyesLeanFTUtils.getViewportSizeOrDisplaySize(
        this._logger,
        this._driver,
        this._promiseFactory,
      )
    } else if (this._driver instanceof EyesStdWinWindow) {
      return that._driver.size()
    } else {
      throw new Error('Top level object is of unsupported type')
    }
  }

  //noinspection JSUnusedGlobalSymbols
  Eyes.prototype.setViewportSize = function(size) {
    if (this._driver instanceof EyesWebBrowser) {
      return EyesLeanFTUtils.setViewportSize(this._logger, this._driver, size, this._promiseFactory)
    } else if (this._driver instanceof EyesStdWinWindow) {
      throw this._driver.resize(size.width, size.height)
    } else {
      throw new Error('Top level object is of unsupported type')
    }
  }

  //noinspection JSUnusedGlobalSymbols
  /**
   * Set the viewport size using the driver. Call this method if for some reason
   * you don't want to call {@link #open(WebDriver, string, string)} (or one of its variants) yet.
   * @param {Web.Browser} browser - The driver to use for setting the viewport.
   * @param {{width: number, height: number}} size - The required viewport size.
   * @return {Promise<void>} The viewport size of the browser.
   */
  Eyes.setViewportSize = function(browser, size) {
    var promiseFactory = new PromiseFactory(function(asyncAction) {
      return new Promise(asyncAction)
    }, undefined)

    return EyesLeanFTUtils.setViewportSize(new Logger(), browser, size, promiseFactory)
  }

  //noinspection JSUnusedGlobalSymbols
  /**
   * Set the full page screenshot option.
   * @param {boolean} force - Whether to force a full page screenshot or not.
   * @return {void}
   */
  Eyes.prototype.setForceFullPageScreenshot = function(force) {
    this._forceFullPage = force
  }

  //noinspection JSUnusedGlobalSymbols
  /**
   * Get whether to force a full page screenshot or not.
   * @return {boolean} true if the option is on, otherwise false.
   */
  Eyes.prototype.getForceFullPageScreenshot = function() {
    return this._forceFullPage
  }

  //noinspection JSUnusedGlobalSymbols
  /**
   * Set the image rotation degrees.
   * @param degrees - The amount of degrees to set the rotation to.
   */
  Eyes.prototype.setForcedImageRotation = function(degrees) {
    if (typeof degrees !== 'number') {
      throw new TypeError('degrees must be a number! set to 0 to clear')
    }
    this._imageRotationDegrees = degrees
    this._automaticRotation = false
  }

  //noinspection JSUnusedGlobalSymbols
  /**
   * Get the rotation degrees.
   * @return {?number} - The rotation degrees.
   */
  Eyes.prototype.getForcedImageRotation = function() {
    return this._imageRotationDegrees || 0
  }

  //noinspection JSUnusedGlobalSymbols
  /**
   * Hide the scrollbars when taking screenshots.
   * @param {boolean} hide - Whether to hide the scrollbars or not.
   */
  Eyes.prototype.setHideScrollbars = function(hide) {
    this._hideScrollbars = hide
  }

  //noinspection JSUnusedGlobalSymbols
  /**
   * Hide the scrollbars when taking screenshots.
   * @return {boolean|null} - true if the hide scrollbars option is on, otherwise false.
   */
  Eyes.prototype.getHideScrollbars = function() {
    return this._hideScrollbars
  }

  //noinspection JSUnusedGlobalSymbols
  /**
   * Set the stitch mode.
   * @param {StitchMode} mode - The desired stitch mode settings.
   */
  Eyes.prototype.setStitchMode = function(mode) {
    this._stitchMode = mode
    if (this._driver) {
      switch (mode) {
        case StitchMode.CSS:
          this.setPositionProvider(
            new CssTranslatePositionProvider(this._logger, this._driver, this._promiseFactory),
          )
          break
        default:
          this.setPositionProvider(
            new ScrollPositionProvider(this._logger, this._driver, this._promiseFactory),
          )
      }
    }
  }

  //noinspection JSUnusedGlobalSymbols
  /**
   * Get the stitch mode.
   * @return {StitchMode} The currently set StitchMode.
   */
  Eyes.prototype.getStitchMode = function() {
    return this._stitchMode
  }

  //noinspection JSUnusedGlobalSymbols
  /**
   * Sets the wait time between before each screen capture, including between
   * screen parts of a full page screenshot.
   * @param waitBeforeScreenshots - The wait time in milliseconds.
   */
  Eyes.prototype.setWaitBeforeScreenshots = function(waitBeforeScreenshots) {
    if (waitBeforeScreenshots <= 0) {
      this._waitBeforeScreenshots = DEFAULT_WAIT_BEFORE_SCREENSHOTS
    } else {
      this._waitBeforeScreenshots = waitBeforeScreenshots
    }
  }

  //noinspection JSUnusedGlobalSymbols
  /**
   * Get the wait time before each screenshot.
   * @return {?number} the wait time between before each screen capture, in milliseconds.
   */
  Eyes.prototype.getWaitBeforeScreenshots = function() {
    return this._waitBeforeScreenshots
  }

  //noinspection JSUnusedGlobalSymbols
  /**
   * Get the session id.
   * @return {Promise<{asExpected: boolean}>} A promise which resolves to the browser's session ID.
   */
  Eyes.prototype.getAUTSessionId = function() {
    var that = this
    return this._promiseFactory.makePromise(function(resolve) {
      if (that._driver instanceof EyesWebBrowser) {
        resolve(that._driver.getSessionId())
      } else {
        resolve(undefined)
      }
    })
  }

  /**
   * @readonly
   * @enum {string}
   */
  Eyes.StitchMode = Object.freeze(StitchMode)

  exports.Eyes = Eyes
})()
