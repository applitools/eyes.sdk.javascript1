'use strict'
const ArgumentGuard = require('./utils/ArgumentGuard')
const GeneralUtils = require('./utils/GeneralUtils')
const TypeUtils = require('./utils/TypeUtils')
const Region = require('./geometry/Region')
const PerformanceUtils = require('./utils/PerformanceUtils')
const ImageMatchSettings = require('./config/ImageMatchSettings')
const MatchWindowData = require('./match/MatchWindowData')
const Options = require('./match/ImageMatchOptions')

const MATCH_INTERVAL = 500 // Milliseconds

/**
 * Handles matching of output with the expected output (including retry and 'ignore mismatch' when needed).
 *
 * @ignore
 */
class MatchWindowTask {
  /**
   * @param {Logger} logger - A logger instance.
   * @param {ServerConnector} serverConnector - Our gateway to the agent
   * @param {RunningSession} runningSession - The running session in which we should match the window
   * @param {number} retryTimeout - The default total time to retry matching (ms).
   * @param {EyesBase} eyes - The eyes object.
   * @param {AppOutputProvider} [appOutputProvider] - A callback for getting the application output when performing match.
   */
  constructor(logger, serverConnector, runningSession, retryTimeout, eyes, appOutputProvider) {
    ArgumentGuard.notNull(eyes, 'eyes')
    ArgumentGuard.notNull(logger, 'logger')
    ArgumentGuard.notNull(serverConnector, 'serverConnector')
    ArgumentGuard.greaterThanOrEqualToZero(retryTimeout, 'retryTimeout')
    ArgumentGuard.notNull(runningSession, 'runningSession')

    this._logger = logger
    this._serverConnector = serverConnector
    this._runningSession = runningSession
    this._defaultRetryTimeout = retryTimeout
    this._eyes = eyes
    this._appOutputProvider = appOutputProvider

    /** @type {MatchResult} */ this._matchResult = undefined
    /** @type {EyesScreenshot} */ this._lastScreenshot = undefined
    /** @type {Region} */ this._lastScreenshotBounds = undefined
  }

  /**
   * Creates the match model and calls the server connector matchWindow method.
   *
   * @param {Trigger[]} userInputs - The user inputs related to the current appOutput.
   * @param {AppOutputWithScreenshot} appOutput - The application output to be matched.
   * @param {string} name - Optional tag to be associated with the match (can be {@code null}).
   * @param {string} renderId - Optional render ID to be associated with the match (can be {@code null}).
   * @param {boolean} ignoreMismatch - Whether to instruct the server to ignore the match attempt in case of a mismatch.
   * @param {ImageMatchSettings} imageMatchSettings - The settings to use.
   * @param {string} source
   * @return {Promise<MatchResult>} - The match result.
   */
  async performMatch(
    userInputs,
    appOutput,
    name,
    renderId,
    ignoreMismatch,
    imageMatchSettings,
    source,
  ) {
    // Prepare match model.
    const options = new Options({
      name,
      renderId,
      userInputs,
      ignoreMismatch,
      ignoreMatch: false,
      forceMismatch: false,
      forceMatch: false,
      imageMatchSettings,
      source,
    })
    const data = new MatchWindowData({
      userInputs,
      appOutput: appOutput.getAppOutput(),
      tag: name,
      ignoreMismatch,
      options,
    })

    if (data.getAppOutput().getScreenshot64()) {
      const screenshot = data.getAppOutput().getScreenshot64()
      data.getAppOutput().setScreenshot64(null)

      await this._eyes._renderingInfoPromise
      const id = GeneralUtils.guid()
      const screenshotUrl = await this._serverConnector.uploadScreenshot(id, screenshot)
      data.getAppOutput().setScreenshotUrl(screenshotUrl)
    }

    // Perform match.
    return this._serverConnector.matchWindow(this._runningSession, data)
  }

