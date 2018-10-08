'use strict';

const { Region } = require('./geometry/Region');
const { ArgumentGuard } = require('./ArgumentGuard');
const { GeneralUtils } = require('./utils/GeneralUtils');
const { MatchWindowData } = require('./match/MatchWindowData');

const MATCH_INTERVAL = 500; // Milliseconds

/**
 * Handles matching of output with the expected output (including retry and 'ignore mismatch' when needed).
 */
class MatchWindowTask {
  /**
   * @param {Logger} logger A logger instance.
   * @param {ServerConnector} serverConnector Our gateway to the agent
   * @param {RunningSession} runningSession The running session in which we should match the window
   * @param {number} retryTimeout The default total time to retry matching (ms).
   * @param {EyesBase} eyes The eyes object.
   * @param {AppOutputProvider} appOutputProvider A callback for getting the application output when performing match.
   */
  constructor(logger, serverConnector, runningSession, retryTimeout, eyes, appOutputProvider) {
    ArgumentGuard.notNull(serverConnector, 'serverConnector');
    ArgumentGuard.greaterThanOrEqualToZero(retryTimeout, 'retryTimeout');
    ArgumentGuard.notNull(appOutputProvider, 'appOutputProvider');
    if (new.target === MatchWindowTask) {
      // only if target is current class, because session should be null for MatchSingleWindowTask
      ArgumentGuard.notNull(runningSession, 'runningSession');
    }

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
   * @param {string} tag Optional tag to be associated with the match (can be {@code null}).
   * @param {boolean} ignoreMismatch Whether to instruct the server to ignore the match attempt in case of a mismatch.
   * @param {CheckSettings} checkSettings The internal settings to use.
   * @param {ImageMatchSettings} imageMatchSettings The settings to use.
   * @return {Promise<MatchResult>} The match result.
   */
  async performMatch(userInputs, appOutput, tag, ignoreMismatch, checkSettings, imageMatchSettings) {
    await MatchWindowTask.collectIgnoreRegions(checkSettings, imageMatchSettings, this._eyes, appOutput);
    await MatchWindowTask.collectFloatingRegions(checkSettings, imageMatchSettings, this._eyes, appOutput);

    // Prepare match data.
    const options = new MatchWindowData.Options(tag, userInputs, ignoreMismatch, false, false, false, imageMatchSettings);
    const data = new MatchWindowData(userInputs, appOutput.getAppOutput(), tag, ignoreMismatch, options);
    // Perform match.
    return this._serverConnector.matchWindow(this._runningSession, data);
  }

  /**
   * @param {CheckSettings} checkSettings
   * @param {ImageMatchSettings} imageMatchSettings
   * @param {EyesBase} eyes
   * @param {AppOutputWithScreenshot} appOutput
   * @return {Promise<void>}
   */
  static async collectIgnoreRegions(checkSettings, imageMatchSettings, eyes, appOutput) {
    const ignoreRegions =
      await MatchWindowTask.collectRegions(checkSettings.getIgnoreRegions(), eyes, appOutput.getScreenshot());
    imageMatchSettings.setIgnoreRegions(ignoreRegions);

    const layoutRegions =
      await MatchWindowTask.collectRegions(checkSettings.getLayoutRegions(), eyes, appOutput.getScreenshot());
    imageMatchSettings.setLayoutRegions(layoutRegions);

    const strictRegions =
      await MatchWindowTask.collectRegions(checkSettings.getStrictRegions(), eyes, appOutput.getScreenshot());
    imageMatchSettings.setStrictRegions(strictRegions);

    const contentRegions =
      await MatchWindowTask.collectRegions(checkSettings.getContentRegions(), eyes, appOutput.getScreenshot());
    imageMatchSettings.setContentRegions(contentRegions);
  }

  /**
   * @param {GetRegion[]} regionProviders
   * @param {EyesBase} eyes
   * @param {EyesScreenshot} screenshot
   * @return {Promise<Region[]>}
   */
  static collectRegions(regionProviders, eyes, screenshot) {
    const regionsPromises = [];
    regionProviders.forEach(regionProvider => {
      try {
        regionsPromises.push(regionProvider.getRegion(eyes, screenshot));
      } catch (e) {
        eyes.log('WARNING - ignore region was out of bounds.', e);
      }
    });
    return Promise.all(regionsPromises);
  }

  /**
   * @param {CheckSettings} checkSettings
   * @param {ImageMatchSettings} imageMatchSettings
   * @param {EyesBase} eyes
   * @param {AppOutputWithScreenshot} appOutput
   * @return {Promise<void>}
   */
  static collectFloatingRegions(checkSettings, imageMatchSettings, eyes, appOutput) {
    const screenshot = appOutput.getScreenshot();
    const regionPromises = checkSettings.getFloatingRegions()
      .map(container => container.getRegion(eyes, screenshot), eyes);

    return Promise.all(regionPromises).then(floatingRegions => {
      imageMatchSettings.setFloatingRegions(floatingRegions);
    });
  }

  /**
   * Repeatedly obtains an application snapshot and matches it with the next expected output, until a match is found or
   *   the timeout expires.
   *
   * @param {Trigger[]} userInputs User input preceding this match.
   * @param {Region} region Window region to capture.
   * @param {string} tag Optional tag to be associated with the match (can be {@code null}).
   * @param {boolean} shouldRunOnceOnTimeout Force a single match attempt at the end of the match timeout.
   * @param {boolean} ignoreMismatch Whether to instruct the server to ignore the match attempt in case of a mismatch.
   * @param {CheckSettings} checkSettings The internal settings to use.
   * @param {ImageMatchSettings} imageMatchSettings The settings to use.
   * @param {number} retryTimeout The amount of time to retry matching in milliseconds or a negative value to use the
   *   default retry timeout.
   * @return {Promise<MatchResult>} Returns the results of the match
   */
  async matchWindow(userInputs, region, tag, shouldRunOnceOnTimeout, ignoreMismatch, checkSettings, imageMatchSettings, retryTimeout) {
    if (retryTimeout === undefined || retryTimeout === null || retryTimeout < 0) {
      retryTimeout = this._defaultRetryTimeout;
    }

    this._logger.verbose(`retryTimeout = ${retryTimeout}`);
    const screenshot = await this._takeScreenshot(userInputs, region, tag, shouldRunOnceOnTimeout, ignoreMismatch, checkSettings, imageMatchSettings, retryTimeout);
    if (ignoreMismatch) {
      return this._matchResult;
    }

    this._updateLastScreenshot(screenshot);
    this._updateBounds(region);
    return this._matchResult;
  }

  /**
   * @private
   * @param {Trigger[]} userInputs
   * @param {Region} region
   * @param {string} tag
   * @param {boolean} shouldRunOnceOnTimeout
   * @param {boolean} ignoreMismatch
   * @param {CheckSettings} checkSettings
   * @param {ImageMatchSettings} imageMatchSettings
   * @param {number} retryTimeout
   * @return {Promise<EyesScreenshot>}
   */
  async _takeScreenshot(userInputs, region, tag, shouldRunOnceOnTimeout, ignoreMismatch, checkSettings, imageMatchSettings, retryTimeout) {
    let screenshot;
    const elapsedTimeStart = GeneralUtils.currentTimeMillis();

    // If the wait to load time is 0, or "run once" is true, we perform a single check window.
    if (retryTimeout === 0 || shouldRunOnceOnTimeout) {
      if (shouldRunOnceOnTimeout) {
        await GeneralUtils.sleep(retryTimeout);
      }

      screenshot = await this._tryTakeScreenshot(userInputs, region, tag, ignoreMismatch, checkSettings, imageMatchSettings);
    } else {
      screenshot = await this._retryTakingScreenshot(userInputs, region, tag, ignoreMismatch, checkSettings, imageMatchSettings, retryTimeout);
    }

    // noinspection MagicNumberJS
    const elapsedTime = GeneralUtils.currentTimeMillis() - elapsedTimeStart;
    this._logger.verbose(`Completed in ${GeneralUtils.elapsedString(elapsedTime)}`);
    return screenshot;
  }

  /**
   * @protected
   * @param {Trigger[]} userInputs
   * @param {Region} region
   * @param {string} tag
   * @param {boolean} ignoreMismatch
   * @param {CheckSettings} checkSettings
   * @param {ImageMatchSettings} imageMatchSettings
   * @param {number} retryTimeout
   * @return {Promise<EyesScreenshot>}
   */
  async _retryTakingScreenshot(userInputs, region, tag, ignoreMismatch, checkSettings, imageMatchSettings, retryTimeout) {
    const start = GeneralUtils.currentTimeMillis(); // Start the retry timer.
    const retry = GeneralUtils.currentTimeMillis() - start;

    // The match retry loop.
    const screenshot = await this._takingScreenshotLoop(userInputs, region, tag, ignoreMismatch, checkSettings, imageMatchSettings, retryTimeout, retry, start);

    // if we're here because we haven't found a match yet, try once more
    if (!this._matchResult.getAsExpected()) {
      return this._tryTakeScreenshot(userInputs, region, tag, ignoreMismatch, checkSettings, imageMatchSettings);
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
   * @param {ImageMatchSettings} imageMatchSettings
   * @param {number} retryTimeout
   * @param {number} retry
   * @param {number} start
   * @param {EyesScreenshot} [screenshot]
   * @return {Promise<EyesScreenshot>}
   */
  async _takingScreenshotLoop(userInputs, region, tag, ignoreMismatch, checkSettings, imageMatchSettings, retryTimeout, retry, start, screenshot) {
    if (retry >= retryTimeout) {
      return screenshot;
    }

    await GeneralUtils.sleep(MatchWindowTask.MATCH_INTERVAL);

    const newScreenshot = await this._tryTakeScreenshot(userInputs, region, tag, true, checkSettings, imageMatchSettings);

    if (this._matchResult.getAsExpected()) {
      return newScreenshot;
    }

    return this._takingScreenshotLoop(
      userInputs, region, tag, ignoreMismatch, checkSettings, imageMatchSettings, retryTimeout,
      GeneralUtils.currentTimeMillis() - start, start, newScreenshot
    );
  }

  /**
   * @protected
   * @param {Trigger[]} userInputs
   * @param {Region} region
   * @param {string} tag
   * @param {boolean} ignoreMismatch
   * @param {CheckSettings} checkSettings
   * @param {ImageMatchSettings} imageMatchSettings
   * @return {Promise<EyesScreenshot>}
   */
  async _tryTakeScreenshot(userInputs, region, tag, ignoreMismatch, checkSettings, imageMatchSettings) {
    const appOutput = await this._appOutputProvider.getAppOutput(region, this._lastScreenshot);
    const screenshot = appOutput.getScreenshot();
    this._matchResult = await this.performMatch(userInputs, appOutput, tag, ignoreMismatch, checkSettings, imageMatchSettings);
    return screenshot;
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
    if (region.isSizeEmpty()) {
      if (this._lastScreenshot) {
        this._lastScreenshotBounds = new Region(
          0,
          0,
          this._lastScreenshot.getImage().getWidth(),
          this._lastScreenshot.getImage().getHeight()
        );
      } else {
        // We set an "infinite" image size since we don't know what the screenshot size is...
        this._lastScreenshotBounds = new Region(0, 0, Number.MAX_VALUE, Number.MAX_VALUE);
      }
    } else {
      this._lastScreenshotBounds = region;
    }

    return Promise.resolve();
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
exports.MatchWindowTask = MatchWindowTask;
