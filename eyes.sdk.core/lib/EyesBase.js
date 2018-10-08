'use strict';

const { Logger } = require('./logging/Logger');

const { Region } = require('./geometry/Region');
const { Location } = require('./geometry/Location');
const { RectangleSize } = require('./geometry/RectangleSize');
const { CoordinatesType } = require('./geometry/CoordinatesType');

const { FileDebugScreenshotsProvider } = require('./debug/FileDebugScreenshotsProvider');
const { NullDebugScreenshotProvider } = require('./debug/NullDebugScreenshotProvider');

const { ImageDeltaCompressor } = require('./images/ImageDeltaCompressor');

const { AppOutputProvider } = require('./capture/AppOutputProvider');
const { AppOutputWithScreenshot } = require('./capture/AppOutputWithScreenshot');
const { AppOutput } = require('./match/AppOutput');

const { FixedScaleProvider } = require('./scaling/FixedScaleProvider');
const { NullScaleProvider } = require('./scaling/NullScaleProvider');

const { NullCutProvider } = require('./cropping/NullCutProvider');

const { InvalidPositionProvider } = require('./positioning/InvalidPositionProvider');

const { TextTrigger } = require('./triggers/TextTrigger');
const { MouseTrigger } = require('./triggers/MouseTrigger');

const { MatchResult } = require('./match/MatchResult');
const { MatchLevel } = require('./match/MatchLevel');
const { ImageMatchSettings } = require('./match/ImageMatchSettings');
const { MatchWindowData } = require('./match/MatchWindowData');

const { DiffsFoundError } = require('./errors/DiffsFoundError');
const { EyesError } = require('./errors/EyesError');
const { NewTestError } = require('./errors/NewTestError');
const { OutOfBoundsError } = require('./errors/OutOfBoundsError');
const { TestFailedError } = require('./errors/TestFailedError');

const { ValidationInfo } = require('./events/ValidationInfo');
const { ValidationResult } = require('./events/ValidationResult');
const { SessionEventHandlers } = require('./events/SessionEventHandlers');

const { CheckSettings } = require('./fluent/CheckSettings');

const { RenderWindowTask } = require('./RenderWindowTask');

const { SessionStartInfo } = require('./server/SessionStartInfo');
const { SessionType } = require('./server/SessionType');
const { PropertyData } = require('./server/PropertyData');
const { TestResultsStatus } = require('./TestResultsStatus');
const { TestResults } = require('./TestResults');
const { ServerConnector } = require('./server/ServerConnector');

const { SimplePropertyHandler } = require('./utils/SimplePropertyHandler');
const { ReadOnlyPropertyHandler } = require('./utils/ReadOnlyPropertyHandler');
const { GeneralUtils } = require('./utils/GeneralUtils');

const { FailureReports } = require('./FailureReports');
const { ArgumentGuard } = require('./ArgumentGuard');
const { AppEnvironment } = require('./AppEnvironment');
const { MatchWindowTask } = require('./MatchWindowTask');
const { MatchSingleWindowTask } = require('./MatchSingleWindowTask');
const { BatchInfo } = require('./BatchInfo');

const DEFAULT_MATCH_TIMEOUT = 2000;
const MIN_MATCH_TIMEOUT = 500;
const USE_DEFAULT_TIMEOUT = -1;

/**
 * Core/Base class for Eyes - to allow code reuse for different SDKs (images, selenium, etc).
 */
class EyesBase {
  // noinspection FunctionTooLongJS
  /**
   * Creates a new {@code EyesBase}instance that interacts with the Eyes Server at the specified url.
   *
   * @param {?string} [serverUrl] The Eyes server URL.
   * @param {?boolean} [isDisabled=false] Will be checked <b>before</b> any argument validation. If true, all method
   *   will immediately return without performing any action.
   */
  constructor(
    serverUrl = EyesBase.getDefaultServerUrl(),
    isDisabled = false
  ) {
    /** @type {boolean} */
    this._isDisabled = isDisabled;

    if (this._isDisabled) {
      this._userInputs = null;
      return;
    }

    ArgumentGuard.notNull(serverUrl, 'serverUrl');

    /** @type {Logger} */
    this._logger = new Logger();

    Region.initLogger(this._logger);

    this._initProviders();

    /** @type {ServerConnector} */
    this._serverConnector = new ServerConnector(this._logger, serverUrl);
    /** @type {number} */
    this._matchTimeout = DEFAULT_MATCH_TIMEOUT;
    /** @type {boolean} */
    this._compareWithParentBranch = false;
    /** @type {boolean} */
    this._ignoreBaseline = false;
    /** @type {FailureReports} */
    this._failureReports = FailureReports.ON_CLOSE;
    /** @type {ImageMatchSettings} */
    this._defaultMatchSettings = new ImageMatchSettings();
    this._defaultMatchSettings.setIgnoreCaret(true);

    /** @type {Trigger[]} */
    this._userInputs = [];
    /** @type {PropertyData[]} */
    this._properties = [];

    /** @type {boolean} */
    this._useImageDeltaCompression = true;

    /** @type {number} */
    this._validationId = -1;
    /** @type {SessionEventHandlers} */
    this._sessionEventHandlers = new SessionEventHandlers();

    /**
     * Used for automatic save of a test run. New tests are automatically saved by default.
     * @type {boolean}
     */
    this._saveNewTests = true;
    /**
     * @type {boolean}
     */
    this._saveFailedTests = false;

    // noinspection JSUnusedGlobalSymbols
    /** @type {RenderWindowTask} */
    this._renderWindowTask = new RenderWindowTask(this._logger, this._serverConnector);

    /** @type {boolean} */ this._shouldMatchWindowRunOnceOnTimeout = undefined;
    /** @type {MatchWindowTask} */ this._matchWindowTask = undefined;

    /** @type {RunningSession} */ this._runningSession = undefined;
    /** @type {SessionStartInfo} */ this._sessionStartInfo = undefined;
    /** @type {boolean} */ this._isViewportSizeSet = undefined;

    /** @type {boolean} */ this._isOpen = undefined;
    /** @type {string} */ this._agentId = undefined;
    /** @type {boolean} */ this._render = false;
    /** @type {boolean} */ this._saveDiffs = undefined;

    /** @type {SessionType} */ this._sessionType = undefined;
    /** @type {string} */ this._testName = undefined;
    /** @type {BatchInfo} */ this._batch = undefined;
    /** @type {string} */ this._hostApp = undefined;
    /** @type {string} */ this._hostOS = undefined;
    /** @type {string} */ this._baselineEnvName = undefined;
    /** @type {string} */ this._environmentName = undefined;
    /** @type {string} */ this._branchName = undefined;
    /** @type {string} */ this._parentBranchName = undefined;
    /** @type {string} */ this._baselineBranchName = undefined;

    /**
     * Will be set for separately for each test.
     * @type {string}
     */
    this._currentAppName = undefined;

    /**
     * The default app name if no current name was provided. If this is {@code null} then there is no default appName.
     * @type {string}
     */
    this._appName = undefined;

    /**
     * The session ID of webdriver instance
     * @type {string}
     */
    this._autSessionId = undefined;
  }

