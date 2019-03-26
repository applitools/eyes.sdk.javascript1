'use strict';

const { makeVisualGridClient } = require('@applitools/visual-grid-client');
const { getProcessPageAndSerializeScript } = require('@applitools/dom-snapshot');
const { ArgumentGuard, TypeUtils } = require('@applitools/eyes-common');

const {
  TestFailedError,
  TestResultsFormatter,
  CorsIframeHandle,
  CorsIframeHandler,
} = require('@applitools/eyes-sdk-core');

const { VisualGridRunner } = require('./visualgrid/VisualGridRunner');
const { BrowserType } = require('./config/BrowserType');
const { Eyes } = require('./Eyes');

/**
 * @ignore
 */
class EyesVisualGrid extends Eyes {
  /** @var {Logger} EyesVisualGrid#_logger */
  /** @var {SeleniumConfiguration} EyesVisualGrid#_configuration */
  /** @var {ImageMatchSettings} EyesVisualGrid#_defaultMatchSettings */

  /**
   * Creates a new (possibly disabled) Eyes instance that interacts with the Eyes Server at the specified url.
   *
   * @param {string} [serverUrl=EyesBase.getDefaultServerUrl()] - The Eyes server URL.
   * @param {boolean} [isDisabled=false] - Set {@code true} to disable Applitools Eyes and use the WebDriver directly.
   * @param {VisualGridRunner} [visualGridRunner] - Set {@code true} to disable Applitools Eyes and use the WebDriver directly.
   */
  constructor(serverUrl, isDisabled, visualGridRunner = new VisualGridRunner()) {
    super(serverUrl, isDisabled, true);

    /** @type {VisualGridRunner} */ this._visualGridRunner = visualGridRunner;

    /** @type {string} */ this._processPageAndSerializeScript = undefined;
    /** @function */ this._checkWindowCommand = undefined;
    /** @function */ this._closeCommand = undefined;
  }

  /**
   * @inheritDoc
   */
  async open(driver, appName, testName, viewportSize, sessionType) {
    ArgumentGuard.notNull(driver, 'driver');

    // noinspection NonBlockStatementBodyJS
    if (appName) this._configuration.appName = appName;
    // noinspection NonBlockStatementBodyJS
    if (testName) this._configuration.testName = testName;
    // noinspection NonBlockStatementBodyJS
    if (viewportSize) this._configuration.viewportSize = viewportSize;
    // noinspection NonBlockStatementBodyJS
    if (sessionType) this._configuration.sessionType = sessionType;

    // noinspection NonBlockStatementBodyJS
    if (this._visualGridRunner.concurrentSessions) this._configuration.concurrentSessions = this._visualGridRunner.concurrentSessions;

    await this._initDriver(driver);

    const { openEyes } = makeVisualGridClient({
      logger: this._logger,
      apiKey: this._configuration.apiKey,
      showLogs: this._configuration.showLogs,
      saveDebugData: this._configuration.saveDebugData,
      proxy: this._configuration.proxy,
      serverUrl: this._configuration.serverUrl,
      renderConcurrencyFactor: this._configuration.concurrentSessions,
    });

    this._processPageAndSerializeScript = await getProcessPageAndSerializeScript();

    if (this._configuration.viewportSize) {
      await this.setViewportSize(this._configuration.viewportSize);

      if (this._configuration.browsersInfo.length === 0) {
        this._configuration.addBrowser(this._configuration.viewportSize.getWidth(), this._configuration.viewportSize.getHeight(), BrowserType.CHROME);
      }
    }

    const { checkWindow, close } = await openEyes({
      appName: this._configuration.appName,
      testName: this._configuration.testName,
      browser: this._configuration.browsersInfo,
      properties: this._configuration.properties,
      batchName: this._configuration.batch && this._configuration.batch.getName(),
      batchId: this._configuration.batch && this._configuration.batch.getId(),
      baselineBranchName: this._configuration.baselineBranchName,
      baselineEnvName: this._configuration.baselineEnvName,
      baselineName: this._configuration.baselineEnvName,
      envName: this._configuration.environmentName,
      branchName: this._configuration.branchName,
      saveFailedTests: this._configuration.saveFailedTests,
      saveNewTests: this._configuration.saveNewTests,
      compareWithParentBranch: this._configuration.compareWithParentBranch,
      ignoreBaseline: this._configuration.ignoreBaseline,
      parentBranchName: this._configuration.parentBranchName,
      agentId: this._configuration.agentId,
      isDisabled: this._configuration.isDisabled,
      matchTimeout: this._configuration.matchTimeout,

      ignoreCaret: this._defaultMatchSettings.getIgnoreCaret(),
      matchLevel: this._defaultMatchSettings.getMatchLevel(),

      // renderBatch,
      // waitForRenderedStatus,
      // renderThroat,
      // getRenderInfoPromise,
      // getHandledRenderInfoPromise,
      // getRenderInfo,
      // createRGridDOMAndGetResourceMapping,
      // eyesTransactionThroat,
    });

    this._checkWindowCommand = checkWindow;
    this._closeCommand = close;
    this._isOpen = true;

    return this._driver;
  }

