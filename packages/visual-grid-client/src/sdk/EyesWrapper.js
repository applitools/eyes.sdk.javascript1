'use strict';
const {
  EyesBase,
  NullRegionProvider,
  TestResultsStatus,
  DiffsFoundError,
  NewTestError,
  TestFailedError,
} = require('@applitools/eyes-sdk-core');
const {presult} = require('@applitools/functional-commons');

const VERSION = require('../../package.json').version;

class EyesWrapper extends EyesBase {
  constructor({apiKey, logHandler} = {}) {
    super();
    apiKey && this.setApiKey(apiKey);
    logHandler && this.setLogHandler(logHandler);
  }

  async open({appName, testName, viewportSize, skipStartingSession}) {
    await super.openBase(appName, testName, undefined, undefined, skipStartingSession);

    if (viewportSize) {
      this.setViewportSize(viewportSize);
    }
  }

  async ensureAborted() {
    if (!this.getRunningSession()) {
      this._configuration.mergeConfig(this.getAssumedConfiguration());
      const [err] = await presult(this._ensureRunningSession());
      if (err) {
        this._logger.log(
          'failed to ensure a running session (probably due to a previous fatal error)',
          err,
        );
      }
    }
    await this.abort();
  }

  async getScreenshot() {
    return;
  }

  async getScreenshotUrl() {
    return this.screenshotUrl;
  }

  async getInferredEnvironment() {
    return this.inferredEnvironment;
  }

  async setViewportSize(viewportSize) {
    this._configuration.setViewportSize(viewportSize);
    this._viewportSizeHandler.set(this._configuration.getViewportSize());
  }

  async getTitle() {
    return 'some title'; // TODO what should this be? is it connected with the tag in `checkWindow` somehow?
  }

  async getDomUrl() {
    return this.domUrl;
  }

  async getImageLocation() {
    return this.imageLocation;
  }

  /**
   * Get the AUT session id.
   *
   * @return {Promise<?String>}
   */
  async getAUTSessionId() {
    return; // TODO is this good?
  }

  setAssumedConfiguration(configuration) {
    this._assumedConfiguration = configuration;
  }

  getAssumedConfiguration() {
    return this._assumedConfiguration;
  }

  /** @override */
  getBaseAgentId() {
    return this.agentId || `visual-grid-client/${VERSION}`;
  }

  setBaseAgentId(agentId) {
    this.agentId = agentId;
  }

  setAccessibilityValidation(accessibilityLevel) {
    this._configuration.getDefaultMatchSettings().setAccessibilityValidation(accessibilityLevel);
  }

  /**
   * Get a RenderingInfo from eyes server
   *
   * @return {Promise<RenderingInfo>}
   */
  getRenderInfo() {
    return this._serverConnector.renderInfo();
  }

  setRenderingInfo(renderingInfo) {
    this._serverConnector.setRenderingInfo(renderingInfo);
  }

  /**
   * Create a screenshot of a page on RenderingGrid server
   *
   * @param {RenderRequest[]} renderRequests - The requests to be sent to the rendering grid
   * @return {Promise<String[]>} - The results of the render
   */
  renderBatch(renderRequests) {
    renderRequests.forEach(rr => rr.setAgentId(this.getBaseAgentId()));
    return this._serverConnector.render(renderRequests);
  }

  putResource(runningRender, resource) {
    return this._serverConnector.renderPutResource(runningRender, resource);
  }

  getRenderStatus(renderId) {
    return this._serverConnector.renderStatusById(renderId);
  }

  checkWindow({screenshotUrl, tag, domUrl, checkSettings, imageLocation, source}) {
    const regionProvider = new NullRegionProvider();
    this.screenshotUrl = screenshotUrl;
    this.domUrl = domUrl;
    this.imageLocation = imageLocation;
    return this.checkWindowBase(regionProvider, tag, false, checkSettings, source);
  }

  testWindow({screenshotUrl, tag, domUrl, checkSettings, imageLocation}) {
    this._logger.verbose(`EyesWrapper.testWindow() called`);
    this.screenshotUrl = screenshotUrl;
    this.domUrl = domUrl;
    this.imageLocation = imageLocation;
    const regionProvider = new NullRegionProvider();
    return this.checkSingleWindowBase(regionProvider, tag, false, checkSettings);
  }

  closeTestWindow(results, throwEx) {
    this._logger.verbose(`EyesWrapper.closeTestWindow() called`);
    const status = results.getStatus();
    if (status === TestResultsStatus.Unresolved) {
      if (results.getIsNew()) {
        if (throwEx) {
          return Promise.reject(new NewTestError(results, this._sessionStartInfo));
        }
      } else {
        if (throwEx) {
          return Promise.reject(new DiffsFoundError(results, this._sessionStartInfo));
        }
      }
    } else if (status === TestResultsStatus.Failed) {
      if (throwEx) {
        return Promise.reject(new TestFailedError(results, this._sessionStartInfo));
      }
    }

    const sessionResultsUrl = results.getAppUrls().getSession();
    results.setUrl(sessionResultsUrl);

    this._isOpen = false;
    this._lastScreenshot = null;
    this.clearUserInputs();
    this._initProviders(true);
    this._logger.getLogHandler().close();
    this._matchWindowTask = null;
    this._autSessionId = undefined;
    this._currentAppName = undefined;
    return Promise.resolve(results);
  }

  setProxy(proxy) {
    if (proxy.uri !== undefined) {
      proxy.url = proxy.uri; // backward compatible
    }
    super.setProxy(proxy);
  }

  setInferredEnvironment(value) {
    this.inferredEnvironment = value;
  }

  getExistingBatchId() {
    // not doing eyesInstance.getBatch().getId() because
    // it would generate a new id if called before open
    return this._configuration._batch && this._configuration._batch.getId();
  }
}

module.exports = EyesWrapper;
