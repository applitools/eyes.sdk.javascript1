'use strict';

const { GeneralUtils } = require('@applitools/eyes-common');

const { MatchWindowTask } = require('./MatchWindowTask');
const { MatchSingleWindowData, Options } = require('./match/MatchSingleWindowData');

/**
 * Handles matching of output with the expected output (including retry and 'ignore mismatch' when needed).
 *
 * @ignore
 */
class MatchSingleWindowTask extends MatchWindowTask {
  /**
   * @param {Logger} logger - A logger instance.
   * @param {ServerConnector} serverConnector - Our gateway to the agent
   * @param {number} retryTimeout - The default total time to retry matching (ms).
   * @param {EyesBase} eyes - The eyes object.
   * @param {AppOutputProvider} appOutputProvider - A callback for getting the application output when performing match.
   * @param {SessionStartInfo} startInfo - The start parameters for the session.
   * @param {boolean} saveNewTests - Used for automatic save of a test run. New tests are automatically saved by default.
   */
  constructor(logger, serverConnector, retryTimeout, eyes, appOutputProvider, startInfo, saveNewTests) {
    super(logger, serverConnector, null, retryTimeout, eyes, appOutputProvider);

    /** @type {SessionStartInfo} */ this._startInfo = startInfo;
    /** @type {TestResults} */ this._matchResult = undefined;
    /** @type {boolean} */ this._saveNewTests = saveNewTests;
  }

  // noinspection JSCheckFunctionSignatures
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
    const options = new Options({ name, renderId, userInputs, ignoreMismatch, ignoreMatch: false, forceMismatch: false, forceMatch: false, imageMatchSettings });
    const data = new MatchSingleWindowData({ startInfo: this._startInfo, userInputs, appOutput: appOutput.getAppOutput(), tag: name, ignoreMismatch, options });
    data.setRemoveSessionIfMatching(ignoreMismatch);
    data.setUpdateBaselineIfNew(this._saveNewTests);

    // Perform match.
    return this._serverConnector.matchSingleWindow(data);
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
  async _retryTakingScreenshot(userInputs, region, tag, ignoreMismatch, checkSettings, retryTimeout) {
    const start = Date.now(); // Start the retry timer.
    const retry = Date.now() - start;

    // The match retry loop.
    const screenshot = await this._takingScreenshotLoop(userInputs, region, tag, ignoreMismatch, checkSettings, retryTimeout, retry, start);

    // if we're here because we haven't found a match yet, try once more
    if (this._matchResult.getIsDifferent()) {
      return this._tryTakeScreenshot(userInputs, region, tag, ignoreMismatch, checkSettings);
    }
    return screenshot;
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
  async _takingScreenshotLoop(userInputs, region, tag, ignoreMismatch, checkSettings, retryTimeout, retry, start, screenshot) {
    if (retry >= retryTimeout) {
      return screenshot;
    }

    await GeneralUtils.sleep(MatchWindowTask.MATCH_INTERVAL);

    const newScreenshot = await this._tryTakeScreenshot(userInputs, region, tag, true, checkSettings);
    if (this._matchResult.getIsDifferent()) {
      return this._takingScreenshotLoop(userInputs, region, tag, ignoreMismatch, checkSettings, retryTimeout, Date.now() - start, start, newScreenshot);
    }

    return newScreenshot;
  }
}

exports.MatchSingleWindowTask = MatchSingleWindowTask;
