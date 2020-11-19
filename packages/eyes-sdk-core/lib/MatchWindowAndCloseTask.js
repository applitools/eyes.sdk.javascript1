'use strict'
const GeneralUtils = require('./utils/GeneralUtils')
const MatchWindowTask = require('./MatchWindowTask')
const Options = require('./match/ImageMatchOptions')
const MatchWindowAndCloseData = require('./match/MatchWindowAndCloseData')

/**
 * Handles matching of output with the expected output (including retry and 'ignore mismatch' when needed).
 *
 * @ignore
 */
class MatchWindowAndCloseTask extends MatchWindowTask {
  constructor(
    logger,
    serverConnector,
    runningSession,
    retryTimeout,
    eyes,
    appOutputProvider,
    updateBaselineIfNew,
  ) {
    super(logger, serverConnector, runningSession, retryTimeout, eyes, appOutputProvider)
    this._updateBaseLineIfNew = updateBaselineIfNew
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
   * @return {Promise<TestResults>} - The match result.
   */
  async performMatch(userInputs, appOutput, name, renderId, ignoreMismatch, imageMatchSettings) {
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
    })
    const data = new MatchWindowAndCloseData({
      startInfo: this._startInfo,
      userInputs,
      appOutput: appOutput.getAppOutput(),
      tag: name,
      ignoreMismatch,
      options,
      updateBaselineIfNew: this._saveNewTest,
      removeSessionIfMatching: ignoreMismatch,
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
    return this._serverConnector.matchWindowAndClose(this._runningSession, data)
  }

  /**
   * @protected
   * @param {Trigger[]} userInputs
   * @param {Region} region
   * @param {string} tag
   * @param {boolean} ignoreMismatch
   * @param {CheckSettings} checkSettings
   * @param {number} retryTimeout
   * @return {Promise<EyesScreenshot>}
   */
  async _retryTakingScreenshot(
    userInputs,
    region,
    tag,
    ignoreMismatch,
    checkSettings,
    retryTimeout,
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
    )

    // if we're here because we haven't found a match yet, try once more
    if (this._matchResult.getIsDifferent()) {
      return this._tryTakeScreenshot(userInputs, region, tag, ignoreMismatch, checkSettings)
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
    )
    if (this._matchResult.getIsDifferent()) {
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

    return newScreenshot
  }
}

module.exports = MatchWindowAndCloseTask
