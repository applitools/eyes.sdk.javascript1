'use strict';

const { makeVisualGridClient } = require('@applitools/visual-grid-client');
const { getProcessPageAndPollScript } = require('@applitools/dom-snapshot');
const { ArgumentGuard, TypeUtils, GeneralUtils } = require('@applitools/eyes-common');
const { CorsIframeHandle, CorsIframeHandler, IgnoreRegionByRectangle } = require('@applitools/eyes-sdk-core');

const { TestResultsSummary } = require('./runner/TestResultsSummary');
const { VisualGridRunner } = require('./runner/VisualGridRunner');
const { BrowserType } = require('./config/BrowserType');
const { Eyes } = require('./Eyes');

const VERSION = require('../package.json').version;

const CAPTURE_DOM_TIMEOUT_MS = 5 * 60 * 1000; // 5 min

/**
 * @ignore
 */
class EyesVisualGrid extends Eyes {
  /** @var {Logger} EyesVisualGrid#_logger */
  /** @var {Configuration} EyesVisualGrid#_configuration */

  /**
   * Creates a new (possibly disabled) Eyes instance that interacts with the Eyes Server at the specified url.
   *
   * @param {string} [serverUrl] - The Eyes server URL.
   * @param {boolean} [isDisabled=false] - Set {@code true} to disable Applitools Eyes and use the WebDriver directly.
   * @param {VisualGridRunner} [runner] - Set shared VisualGridRunner if you want to group results.
   */
  constructor(serverUrl, isDisabled, runner = new VisualGridRunner()) {
    super(serverUrl, isDisabled, runner);

    this._isVisualGrid = true;

    /** @type {string} */ this._processResourcesScript = undefined;
    /** @function */ this._checkWindowCommand = undefined;
    /** @function */ this._closeCommand = undefined;
    /** @type {Promise} */ this._closePromise = undefined;
  }

  // noinspection JSMethodCanBeStatic
  /**
   * @override
   * @protected
   * @return {string} - The base agent id of the SDK.
   */
  getBaseAgentId() {
    return `eyes.selenium.visualgrid.javascript/${VERSION}`;
  }