  /**
   * @param {GetRegion[]|GetFloatingRegion[]|GetAccessibilityRegion[]} regionProviders
   * @param {EyesScreenshot} screenshot
   * @return {Promise<Region[]|FloatingMatchSettings[]|AccessibilityMatchSettings[]>}
   */
  async _getTotalRegions(regionProviders, screenshot) {
    const eyes = this._eyes
    const totalRegions = []
    for (let i = 0; i < regionProviders.length; i += 1) {
      try {
        const regions = await regionProviders[i].getRegion(eyes._context, screenshot)
        totalRegions.push(...regions)
      } catch (e) {
        eyes.log('WARNING - region was out of bounds.', e)
      }
    }
    return totalRegions
  }

  /**
   * @param {CheckSettings} checkSettings
   * @param {ImageMatchSettings} imageMatchSettings
   * @param {EyesScreenshot} screenshot
   * @return {Promise}
   */
  async _collectRegions(checkSettings, imageMatchSettings, screenshot) {
    const ignoreRegions = await this._getTotalRegions(checkSettings.getIgnoreRegions(), screenshot)
    imageMatchSettings.setIgnoreRegions(ignoreRegions)

    const layoutRegions = await this._getTotalRegions(checkSettings.getLayoutRegions(), screenshot)
    imageMatchSettings.setLayoutRegions(layoutRegions)

    const strictRegions = await this._getTotalRegions(checkSettings.getStrictRegions(), screenshot)
    imageMatchSettings.setStrictRegions(strictRegions)

    const contentRegions = await this._getTotalRegions(
      checkSettings.getContentRegions(),
      screenshot,
    )
    imageMatchSettings.setContentRegions(contentRegions)

    const floatingRegions = await this._getTotalRegions(
      checkSettings.getFloatingRegions(),
      screenshot,
    )
    imageMatchSettings.setFloatingRegions(floatingRegions)

    const accessibilityRegions = await this._getTotalRegions(
      checkSettings.getAccessibilityRegions(),
      screenshot,
    )
    imageMatchSettings.setAccessibilityRegions(accessibilityRegions)
  }

  /**
   * Build match settings by merging the check settings and the default match settings.
   * @param {CheckSettings} checkSettings - the settings to match the image by.
   * @param {EyesScreenshot} screenshot - the Screenshot wrapper object.
   * @return {ImageMatchSettings} - Merged match settings.
   */
  async createImageMatchSettings(checkSettings, screenshot) {
    let imageMatchSettings = null
    if (checkSettings != null) {
      let matchLevel = checkSettings.getMatchLevel()
      if (TypeUtils.isNull(matchLevel)) {
        matchLevel = this._eyes.getDefaultMatchSettings().getMatchLevel()
      }

      let ignoreCaret = checkSettings.getIgnoreCaret()
      if (TypeUtils.isNull(ignoreCaret)) {
        ignoreCaret = this._eyes.getDefaultMatchSettings().getIgnoreCaret()
      }

      let useDom = checkSettings.getUseDom()
      if (TypeUtils.isNull(useDom)) {
        useDom = this._eyes.getDefaultMatchSettings().getUseDom()
      }

      let enablePatterns = checkSettings.getEnablePatterns()
      if (TypeUtils.isNull(enablePatterns)) {
        enablePatterns = this._eyes.getDefaultMatchSettings().getEnablePatterns()
      }

      let ignoreDisplacements = checkSettings.getIgnoreDisplacements()
      if (TypeUtils.isNull(ignoreDisplacements)) {
        ignoreDisplacements = this._eyes.getDefaultMatchSettings().getIgnoreDisplacements()
      }

      const accessibilitySettings = this._eyes.getDefaultMatchSettings().getAccessibilitySettings()

      imageMatchSettings = new ImageMatchSettings({
        matchLevel,
        exact: null,
        ignoreCaret,
        useDom,
        enablePatterns,
        ignoreDisplacements,
        accessibilitySettings,
      })

      await this._collectRegions(checkSettings, imageMatchSettings, screenshot)
    }
    return imageMatchSettings
  }

