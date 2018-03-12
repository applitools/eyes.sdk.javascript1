'use strict';

const GeneralUtils = require('./utils/GeneralUtils');
const MatchWindowData = require('./match/MatchWindowData');
const MatchWindowTask = require('./MatchWindowTask');
const MatchSingleWindowData = require('./match/MatchSingleWindowData');

/**
 * Handles matching of output with the expected output (including retry and 'ignore mismatch' when needed).
 */
class MatchSingleWindowTask extends MatchWindowTask {

    /**
     * @param {PromiseFactory} promiseFactory An object which will be used for creating deferreds/promises.
     * @param {Logger} logger A logger instance.
     * @param {ServerConnector} serverConnector Our gateway to the agent
     * @param {int} retryTimeout The default total time to retry matching (ms).
     * @param {EyesBase} eyes The eyes object.
     * @param {AppOutputProvider} appOutputProvider A callback for getting the application output when performing match.
     * @param {SessionStartInfo} startInfo The start parameters for the session.
     * @param {Boolean} saveNewTests Used for automatic save of a test run. New tests are automatically saved by default.
     */
    constructor(promiseFactory, logger, serverConnector, retryTimeout, eyes, appOutputProvider, startInfo, saveNewTests) {
        super(promiseFactory, logger, serverConnector, null, retryTimeout, eyes, appOutputProvider);

        /** @type {SessionStartInfo} */ this._startInfo = startInfo;
        /** @type {TestResults} */ this._matchResult = undefined;
        /** @type {Boolean} */ this._saveNewTests = saveNewTests;
    }

    /**
     * Creates the match data and calls the server connector matchWindow method.
     *
     * @protected
     * @param {Trigger[]} userInputs The user inputs related to the current appOutput.
     * @param {AppOutputWithScreenshot} appOutput The application output to be matched.
     * @param {String} tag Optional tag to be associated with the match (can be {@code null}).
     * @param {Boolean} ignoreMismatch Whether to instruct the server to ignore the match attempt in case of a mismatch.
     * @param {CheckSettings} checkSettings The internal settings to use.
     * @param {ImageMatchSettings} imageMatchSettings The settings to use.
     * @return {Promise.<TestResults>} The match result.
     */
    performMatch(userInputs, appOutput, tag, ignoreMismatch, checkSettings, imageMatchSettings) {
        const that = this;
        return that._promiseFactory.resolve().then(() => {
            return MatchWindowTask.collectIgnoreRegions(checkSettings, imageMatchSettings, that._eyes, appOutput);
        }).then(() => {
            return MatchWindowTask.collectFloatingRegions(checkSettings, imageMatchSettings, that._eyes, appOutput);
        }).then(() => {
            // Prepare match data.
            const options = new MatchWindowData.Options(tag, userInputs, ignoreMismatch, false, false, false, imageMatchSettings);
            const data = new MatchSingleWindowData(that._startInfo, userInputs, appOutput.getAppOutput(), tag, ignoreMismatch, options);
            data.setRemoveSessionIfMatching(ignoreMismatch);
            data.setUpdateBaselineIfNew(that._saveNewTests);

            // Perform match.
            return this._serverConnector.matchSingleWindow(data);
        });
    }

    /**
     * @private
     * @param {Trigger[]} userInputs
     * @param {Region} region
     * @param {String} tag
     * @param {Boolean} ignoreMismatch
     * @param {CheckSettings} checkSettings
     * @param {ImageMatchSettings} imageMatchSettings
     * @param {int} retryTimeout
     * @return {Promise.<EyesScreenshot>}
     */
    _retryTakingScreenshot(userInputs, region, tag, ignoreMismatch, checkSettings, imageMatchSettings, retryTimeout) {
        const that = this;
        const start = GeneralUtils.currentTimeMillis(); // Start the retry timer.
        const retry = GeneralUtils.currentTimeMillis() - start;

        // The match retry loop.
        return that._takingScreenshotLoop(userInputs, region, tag, ignoreMismatch, checkSettings, imageMatchSettings, retryTimeout, retry, start).then(screenshot => {
            // if we're here because we haven't found a match yet, try once more
            if (this._matchResult.getIsDifferent()) {
                return this._tryTakeScreenshot(userInputs, region, tag, ignoreMismatch, checkSettings, imageMatchSettings);
            }
            return screenshot;
        });
    }

    _takingScreenshotLoop(userInputs, region, tag, ignoreMismatch, checkSettings, imageMatchSettings, retryTimeout, retry, start, screenshot) {
        if (retry >= retryTimeout) {
            return this._promiseFactory.resolve(screenshot);
        }

        const that = this;
        return GeneralUtils.sleep(MatchWindowTask.MATCH_INTERVAL, that._promiseFactory).then(() => {
            // get first screenshot
            return that._tryTakeScreenshot(userInputs, region, tag, true, checkSettings, imageMatchSettings).then(screenshot => {
                if (that._matchResult.getIsDifferent()) {
                    return that._takingScreenshotLoop(userInputs, region, tag, ignoreMismatch, imageMatchSettings,
                        retryTimeout, GeneralUtils.currentTimeMillis() - start, start, screenshot);
                } else {
                    return screenshot;
                }
            });
        });
    }

}

module.exports = MatchSingleWindowTask;