  /**
   * @param {boolean} [throwEx]
   * @return {Promise<TestResults>}
   */
  async close(throwEx = true) {
    try {
      const results = await this._closeCommand(throwEx);
      const first = results[0];

      if (first instanceof TestFailedError) {
        return first.getTestResults();
      }

      return first;
    } catch (err) {
      if (Array.isArray(err)) {
        throw err[0];
      }

      throw err;
    } finally {
      this._isOpen = false;
    }
  }

  // noinspection JSMethodCanBeStatic
  /**
   * @return {Promise<?TestResults>}
   */
  async abortIfNotClosed() {
    return null; // TODO - implement?
  }

  /**
   * @param {boolean} [throwEx]
   * @return {Promise<TestResults[]|Error[]>}
   */
  async closeAndReturnResults(throwEx = false) {
    try {
      return await this._closeCommand(throwEx);
    } finally {
      this._isOpen = false;
    }
  }

  /**
   * @param {boolean} [throwEx]
   * @return {Promise}
   */
  async closeAndPrintResults(throwEx = true) {
    const results = await this.closeAndReturnResults(throwEx);

    const testResultsFormatter = new TestResultsFormatter(results);
    // eslint-disable-next-line no-console
    console.log(testResultsFormatter.asFormatterString());
  }

  /**
   * @return {object}
   */
  getRunner() {
    const runner = {};
    /**
     * @param {boolean} [throwEx=true]
     * @return {Promise<TestResults[]|Error[]>}
     */
    runner.getAllResults = async (throwEx = false) => {
      return await this.closeAndReturnResults(throwEx);
    };
    return runner;
  }

  /**
   * @inheritDoc
   */
  async check(name, checkSettings) {
    ArgumentGuard.notNull(checkSettings, 'checkSettings');

    if (TypeUtils.isNotNull(name)) {
      checkSettings.withName(name);
    }

    this._logger.verbose(`Dom extraction starting   (${checkSettings.toString()})   $$$$$$$$$$$$`);

    let targetSelector = await checkSettings.getTargetProvider();
    if (targetSelector) {
      targetSelector = await targetSelector.getSelector(this);
    }

    const domCaptureScript = `var callback = arguments[arguments.length - 1]; return (${this._processPageAndSerializeScript})().then(JSON.stringify).then(callback, function(err) {callback(err.stack || err.toString())})`;
    const results = await this._driver.executeAsyncScript(domCaptureScript);
    const { cdt, url: pageUrl, blobs, resourceUrls, frames } = JSON.parse(results);

    if (this.getCorsIframeHandle() === CorsIframeHandle.BLANK) {
      CorsIframeHandler.blankCorsIframeSrcOfCdt(cdt, frames);
    }

    const resourceContents = blobs.map(({ url, type, value }) => ({
      url,
      type,
      value: Buffer.from(value, 'base64'),
    }));

    this._logger.verbose(`Dom extracted  (${checkSettings.toString()})   $$$$$$$$$$$$`);

    await this._checkWindowCommand({
      resourceUrls,
      resourceContents,
      // frames
      url: pageUrl,
      cdt,
      tag: checkSettings.getName(),
      sizeMode: checkSettings.getSizeMode(),
      selector: targetSelector,
      region: checkSettings.getTargetRegion(),
      scriptHooks: checkSettings.getScriptHooks(),
      ignore: checkSettings.getIgnoreRegions(),
      floating: checkSettings.getFloatingRegions(),
      sendDom: checkSettings.getSendDom() ? checkSettings.getSendDom() : this.getSendDom(),
      matchLevel: checkSettings.getMatchLevel() ? checkSettings.getMatchLevel() : this.getMatchLevel(),
    });
  }
}

exports.EyesVisualGrid = EyesVisualGrid;