  /**
   * Repeatedly obtains an application snapshot and matches it with the next expected output, until a match is found or
   *   the timeout expires.
   *
   * @param {Trigger[]} userInputs - User input preceding this match.
   * @param {Region} region - Window region to capture.
   * @param {string} tag - Optional tag to be associated with the match (can be {@code null}).
   * @param {boolean} shouldRunOnceOnTimeout - Force a single match attempt at the end of the match timeout.
   * @param {boolean} ignoreMismatch - Whether to instruct the server to ignore the match attempt in case of a mismatch.
   * @param {CheckSettings} checkSettings - The internal settings to use.
   * @param {number} [retryTimeout] - The amount of time to retry matching in milliseconds or a negative value to use the
   *   default retry timeout.
   * @param {string} [source]
   * @return {Promise<MatchResult>} - Returns the results of the match
   */
  async matchWindow(
    userInputs,
    region,
    tag,
    shouldRunOnceOnTimeout,
    ignoreMismatch,
    checkSettings,
    retryTimeout,
    source,
  ) {
    ArgumentGuard.notNull(userInputs, 'userInputs')
    ArgumentGuard.notNull(region, 'region')
    ArgumentGuard.isString(tag, 'tag')
    ArgumentGuard.isBoolean(shouldRunOnceOnTimeout, 'shouldRunOnceOnTimeout')
    ArgumentGuard.isBoolean(ignoreMismatch, 'ignoreMismatch')
    ArgumentGuard.notNull(checkSettings, 'checkSettings')
    ArgumentGuard.isNumber(retryTimeout, 'retryTimeout', false)

    if (retryTimeout === undefined || retryTimeout === null || retryTimeout < 0) {
      retryTimeout = this._defaultRetryTimeout
    }

    this._logger.verbose(`retryTimeout = ${retryTimeout}`)
    const screenshot = await this._takeScreenshot(
      userInputs,
      region,
      tag,
      shouldRunOnceOnTimeout,
      ignoreMismatch,
      checkSettings,
      retryTimeout,
      source,
    )
    if (ignoreMismatch) {
      return this._matchResult
    }

    this._updateLastScreenshot(screenshot)
    this._updateBounds(region)
    return this._matchResult
  }

  /**
   * @private
   * @param {Trigger[]} userInputs
   * @param {Region} region
   * @param {string} tag
   * @param {boolean} shouldRunOnceOnTimeout
   * @param {boolean} ignoreMismatch
   * @param {CheckSettings} checkSettings
   * @param {number} retryTimeout
   * @param {string} source
   * @return {Promise<EyesScreenshot>}
   */
  async _takeScreenshot(
    userInputs,
    region,
    tag,
    shouldRunOnceOnTimeout,
    ignoreMismatch,
    checkSettings,
    retryTimeout,
    source,
  ) {
    const timeStart = PerformanceUtils.start()

    let screenshot
    // If the wait to load time is 0, or "run once" is true, we perform a single check window.
    if (retryTimeout === 0 || shouldRunOnceOnTimeout) {
      if (shouldRunOnceOnTimeout) {
        await GeneralUtils.sleep(retryTimeout)
      }

      screenshot = await this._tryTakeScreenshot(
        userInputs,
        region,
        tag,
        ignoreMismatch,
        checkSettings,
        source,
      )
    } else {
      screenshot = await this._retryTakingScreenshot(
        userInputs,
        region,
        tag,
        ignoreMismatch,
        checkSettings,
        retryTimeout,
      )
    }

    this._logger.verbose(`Completed in ${timeStart.end().summary}`)
    return screenshot
  }