  /**
   * @inheritDoc
   */
  async open(driver, appName, testName, viewportSize, sessionType) {
    ArgumentGuard.notNull(driver, 'driver');

    // noinspection NonBlockStatementBodyJS
    if (appName) this._configuration.setAppName(appName);
    // noinspection NonBlockStatementBodyJS
    if (testName) this._configuration.setTestName(testName);
    // noinspection NonBlockStatementBodyJS
    if (viewportSize) this._configuration.setViewportSize(viewportSize);
    // noinspection NonBlockStatementBodyJS
    if (sessionType) this._configuration.setSessionType(sessionType);

    // noinspection NonBlockStatementBodyJS
    if (this._runner.getConcurrentSessions()) {
      this._configuration.setConcurrentSessions(this._runner.getConcurrentSessions());
    }

    await this._initDriver(driver);

    const { openEyes } = makeVisualGridClient({
      logger: this._logger,
      agentId: this.getFullAgentId(),
      apiKey: this._configuration.getApiKey(),
      showLogs: this._configuration.getShowLogs(),
      saveDebugData: this._configuration.getSaveDebugData(),
      proxy: this._configuration.getProxy(),
      serverUrl: this._configuration.getServerUrl(),
      // concurrency: this._configuration.getConcurrentSessions(),
      renderConcurrencyFactor: this._configuration.getConcurrentSessions(),
    });

    this._processResourcesScript = await getProcessPageAndPollScript();

    if (this._configuration.getViewportSize()) {
      await this.setViewportSize(this._configuration.getViewportSize());

      if (this._configuration.getBrowsersInfo().length === 0) {
        this._configuration.addBrowser(this._configuration.getViewportSize().getWidth(), this._configuration.getViewportSize().getHeight(), BrowserType.CHROME);
      }
    }

    const { checkWindow, close } = await openEyes({
      appName: this._configuration.getAppName(),
      testName: this._configuration.getTestName(),
      browser: this._configuration.getBrowsersInfo(),
      properties: this._configuration.getProperties(),
      batchSequenceName: this._configuration.getBatch() && this._configuration.getBatch().getSequenceName(),
      batchName: this._configuration.getBatch() && this._configuration.getBatch().getName(),
      batchId: this._configuration.getBatch() && this._configuration.getBatch().getId(),
      baselineBranchName: this._configuration.getBaselineBranchName(),
      baselineEnvName: this._configuration.getBaselineEnvName(),
      baselineName: this._configuration.getBaselineEnvName(),
      envName: this._configuration.getEnvironmentName(),
      branchName: this._configuration.getBranchName(),
      saveFailedTests: this._configuration.getSaveFailedTests(),
      saveNewTests: this._configuration.getSaveNewTests(),
      compareWithParentBranch: this._configuration.getCompareWithParentBranch(),
      ignoreBaseline: this._configuration.getIgnoreBaseline(),
      parentBranchName: this._configuration.getParentBranchName(),
      isDisabled: this._configuration.getIsDisabled(),
      matchTimeout: this._configuration.getMatchTimeout(),

      ignoreCaret: this._configuration.getIgnoreCaret(),
      matchLevel: this._configuration.getMatchLevel(),
      useDom: this._configuration.getUseDom(),
      enablePatterns: this._configuration.getEnablePatterns(),
      ignoreDisplacements: this._configuration.getIgnoreDisplacements(),
      saveDebugData: this._configuration.getSaveDebugData(),
    });

    this._isOpen = true;
    this._checkWindowCommand = checkWindow;
    this._closeCommand = async () => close(true).catch((err) => {
      if (Array.isArray(err)) {
        return err;
      }

      throw err;
    });

    return this._driver;
  }

  /**
   * @package
   * @param {boolean} [throwEx=true]
   * @return {Promise<TestResultsSummary>}
   */
  async closeAndReturnResults(throwEx = true) {
    try {
      const resultsPromise = this._closePromise || this._closeCommand();
      const res = await resultsPromise;
      const testResultsSummary = new TestResultsSummary(res);

      if (throwEx === true) {
        for (const result of testResultsSummary.getAllResults()) {
          if (result.getException()) {
            throw result.getException();
          }
        }
      }

      return testResultsSummary;
    } finally {
      this._isOpen = false;
      this._closePromise = undefined;
    }
  }

  /**
   * @return {Promise}
   */
  async closeAsync() {
    if (!this._closePromise) {
      this._closePromise = this._closeCommand();
    }
  }

  /**
   * @param {boolean} [throwEx]
   * @return {Promise<TestResults>}
   */
  async close(throwEx = true) {
    const results = await this.closeAndReturnResults(throwEx);

    for (const result of results.getAllResults()) {
      if (result.getException()) {
        return result.getTestResults();
      }
    }

    return results.getAllResults()[0].getTestResults();
  }

  // noinspection JSMethodCanBeStatic
  /**
   * @return {Promise<?TestResults>}
   */
  async abort() {
    return null; // TODO - implement?
  }

  /**
   * @private
   * @param {EyesWebDriver} driver
   * @param {Logger} logger
   * @param {string} processResourcesScript
   * @param {number} startTime
   * @return {Promise<object>}
   */
  static async _capturePageDom(driver, logger, processResourcesScript, startTime = Date.now()) {
    let /** @type {{value: object, status: string, error: string}} */ scriptResponse;

    try {
      const resultAsString = await driver.executeScript(`${processResourcesScript} return __processPageAndPoll();`);
      scriptResponse = JSON.parse(resultAsString);
    } catch (err) {
      logger.log('Failed to execute script to capture DOM:', err);
    }

    if ((Date.now() - startTime) >= CAPTURE_DOM_TIMEOUT_MS) {
      throw new Error('Timeout is reached for capture DOM.');
    } else if (scriptResponse.status === 'SUCCESS') {
      return scriptResponse.value;
    } else if (scriptResponse.status === 'ERROR') {
      throw new Error(`Failed to capture DOM: ${scriptResponse.error}`);
    }

    await GeneralUtils.sleep(200);
    return EyesVisualGrid._capturePageDom(driver, logger, processResourcesScript, startTime);
  }