  // noinspection FunctionWithMoreThanThreeNegationsJS
  /**
   * @param {boolean} [hardReset=false] If false, init providers only if they're not initialized.
   * @private
   */
  _initProviders(hardReset = false) {
    if (hardReset) {
      this._scaleProviderHandler = undefined;
      this._cutProviderHandler = undefined;
      this._positionProviderHandler = undefined;
      this._viewportSizeHandler = undefined;
      this._debugScreenshotsProvider = undefined;
    }

    if (!this._scaleProviderHandler) {
      /** @type {PropertyHandler<ScaleProvider>} */
      this._scaleProviderHandler = new SimplePropertyHandler();
      this._scaleProviderHandler.set(new NullScaleProvider());
    }

    if (!this._cutProviderHandler) {
      /** @type {PropertyHandler<CutProvider>} */
      this._cutProviderHandler = new SimplePropertyHandler();
      this._cutProviderHandler.set(new NullCutProvider());
    }

    if (!this._positionProviderHandler) {
      /** @type {PropertyHandler<PositionProvider>} */
      this._positionProviderHandler = new SimplePropertyHandler();
      this._positionProviderHandler.set(new InvalidPositionProvider());
    }

    if (!this._viewportSizeHandler) {
      /** @type {PropertyHandler<RectangleSize>} */
      this._viewportSizeHandler = new SimplePropertyHandler();
      this._viewportSizeHandler.set(null);
    }

    if (!this._debugScreenshotsProvider) {
      /** @type {DebugScreenshotsProvider} */
      this._debugScreenshotsProvider = new NullDebugScreenshotProvider();
    }
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Sets the user given agent id of the SDK.
   *
   * @param agentId {string} The agent ID to set.
   */
  setAgentId(agentId) {
    this._agentId = agentId;
  }

  /**
   * @return {string} The user given agent id of the SDK.
   */
  getAgentId() {
    return this._agentId;
  }

  /**
   * Sets the API key of your applitools Eyes account.
   *
   * @param apiKey {string} The api key to be used.
   */
  setApiKey(apiKey) {
    ArgumentGuard.notNull(apiKey, 'apiKey');
    ArgumentGuard.alphanumeric(apiKey, 'apiKey');
    this._serverConnector.setApiKey(apiKey);
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @return {string} The currently set API key or {@code null} if no key is set.
   */
  getApiKey() {
    return this._serverConnector.getApiKey();
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Sets the current server URL used by the rest client.
   *
   * @param serverUrl {string} The URI of the rest server, or {@code null} to use the default server.
   */
  setServerUrl(serverUrl) {
    if (serverUrl) {
      this._serverConnector.setServerUrl(serverUrl);
    } else {
      this._serverConnector.setServerUrl(EyesBase.getDefaultServerUrl());
    }
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @return {string} The URI of the eyes server.
   */
  getServerUrl() {
    return this._serverConnector.getServerUrl();
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Sets the authToken for rendering server.
   *
   * @param authToken {string} The authToken to be used.
   */
  setRenderingAuthToken(authToken) {
    this._serverConnector.setRenderingAuthToken(authToken);
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @return {string} The currently authToken or {@code null} if no key is set.
   */
  getRenderingAuthToken() {
    return this._serverConnector.getRenderingAuthToken();
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Sets the current rendering server URL used by the rest client.
   *
   * @param serverUrl {string} The URI of the rendering server, or {@code null} to use the default server.
   */
  setRenderingServerUrl(serverUrl) {
    this._serverConnector.setRenderingServerUrl(serverUrl);
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @return {string} The URI of the eyes server.
   */
  getRenderingServerUrl() {
    return this._serverConnector.getRenderingServerUrl();
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Sets the proxy settings to be used by the request module.
   *
   * @param {ProxySettings|string} proxySettingsOrUrl The ProxySettings object or proxy url to be used by the
   *   serverConnector. If {@code null} then no proxy is set.
   * @param {string} [username]
   * @param {string} [password]
   */
  setProxy(proxySettingsOrUrl, username, password) {
    return this._serverConnector.setProxy(proxySettingsOrUrl, username, password);
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @return {ProxySettings} current proxy settings used by the server connector, or {@code null} if no proxy is set.
   */
  getProxy() {
    return this._serverConnector.getProxy();
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @param isDisabled {boolean} If true, all interactions with this API will be silently ignored.
   */
  setIsDisabled(isDisabled) {
    this._isDisabled = isDisabled;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @return {boolean} Whether eyes is disabled.
   */
  getIsDisabled() {
    return this._isDisabled;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @param appName {string} The name of the application under test.
   */
  setAppName(appName) {
    this._appName = appName;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @return {string} The name of the application under test.
   */
  getAppName() {
    return this._currentAppName || this._appName;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Sets the branch in which the baseline for subsequent test runs resides. If the branch does not already exist it
   * will be created under the specified parent branch (see {@link #setParentBranchName}). Changes to the baseline
   * or model of a branch do not propagate to other branches.
   *
   * @param branchName {string} Branch name or {@code null} to specify the default branch.
   */
  setBranchName(branchName) {
    this._branchName = branchName;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @return {string} The current branch name.
   */
  getBranchName() {
    return this._branchName;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Sets the branch under which new branches are created.
   *
   * @param parentBranchName {string} Branch name or {@code null} to specify the default branch.
   */
  setParentBranchName(parentBranchName) {
    this._parentBranchName = parentBranchName;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @return {string} The name of the current parent branch under which new branches will be created.
   */
  getParentBranchName() {
    return this._parentBranchName;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Sets the baseline branch under which new branches are created.
   *
   * @param baselineBranchName {string} Branch name or {@code null} to specify the default branch.
   */
  setBaselineBranchName(baselineBranchName) {
    this._baselineBranchName = baselineBranchName;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @return {string} The name of the baseline branch
   */
  getBaselineBranchName() {
    return this._baselineBranchName;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Clears the user inputs list.
   *
   * @protected
   */
  clearUserInputs() {
    if (this._isDisabled) {
      return;
    }
    this._userInputs.length = 0;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @protected
   * @return {Trigger[]} User inputs collected between {@code checkWindowBase} invocations.
   */
  getUserInputs() {
    if (this._isDisabled) {
      return null;
    }
    return GeneralUtils.clone(this._userInputs);
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Sets the maximum time (in ms) a match operation tries to perform a match.
   * @param {number} ms Total number of ms to wait for a match.
   */
  setMatchTimeout(ms) {
    if (this._isDisabled) {
      this._logger.verbose('Ignored');
      return;
    }

    this._logger.verbose(`Setting match timeout to: ${ms}`);
    if (ms !== 0 && MIN_MATCH_TIMEOUT > ms) {
      throw new TypeError(`Match timeout must be set in milliseconds, and must be > ${MIN_MATCH_TIMEOUT}`);
    }

    this._matchTimeout = ms;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @return {number} The maximum time in ms {@link #checkWindowBase(RegionProvider, string, boolean, number)} waits
   *   for a match.
   */
  getMatchTimeout() {
    return this._matchTimeout;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Set whether or not new tests are saved by default.
   *
   * @param {boolean} saveNewTests True if new tests should be saved by default. False otherwise.
   */
  setSaveNewTests(saveNewTests) {
    this._saveNewTests = saveNewTests;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @return {boolean} True if new tests are saved by default.
   */
  getSaveNewTests() {
    return this._saveNewTests;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Set whether or not failed tests are saved by default.
   *
   * @param {boolean} saveFailedTests True if failed tests should be saved by default, false otherwise.
   */
  setSaveFailedTests(saveFailedTests) {
    this._saveFailedTests = saveFailedTests;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @return {boolean} True if failed tests are saved by default.
   */
  getSaveFailedTests() {
    return this._saveFailedTests;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Sets the batch in which context future tests will run or {@code null} if tests are to run standalone.
   *
   * @param batchOrName {BatchInfo|string} - the batch name or batch object
   * @param [batchId] {string} - ID of the batch, should be generated using GeneralUtils.guid()
   * @param [batchDate] {string} - start date of the batch, can be created as new Date().toUTCString()
   */
  setBatch(batchOrName, batchId, batchDate) {
    if (this._isDisabled) {
      this._logger.verbose('Ignored');
      return;
    }

    if (batchOrName instanceof BatchInfo) {
      this._batch = batchOrName;
    } else {
      this._batch = new BatchInfo(batchOrName, batchDate, batchId);
    }

    this._logger.verbose(`setBatch(${this._batch})`);
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @return {BatchInfo} The currently set batch info.
   */
  getBatch() {
    if (!this._batch) {
      this._logger.verbose('No batch set');
      this._batch = new BatchInfo();
    }

    return this._batch;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @param {FailureReports} failureReports Use one of the values in FailureReports.
   */
  setFailureReports(failureReports) {
    ArgumentGuard.isValidEnumValue(failureReports, FailureReports);
    this._failureReports = failureReports;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @return {FailureReports} The failure reports setting.
   */
  getFailureReports() {
    return this._failureReports;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Updates the match settings to be used for the session.
   *
   * @param {ImageMatchSettings} defaultMatchSettings The match settings to be used for the session.
   */
  setDefaultMatchSettings(defaultMatchSettings) {
    ArgumentGuard.notNull(defaultMatchSettings, 'defaultMatchSettings');
    this._defaultMatchSettings = defaultMatchSettings;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @return {ImageMatchSettings} The match settings used for the session.
   */
  getDefaultMatchSettings() {
    return this._defaultMatchSettings;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * The test-wide match level to use when checking application screenshot with the expected output.
   *
   * @deprecated This function is deprecated. Please use {@link #setDefaultMatchSettings} instead.
   * @param {MatchLevel} matchLevel The test-wide match level to use when checking application screenshot with the
   *   expected output.
   */
  setMatchLevel(matchLevel) {
    ArgumentGuard.isValidEnumValue(matchLevel, MatchLevel);
    this._defaultMatchSettings.setMatchLevel(matchLevel);
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @deprecated Please use{@link #getDefaultMatchSettings} instead.
   * @return {MatchLevel} The test-wide match level.
   */
  getMatchLevel() {
    return this._defaultMatchSettings.getMatchLevel();
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @return {string} The full agent id composed of both the base agent id and the user given agent id.
   */
  getFullAgentId() {
    const agentId = this.getAgentId();
    if (!agentId) {
      return this.getBaseAgentId();
    }
    // noinspection JSUnresolvedFunction
    return `${agentId} [${this.getBaseAgentId()}]`;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @return {boolean} Whether a session is open.
   */
  getIsOpen() {
    return this._isOpen;
  }

  /**
   * @return {string}
   */
  static getDefaultServerUrl() {
    return process.env.APPLITOOLS_SERVER_URL || 'https://eyesapi.applitools.com';
  }

  /**
   * Sets a handler of log messages generated by this API.
   *
   * @param {LogHandler} logHandler Handles log messages generated by this API.
   */
  setLogHandler(logHandler) {
    this._logger.setLogHandler(logHandler);
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @return {LogHandler} The currently set log handler.
   */
  getLogHandler() {
    return this._logger.getLogHandler();
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Manually set the the sizes to cut from an image before it's validated.
   *
   * @param {CutProvider} [cutProvider] the provider doing the cut.
   */
  setImageCut(cutProvider) {
    if (cutProvider) {
      this._cutProviderHandler = new ReadOnlyPropertyHandler(this._logger, cutProvider);
    } else {
      this._cutProviderHandler = new SimplePropertyHandler(new NullCutProvider());
    }
  }

  /**
   * @return {boolean}
   */
  getIsCutProviderExplicitlySet() {
    return this._cutProviderHandler && !(this._cutProviderHandler.get() instanceof NullCutProvider);
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Manually set the scale ratio for the images being validated.
   *
   * @param {number} [scaleRatio=1] The scale ratio to use, or {@code null} to reset back to automatic scaling.
   */
  setScaleRatio(scaleRatio) {
    if (scaleRatio) {
      this._scaleProviderHandler = new ReadOnlyPropertyHandler(this._logger, new FixedScaleProvider(scaleRatio));
    } else {
      this._scaleProviderHandler = new SimplePropertyHandler(new NullScaleProvider());
    }
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @return {number} The ratio used to scale the images being validated.
   */
  getScaleRatio() {
    return this._scaleProviderHandler.get().getScaleRatio();
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Adds a property to be sent to the server.
   *
   * @param {string} name The property name.
   * @param {string} value The property value.
   */
  addProperty(name, value) {
    const pd = new PropertyData(name, value);
    return this._properties.push(pd);
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Clears the list of custom properties.
   */
  clearProperties() {
    this._properties.length = 0;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @param {boolean} value If true, createSession request will return renderingInfo properties
   */
  setRender(value) {
    this._render = value;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @return {boolean}
   */
  getRender() {
    return this._render;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Automatically save differences as a baseline.
   *
   * @param {boolean} saveDiffs Sets whether to automatically save differences as baseline.
   */
  setSaveDiffs(saveDiffs) {
    this._saveDiffs = saveDiffs;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @return {boolean} whether to automatically save differences as baseline.
   */
  getSaveDiffs() {
    return this._saveDiffs;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @param {boolean} saveDebugScreenshots If true, will save all screenshots to local directory.
   */
  setSaveDebugScreenshots(saveDebugScreenshots) {
    const prev = this._debugScreenshotsProvider;
    if (saveDebugScreenshots) {
      this._debugScreenshotsProvider = new FileDebugScreenshotsProvider();
    } else {
      this._debugScreenshotsProvider = new NullDebugScreenshotProvider();
    }
    this._debugScreenshotsProvider.setPrefix(prev.getPrefix());
    this._debugScreenshotsProvider.setPath(prev.getPath());
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @return {boolean}
   */
  getSaveDebugScreenshots() {
    return !(this._debugScreenshotsProvider instanceof NullDebugScreenshotProvider);
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @param {string} pathToSave Path where you want to save the debug screenshots.
   */
  setDebugScreenshotsPath(pathToSave) {
    this._debugScreenshotsProvider.setPath(pathToSave);
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @return {string} The path where you want to save the debug screenshots.
   */
  getDebugScreenshotsPath() {
    return this._debugScreenshotsProvider.getPath();
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @param {string} prefix The prefix for the screenshots' names.
   */
  setDebugScreenshotsPrefix(prefix) {
    this._debugScreenshotsProvider.setPrefix(prefix);
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @return {string} The prefix for the screenshots' names.
   */
  getDebugScreenshotsPrefix() {
    return this._debugScreenshotsProvider.getPrefix();
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @param {DebugScreenshotsProvider} debugScreenshotsProvider
   */
  setDebugScreenshotsProvider(debugScreenshotsProvider) {
    this._debugScreenshotsProvider = debugScreenshotsProvider;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @return {DebugScreenshotsProvider}
   */
  getDebugScreenshotsProvider() {
    return this._debugScreenshotsProvider;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Sets the ignore blinking caret value.
   *
   * @param {boolean} value The ignore value.
   */
  setIgnoreCaret(value) {
    this._defaultMatchSettings.setIgnoreCaret(value);
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @return {boolean} Whether to ignore or the blinking caret or not when comparing images.
   */
  getIgnoreCaret() {
    const ignoreCaret = this._defaultMatchSettings.getIgnoreCaret();
    return ignoreCaret || true;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @param {boolean} compareWithParentBranch New compareWithParentBranch value, default is false
   */
  setCompareWithParentBranch(compareWithParentBranch) {
    this._compareWithParentBranch = compareWithParentBranch;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @return {boolean} The currently compareWithParentBranch value
   */
  isCompareWithParentBranch() {
    return this._compareWithParentBranch;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @param {boolean} ignoreBaseline New ignoreBaseline value, default is false
   */
  setIgnoreBaseline(ignoreBaseline) {
    this._ignoreBaseline = ignoreBaseline;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @return {boolean} The currently ignoreBaseline value
   */
  isIgnoreBaseline() {
    return this._ignoreBaseline;
  }

  /**
   * Ends the currently running test.
   *
   * @param {boolean} [throwEx=true] If true, then the returned promise will 'reject' for failed/aborted tests.
   * @return {Promise<TestResults>} A promise which resolves/rejects (depending on the value of 'throwEx') to the test
   *   results.
   */
  async close(throwEx = true) {
    try {
      if (this._isDisabled) {
        this._logger.verbose('Eyes close ignored. (disabled)');
        return null;
      }

      this._logger.verbose(`"EyesBase.close(${throwEx})`);
      ArgumentGuard.isValidState(this._isOpen, 'Eyes not open');

      this._isOpen = false;

      this._lastScreenshot = null;
      this.clearUserInputs();

      this._initProviders(true);

      // If a session wasn't started, use empty results.
      if (!this._runningSession) {
        this._logger.verbose('Server session was not started');
        this._logger.log('--- Empty test ended.');
        return new TestResults();
      }

      const isNewSession = this._runningSession.getIsNewSession();
      const sessionResultsUrl = this._runningSession.getUrl();

      this._logger.verbose('Ending server session...');
      // noinspection OverlyComplexBooleanExpressionJS
      const save = (isNewSession && this._saveNewTests) || (!isNewSession && this._saveFailedTests);
      this._logger.verbose(`Automatically save test? ${save}`);

      // Session was started, call the server to end the session.
      const results = await this._serverConnector.stopSession(this._runningSession, false, save);
      results.setIsNew(isNewSession);
      results.setIsSaved(save);
      results.setUrl(sessionResultsUrl);

      // for backwards compatibility with outdated servers
      if (!results.getStatus()) {
        if (results.getMissing() === 0 && results.getMismatches() === 0) {
          results.setStatus(TestResultsStatus.Passed);
        } else {
          results.setStatus(TestResultsStatus.Unresolved);
        }
      }

      this._logger.verbose(`Results: ${results}`);

      const status = results.getStatus();
      await this._sessionEventHandlers.testEnded(await this.getAUTSessionId(), results);

      if (status === TestResultsStatus.Unresolved) {
        if (results.getIsNew()) {
          this._logger.log(`--- New test ended. Please approve the new baseline at ${sessionResultsUrl}`);
          if (throwEx) {
            // noinspection ExceptionCaughtLocallyJS
            throw new NewTestError(results, this._sessionStartInfo);
          }
        } else {
          this._logger.log(`--- Failed test ended. See details at ${sessionResultsUrl}`);
          if (throwEx) {
            // noinspection ExceptionCaughtLocallyJS
            throw new DiffsFoundError(results, this._sessionStartInfo);
          }
        }
      } else if (status === TestResultsStatus.Failed) {
        this._logger.log(`--- Failed test ended. See details at ${sessionResultsUrl}`);
        if (throwEx) {
          // noinspection ExceptionCaughtLocallyJS
          throw new TestFailedError(results, this._sessionStartInfo);
        }
      } else {
        this._logger.log(`--- Test passed. See details at ${sessionResultsUrl}`);
      }

      return results;
    } catch (err) {
      this._logger.log(`Failed to abort server session: ${err.message}`);
      throw err;
    } finally {
      // Making sure that we reset the running session even if an exception was thrown during close.
      this._matchWindowTask = undefined;
      this._autSessionId = undefined;
      this._runningSession = undefined;
      this._currentAppName = undefined;
      this._logger.getLogHandler().close();
    }
  }

  /**
   * If a test is running, aborts it. Otherwise, does nothing.
   *
   * @return {Promise<void>} A promise which resolves to the test results.
   */
  async abortIfNotClosed() {
    try {
      if (this._isDisabled) {
        this._logger.verbose('Eyes abortIfNotClosed ignored. (disabled)');
        return;
      }

      this._isOpen = false;

      this._lastScreenshot = null;
      this.clearUserInputs();

      if (!this._runningSession) {
        this._logger.verbose('Closed');
        return;
      }

      this._logger.verbose('Aborting server session...');
      try {
        // When aborting we do not save the test.
        await this._serverConnector.stopSession(this._runningSession, true, false);
        this._logger.log('--- Test aborted.');
      } catch (err) {
        this._logger.log(`Failed to abort server session: ${err}`);
      }
    } finally {
      this._runningSession = null;
      this._logger.getLogHandler().close();
    }
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Sets the host OS name - overrides the one in the agent string.
   *
   * @param {string} hostOS The host OS running the AUT.
   */
  setHostOS(hostOS) {
    this._logger.log(`Host OS: ${hostOS}`);

    if (hostOS) {
      this._hostOS = hostOS.trim();
    } else {
      this._hostOS = undefined;
    }
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @return {string} The host OS as set by the user.
   */
  getHostOS() {
    return this._hostOS;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Sets the host application - overrides the one in the agent string.
   *
   * @param {string} hostApp The application running the AUT (e.g., Chrome).
   */
  setHostApp(hostApp) {
    this._logger.log(`Host App: ${hostApp}`);

    if (hostApp) {
      this._hostApp = hostApp.trim();
    } else {
      this._hostApp = undefined;
    }
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @return {string} The application name running the AUT.
   */
  getHostApp() {
    return this._hostApp;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @deprecated Only available for backward compatibility. See {@link #setBaselineEnvName(string)}.
   * @param baselineName {string} If specified, determines the baseline to compare with and disables automatic baseline
   *   inference.
   */
  setBaselineName(baselineName) {
    this._logger.log(`Baseline name: ${baselineName}`);

    if (baselineName) {
      this._baselineEnvName = baselineName.trim();
    } else {
      this._baselineEnvName = undefined;
    }
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @deprecated Only available for backward compatibility. See {@link #getBaselineEnvName()}.
   * @return {string} The baseline name, if it was specified.
   */
  getBaselineName() {
    return this._baselineEnvName;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * If not {@code null}, determines the name of the environment of the baseline.
   *
   * @param baselineEnvName {string} The name of the baseline's environment.
   */
  setBaselineEnvName(baselineEnvName) {
    this._logger.log(`Baseline environment name: ${baselineEnvName}`);

    if (baselineEnvName) {
      this._baselineEnvName = baselineEnvName.trim();
    } else {
      this._baselineEnvName = undefined;
    }
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * If not {@code null}, determines the name of the environment of the baseline.
   *
   * @return {string} The name of the baseline's environment, or {@code null} if no such name was set.
   */
  getBaselineEnvName() {
    return this._baselineEnvName;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * If not {@code null} specifies a name for the environment in which the application under test is running.
   *
   * @param envName {string} The name of the environment of the baseline.
   */
  setEnvName(envName) {
    this._logger.log(`Environment name: ${envName}`);

    if (envName) {
      this._environmentName = envName.trim();
    } else {
      this._environmentName = undefined;
    }
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * If not {@code null} specifies a name for the environment in which the application under test is running.
   *
   * @return {string} The name of the environment of the baseline, or {@code null} if no such name was set.
   */
  getEnvName() {
    return this._environmentName;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @return {PositionProvider} The currently set position provider.
   */
  getPositionProvider() {
    return this._positionProviderHandler.get();
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @param {PositionProvider} positionProvider The position provider to be used.
   */
  setPositionProvider(positionProvider) {
    if (positionProvider) {
      this._positionProviderHandler = new ReadOnlyPropertyHandler(this._logger, positionProvider);
    } else {
      this._positionProviderHandler = new SimplePropertyHandler(new InvalidPositionProvider());
    }
  }

  /**
   * Takes a snapshot of the application under test and matches it with the expected output.
   *
   * @protected
   * @param {RegionProvider} regionProvider Returns the region to check or empty region to check the entire window.
   * @param {string} [tag=''] An optional tag to be associated with the snapshot.
   * @param {boolean} [ignoreMismatch=false] Whether to ignore this check if a mismatch is found.
   * @param {CheckSettings} [checkSettings]  The settings to use.
   * @return {Promise<MatchResult>} The result of matching the output with the expected output.
   * @throws DiffsFoundError Thrown if a mismatch is detected and immediate failure reports are enabled.
   */
  async checkWindowBase(regionProvider, tag = '', ignoreMismatch = false, checkSettings = new CheckSettings(USE_DEFAULT_TIMEOUT)) {
    if (this._isDisabled) {
      this._logger.verbose('Ignored');
      const result = new MatchResult();
      result.setAsExpected(true);
      return Promise.resolve(result);
    }

    ArgumentGuard.isValidState(this._isOpen, 'Eyes not open');
    ArgumentGuard.notNull(regionProvider, 'regionProvider');

    this._validationId += 1;
    const validationInfo = new ValidationInfo();
    validationInfo.setValidationId(this._validationId);
    validationInfo.setTag(tag);

    // default result
    const validationResult = new ValidationResult();

    await this.beforeMatchWindow();
    await this._sessionEventHandlers.validationWillStart(this._autSessionId, validationInfo);
    const matchResult = await EyesBase.matchWindow(regionProvider, tag, ignoreMismatch, checkSettings, this);
    await this.afterMatchWindow();

    this._logger.verbose('MatchWindow Done!');
    validationResult.setAsExpected(matchResult.getAsExpected());

    if (!ignoreMismatch) {
      this.clearUserInputs();
    }

    this._validateResult(tag, matchResult);
    this._logger.verbose('Done!');
    await this._sessionEventHandlers.validationEnded(this._autSessionId, validationInfo.getValidationId(), validationResult);

    return matchResult;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Takes a snapshot of the application under test and matches it with the expected output.
   *
   * @protected
   * @param {RegionProvider} regionProvider Returns the region to check or empty rectangle to check the entire window.
   * @param {string} [tag=''] An optional tag to be associated with the snapshot.
   * @param {boolean} [ignoreMismatch=false] Whether to ignore this check if a mismatch is found.
   * @param {CheckSettings} [checkSettings]  The settings to use.
   * @return {Promise<TestResults>} The result of matching the output with the expected output.
   * @throws DiffsFoundError Thrown if a mismatch is detected and immediate failure reports are enabled.
   */
  async checkSingleWindowBase(regionProvider, tag = '', ignoreMismatch = false, checkSettings = new CheckSettings(USE_DEFAULT_TIMEOUT)) {
    if (this._isDisabled) {
      this._logger.verbose('checkSingleWindowBase Ignored');
      const result = new TestResults();
      result.setStatus(TestResultsStatus.Passed);
      return result;
    }

    ArgumentGuard.isValidState(this._isOpen, 'Eyes not open');
    ArgumentGuard.notNull(regionProvider, 'regionProvider');

    await this._ensureViewportSize();

    const appEnvironment = await this.getAppEnvironment();
    this._sessionStartInfo = new SessionStartInfo(
      this.getBaseAgentId(),
      this._sessionType,
      this.getAppName(),
      undefined,
      this._testName,
      this.getBatch(),
      this._baselineEnvName,
      this._environmentName,
      appEnvironment,
      this._defaultMatchSettings,
      this._branchName || process.env.APPLITOOLS_BRANCH,
      this._parentBranchName || process.env.APPLITOOLS_PARENT_BRANCH,
      this._baselineBranchName || process.env.APPLITOOLS_BASELINE_BRANCH,
      this._compareWithParentBranch,
      this._ignoreBaseline,
      this._render,
      this._saveDiffs,
      this._properties
    );

    // noinspection JSClosureCompilerSyntax
    const outputProvider = new AppOutputProvider();
    // A callback which will call getAppOutput
    // noinspection AnonymousFunctionJS
    outputProvider.getAppOutput = (region, lastScreenshot) =>
      this._getAppOutputWithScreenshot(region, lastScreenshot);

    this._matchWindowTask = new MatchSingleWindowTask(
      this._logger,
      this._serverConnector,
      this._matchTimeout,
      this,
      outputProvider,
      this._sessionStartInfo,
      this._saveNewTests
    );

    await this.beforeMatchWindow();
    const testResult = await EyesBase.matchWindow(regionProvider, tag, ignoreMismatch, checkSettings, this, true);
    await this.afterMatchWindow();

    this._logger.verbose('MatchSingleWindow Done!');

    if (!ignoreMismatch) {
      this.clearUserInputs();
    }

    const matchResult = new MatchResult();
    matchResult.setAsExpected(!testResult.getIsDifferent());
    this._validateResult(tag, matchResult);

    this._logger.verbose('Done!');
    // noinspection JSValidateTypes
    return testResult;
  }

  // noinspection JSMethodCanBeStatic
  /**
   * @protected
   * @return {Promise<void>}
   */
  beforeMatchWindow() {
    return Promise.resolve();
  }

  // noinspection JSMethodCanBeStatic
  /**
   * @protected
   * @return {Promise<void>}
   */
  afterMatchWindow() {
    return Promise.resolve();
  }

  /**
   * Replaces an actual image in the current running session.
   *
   * @param {number} stepIndex The zero based index of the step in which to replace the actual image.
   * @param {Buffer} screenshot The PNG bytes of the updated screenshot.
   * @param {string} [tag] The updated tag for the step.
   * @param {string} [title] The updated title for the step.
   * @param {Trigger[]} [userInputs] The updated userInputs for the step.
   * @return {Promise<MatchResult>} A promise which resolves when replacing is done, or rejects on error.
   */
  async replaceWindow(stepIndex, screenshot, tag = '', title = '', userInputs = []) {
    this._logger.verbose('EyesBase.replaceWindow - running');

    if (this._isDisabled) {
      this._logger.verbose('Ignored');
      const result = new MatchResult();
      result.setAsExpected(true);
      return result;
    }

    ArgumentGuard.isValidState(this._isOpen, 'Eyes not open');

    this._logger.verbose('EyesBase.replaceWindow - calling serverConnector.replaceWindow');

    const replaceWindowData = new MatchWindowData(userInputs, new AppOutput(title, screenshot), tag, null, null);

    const result = await this._serverConnector.replaceWindow(this._runningSession, stepIndex, replaceWindowData);
    this._logger.verbose('EyesBase.replaceWindow done');
    return result;
  }

  /**
   * @private
   * @param {RegionProvider} regionProvider
   * @param {string} tag
   * @param {boolean} ignoreMismatch
   * @param {CheckSettings} checkSettings
   * @param {EyesBase} self
   * @param {boolean} [skipStartingSession=false]
   * @return {Promise<MatchResult>}
   */
  static async matchWindow(regionProvider, tag, ignoreMismatch, checkSettings, self, skipStartingSession = false) {
    let retryTimeout = -1;
    const defaultMatchSettings = self.getDefaultMatchSettings();

    let imageMatchSettings;
    if (checkSettings) {
      retryTimeout = checkSettings.getTimeout();

      const matchLevel = checkSettings.getMatchLevel() || defaultMatchSettings.getMatchLevel();
      imageMatchSettings = new ImageMatchSettings(matchLevel, null);

      const ignoreCaret = checkSettings.getIgnoreCaret() || defaultMatchSettings.getIgnoreCaret();
      imageMatchSettings.setIgnoreCaret(ignoreCaret);
    }

    // noinspection JSUnresolvedVariable
    self._logger.verbose(`CheckWindowBase(${regionProvider.constructor.name}, '${tag}', ${ignoreMismatch}, ${retryTimeout})`);

    if (!skipStartingSession) {
      await self._ensureRunningSession();
    }

    const region = await regionProvider.getRegion();
    self._logger.verbose('Calling match window...');

    return self._matchWindowTask.matchWindow(
      self.getUserInputs(), region, tag, self._shouldMatchWindowRunOnceOnTimeout,
      ignoreMismatch, checkSettings, imageMatchSettings, retryTimeout
    );
  }

  /**
   * @private
   * @param {string} tag
   * @param {MatchResult} result
   */
  _validateResult(tag, result) {
    if (result.getAsExpected()) {
      return;
    }

    this._shouldMatchWindowRunOnceOnTimeout = true;

    if (this._runningSession && !this._runningSession.getIsNewSession()) {
      this._logger.log(`Mismatch! (${tag})`);
    }

    if (this.getFailureReports() === FailureReports.IMMEDIATE) {
      throw new TestFailedError(null, `Mismatch found in '${this._sessionStartInfo.getScenarioIdOrName()}' of '${this._sessionStartInfo.getAppIdOrName()}'`);
    }
  }

  /**
   * Starts a test.
   *
   * @protected
   * @param {string} appName The name of the application under test.
   * @param {string} testName The test name.
   * @param {RectangleSize|{width: number, height: number}} [viewportSize] The client's viewport size (i.e., the
   *   visible part of the document's body) or {@code null} to allow any viewport size.
   * @param {SessionType} [sessionType=SessionType.SEQUENTIAL]  The type of test (e.g., Progression for timing tests),
   *   or {@code null} to use the default.
   * @return {Promise<void>}
   */
  async openBase(appName, testName, viewportSize, sessionType = SessionType.SEQUENTIAL) {
    this._logger.getLogHandler().open();

    if (viewportSize) {
      viewportSize = new RectangleSize(viewportSize);
    }

    try {
      if (this._isDisabled) {
        this._logger.verbose('Eyes Open ignored - disabled');
        return;
      }

      // If there's no default application name, one must be provided for the current test.
      if (!this._appName) {
        ArgumentGuard.notNull(appName, 'appName');
      }
      ArgumentGuard.notNull(testName, 'testName');

      this._logger.verbose(`Agent = ${this.getFullAgentId()}`);
      this._logger.verbose(`openBase('${appName}', '${testName}', '${viewportSize}')`);

      await this._sessionEventHandlers.testStarted(await this.getAUTSessionId());

      this._validateApiKey();
      this._logOpenBase();
      await this._validateSessionOpen();

      this._initProviders();
      this._isViewportSizeSet = false;
      await this.beforeOpen();

      this._currentAppName = appName || this._appName;
      this._testName = testName;
      this._viewportSizeHandler.set(viewportSize);
      this._sessionType = sessionType;
      this._validationId = -1;

      if (viewportSize) {
        await this._ensureRunningSession();
      }

      this._autSessionId = await this.getAUTSessionId();
      this._isOpen = true;
      await this.afterOpen();
    } catch (err) {
      this._logger.log(err.message);
      this._logger.getLogHandler().close();
      throw err;
    }
  }

  // noinspection JSMethodCanBeStatic
  /**
   * @protected
   * @return {Promise<void>}
   */
  beforeOpen() {
    return Promise.resolve();
  }

  // noinspection JSMethodCanBeStatic
  /**
   * @protected
   * @return {Promise<void>}
   */
  afterOpen() {
    return Promise.resolve();
  }

  /**
   * @private
   * @return {Promise<void>}
   */
  async _ensureRunningSession() {
    if (this._runningSession) {
      return;
    }

    this._logger.verbose('No running session, calling start session...');
    await this.startSession();
    this._logger.verbose('Done!');

    // noinspection JSClosureCompilerSyntax
    const outputProvider = new AppOutputProvider();
    // A callback which will call getAppOutput
    outputProvider.getAppOutput = (region, lastScreenshot) =>
      this._getAppOutputWithScreenshot(region, lastScreenshot);

    this._matchWindowTask = new MatchWindowTask(
      this._logger,
      this._serverConnector,
      this._runningSession,
      this._matchTimeout,
      this,
      outputProvider
    );
  }

  /**
   * @private
   */
  _validateApiKey() {
    if (!this.getApiKey()) {
      const errMsg = 'API key is missing! Please set it using setApiKey()';
      this._logger.log(errMsg);
      throw new Error(errMsg);
    }
  }

  /**
   * @private
   */
  _logOpenBase() {
    this._logger.verbose(`Eyes server URL is '${this._serverConnector.getServerUrl()}'`);
    this._logger.verbose(`Timeout = '${this._serverConnector.getTimeout()}'`);
    this._logger.verbose(`matchTimeout = '${this._matchTimeout}'`);
    this._logger.verbose(`Default match settings = '${this._defaultMatchSettings}'`);
    this._logger.verbose(`FailureReports = '${this._failureReports}'`);
  }

  /**
   * @private
   * @return {Promise<void>}
   */
  async _validateSessionOpen() {
    if (this._isOpen) {
      await this.abortIfNotClosed();
      const errMsg = 'A test is already running';
      this._logger.log(errMsg);
      throw new Error(errMsg);
    }
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Define the viewport size as {@code size} without doing any actual action on the
   *
   * @param {RectangleSize} explicitViewportSize The size of the viewport. {@code null} disables the explicit size.
   */
  setExplicitViewportSize(explicitViewportSize) {
    if (!explicitViewportSize) {
      this._viewportSizeHandler = new SimplePropertyHandler();
      this._viewportSizeHandler.set(null);
      this._isViewportSizeSet = false;
      return;
    }

    this._logger.verbose(`Viewport size explicitly set to ${explicitViewportSize}`);
    this._viewportSizeHandler = new ReadOnlyPropertyHandler(this._logger, new RectangleSize(explicitViewportSize));
    this._isViewportSizeSet = true;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Adds a trigger to the current list of user inputs.
   *
   * @protected
   * @param {Trigger} trigger The trigger to add to the user inputs list.
   */
  addUserInput(trigger) {
    if (this._isDisabled) {
      return;
    }

    ArgumentGuard.notNull(trigger, 'trigger');
    this._userInputs.push(trigger);
  }

  /**
   * Adds a text trigger.
   *
   * @protected
   * @param {Region} control The control's position relative to the window.
   * @param {string} text The trigger's text.
   */
  addTextTriggerBase(control, text) {
    if (this._isDisabled) {
      this._logger.verbose(`Ignoring '${text}' (disabled)`);
      return;
    }

    ArgumentGuard.notNull(control, 'control');
    ArgumentGuard.notNull(text, 'text');

    // We don't want to change the objects we received.
    let newControl = new Region(control);

    if (!this._matchWindowTask || !this._matchWindowTask.getLastScreenshot()) {
      this._logger.verbose(`Ignoring '${text}' (no screenshot)`);
      return;
    }

    newControl = this._matchWindowTask
      .getLastScreenshot()
      .getIntersectedRegion(newControl, CoordinatesType.SCREENSHOT_AS_IS);
    if (newControl.isSizeEmpty()) {
      this._logger.verbose(`Ignoring '${text}' (out of bounds)`);
      return;
    }

    const trigger = new TextTrigger(newControl, text);
    this._userInputs.push(trigger);

    this._logger.verbose(`Added ${trigger}`);
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Adds a mouse trigger.
   *
   * @protected
   * @param {MouseTrigger.MouseAction} action  Mouse action.
   * @param {Region} control The control on which the trigger is activated (location is relative to the window).
   * @param {Location} cursor The cursor's position relative to the control.
   */
  addMouseTriggerBase(action, control, cursor) {
    if (this._isDisabled) {
      this._logger.verbose(`Ignoring ${action} (disabled)`);
      return;
    }

    ArgumentGuard.notNull(action, 'action');
    ArgumentGuard.notNull(control, 'control');
    ArgumentGuard.notNull(cursor, 'cursor');

    // Triggers are actually performed on the previous window.
    if (!this._matchWindowTask || !this._matchWindowTask.getLastScreenshot()) {
      this._logger.verbose(`Ignoring ${action} (no screenshot)`);
      return;
    }

    // Getting the location of the cursor in the screenshot
    let cursorInScreenshot = new Location(cursor);
    // First we need to getting the cursor's coordinates relative to the context (and not to the control).
    cursorInScreenshot.offsetByLocation(control.getLocation());
    try {
      cursorInScreenshot = this._matchWindowTask
        .getLastScreenshot()
        .getLocationInScreenshot(cursorInScreenshot, CoordinatesType.CONTEXT_RELATIVE);
    } catch (err) {
      if (err instanceof OutOfBoundsError) {
        this._logger.verbose(`"Ignoring ${action} (out of bounds)`);
        return;
      }

      throw err;
    }

    const controlScreenshotIntersect = this._matchWindowTask
      .getLastScreenshot()
      .getIntersectedRegion(control, CoordinatesType.SCREENSHOT_AS_IS);

    // If the region is NOT empty, we'll give the coordinates relative to the control.
    if (!controlScreenshotIntersect.isSizeEmpty()) {
      const l = controlScreenshotIntersect.getLocation();
      cursorInScreenshot.offset(-l.getX(), -l.getY());
    }

    const trigger = new MouseTrigger(action, controlScreenshotIntersect, cursorInScreenshot);
    this._userInputs.push(trigger);
  }

  /**
   * Application environment is the environment (e.g., the host OS) which runs the application under test.
   *
   * @protected
   * @return {Promise<AppEnvironment>} The current application environment.
   */
  async getAppEnvironment() {
    const appEnv = new AppEnvironment();

    // If hostOS isn't set, we'll try and extract and OS ourselves.
    if (this._hostOS) {
      appEnv.setOs(this._hostOS);
    }

    if (this._hostApp) {
      appEnv.setHostingApp(this._hostApp);
    }

    const inferred = await this.getInferredEnvironment();
    appEnv.setInferred(inferred);
    appEnv.setDisplaySize(this._viewportSizeHandler.get());
    return appEnv;
  }

  /**
   * Start eyes session on the eyes server.
   *
   * @protected
   * @return {Promise<void>}
   */
  async startSession() {
    this._logger.verbose('startSession()');

    if (this._runningSession) {
      return;
    }

    this._logger.verbose(`Batch is ${this._batch}`);
    this._autSessionId = await this.getAUTSessionId();

    try {
      await this._ensureViewportSize();
    } catch (err) {
      // Throw to skip execution of all consecutive "then" blocks.
      throw new EyesError('Failed to set/get viewport size', err);
    }

    await this._sessionEventHandlers.initStarted();
    const appEnvironment = await this.getAppEnvironment();
    this._logger.verbose(`Application environment is ${appEnvironment}`);
    await this._sessionEventHandlers.initEnded();

    this._sessionStartInfo = new SessionStartInfo(
      this.getBaseAgentId(),
      this._sessionType,
      this.getAppName(),
      undefined,
      this._testName,
      this.getBatch(),
      this._baselineEnvName,
      this._environmentName,
      appEnvironment,
      this._defaultMatchSettings,
      this._branchName || process.env.APPLITOOLS_BRANCH,
      this._parentBranchName || process.env.APPLITOOLS_PARENT_BRANCH,
      this._baselineBranchName || process.env.APPLITOOLS_BASELINE_BRANCH,
      this._compareWithParentBranch,
      this._ignoreBaseline,
      this._render,
      this._saveDiffs,
      this._properties
    );

    this._logger.verbose('Starting server session...');
    this._runningSession = await this._serverConnector.startSession(this._sessionStartInfo);
    this._logger.verbose(`Server session ID is ${this._runningSession.getId()}`);
    this._logger.getLogHandler().setSessionId(this._runningSession.getSessionId());

    if (this._runningSession.getRenderingInfo()) {
      this._serverConnector.setRenderingAuthToken(this._runningSession.getRenderingInfo().getAccessToken());
      this._serverConnector.setRenderingServerUrl(this._runningSession.getRenderingInfo().getServiceUrl());
    }

    const testInfo = `'${this._testName}' of '${this.getAppName()}' "${appEnvironment}`;
    if (this._runningSession.getIsNewSession()) {
      this._logger.log(`--- New test started - ${testInfo}`);
      this._shouldMatchWindowRunOnceOnTimeout = true;
    } else {
      this._logger.log(`--- Test started - ${testInfo}`);
      this._shouldMatchWindowRunOnceOnTimeout = false;
    }
  }

  /**
   * @private
   * @return {Promise<void>}
   */
  async _ensureViewportSize() {
    if (!this._isViewportSizeSet) {
      try {
        if (this._viewportSizeHandler.get()) {
          const targetSize = this._viewportSizeHandler.get();
          await this._sessionEventHandlers.setSizeWillStart(targetSize);
          await this.setViewportSize(targetSize);

          // If it's read-only, no point in making the getViewportSize() call..
        } else if (!(this._viewportSizeHandler instanceof ReadOnlyPropertyHandler)) {
          const targetSize = await this.getViewportSize();
          await this._sessionEventHandlers.setSizeWillStart(targetSize);
          this._viewportSizeHandler.set(targetSize);
        }

        this._isViewportSizeSet = true;
        await this._sessionEventHandlers.setSizeEnded();
      } catch (ignored) {
        this._isViewportSizeSet = false;
      }
    }
  }

  /**
   * @private
   * @param {Region} region The region of the screenshot which will be set in the application output.
   * @param {EyesScreenshot} lastScreenshot Previous application screenshot (used for compression) or {@code null} if
   *   not available.
   * @return {Promise<AppOutputWithScreenshot>} The updated app output and screenshot.
   */
  async _getAppOutputWithScreenshot(region, lastScreenshot) {
    this._logger.verbose('getting screenshot...');
    let screenshot, screenshotUrl, screenshotBuffer;

    // Getting the screenshot (abstract function implemented by each SDK).
    screenshot = await this.getScreenshot();
    this._logger.verbose('Done getting screenshot!');

    if (screenshot) {
      // Cropping by region if necessary
      if (!region.isSizeEmpty()) {
        screenshot = await screenshot.getSubScreenshot(region, false);
        await this._debugScreenshotsProvider.save(screenshot.getImage(), 'SUB_SCREENSHOT');
      }

      const targetBuffer = await screenshot.getImage().getImageBuffer();
      screenshotBuffer = targetBuffer;

      if (this._useImageDeltaCompression && lastScreenshot) {
        try {
          this._logger.verbose('Compressing screenshot...');
          const sourceData = await lastScreenshot.getImage().getImageData();
          const targetData = await screenshot.getImage().getImageData();

          screenshotBuffer = ImageDeltaCompressor.compressByRawBlocks(targetData, targetBuffer, sourceData);
          const savedSize = targetBuffer.length - screenshotBuffer.length;
          if (savedSize === 0) {
            this._logger.verbose('Compression skipped, because of significant difference.');
          } else {
            this._logger.verbose(`Compression finished, saved size is ${savedSize}.`);
          }
        } catch (err) {
          this._logger.log('Failed to compress screenshot!', err);
        }
      }
    } else {
      this._logger.verbose('getting screenshot url...');
      screenshotUrl = await this.getScreenshotUrl();
      this._logger.verbose('Done getting screenshotUrl!');
    }

    this._logger.verbose('Getting title, domUrl, imageLocation...');
    const title = await this.getTitle();
    const domUrl = await this.getDomUrl();
    const imageLocation = await this.getImageLocation();
    this._logger.verbose('Done getting title, domUrl, imageLocation!');

    const appOutput = new AppOutput(title, screenshotBuffer, screenshotUrl, domUrl, imageLocation);
    const result = new AppOutputWithScreenshot(appOutput, screenshot);
    this._logger.verbose('Done!');
    return result;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @return {SessionEventHandlers}
   */
  getSessionEventHandlers() {
    return this._sessionEventHandlers;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @param {SessionEventHandler} eventHandler
   */
  addSessionEventHandler(eventHandler) {
    this._sessionEventHandlers.addEventHandler(eventHandler);
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @param {SessionEventHandler} eventHandler
   */
  removeSessionEventHandler(eventHandler) {
    this._sessionEventHandlers.removeEventHandler(eventHandler);
  }

  // noinspection JSUnusedGlobalSymbols
  clearSessionEventHandlers() {
    this._sessionEventHandlers.clearEventHandlers();
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Whether sessions are removed immediately after they are finished.
   *
   * @param shouldRemove {boolean}
   */
  setRemoveSession(shouldRemove) {
    this._serverConnector.setRemoveSession(shouldRemove);
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @return {boolean} Whether sessions are removed immediately after they are finished.
   */
  getRemoveSession() {
    return this._serverConnector.getRemoveSession();
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @return {?string} The name of the currently running test.
   */
  getTestName() {
    return this._testName;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @return {RunningSession} An object containing data about the currently running session.
   */
  getRunningSession() {
    return this._runningSession;
  }

  // noinspection JSMethodCanBeStatic
  /**
   * @protected
   * @abstract
   * @return {string} The base agent id of the SDK.
   */
  getBaseAgentId() {
    throw new TypeError('getBaseAgentId method is not implemented!');
  }

  // noinspection JSMethodCanBeStatic
  /**
   * @protected
   * @abstract
   * Get the session id.
   * @return {Promise<string>} A promise which resolves to the webdriver's session ID.
   */
  getAUTSessionId() {
    throw new TypeError('getAUTSessionId method is not implemented!');
  }

  // noinspection JSMethodCanBeStatic
  /**
   * The viewport size of the AUT.
   *
   * @protected
   * @abstract
   * @return {Promise<RectangleSize>}
   */
  getViewportSize() {
    throw new TypeError('getViewportSize method is not implemented!');
  }

  // noinspection JSMethodCanBeStatic
  /**
   * @protected
   * @abstract
   * @param {RectangleSize} size The required viewport size.
   * @return {Promise<void>}
   */
  setViewportSize(size) {
    throw new TypeError('setViewportSize method is not implemented!');
  }

  // noinspection JSMethodCanBeStatic
  /**
   * The inferred string is in the format "source:info" where source is either "useragent" or "pos".
   * Information associated with a "useragent" source is a valid browser user agent string. Information associated with
   * a "pos" source is a string of the format "process-name;os-name" where "process-name" is the name of the main
   * module of the executed process and "os-name" is the OS name.
   *
   * @protected
   * @abstract
   * @return {Promise<string>} The inferred environment string or {@code null} if none is available.
   */
  getInferredEnvironment() {
    throw new TypeError('getInferredEnvironment method is not implemented!');
  }

  // noinspection JSMethodCanBeStatic
  /**
   * An updated screenshot.
   *
   * @protected
   * @abstract
   * @return {Promise<EyesScreenshot>}
   */
  getScreenshot() {
    throw new TypeError('getScreenshot method is not implemented!');
  }

  // noinspection JSMethodCanBeStatic
  /**
   * An updated screenshot.
   *
   * @protected
   * @abstract
   * @return {Promise<string>}
   */
  getScreenshotUrl() {
    throw new TypeError('getScreenshotUrl method is not implemented!');
  }

  // noinspection JSMethodCanBeStatic
  /**
   * The current title of of the AUT.
   *
   * @protected
   * @abstract
   * @return {Promise<string>}
   */
  getTitle() {
    throw new TypeError('getTitle method is not implemented!');
  }

  // noinspection JSMethodCanBeStatic
  /**
   * A url pointing to a DOM capture of the AUT at the time of screenshot
   *
   * @protected
   * @abstract
   * @return {Promise<string>}
   */
  getDomUrl() {
    return Promise.resolve(undefined);
  }

  // noinspection JSMethodCanBeStatic
  /**
   * The location of the image relative to the logical full page image, when cropping an image e.g. with checkRegion
   *
   * @protected
   * @abstract
   * @return {Promise<Location>}
   */
  getImageLocation() {
    return Promise.resolve(undefined);
  }

  /**
   * @param {string...} args
   */
  log(...args) {
    this._logger.log(...args);
  }
}

exports.EyesBase = EyesBase;