  /**
   * @protected
   * @param {Trigger[]} userInputs
   * @param {Region} region
   * @param {string} tag
   * @param {boolean} ignoreMismatch
   * @param {CheckSettings} checkSettings
   * @param {number} retryTimeout
   * @param {string} source
   * @return {Promise<EyesScreenshot>}
   */
  async _retryTakingScreenshot(
    userInputs,
    region,
    tag,
    ignoreMismatch,
    checkSettings,
    retryTimeout,
    source,
  ) {
    const start = Date.now() // Start the retry timer.
    const retry = Date.now() - start

    // The match retry loop.
    const screenshot = await this._takingScreenshotLoop(
      userInputs,
      region,
      tag,
      ignoreMismatch,
      checkSettings,
      retryTimeout,
      retry,
      start,
      source,
    )

    // if we're here because we haven't found a match yet, try once more
    if (!this._matchResult.getAsExpected()) {
      return this._tryTakeScreenshot(userInputs, region, tag, ignoreMismatch, checkSettings, source)
    }
    return screenshot
  }

  /**
   * @protected
   * @param {Trigger[]} userInputs
   * @param {Region} region
   * @param {string} tag
   * @param {boolean} ignoreMismatch
   * @param {CheckSettings} checkSettings
   * @param {number} retryTimeout
   * @param {number} retry
   * @param {number} start
   * @param {EyesScreenshot} [screenshot]
   * @param {string} [source]
   * @return {Promise<EyesScreenshot>}
   */
  async _takingScreenshotLoop(
    userInputs,
    region,
    tag,
    ignoreMismatch,
    checkSettings,
    retryTimeout,
    retry,
    start,
    screenshot,
    source,
  ) {
    if (retry >= retryTimeout) {
      return screenshot
    }

    await GeneralUtils.sleep(MatchWindowTask.MATCH_INTERVAL)

    const newScreenshot = await this._tryTakeScreenshot(
      userInputs,
      region,
      tag,
      true,
      checkSettings,
      source,
    )

    if (this._matchResult.getAsExpected()) {
      return newScreenshot
    }

    return this._takingScreenshotLoop(
      userInputs,
      region,
      tag,
      ignoreMismatch,
      checkSettings,
      retryTimeout,
      Date.now() - start,
      start,
      newScreenshot,
    )
  }

  /**
   * @protected
   * @param {Trigger[]} userInputs
   * @param {Region} region
   * @param {string} tag
   * @param {boolean} ignoreMismatch
   * @param {CheckSettings} checkSettings
   * @param {string} source
   * @return {Promise<EyesScreenshot>}
   */
  async _tryTakeScreenshot(userInputs, region, tag, ignoreMismatch, checkSettings, source) {
    const appOutput = await this._appOutputProvider.getAppOutput(
      region,
      this._lastScreenshot,
      checkSettings,
    )
    const renderId = checkSettings.getRenderId()
    const screenshot = appOutput.getScreenshot()
    const matchSettings = await this.createImageMatchSettings(checkSettings, screenshot)
    this._matchResult = await this.performMatch(
      userInputs,
      appOutput,
      tag,
      renderId,
      ignoreMismatch,
      matchSettings,
      source,
    )
    return screenshot
  }

  /**
   * @private
   * @param {EyesScreenshot} screenshot
   */
  _updateLastScreenshot(screenshot) {
    if (screenshot) {
      this._lastScreenshot = screenshot
    }
  }

  /**
   * @private
   * @param {Region} region
   */
  _updateBounds(region) {
    if (region.isSizeEmpty()) {
      if (this._lastScreenshot) {
        this._lastScreenshotBounds = new Region(
          0,
          0,
          this._lastScreenshot.getImage().getWidth(),
          this._lastScreenshot.getImage().getHeight(),
        )
      } else {
        // We set an "infinite" image size since we don't know what the screenshot size is...
        this._lastScreenshotBounds = new Region(0, 0, Number.MAX_VALUE, Number.MAX_VALUE)
      }
    } else {
      this._lastScreenshotBounds = region
    }
  }

  /**
   * @return {EyesScreenshot}
   */
  getLastScreenshot() {
    return this._lastScreenshot
  }

  /**
   * @return {Region}
   */
  getLastScreenshotBounds() {
    return this._lastScreenshotBounds
  }
}

MatchWindowTask.MATCH_INTERVAL = MATCH_INTERVAL
module.exports = MatchWindowTask