  /**
   * @inheritDoc
   */
  async check(name, checkSettings) {
    ArgumentGuard.notNull(checkSettings, 'checkSettings');

    if (TypeUtils.isNotNull(name)) {
      checkSettings.withName(name);
    }

    let targetSelector = await checkSettings.getTargetProvider();
    if (targetSelector) {
      targetSelector = await targetSelector.getSelector(this);
    }

    this._logger.verbose(`Dom extraction starting   (${checkSettings.toString()})   $$$$$$$$$$$$`);

    let pageDomResults;
    try {
      pageDomResults = await EyesVisualGrid._capturePageDom(this._driver, this._logger, this._processResourcesScript);
    } catch (e) {
      throw new Error(`Failed to extract DOM from the page: ${e.toString()}`);
    }

    const { cdt, url: pageUrl, blobs, resourceUrls, frames } = pageDomResults;

    if (this.getCorsIframeHandle() === CorsIframeHandle.BLANK) {
      CorsIframeHandler.blankCorsIframeSrcOfCdt(cdt, frames);
    }

    const resourceContents = this._blobsToResourceContents(blobs);
    if (frames && frames.length > 0) {
      for (let i = 0; i < frames.length; i += 1) {
        frames[i].resourceContents = this._blobsToResourceContents(frames[i].blobs);
        delete frames[i].blobs;
      }
    }

    this._logger.verbose(`Dom extracted  (${checkSettings.toString()})   $$$$$$$$$$$$`);

    const source = await this._driver.getCurrentUrl();
    const ignoreRegions = await this._prepareRegions(checkSettings.getIgnoreRegions());

    await this._checkWindowCommand({
      resourceUrls,
      resourceContents,
      frames,
      url: pageUrl,
      cdt,
      tag: checkSettings.getName(),
      sizeMode: checkSettings.getSizeMode() === 'viewport' && this.getForceFullPageScreenshot() ? 'full-page' : checkSettings.getSizeMode(),
      selector: targetSelector,
      region: checkSettings.getTargetRegion(),
      scriptHooks: checkSettings.getScriptHooks(),
      ignore: ignoreRegions,
      floating: checkSettings.getFloatingRegions(),
      sendDom: checkSettings.getSendDom() ? checkSettings.getSendDom() : this.getSendDom(),
      matchLevel: checkSettings.getMatchLevel() ? checkSettings.getMatchLevel() : this.getMatchLevel(),
      source,
    });
  }

  /**
   * @private
   * @param {{type: string, url: string, value: string}[]} blobs
   * @return {{type: string, url: string, value: Buffer}[]}
   */
  _blobsToResourceContents(blobs) {
    return blobs.map(({ url, type, value }) => ({
      url,
      type,
      value: Buffer.from(value, 'base64'),
    }));
  }

  /**
   * @private
   * @param {GetRegion[]} regions
   * @return {{type: string, url: string, value: Buffer}[]}
   */
  async _prepareRegions(regions) {
    if (regions && regions.length > 0) {
      const newRegions = [];

      for (const region of regions) {
        if (region instanceof IgnoreRegionByRectangle) {
          const plainRegion = (await region.getRegion(this, undefined)).toJSON();
          newRegions.push(plainRegion);
        } else {
          const selector = await region.getSelector(this);
          newRegions.push({ selector });
        }
      }

      return newRegions;
    }

    return regions;
  }
}

exports.EyesVisualGrid = EyesVisualGrid;
