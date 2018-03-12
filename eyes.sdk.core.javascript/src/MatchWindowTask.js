'use strict';

const Region = require('./geometry/Region');
const ArgumentGuard = require('./ArgumentGuard');
const GeneralUtils = require('./utils/GeneralUtils');
const MatchWindowData = require('./match/MatchWindowData');

const MATCH_INTERVAL = 500; // Milliseconds

/**
 * Handles matching of output with the expected output (including retry and 'ignore mismatch' when needed).
 */
class MatchWindowTask {

    /**
     * @param {PromiseFactory} promiseFactory An object which will be used for creating deferreds/promises.
     * @param {Logger} logger A logger instance.
     * @param {ServerConnector} serverConnector Our gateway to the agent
     * @param {RunningSession} runningSession The running session in which we should match the window
     * @param {int} retryTimeout The default total time to retry matching (ms).
     * @param {EyesBase} eyes The eyes object.
     * @param {AppOutputProvider} appOutputProvider A callback for getting the application output when performing match.
     */
    constructor(promiseFactory, logger, serverConnector, runningSession, retryTimeout, eyes, appOutputProvider) {
        ArgumentGuard.notNull(serverConnector, "serverConnector");
        ArgumentGuard.greaterThanOrEqualToZero(retryTimeout, "retryTimeout");
        ArgumentGuard.notNull(appOutputProvider, "appOutputProvider");
        if (new.target === MatchWindowTask) {
            // only if target is current class, because session should be null for MatchSingleWindowTask
            ArgumentGuard.notNull(runningSession, "runningSession");
        }

        this._promiseFactory = promiseFactory;
        this._logger = logger;
        this._serverConnector = serverConnector;
        this._runningSession = runningSession;
        this._defaultRetryTimeout = retryTimeout;
        this._eyes = eyes;
        this._appOutputProvider = appOutputProvider;

        /** @type {EyesScreenshot} */ this._lastScreenshot = undefined;
        /** @type {MatchResult} */ this._matchResult = undefined;
        /** @type {Region} */ this._lastScreenshotBounds = undefined;
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
     * @return {Promise.<MatchResult>} The match result.
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
            const data = new MatchWindowData(userInputs, appOutput.getAppOutput(), tag, ignoreMismatch, options);
            // Perform match.
            return this._serverConnector.matchWindow(that._runningSession, data);
        });
    }

    /**
     * @param {CheckSettings} checkSettings
     * @param {ImageMatchSettings} imageMatchSettings
     * @param {EyesBase} eyes
     * @param {AppOutputWithScreenshot} appOutput
     * @return {Promise}
     */
    static collectIgnoreRegions(checkSettings, imageMatchSettings, eyes, appOutput) {
        const screenshot = appOutput.getScreenshot();
        const regionPromises = checkSettings.getIgnoreRegions().map(container => container.getRegion(eyes, screenshot), eyes);

        return eyes.getPromiseFactory().all(regionPromises).then(ignoreRegions => {
            imageMatchSettings.setIgnoreRegions(ignoreRegions);
        });
    }

    /**
     * @param {CheckSettings} checkSettings
     * @param {ImageMatchSettings} imageMatchSettings
     * @param {EyesBase} eyes
     * @param {AppOutputWithScreenshot} appOutput
     * @return {Promise}
     */
    static collectFloatingRegions(checkSettings, imageMatchSettings, eyes, appOutput) {
        const screenshot = appOutput.getScreenshot();
        const regionPromises = checkSettings.getFloatingRegions().map(container => container.getRegion(eyes, screenshot), eyes);

        return eyes.getPromiseFactory().all(regionPromises).then(floatingRegions => {
            imageMatchSettings.setFloatingRegions(floatingRegions);
        });
    }

    /**
     * Repeatedly obtains an application snapshot and matches it with the next
     * expected output, until a match is found or the timeout expires.
     *
     * @param {Trigger[]} userInputs User input preceding this match.
     * @param {Region} region Window region to capture.
     * @param {String} tag Optional tag to be associated with the match (can be {@code null}).
     * @param {Boolean} shouldRunOnceOnTimeout Force a single match attempt at the end of the match timeout.
     * @param {Boolean} ignoreMismatch Whether to instruct the server to ignore the match attempt in case of a mismatch.
     * @param {CheckSettings} checkSettings The internal settings to use.
     * @param {ImageMatchSettings} imageMatchSettings The settings to use.
     * @param {int} retryTimeout The amount of time to retry matching in milliseconds or a negative value to use the default retry timeout.
     * @return {Promise.<MatchResult>} Returns the results of the match
     */
    matchWindow(userInputs, region, tag, shouldRunOnceOnTimeout, ignoreMismatch, checkSettings, imageMatchSettings, retryTimeout) {
        if (retryTimeout === undefined || retryTimeout === null || retryTimeout < 0) {
            retryTimeout = this._defaultRetryTimeout;
        }

        const that = this;
        this._logger.verbose(`retryTimeout = ${retryTimeout}`);
        return that._takeScreenshot(userInputs, region, tag, shouldRunOnceOnTimeout, ignoreMismatch, checkSettings, imageMatchSettings, retryTimeout).then(screenshot => {
            if (ignoreMismatch) {
                return that._matchResult;
            }

            that._updateLastScreenshot(screenshot);
            that._updateBounds(region);
            return that._matchResult;
        });
    }

    /**
     * @private
     * @param {Trigger[]} userInputs
     * @param {Region} region
     * @param {String} tag
     * @param {Boolean} shouldRunOnceOnTimeout
     * @param {Boolean} ignoreMismatch
     * @param {CheckSettings} checkSettings
     * @param {ImageMatchSettings} imageMatchSettings
     * @param {int} retryTimeout
     * @return {Promise.<EyesScreenshot>}
     */
    _takeScreenshot(userInputs, region, tag, shouldRunOnceOnTimeout, ignoreMismatch, checkSettings, imageMatchSettings, retryTimeout) {
        const that = this;
        const elapsedTimeStart = GeneralUtils.currentTimeMillis();
        let promise = this._promiseFactory.resolve();
        // If the wait to load time is 0, or "run once" is true, we perform a single check window.
        if (retryTimeout === 0 || shouldRunOnceOnTimeout) {
            if (shouldRunOnceOnTimeout) {
                promise = promise.then(() => {
                    return GeneralUtils.sleep(retryTimeout, that._promiseFactory);
                });
            }

            promise = promise.then(() => {
                return that._tryTakeScreenshot(userInputs, region, tag, ignoreMismatch, checkSettings, imageMatchSettings);
            });
        } else {
            promise = promise.then(() => {
                return that._retryTakingScreenshot(userInputs, region, tag, ignoreMismatch, checkSettings, imageMatchSettings, retryTimeout);
            });
        }

        return promise.then(screenshot => {
            // noinspection MagicNumberJS
            const elapsedTime = GeneralUtils.currentTimeMillis() - elapsedTimeStart;
            that._logger.verbose(`Completed in ${GeneralUtils.elapsedString(elapsedTime)}`);
            return screenshot;
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
            if (!this._matchResult.getAsExpected()) {
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
            return that._tryTakeScreenshot(userInputs, region, tag, true, checkSettings, imageMatchSettings).then(screenshot => {
                if (that._matchResult.getAsExpected()) {
                    return screenshot;
                } else {
                    return that._takingScreenshotLoop(userInputs, region, tag, ignoreMismatch, imageMatchSettings,
                        retryTimeout, GeneralUtils.currentTimeMillis() - start, start, screenshot);
                }
            });
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
     * @return {Promise.<EyesScreenshot>}
     */
    _tryTakeScreenshot(userInputs, region, tag, ignoreMismatch, checkSettings, imageMatchSettings) {
        const that = this;
        return that._appOutputProvider.getAppOutput(region, that._lastScreenshot).then(appOutput => {
            const screenshot = appOutput.getScreenshot();
            return that.performMatch(userInputs, appOutput, tag, ignoreMismatch, checkSettings, imageMatchSettings).then(matchResult => {
                that._matchResult = matchResult;
                return screenshot;
            });
        });
    }

    /**
     * @private
     * @param {EyesScreenshot} screenshot
     */
    _updateLastScreenshot(screenshot) {
        if (screenshot) {
            this._lastScreenshot = screenshot;
        }
    }

    /**
     * @private
     * @param {Region} region
     */
    _updateBounds(region) {
        if (region.isEmpty()) {
            if (this._lastScreenshot) {
                this._lastScreenshotBounds = new Region(0, 0, this._lastScreenshot.getImage().getWidth(), this._lastScreenshot.getImage().getHeight());
            } else {
                // We set an "infinite" image size since we don't know what the screenshot size is...
                this._lastScreenshotBounds = new Region(0, 0, Number.MAX_VALUE, Number.MAX_VALUE);
            }
        } else {
            this._lastScreenshotBounds = region;
        }

        return this._promiseFactory.resolve();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @return {EyesScreenshot}
     */
    getLastScreenshot() {
        return this._lastScreenshot;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @return {Region}
     */
    getLastScreenshotBounds() {
        return this._lastScreenshotBounds;
    }

}

MatchWindowTask.MATCH_INTERVAL = MATCH_INTERVAL;
module.exports = MatchWindowTask;
