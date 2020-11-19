'use strict'

const Logger = require('../logging/Logger')
const EyesError = require('../errors/EyesError')
const Region = require('../geometry/Region')
const Location = require('../geometry/Location')
const RectangleSize = require('../geometry/RectangleSize')
const CoordinatesType = require('../geometry/CoordinatesType')

const GeneralUtils = require('../utils/GeneralUtils')
const ArgumentGuard = require('../utils/ArgumentGuard')
const TypeUtils = require('../utils/TypeUtils')

const ImageDeltaCompressor = require('../images/ImageDeltaCompressor')
const SimplePropertyHandler = require('../handler/SimplePropertyHandler')
const ReadOnlyPropertyHandler = require('../handler/ReadOnlyPropertyHandler')
const FileDebugScreenshotsProvider = require('../debug/FileDebugScreenshotsProvider')
const NullDebugScreenshotProvider = require('../debug/NullDebugScreenshotProvider')
const SessionType = require('../config/SessionType')
const Configuration = require('../config/Configuration')

const AppOutputProvider = require('../capture/AppOutputProvider')
const AppOutputWithScreenshot = require('../capture/AppOutputWithScreenshot')
const AppOutput = require('../match/AppOutput')

const FixedScaleProvider = require('../scaling/FixedScaleProvider')
const NullScaleProvider = require('../scaling/NullScaleProvider')

const NullCutProvider = require('../cropping/NullCutProvider')

const InvalidPositionProvider = require('../positioning/InvalidPositionProvider')

const TextTrigger = require('../triggers/TextTrigger')
const MouseTrigger = require('../triggers/MouseTrigger')

const MatchResult = require('../match/MatchResult')
const MatchWindowData = require('../match/MatchWindowData')

const DiffsFoundError = require('../errors/DiffsFoundError')
const NewTestError = require('../errors/NewTestError')
const OutOfBoundsError = require('../errors/OutOfBoundsError')
const TestFailedError = require('../errors/TestFailedError')

const ValidationInfo = require('../events/ValidationInfo')
const ValidationResult = require('../events/ValidationResult')
const SessionEventHandlers = require('../events/SessionEventHandlers')

const CheckSettings = require('../fluent/CheckSettings')

const SessionStartInfo = require('../server/SessionStartInfo')
const TestResultsStatus = require('../TestResultsStatus')
const TestResults = require('../TestResults')
const ServerConnector = require('../server/ServerConnector')

const FailureReports = require('../FailureReports')
const AppEnvironment = require('../AppEnvironment')
const MatchWindowTask = require('../MatchWindowTask')
const MatchWindowAndCloseTask = require('../MatchWindowAndCloseTask')
const getScmInfo = require('../getScmInfo')

const USE_DEFAULT_TIMEOUT = -1

/**
 * Core/Base class for Eyes - to allow code reuse for different SDKs (images, selenium, etc).
 */
class EyesBase {
  /**
   * Creates a new {@code EyesBase}instance that interacts with the Eyes Server at the specified url.
   *
   * @param {?string} [serverUrl] - The Eyes server URL.
   * @param {?boolean} [isDisabled=false] - Will be checked <b>before</b> any argument validation. If true, all method
   *   will immediately return without performing any action.
   * @param {Configuration} [configuration]
   */
  constructor(serverUrl, isDisabled, configuration = new Configuration()) {
    /** @var {Logger} */
    this._logger = new Logger(configuration.getShowLogs())
    /** @var {Configuration} */
    this._configuration = configuration.cloneConfig()

    this._configuration.setServerUrl(serverUrl)
    this._configuration.setIsDisabled(isDisabled)

    /** @type {ServerConnector} */
    this._serverConnector = new ServerConnector({
      logger: this._logger,
      configuration: this._configuration,
      getAgentId: this.getFullAgentId.bind(this),
    })

    if (this._configuration.getIsDisabled()) {
      this._userInputs = []
      return
    }

    this._initProviders()

    /** @type {FailureReports} */
    this._failureReports = FailureReports.ON_CLOSE

    /** @type {number} */
    this._validationId = -1
    /** @type {SessionEventHandlers} */
    this._sessionEventHandlers = new SessionEventHandlers()

    /** @type {MatchWindowTask} */ this._matchWindowTask = undefined
    /** @type {RunningSession} */ this._runningSession = undefined
    /** @type {SessionStartInfo} */ this._sessionStartInfo = undefined

    /** @type {boolean} */ this._shouldMatchWindowRunOnceOnTimeout = undefined
    /** @type {boolean} */ this._isViewportSizeSet = undefined

    /** @type {boolean} */ this._isOpen = false
    /** @type {boolean} */ this._isVisualGrid = false

    /** @type {boolean} */ this._useImageDeltaCompression = true

    /**
     * Will be set for separately for each test.
     * @type {string}
     */
    this._currentAppName = undefined

    /**
     * The session ID of webdriver instance
     * @type {string}
     */
    this._autSessionId = undefined

    /**
     * @type {Trigger[]}
     */
    this._userInputs = []
  }

  /**
   * @return {Logger}
   */
  getLogger() {
    return this._logger
  }

  /**
   * Sets a handler of log messages generated by this API.
   *
   * @param {LogHandler} logHandler - Handles log messages generated by this API.
   */
  setLogHandler(logHandler) {
    this._logger.setLogHandler(logHandler)
  }

  /**
   * @return {LogHandler} - The currently set log handler.
   */
  getLogHandler() {
    return this._logger.getLogHandler()
  }

  /**
   * @param {...string} args
   */
  log(...args) {
    this._logger.log(...args)
  }

  /**
   * @return {Configuration}
   */
  getConfiguration() {
    return this._configuration.cloneConfig()
  }

  /**
   * @param {Configuration|object} configuration
   */
  setConfiguration(configuration) {
    if (
      !configuration ||
      !configuration.constructor ||
      configuration.constructor.name !== 'Configuration'
    ) {
      configuration = new Configuration(configuration)
    }

    this._configuration = configuration.cloneConfig()
    this._serverConnector._configuration = this._configuration
  }

  /**
   * Sets the user given agent id of the SDK.
   *
   * @param {string} agentId - The agent ID to set.
   */
  setAgentId(agentId) {
    this._configuration.setAgentId(agentId)
  }

  /**
   * @return {string} - The user given agent id of the SDK.
   */
  getAgentId() {
    return this._configuration.getAgentId()
  }

  /**
   * Sets the API key of your Applitools Eyes account.
   *
   * @param {string} apiKey - The api key to be used.
   */
  setApiKey(apiKey) {
    this._configuration.setApiKey(apiKey)
  }

  /**
   * @return {string} - The currently set API key or {@code null} if no key is set.
   */
  getApiKey() {
    return this._configuration.getApiKey()
  }

  /**
   * Sets the current server URL used by the rest client.
   *
   * @param {string} serverUrl - The URI of the rest server, or {@code null} to use the default server.
   */
  setServerUrl(serverUrl) {
    this._configuration.setServerUrl(serverUrl)
  }

  /**
   * @return {string} - The URI of the eyes server.
   */
  getServerUrl() {
    return this._configuration.getServerUrl()
  }

  /**
   * Sets the proxy settings to be used for all requests to Eyes server.
   * Alternatively, proxy can be set via global variables `HTTP_PROXY`, `HTTPS_PROXY`, `NO_PROXY`.
   *
   * @signature `setProxy(proxySettings)`
   * @sigparam {ProxySettings} proxySettings - The ProxySettings instance to use.
   *
   * @signature `setProxy(isEnabled)`
   * @sigparam {boolean} isEnabled - You can pass {@code false} to completely disable proxy.
   *
   * @signature `setProxy(url, username, password)`
   * @sigparam {string} url - The proxy url to be used.
   * @sigparam {string} [username] - The proxy username to be used.
   * @sigparam {string} [password] - The proxy password to be used.
   *
   * @param {?(ProxySettings|boolean|string)} varArg - The ProxySettings object or proxy url to be used.
   *  Use {@code false} to disable proxy (even if it set via env variables). Use {@code null} to reset proxy settings.
   * @param {string} [username] - The proxy username to be used.
   * @param {string} [password] - The proxy password to be used.
   */
  setProxy(varArg, username, password) {
    if (!username && !password) {
      this._configuration.setProxy(varArg)
    } else {
      this._configuration.setProxy({
        url: varArg,
        username,
        password,
      })
    }
  }

  /**
   * @return {ProxySettings} - current proxy settings used by the server connector, or {@code null} if no proxy is set.
   */
  getProxy() {
    return this._configuration.getProxy()
  }

  /**
   * @return {number} - The timeout for web requests (in milliseconds).
   */
  getConnectionTimeout() {
    return this._configuration.getConnectionTimeout()
  }

  /**
   * Sets the connect and read timeouts for web requests.
   *
   * @param {number} connectionTimeout - Connect/Read timeout in milliseconds. 0 equals infinity.
   */
  setConnectionTimeout(connectionTimeout) {
    this._configuration.setConnectionTimeout(connectionTimeout)
  }

  /**
   * Whether sessions are removed immediately after they are finished.
   *
   * @param {boolean} removeSession
   */
  setRemoveSession(removeSession) {
    this._configuration.setRemoveSession(removeSession)
  }

  /**
   * @return {boolean} - Whether sessions are removed immediately after they are finished.
   */
  getRemoveSession() {
    return this._configuration.getRemoveSession()
  }

  /**
   * @param {boolean} isDisabled - If true, all interactions with this API will be silently ignored.
   */
  setIsDisabled(isDisabled) {
    this._configuration.setIsDisabled(isDisabled)
  }

  /**
   * @return {boolean} - Whether eyes is disabled.
   */
  getIsDisabled() {
    return this._configuration.getIsDisabled()
  }

  /**
   * @return {string} - The host OS as set by the user.
   */
  getHostApp() {
    return this._configuration.getHostApp()
  }

  /**
   * Sets the host application - overrides the one in the agent string.
   *
   * @param {string} value - The application running the AUT (e.g., Chrome).
   */
  setHostApp(value) {
    this._logger.log(`Host App: ${value}`)
    this._configuration.setHostApp(value)
  }

  /**
   * @return {string} - The host OS as set by the user.
   */
  getHostOS() {
    return this._configuration.getHostOS()
  }

  /**
   * Sets the host OS name - overrides the one in the agent string.
   *
   * @param {string} value - The host OS running the AUT.
   */
  setHostOS(value) {
    this._logger.log(`Host OS: ${value}`)
    this._configuration.setHostOS(value)
  }

  /**
   * @return {string} - The host OS as set by the user.
   */
  getHostAppInfo() {
    return this._configuration.getHostAppInfo()
  }

  /**
   * Sets the host application - overrides the one in the agent string.
   *
   * @param {string} value - The application running the AUT (e.g., Chrome).
   */
  setHostAppInfo(value) {
    this._logger.log(`Host App Info: ${value}`)
    this._configuration.setHostAppInfo(value)
  }

  /**
   * @return {string} - The host OS as set by the user.
   */
  getHostOSInfo() {
    return this._configuration.getHostOSInfo()
  }

  /**
   * Sets the host OS name - overrides the one in the agent string.
   *
   * @param {string} value - The host OS running the AUT.
   */
  setHostOSInfo(value) {
    this._logger.log(`Host OS Info: ${value}`)
    this._configuration.setHostOSInfo(value)
  }

  /**
   * @return {string} - The application name running the AUT.
   */
  getDeviceInfo() {
    return this._configuration.getDeviceInfo()
  }

  /**
   * Sets the host application - overrides the one in the agent string.
   *
   * @param {string} value - The application running the AUT (e.g., Chrome).
   */
  setDeviceInfo(value) {
    this._logger.log(`Device Info: ${value}`)
    this._configuration.setDeviceInfo(value)
  }

  /**
   * @param {string} appName - The name of the application under test.
   */
  setAppName(appName) {
    this._configuration.setAppName(appName)
  }

  /**
   * @return {string} - The name of the application under test.
   */
  getAppName() {
    return this._configuration.getAppName()
  }

  /**
   * Sets the branch in which the baseline for subsequent test runs resides. If the branch does not already exist it
   * will be created under the specified parent branch (see {@link #setParentBranchName}). Changes to the baseline
   * or model of a branch do not propagate to other branches.
   *
   * @param {string} branchName - Branch name or {@code null} to specify the default branch.
   */
  setBranchName(branchName) {
    this._configuration.setBranchName(branchName)
  }

  /**
   * @return {string} - The current branch name.
   */
  getBranchName() {
    return this._configuration.getBranchName()
  }

  /**
   * Sets the branch under which new branches are created.
   *
   * @param {string} parentBranchName - Branch name or {@code null} to specify the default branch.
   */
  setParentBranchName(parentBranchName) {
    this._configuration.setParentBranchName(parentBranchName)
  }

  /**
   * @return {string} - The name of the current parent branch under which new branches will be created.
   */
  getParentBranchName() {
    return this._configuration.getParentBranchName()
  }

  /**
   * Sets the baseline branch under which new branches are created.
   *
   * @param {string} baselineBranchName - Branch name or {@code null} to specify the default branch.
   */
  setBaselineBranchName(baselineBranchName) {
    this._configuration.setBaselineBranchName(baselineBranchName)
  }

  /**
   * @return {string} - The name of the baseline branch
   */
  getBaselineBranchName() {
    return this._configuration.getBaselineBranchName()
  }

  /**
   * Sets the maximum time (in ms) a match operation tries to perform a match.
   * @param {number} ms - Total number of ms to wait for a match.
   */
  setMatchTimeout(ms) {
    if (this._configuration.getIsDisabled()) {
      this._logger.verbose('Ignored')
      return
    }

    this._configuration.setMatchTimeout(ms)
  }

  /**
   * @return {number} - The maximum time in ms {@link #checkWindowBase(RegionProvider, string, boolean, number)} waits
   *   for a match.
   */
  getMatchTimeout() {
    return this._configuration.getMatchTimeout()
  }

  /**
   * Set whether or not new tests are saved by default.
   *
   * @param {boolean} saveNewTests - True if new tests should be saved by default. False otherwise.
   */
  setSaveNewTests(saveNewTests) {
    this._configuration.setSaveNewTests(saveNewTests)
  }

  /**
   * @return {boolean} - True if new tests are saved by default.
   */
  getSaveNewTests() {
    return this._configuration.getSaveNewTests()
  }

  /**
   * Set whether or not failed tests are saved by default.
   *
   * @param {boolean} saveFailedTests - True if failed tests should be saved by default, false otherwise.
   */
  setSaveFailedTests(saveFailedTests) {
    this._configuration.setSaveFailedTests(saveFailedTests)
  }

  /**
   * @return {boolean} - True if failed tests are saved by default.
   */
  getSaveFailedTests() {
    return this._configuration.getSaveFailedTests()
  }

  /**
   * Sets the batch in which context future tests will run or {@code null} if tests are to run standalone.
   *
   * @param {BatchInfo|BatchInfoObject|string} batchOrName - The batch name or batch object
   * @param {string} [batchId] - ID of the batch, should be generated using GeneralUtils.guid()
   * @param {string} [startedAt] - Start date of the batch, can be created as new Date().toUTCString()
   */
  setBatch(batchOrName, batchId, startedAt) {
    if (this._configuration.getIsDisabled()) {
      this._logger.verbose('Ignored')
      return
    }

    if (arguments.length > 1) {
      this._configuration.setBatch({
        id: batchId,
        name: batchOrName,
        startedAt,
      })
    } else {
      this._configuration.setBatch(batchOrName)
    }

    this._logger.verbose(`setBatch(${this._configuration._batch})`)
  }

  /**
   * @return {BatchInfo} - The currently set batch info.
   */
  getBatch() {
    return this._configuration.getBatch()
  }

  /**
   * Adds a property to be sent to the server.
   *
   * @param {string} name - The property name.
   * @param {string} value - The property value.
   */
  addProperty(name, value) {
    return this._configuration.addProperty(name, value)
  }

  /**
   * Clears the list of custom properties.
   */
  clearProperties() {
    this._configuration._properties = []
  }

  /**
   * Automatically save differences as a baseline.
   *
   * @param {boolean} saveDiffs - Sets whether to automatically save differences as baseline.
   */
  setSaveDiffs(saveDiffs) {
    this._configuration.setSaveDiffs(saveDiffs)
  }

  /**
   * @return {boolean} - whether to automatically save differences as baseline.
   */
  getSaveDiffs() {
    return this._configuration.getSaveDiffs()
  }

  /**
   * @param {boolean} sendDom
   */
  setSendDom(sendDom) {
    this._configuration.setSendDom(sendDom)
  }

  /**
   * @return {boolean}
   */
  getSendDom() {
    return this._configuration.getSendDom()
  }

  /**
   * @param {boolean} compareWithParentBranch - New compareWithParentBranch value, default is false
   */
  setCompareWithParentBranch(compareWithParentBranch) {
    this._configuration.setCompareWithParentBranch(compareWithParentBranch)
  }

  /**
   * @deprecated Use {@link #getCompareWithParentBranch()} instead
   * @return {boolean} - The currently compareWithParentBranch value
   */
  isCompareWithParentBranch() {
    return this._configuration.getCompareWithParentBranch()
  }

  /**
   * @return {boolean} - The currently compareWithParentBranch value
   */
  getCompareWithParentBranch() {
    return this._configuration.getCompareWithParentBranch()
  }

  /**
   * @param {boolean} ignoreBaseline - New ignoreBaseline value, default is false
   */
  setIgnoreBaseline(ignoreBaseline) {
    this._configuration.setIgnoreBaseline(ignoreBaseline)
  }

  /**
   * @deprecated Use {@link #getIgnoreBaseline()} instead
   * @return {boolean} - The currently ignoreBaseline value
   */
  isIgnoreBaseline() {
    return this._configuration.getIgnoreBaseline()
  }

  /**
   * @return {boolean} - The currently ignoreBaseline value
   */
  getIgnoreBaseline() {
    return this._configuration.getIgnoreBaseline()
  }

  /**
   * @deprecated Only available for backward compatibility. See {@link #setBaselineEnvName(string)}.
   * @param {string} baselineName - If specified, determines the baseline to compare with and disables automatic baseline
   *   inference.
   */
  setBaselineName(baselineName) {
    this.setBaselineEnvName(baselineName)
  }

  /**
   * @deprecated Only available for backward compatibility. See {@link #getBaselineEnvName()}.
   * @return {string} - The baseline name, if it was specified.
   */
  getBaselineName() {
    return this.getBaselineEnvName()
  }

  /**
   * If not {@code null}, determines the name of the environment of the baseline.
   *
   * @param {string} baselineEnvName - The name of the baseline's environment.
   */
  setBaselineEnvName(baselineEnvName) {
    this._logger.log(`Baseline environment name: ${baselineEnvName}`)
    this._configuration.setBaselineEnvName(baselineEnvName)
  }

  /**
   * If not {@code null}, determines the name of the environment of the baseline.
   *
   * @return {string} - The name of the baseline's environment, or {@code null} if no such name was set.
   */
  getBaselineEnvName() {
    return this._configuration.getBaselineEnvName()
  }

  /**
   * If not {@code null} specifies a name for the environment in which the application under test is running.
   *
   * @deprecated use {@link setEnvironmentName} instead
   * @param {string} envName - The name of the environment of the baseline.
   */
  setEnvName(envName) {
    this.setEnvironmentName(envName)
  }

  /**
   * If not {@code null} specifies a name for the environment in which the application under test is running.
   *
   * @param {string} envName - The name of the environment of the baseline.
   */
  setEnvironmentName(envName) {
    this._logger.log(`Environment name: ${envName}`)
    this._configuration.setEnvironmentName(envName)
  }

  /**
   * If not {@code null} specifies a name for the environment in which the application under test is running.
   *
   * @return {string} - The name of the environment of the baseline, or {@code null} if no such name was set.
   */
  getEnvName() {
    return this._configuration.getEnvironmentName()
  }

  /**
   * @param {string} testName - The name of the currently running test.
   */
  setTestName(testName) {
    this._configuration.setTestName(testName)
  }

  /**
   * @return {?string} - The name of the currently running test.
   */
  getTestName() {
    return this._configuration.getTestName()
  }

  /**
   * @param {string} displayName - The display name of the currently running test.
   */
  setDisplayName(displayName) {
    this._configuration.setDisplayName(displayName)
  }

  /**
   * @return {?string} - The display name of the currently running test.
   */
  getDisplayName() {
    return this._configuration.getDisplayName()
  }

  /**
   * @return {ImageMatchSettings} - The match settings used for the session.
   */
  getDefaultMatchSettings() {
    return this._configuration.getDefaultMatchSettings()
  }

  /**
   * Updates the match settings to be used for the session.
   *
   * @param {ImageMatchSettings} defaultMatchSettings - The match settings to be used for the session.
   */
  setDefaultMatchSettings(defaultMatchSettings) {
    this._configuration.setDefaultMatchSettings(defaultMatchSettings)
  }

  /**
   * The test-wide match level to use when checking application screenshot with the expected output.
   *
   * @param {MatchLevel} matchLevel - The test-wide match level to use when checking application screenshot with the
   *   expected output.
   */
  setMatchLevel(matchLevel) {
    this._configuration.getDefaultMatchSettings().setMatchLevel(matchLevel)
  }

  /**
   * @return {MatchLevel} - The test-wide match level.
   */
  getMatchLevel() {
    return this._configuration.getDefaultMatchSettings().getMatchLevel()
  }

  /**
   * The test-wide useDom to use.
   *
   * @param {boolean} useDom - The test-wide useDom to use in match requests.
   */
  setUseDom(useDom) {
    this._configuration.getDefaultMatchSettings().setUseDom(useDom)
  }

  /**
   * @return {boolean} - The test-wide useDom to use in match requests.
   */
  getUseDom() {
    return this._configuration.getDefaultMatchSettings().getUseDom()
  }

  /**
   * The test-wide enablePatterns to use.
   *
   * @param {boolean} enablePatterns - The test-wide enablePatterns to use in match requests.
   */
  setEnablePatterns(enablePatterns) {
    this._configuration.getDefaultMatchSettings().setEnablePatterns(enablePatterns)
  }

  /**
   * @return {boolean} - The test-wide enablePatterns to use in match requests.
   */
  getEnablePatterns() {
    return this._configuration.getDefaultMatchSettings().getEnablePatterns()
  }

  /**
   * The test-wide ignoreDisplacements to use.
   *
   * @param {boolean} ignoreDisplacements - The test-wide ignoreDisplacements to use in match requests.
   */
  setIgnoreDisplacements(ignoreDisplacements) {
    this._configuration.getDefaultMatchSettings().setIgnoreDisplacements(ignoreDisplacements)
  }

  /**
   * @return {boolean} - The test-wide ignoreDisplacements to use in match requests.
   */
  getIgnoreDisplacements() {
    return this._configuration.getDefaultMatchSettings().getIgnoreDisplacements()
  }

  /**
   * Sets the ignore blinking caret value.
   *
   * @param {boolean} value - The ignore value.
   */
  setIgnoreCaret(value) {
    this._configuration.getDefaultMatchSettings().setIgnoreCaret(value)
  }

  /**
   * @return {boolean} - Whether to ignore or the blinking caret or not when comparing images.
   */
  getIgnoreCaret() {
    return this._configuration.getDefaultMatchSettings().getIgnoreCaret()
  }

  /**
   * @param {boolean} [hardReset=false] - If false, init providers only if they're not initialized.
   * @private
   */
  _initProviders(hardReset = false) {
    if (hardReset) {
      this._scaleProviderHandler = undefined
      this._cutProviderHandler = undefined
      this._positionProviderHandler = undefined
      this._viewportSizeHandler = undefined
      this._debugScreenshotsProvider = undefined
    }

    if (!this._scaleProviderHandler) {
      /** @type {PropertyHandler<ScaleProvider>} */
      this._scaleProviderHandler = new SimplePropertyHandler()
      this._scaleProviderHandler.set(new NullScaleProvider())
    }

    if (!this._cutProviderHandler) {
      /** @type {PropertyHandler<CutProvider>} */
      this._cutProviderHandler = new SimplePropertyHandler()
      this._cutProviderHandler.set(new NullCutProvider())
    }

    if (!this._positionProviderHandler) {
      /** @type {PropertyHandler<PositionProvider>} */
      this._positionProviderHandler = new SimplePropertyHandler()
      this._positionProviderHandler.set(new InvalidPositionProvider())
    }

    if (!this._viewportSizeHandler) {
      /** @type {PropertyHandler<RectangleSize>} */
      this._viewportSizeHandler = new SimplePropertyHandler()
      this._viewportSizeHandler.set(null)
    }

    if (!this._debugScreenshotsProvider) {
      /** @type {DebugScreenshotsProvider} */
      this._debugScreenshotsProvider = new NullDebugScreenshotProvider()
    }
  }

  getAndSaveRenderingInfo() {
    throw new TypeError('The method "getAndSaveRenderingInfo" is not implemented!')
  }

  _getAndSaveBatchInfoFromServer(_batchId) {
    throw new TypeError('The method "_getAndSaveBatchInfoFromServer" is not implemented!')
  }

  async _getScmMergeBaseTime(branchName, parentBranchName) {
    ArgumentGuard.notNullOrEmpty(branchName, 'branchName')
    ArgumentGuard.notNullOrEmpty(parentBranchName, 'parentBranchName')
    return getScmInfo(branchName, parentBranchName)
  }

  async handleScmMergeBaseTime() {
    const batchId = this.getUserSetBatchId()
    let scmSourceBranch = this._configuration.getBranchName()
    let scmTargetBranch = this._configuration.getParentBranchName()

    const isLocalBranchTest =
      scmSourceBranch && scmTargetBranch && scmSourceBranch !== scmTargetBranch
    const isCiBranchTest = batchId && !scmSourceBranch && !scmTargetBranch

    let err
    if (isCiBranchTest) {
      ;[err, {scmSourceBranch, scmTargetBranch} = {}] = await GeneralUtils.presult(
        this._getAndSaveBatchInfoFromServer(batchId),
      )
      this._logger.log(
        `_getAndSaveBatchInfoFromServer done for ${batchId},
        branchName: ${scmSourceBranch}, parentBranchName: ${scmTargetBranch}, err: ${err}`,
      )
    }

    let mergeBaseTime
    if ((isLocalBranchTest || isCiBranchTest) && !err) {
      ;[err, mergeBaseTime] = await GeneralUtils.presult(
        this._getScmMergeBaseTime(scmSourceBranch, scmTargetBranch),
      )
      this._logger.log('_getScmMergeBaseTime done,', `mergeBaseTime: ${mergeBaseTime} err: ${err}`)
    }

    return mergeBaseTime
  }

  /**
   * @param {RenderingInfo} renderingInfo
   */
  setRenderingInfo(renderingInfo) {
    this._serverConnector.setRenderingInfo(renderingInfo)
  }

  /**
   * @return {string} - The name of the application under test.
   */
  getAppName() {
    return this._currentAppName || this._configuration.getAppName()
  }

  /**
   * Clears the user inputs list.
   *
   * @protected
   */
  clearUserInputs() {
    if (this._configuration.getIsDisabled()) {
      return
    }
    this._userInputs.length = 0
  }

  /**
   * @protected
   * @return {Trigger[]} - User inputs collected between {@code checkWindowBase} invocations.
   */
  getUserInputs() {
    if (this._configuration.getIsDisabled()) {
      return null
    }

    return this._userInputs.map(input => Object.assign(Object.create(input), input))
  }

  /**
   * @param {FailureReports} failureReports - Use one of the values in FailureReports.
   */
  setFailureReports(failureReports) {
    ArgumentGuard.isValidEnumValue(failureReports, FailureReports)
    this._failureReports = failureReports
  }

  /**
   * @return {FailureReports} - The failure reports setting.
   */
  getFailureReports() {
    return this._failureReports
  }

  /**
   * @return {string} - The full agent id composed of both the base agent id and the user given agent id.
   */
  getFullAgentId() {
    return this.getAgentId()
      ? `${this.getAgentId()} [${this.getBaseAgentId()}]`
      : this.getBaseAgentId()
  }

  /**
   * @return {boolean} - Whether a session is open.
   */
  getIsOpen() {
    return this._isOpen
  }

  /**
   * Manually set the the sizes to cut from an image before it's validated.
   *
   * @param {CutProvider} [cutProvider] - the provider doing the cut.
   */
  setCutProvider(cutProvider) {
    if (cutProvider) {
      this._cutProviderHandler = new ReadOnlyPropertyHandler(this._logger, cutProvider)
    } else {
      this._cutProviderHandler = new SimplePropertyHandler(new NullCutProvider())
    }
  }

  /**
   * Manually set the the sizes to cut from an image before it's validated.
   *
   * @param {CutProvider} [cutProvider] - the provider doing the cut.
   */
  setImageCut(cutProvider) {
    this.setCutProvider(cutProvider)
  }

  /**
   * @return {boolean}
   */
  getIsCutProviderExplicitlySet() {
    return this._cutProviderHandler && !(this._cutProviderHandler.get() instanceof NullCutProvider)
  }

  /**
   * Manually set the scale ratio for the images being validated.
   *
   * @param {number} [scaleRatio=1] - The scale ratio to use, or {@code null} to reset back to automatic scaling.
   */
  setScaleRatio(scaleRatio) {
    if (scaleRatio) {
      this._scaleProviderHandler = new ReadOnlyPropertyHandler(
        this._logger,
        new FixedScaleProvider(scaleRatio),
      )
    } else {
      this._scaleProviderHandler = new SimplePropertyHandler(new NullScaleProvider())
    }
  }

  /**
   * @return {number} - The ratio used to scale the images being validated.
   */
  getScaleRatio() {
    return this._scaleProviderHandler.get().getScaleRatio()
  }

  setRender(_value) {
    GeneralUtils.deprecationWarning({deprecatedThing: 'setRender', isDead: true})
  }

  getRender() {
    GeneralUtils.deprecationWarning({deprecatedThing: 'getRender', isDead: true})
  }

  /**
   * @param {boolean} saveDebugScreenshots - If true, will save all screenshots to local directory.
   */
  setSaveDebugScreenshots(saveDebugScreenshots) {
    const prev = this._debugScreenshotsProvider
    if (saveDebugScreenshots) {
      this._debugScreenshotsProvider = new FileDebugScreenshotsProvider()
    } else {
      this._debugScreenshotsProvider = new NullDebugScreenshotProvider()
    }
    this._debugScreenshotsProvider.setPrefix(prev.getPrefix())
    this._debugScreenshotsProvider.setPath(prev.getPath())
  }

  /**
   * @return {boolean}
   */
  getSaveDebugScreenshots() {
    return !(this._debugScreenshotsProvider instanceof NullDebugScreenshotProvider)
  }

  /**
   * @param {string} pathToSave - Path where you want to save the debug screenshots.
   */
  setDebugScreenshotsPath(pathToSave) {
    this._debugScreenshotsProvider.setPath(pathToSave)
  }

  /**
   * @return {string} - The path where you want to save the debug screenshots.
   */
  getDebugScreenshotsPath() {
    return this._debugScreenshotsProvider.getPath()
  }

  /**
   * @param {string} prefix - The prefix for the screenshots' names.
   */
  setDebugScreenshotsPrefix(prefix) {
    this._debugScreenshotsProvider.setPrefix(prefix)
  }

  /**
   * @return {string} - The prefix for the screenshots' names.
   */
  getDebugScreenshotsPrefix() {
    return this._debugScreenshotsProvider.getPrefix()
  }

  /**
   * @param {DebugScreenshotsProvider} debugScreenshotsProvider
   */
  setDebugScreenshotsProvider(debugScreenshotsProvider) {
    this._debugScreenshotsProvider = debugScreenshotsProvider
  }

  /**
   * @return {DebugScreenshotsProvider}
   */
  getDebugScreenshotsProvider() {
    return this._debugScreenshotsProvider
  }

  /**
   * Ends the currently running test.
   *
   * @param {boolean} [throwEx=true] - If true, then the returned promise will 'reject' for failed/aborted tests.
   * @return {Promise<TestResults>} - A promise which resolves/rejects (depending on the value of 'throwEx') to the test
   *   results.
   */
  async close(throwEx = true) {
    try {
      if (this._configuration.getIsDisabled()) {
        this._logger.verbose('Eyes close ignored. (disabled)')
        return null
      }

      this._logger.verbose(`EyesBase.close(${throwEx})`)
      ArgumentGuard.isValidState(this._isOpen, 'Eyes not open')

      this._isOpen = false

      this._lastScreenshot = null
      this.clearUserInputs()

      this._initProviders(true)

      // If a session wasn't started, use empty results.
      if (!this._runningSession) {
        this._logger.verbose('Server session was not started')
        this._logger.log('--- Empty test ended.')
        return new TestResults()
      }

      const isNewSession = this._runningSession.getIsNew()
      const sessionResultsUrl = this._runningSession.getUrl()

      this._logger.verbose('Ending server session...')

      const save =
        (isNewSession && this._configuration.getSaveNewTests()) ||
        (!isNewSession && this._configuration.getSaveFailedTests())
      this._logger.verbose(`Automatically save test? ${save}`)

      // Session was started, call the server to end the session.
      const results = await this._serverConnector.stopSession(this._runningSession, false, save)
      results.setIsNew(isNewSession)
      results.setUrl(sessionResultsUrl)

      // for backwards compatibility with outdated servers
      if (!results.getStatus()) {
        if (results.getMissing() === 0 && results.getMismatches() === 0) {
          results.setStatus(TestResultsStatus.Passed)
        } else {
          results.setStatus(TestResultsStatus.Unresolved)
        }
      }

      this._logger.verbose(`Results: ${results}`)

      const status = results.getStatus()
      await this._sessionEventHandlers.testEnded(await this.getAUTSessionId(), results)

      if (status === TestResultsStatus.Unresolved) {
        if (results.getIsNew()) {
          this._logger.log(
            `--- New test ended. Please approve the new baseline at ${sessionResultsUrl}`,
          )
          if (throwEx) {
            throw new NewTestError(results, this._sessionStartInfo)
          }
        } else {
          this._logger.log(`--- Failed test ended. See details at ${sessionResultsUrl}`)
          if (throwEx) {
            throw new DiffsFoundError(results, this._sessionStartInfo)
          }
        }
      } else if (status === TestResultsStatus.Failed) {
        this._logger.log(`--- Failed test ended. See details at ${sessionResultsUrl}`)
        if (throwEx) {
          throw new TestFailedError(results, this._sessionStartInfo)
        }
      } else {
        this._logger.log(`--- Test passed. See details at ${sessionResultsUrl}`)
      }

      results.setServerConnector(this._serverConnector)
      return results
    } catch (err) {
      this._logger.log(`Failed to abort server session: ${err.message}`)
      throw err
    } finally {
      // Making sure that we reset the running session even if an exception was thrown during close.
      this._matchWindowTask = null
      this._autSessionId = undefined
      this._runningSession = null
      this._currentAppName = undefined
      this._logger.getLogHandler().close()
    }
  }

  /**
   * If a test is running, aborts it. Otherwise, does nothing.
   *
   * @alias abort
   * @return {Promise<?TestResults>} - A promise which resolves to the test results.
   */
  async abortIfNotClosed() {
    return this.abort()
  }

  /**
   * If a test is running, aborts it. Otherwise, does nothing.
   *
   * @return {Promise<?TestResults>} - A promise which resolves to the test results.
   */
  async abort() {
    try {
      if (this._configuration.getIsDisabled()) {
        this._logger.verbose('Eyes abort ignored. (disabled)')
        return null
      }

      this._isOpen = false

      this._lastScreenshot = null
      this.clearUserInputs()

      if (!this._runningSession) {
        this._logger.verbose('Closed')
        return null
      }

      this._logger.verbose('Aborting server session...')
      const testResults = await this._serverConnector.stopSession(this._runningSession, true, false)

      this._logger.log('--- Test aborted.')
      return testResults
    } catch (err) {
      this._logger.log(`Failed to abort server session: ${err}`)
      return null
    } finally {
      this._runningSession = null
      this._logger.getLogHandler().close()
    }
  }

  /**
   * @return {PositionProvider} - The currently set position provider.
   */
  getPositionProvider() {
    return this._positionProviderHandler.get()
  }

  /**
   * @param {PositionProvider} positionProvider - The position provider to be used.
   */
  setPositionProvider(positionProvider) {
    if (positionProvider) {
      this._positionProviderHandler = new ReadOnlyPropertyHandler(this._logger, positionProvider)
    } else {
      this._positionProviderHandler = new SimplePropertyHandler(new InvalidPositionProvider())
    }
  }

  /**
   * Takes a snapshot of the application under test and matches it with the expected output.
   *
   * @protected
   * @param {RegionProvider} regionProvider - Returns the region to check or empty region to check the entire window.
   * @param {string} [tag=''] - An optional tag to be associated with the snapshot.
   * @param {boolean} [ignoreMismatch=false] - Whether to ignore this check if a mismatch is found.
   * @param {CheckSettings} [checkSettings] - The settings to use.
   * @param {string} [source] - The tested source page.
   * @return {Promise<MatchResult>} - The result of matching the output with the expected output.
   * @throws DiffsFoundError - Thrown if a mismatch is detected and immediate failure reports are enabled.
   */
  async checkWindowBase(
    regionProvider,
    tag = '',
    ignoreMismatch = false,
    checkSettings = new CheckSettings(USE_DEFAULT_TIMEOUT),
    source,
    closeAfterMatch,
    throwEx,
  ) {
    if (closeAfterMatch) {
      return this.checkWindowAndCloseBase(
        regionProvider,
        tag,
        ignoreMismatch,
        checkSettings,
        source,
        throwEx,
      )
    }
    if (this._configuration.getIsDisabled()) {
      this._logger.verbose('Ignored')
      const result = new MatchResult()
      result.setAsExpected(true)
      return result
    }

    ArgumentGuard.isValidState(this._isOpen, 'Eyes not open')
    ArgumentGuard.notNull(regionProvider, 'regionProvider')

    this._validationId += 1
    const validationInfo = new ValidationInfo()
    validationInfo.setValidationId(this._validationId)
    validationInfo.setTag(tag)

    // default result
    const validationResult = new ValidationResult()

    await GeneralUtils.sleep(this._configuration.getWaitBeforeScreenshots())

    await this.beforeMatchWindow()
    await this._sessionEventHandlers.validationWillStart(this._autSessionId, validationInfo)

    await this._ensureRunningSession()
    const outputProvider = new AppOutputProvider()
    // A callback which will call getAppOutput
    outputProvider.getAppOutput = (region, lastScreenshot, checkSettingsLocal) =>
      this._getAppOutputWithScreenshot(region, lastScreenshot, checkSettingsLocal)

    this._matchWindowTask = new MatchWindowTask(
      this._logger,
      this._serverConnector,
      this._runningSession,
      this._configuration.getMatchTimeout(),
      this,
      outputProvider,
    )

    const matchResult = await EyesBase.matchWindow(
      regionProvider,
      tag,
      ignoreMismatch,
      checkSettings,
      this,
      source,
    )
    await this.afterMatchWindow()

    this._logger.verbose('MatchWindow Done!')
    validationResult.setAsExpected(matchResult.getAsExpected())

    if (!ignoreMismatch) {
      this.clearUserInputs()
    }

    this._validateResult(tag, matchResult)
    this._logger.verbose('Done!')
    await this._sessionEventHandlers.validationEnded(
      this._autSessionId,
      validationInfo.getValidationId(),
      validationResult,
    )

    return matchResult
  }

  /**
   * Takes a snapshot of the application under test and matches it with the expected output.
   *
   * @protected
   * @param {RegionProvider} regionProvider - Returns the region to check or empty rectangle to check the entire window.
   * @param {string} [tag=''] - An optional tag to be associated with the snapshot.
   * @param {boolean} [ignoreMismatch=false] - Whether to ignore this check if a mismatch is found.
   * @param {CheckSettings} [checkSettings] - The settings to use.
   * @return {Promise<TestResults>} - The result of matching the output with the expected output.
   */
  async checkWindowAndCloseBase(
    regionProvider,
    tag = '',
    ignoreMismatch = false,
    checkSettings = new CheckSettings(USE_DEFAULT_TIMEOUT),
    source,
    throwEx = true,
  ) {
    if (this._configuration.getIsDisabled()) {
      this._logger.verbose('checkWindowAndCloseBase Ignored')
      const result = new TestResults()
      result.setStatus(TestResultsStatus.Passed)
      return result
    }

    ArgumentGuard.isValidState(this._isOpen, 'Eyes not open')
    ArgumentGuard.notNull(regionProvider, 'regionProvider')

    await this.beforeMatchWindow()

    await this._ensureRunningSession()
    const outputProvider = new AppOutputProvider()
    // A callback which will call getAppOutput

    outputProvider.getAppOutput = (region, lastScreenshot, checkSettingsLocal) =>
      this._getAppOutputWithScreenshot(region, lastScreenshot, checkSettingsLocal)

    this._shouldMatchWindowRunOnceOnTimeout = true
    this._matchWindowTask = new MatchWindowAndCloseTask(
      this._logger,
      this._serverConnector,
      this._runningSession,
      this._configuration.getMatchTimeout(),
      this,
      outputProvider,
      this._configuration.getSaveNewTests(),
    )

    const results = await EyesBase.matchWindow(
      regionProvider,
      tag,
      ignoreMismatch,
      checkSettings,
      this,
      source,
    )
    await this.afterMatchWindow()

    try {
      if (!ignoreMismatch) {
        this.clearUserInputs()
      }

      const isNewSession = this._runningSession.getIsNew()
      const sessionResultsUrl = this._runningSession.getUrl()

      const matchResult = new MatchResult()
      matchResult.setAsExpected(!results.getIsDifferent())
      this._validateResult(tag, matchResult)

      this._logger.verbose('Done!')

      results.setIsNew(isNewSession)
      results.setUrl(sessionResultsUrl)

      // for backwards compatibility with outdated servers
      if (!results.getStatus()) {
        if (results.getMissing() === 0 && results.getMismatches() === 0) {
          results.setStatus(TestResultsStatus.Passed)
        } else {
          results.setStatus(TestResultsStatus.Unresolved)
        }
      }

      this._logger.verbose(`Results: ${results}`)

      const status = results.getStatus()
      await this._sessionEventHandlers.testEnded(await this.getAUTSessionId(), results)

      if (status === TestResultsStatus.Unresolved) {
        if (results.getIsNew()) {
          this._logger.log(
            `--- New test ended. Please approve the new baseline at ${sessionResultsUrl}`,
          )
          if (throwEx) {
            throw new NewTestError(results, this._sessionStartInfo)
          }
        } else {
          this._logger.log(`--- Failed test ended. See details at ${sessionResultsUrl}`)
          if (throwEx) {
            throw new DiffsFoundError(results, this._sessionStartInfo)
          }
        }
      } else if (status === TestResultsStatus.Failed) {
        this._logger.log(`--- Failed test ended. See details at ${sessionResultsUrl}`)
        if (throwEx) {
          throw new TestFailedError(results, this._sessionStartInfo)
        }
      } else {
        this._logger.log(`--- Test passed. See details at ${sessionResultsUrl}`)
      }

      results.setServerConnector(this._serverConnector)
      return results
    } catch (err) {
      this._logger.log(`Failed to abort server session: ${err.message}`)
      throw err
    } finally {
      // Making sure that we reset the running session even if an exception was thrown during close.
      this._matchWindowTask = null
      this._autSessionId = undefined
      this._runningSession = null
      this._currentAppName = undefined
      this._logger.getLogHandler().close()
    }
  }

  /**
   * @protected
   * @return {Promise}
   */
  async beforeMatchWindow() {
    return undefined
  }

  /**
   * @protected
   * @return {Promise}
   */
  async afterMatchWindow() {
    return undefined
  }

  /**
   * @protected
   * @return {Promise<?string>}
   */
  async tryCaptureDom() {
    return undefined
  }

  /**
   * @protected
   * @return {Promise<?string>}
   */
  async getOrigin() {
    return undefined
  }

  /**
   * Replaces an actual image in the current running session.
   *
   * @param {number} stepIndex - The zero based index of the step in which to replace the actual image.
   * @param {Buffer} screenshot - The PNG bytes of the updated screenshot.
   * @param {string} [tag] - The updated tag for the step.
   * @param {string} [title] - The updated title for the step.
   * @param {Trigger[]} [userInputs] - The updated userInputs for the step.
   * @return {Promise<MatchResult>} - A promise which resolves when replacing is done, or rejects on error.
   */
  async replaceWindow(stepIndex, screenshot, tag = '', title = '', userInputs = []) {
    this._logger.verbose('EyesBase.replaceWindow - running')

    if (this._configuration.getIsDisabled()) {
      this._logger.verbose('Ignored')
      const result = new MatchResult()
      result.setAsExpected(true)
      return result
    }

    ArgumentGuard.isValidState(this._isOpen, 'Eyes not open')

    this._logger.verbose('EyesBase.replaceWindow - calling serverConnector.replaceWindow')

    const replaceWindowData = new MatchWindowData({
      userInputs,
      appOutput: new AppOutput({title, screenshot}),
      tag,
    })

    const result = await this._serverConnector.replaceWindow(
      this._runningSession,
      stepIndex,
      replaceWindowData,
    )
    this._logger.verbose('EyesBase.replaceWindow done')
    return result
  }

  /**
   * @private
   * @param {RegionProvider} regionProvider
   * @param {string} tag
   * @param {boolean} ignoreMismatch
   * @param {CheckSettings} checkSettings
   * @param {EyesBase} self
   * @param {string} [source]
   * @return {Promise<MatchResult>}
   */
  static async matchWindow(regionProvider, tag, ignoreMismatch, checkSettings, self, source) {
    let retryTimeout = -1

    if (checkSettings) {
      retryTimeout = checkSettings.getTimeout()
    }

    self._logger.verbose(
      `CheckWindowBase(${regionProvider.constructor.name}, '${tag}', ${ignoreMismatch}, ${retryTimeout})`,
    )

    const region = await regionProvider.getRegion()
    self._logger.verbose('Calling match window...')

    return self._matchWindowTask.matchWindow(
      self.getUserInputs(),
      region,
      tag,
      self._shouldMatchWindowRunOnceOnTimeout,
      ignoreMismatch,
      checkSettings,
      retryTimeout,
      source,
    )
  }

  /**
   * @private
   * @param {string} domJson
   * @return {Promise<?string>}
   */
  async _tryPostDomSnapshot(domJson) {
    if (!domJson) {
      return null
    }
    const id = GeneralUtils.guid()
    return this._serverConnector.postDomSnapshot(id, domJson)
  }

  /**
   * @private
   * @param {string} tag
   * @param {MatchResult} result
   */
  _validateResult(tag, result) {
    if (result.getAsExpected()) {
      return
    }

    this._shouldMatchWindowRunOnceOnTimeout = true

    if (this._runningSession && !this._runningSession.getIsNew()) {
      this._logger.log(`Mismatch! (${tag})`)
    }

    if (this.getFailureReports() === FailureReports.IMMEDIATE) {
      throw new TestFailedError(
        null,
        `Mismatch found in '${this._sessionStartInfo.getScenarioIdOrName()}' of '${this._sessionStartInfo.getAppIdOrName()}'`,
      )
    }
  }

  /**
   * Starts a test.
   *
   * @protected
   * @param {string} appName - The name of the application under test.
   * @param {string} testName - The test name.
   * @param {RectangleSize|PalinRectangleSize} [viewportSize] - The client's viewport size (i.e., the
   *   visible part of the document's body) or {@code null} to allow any viewport size.
   * @param {SessionType} [sessionType=SessionType.SEQUENTIAL] - The type of test (e.g., Progression for timing tests),
   *   or {@code null} to use the default.
   * @param {skipStartingSession} [skipStartingSession=false] - If {@code true} skip starting the session.
   * @return {Promise}
   */
  async openBase(
    appName,
    testName,
    viewportSize,
    sessionType = SessionType.SEQUENTIAL,
    skipStartingSession = false,
  ) {
    this._logger.getLogHandler().open()

    if (viewportSize) this._configuration.setViewportSize(viewportSize)

    try {
      if (this._configuration.getIsDisabled()) {
        this._logger.verbose('Eyes Open ignored - disabled')
        return
      }

      // If there's no default application name, one must be provided for the current test.
      if (!this._configuration.getAppName()) {
        ArgumentGuard.notNull(appName, 'appName')
      }
      ArgumentGuard.notNull(testName, 'testName')

      this._logger.verbose(`Agent = ${this.getFullAgentId()}`)
      this._logger.verbose(
        `openBase('${appName}', '${testName}', '${this._configuration.getViewportSize()}')`,
      )

      if (!this._renderingInfoPromise) {
        this._renderingInfoPromise = this.getAndSaveRenderingInfo()
      }
      this._scmMergeBaseTimePromise = this.handleScmMergeBaseTime()

      await this._sessionEventHandlers.testStarted(await this.getAUTSessionId())

      this._validateApiKey()
      this._logOpenBase()
      await this._validateSessionOpen()

      this._initProviders()
      this._isViewportSizeSet = false
      await this.beforeOpen()

      this._currentAppName = appName || this._configuration.getAppName()
      this._configuration.setTestName(testName)
      this._viewportSizeHandler.set(this._configuration.getViewportSize())
      this._configuration.setSessionType(sessionType)
      this._validationId = -1

      if (this._configuration.getViewportSize() && !skipStartingSession) {
        await this._ensureRunningSession()
      }

      this._autSessionId = await this.getAUTSessionId()
      this._isOpen = true
      await this.afterOpen()
    } catch (err) {
      this._logger.log(err.message)
      this._logger.getLogHandler().close()
      throw err
    }
  }

  /**
   * @protected
   * @return {Promise}
   */
  async beforeOpen() {
    return undefined
  }

  /**
   * @protected
   * @return {Promise}
   */
  async afterOpen() {
    return undefined
  }

  /**
   * @private
   * @return {Promise}
   */
  async _ensureRunningSession() {
    if (this._runningSession) {
      this._logger.verbose('session already running.')
      return
    }

    this._logger.verbose('No running session, calling start session...')
    await this.startSession()
    this._logger.setSessionId(this._runningSession.getSessionId())
    this._logger.verbose('Done!')
  }

  /**
   * @private
   */
  _validateApiKey() {
    if (!this.getApiKey()) {
      const errMsg = 'API key is missing! Please set it using setApiKey()'
      this._logger.log(errMsg)
      throw new Error(errMsg)
    }
  }

  /**
   * @private
   */
  _logOpenBase() {
    this._logger.verbose(`Eyes server URL is '${this._configuration.getServerUrl()}'`)
    this._logger.verbose(`Timeout = '${this._configuration.getConnectionTimeout()}'`)
    this._logger.verbose(`matchTimeout = '${this._configuration.getMatchTimeout()}'`)
    this._logger.verbose(
      `Default match settings = '${this._configuration.getDefaultMatchSettings()}'`,
    )
    this._logger.verbose(`FailureReports = '${this._failureReports}'`)
  }

  /**
   * @private
   * @return {Promise}
   */
  async _validateSessionOpen() {
    if (this._isOpen) {
      await this.abort()
      const errMsg = 'A test is already running'
      this._logger.log(errMsg)
      throw new Error(errMsg)
    }
  }

  /**
   * Define the viewport size as {@code size} without doing any actual action on the
   *
   * @param {RectangleSize} explicitViewportSize - The size of the viewport. {@code null} disables the explicit size.
   */
  setExplicitViewportSize(explicitViewportSize) {
    if (!explicitViewportSize) {
      this._viewportSizeHandler = new SimplePropertyHandler()
      this._viewportSizeHandler.set(null)
      this._configuration.setViewportSize(undefined)
      this._isViewportSizeSet = false
      return
    }

    this._logger.verbose(`Viewport size explicitly set to ${explicitViewportSize}`)
    this._viewportSizeHandler = new ReadOnlyPropertyHandler(
      this._logger,
      new RectangleSize(explicitViewportSize),
    )
    this._configuration.setViewportSize(explicitViewportSize)
    this._isViewportSizeSet = true
  }

  /**
   * Adds a trigger to the current list of user inputs.
   *
   * @protected
   * @param {Trigger} trigger - The trigger to add to the user inputs list.
   */
  addUserInput(trigger) {
    if (this._configuration.getIsDisabled()) {
      return
    }

    ArgumentGuard.notNull(trigger, 'trigger')
    this._userInputs.push(trigger)
  }

  /**
   * Adds a text trigger.
   *
   * @protected
   * @param {Region} control - The control's position relative to the window.
   * @param {string} text - The trigger's text.
   */
  addTextTriggerBase(control, text) {
    if (this._configuration.getIsDisabled()) {
      this._logger.verbose(`Ignoring '${text}' (disabled)`)
      return
    }

    ArgumentGuard.notNull(control, 'control')
    ArgumentGuard.notNull(text, 'text')

    // We don't want to change the objects we received.
    let newControl = new Region(control)

    if (!this._matchWindowTask || !this._matchWindowTask.getLastScreenshot()) {
      this._logger.verbose(`Ignoring '${text}' (no screenshot)`)
      return
    }

    newControl = this._matchWindowTask
      .getLastScreenshot()
      .getIntersectedRegion(newControl, CoordinatesType.SCREENSHOT_AS_IS)
    if (newControl.isSizeEmpty()) {
      this._logger.verbose(`Ignoring '${text}' (out of bounds)`)
      return
    }

    const trigger = new TextTrigger(newControl, text)
    this._userInputs.push(trigger)

    this._logger.verbose(`Added ${trigger}`)
  }

  /**
   * Adds a mouse trigger.
   *
   * @protected
   * @param {MouseTrigger.MouseAction} action - Mouse action.
   * @param {Region} control - The control on which the trigger is activated (location is relative to the window).
   * @param {Location} cursor - The cursor's position relative to the control.
   */
  addMouseTriggerBase(action, control, cursor) {
    if (this._configuration.getIsDisabled()) {
      this._logger.verbose(`Ignoring ${action} (disabled)`)
      return
    }

    ArgumentGuard.notNull(action, 'action')
    ArgumentGuard.notNull(control, 'control')
    ArgumentGuard.notNull(cursor, 'cursor')

    // Triggers are actually performed on the previous window.
    if (!this._matchWindowTask || !this._matchWindowTask.getLastScreenshot()) {
      this._logger.verbose(`Ignoring ${action} (no screenshot)`)
      return
    }

    // We don't want to change the objects we received.
    const newControl = new Region(control)
    // Getting the location of the cursor in the screenshot
    let cursorInScreenshot = new Location(cursor)
    // First we need to getting the cursor's coordinates relative to the context (and not to the control).
    cursorInScreenshot.offsetByLocation(newControl.getLocation())
    try {
      cursorInScreenshot = this._matchWindowTask
        .getLastScreenshot()
        .getLocationInScreenshot(cursorInScreenshot, CoordinatesType.CONTEXT_RELATIVE)
    } catch (err) {
      if (err instanceof OutOfBoundsError) {
        this._logger.verbose(`"Ignoring ${action} (out of bounds)`)
        return
      }

      throw err
    }

    const controlScreenshotIntersect = this._matchWindowTask
      .getLastScreenshot()
      .getIntersectedRegion(newControl, CoordinatesType.SCREENSHOT_AS_IS)

    // If the region is NOT empty, we'll give the coordinates relative to the control.
    if (!controlScreenshotIntersect.isSizeEmpty()) {
      const l = controlScreenshotIntersect.getLocation()
      cursorInScreenshot.offset(-l.getX(), -l.getY())
    }

    const trigger = new MouseTrigger(action, controlScreenshotIntersect, cursorInScreenshot)
    this._userInputs.push(trigger)
  }

  setAppEnvironment(hostOS, hostApp) {
    if (this.getIsDisabled()) {
      this._logger.verbose('Ignored')
      return
    }

    this._logger.verbose(`SetAppEnvironment(${hostOS}, ${hostApp})`)

    this._configuration.setHostOS(hostOS)
    this._configuration.setHostApp(hostApp)
  }

  /**
   * Application environment is the environment (e.g., the host OS) which runs the application under test.
   *
   * @protected
   * @return {Promise<AppEnvironment>} - The current application environment.
   */
  async getAppEnvironment() {
    const appEnv = new AppEnvironment()

    // If hostOS isn't set, we'll try and extract and OS ourselves.
    if (this._configuration.getHostOS()) {
      appEnv.setOs(this._configuration.getHostOS())
    }

    if (this._configuration.getHostApp()) {
      appEnv.setHostingApp(this._configuration.getHostApp())
    }

    if (this._configuration.getDeviceInfo()) {
      appEnv.setDeviceInfo(this._configuration.getDeviceInfo())
    }

    if (this._configuration.getHostAppInfo()) {
      appEnv.setHostingAppInfo(this._configuration.getHostAppInfo())
    }

    if (this._configuration.getHostOSInfo()) {
      appEnv.setOsInfo(this._configuration.getHostOSInfo())
    }

    const inferred = await this.getInferredEnvironment()
    appEnv.setInferred(inferred)
    appEnv.setDisplaySize(this._viewportSizeHandler.get())
    return appEnv
  }

  /**
   * Start eyes session on the eyes server.
   *
   * @protected
   * @return {Promise}
   */
  async startSession() {
    this._logger.verbose('startSession()')

    if (this._runningSession) {
      return
    }

    this._logger.verbose(`Batch is ${this._configuration.getBatch()}`)
    this._autSessionId = await this.getAUTSessionId()

    try {
      await this._ensureViewportSize()
    } catch (err) {
      // Throw to skip execution of all consecutive "then" blocks.
      throw new EyesError('Failed to set/get viewport size', err)
    }

    await this._sessionEventHandlers.initStarted()
    const appEnvironment = await this.getAppEnvironment()
    this._logger.verbose(`Application environment is ${appEnvironment}`)
    await this._sessionEventHandlers.initEnded()

    const parentBranchBaselineSavedBefore = await this._scmMergeBaseTimePromise

    this._sessionStartInfo = new SessionStartInfo({
      agentId: this.getFullAgentId(),
      sessionType: this._configuration.getSessionType(),
      appIdOrName: this.getAppName(),
      verId: undefined,
      scenarioIdOrName: this._configuration.getTestName(),
      displayName: this._configuration.getDisplayName(),
      batchInfo: this._configuration.getBatch(),
      baselineEnvName: this._configuration.getBaselineEnvName(),
      environmentName: this._configuration.getEnvironmentName(),
      environment: appEnvironment,
      defaultMatchSettings: this._configuration.getDefaultMatchSettings(),
      branchName: this._configuration.getBranchName(),
      parentBranchName: this._configuration.getParentBranchName(),
      parentBranchBaselineSavedBefore,
      baselineBranchName: this._configuration.getBaselineBranchName(),
      compareWithParentBranch: this._configuration.getCompareWithParentBranch(),
      ignoreBaseline: this._configuration.getIgnoreBaseline(),
      saveDiffs: this._configuration.getSaveDiffs(),
      properties: this._configuration.getProperties(),
      agentSessionId: GeneralUtils.guid(),
      timeout: this._configuration.getAbortIdleTestTimeout(),
    })

    this._logger.verbose('Starting server session...')
    this._runningSession = await this._serverConnector.startSession(this._sessionStartInfo)
    this._logger.verbose(`Server session ID is ${this._runningSession.getId()}`)

    if (this._runningSession.getRenderingInfo()) {
      this._serverConnector.setRenderingInfo(this._runningSession.getRenderingInfo())
    }

    const testInfo = `'${this._configuration.getTestName()}' of '${this.getAppName()}' "${appEnvironment}`
    if (this._runningSession.getIsNew()) {
      this._logger.log(`--- New test started - ${testInfo}`)
      this._shouldMatchWindowRunOnceOnTimeout = true
    } else {
      this._logger.log(`--- Test started - ${testInfo}`)
      this._shouldMatchWindowRunOnceOnTimeout = false
    }
  }

  /**
   * @package
   * @return {Promise}
   */
  async closeBatch() {
    if (this._configuration.getIsDisabled() || this._configuration.getDontCloseBatches()) {
      this._logger.verbose('closeBatch Ignored')
      return
    }

    try {
      if (this._configuration._batch) {
        const batchId = this.getBatchIdWithoutGenerating()
        await this._serverConnector.deleteBatchSessions(batchId)
      } else {
        this._logger.log('Failed to close batch: no batch found.')
      }
    } catch (e) {
      this._logger.log('Failed to close batch: error occurred', e)
    }
  }

  getUserSetBatchId() {
    const isGeneratedId =
      this._configuration._batch && this._configuration._batch.getIsGeneratedId()
    if (!isGeneratedId) {
      return this.getBatchIdWithoutGenerating()
    }
  }

  /*
   * Get batch id if set by user.
   * do not do eyesInstance.getBatch().getId() because it would generate
   * a new id if called before open.
   */
  getBatchIdWithoutGenerating() {
    // TODO
    // we need the Configuration to check for default values like getEnvValue('BATCH_ID') instead of
    // it creating new Objects (with defaults) on demand, see Configuration#getBatch().
    return (
      (this._configuration._batch && this._configuration._batch.getId()) ||
      GeneralUtils.getEnvValue('BATCH_ID')
    )
  }

  /**
   * @private
   * @return {Promise}
   */
  async _ensureViewportSize() {
    if (!this._isViewportSizeSet) {
      try {
        if (this._viewportSizeHandler.get()) {
          const targetSize = this._viewportSizeHandler.get()
          await this._sessionEventHandlers.setSizeWillStart(targetSize)
          await this.setViewportSize(targetSize)

          // If it's read-only, no point in making the getViewportSize() call..
        } else if (!(this._viewportSizeHandler instanceof ReadOnlyPropertyHandler)) {
          const targetSize = await this.getViewportSize()
          await this._sessionEventHandlers.setSizeWillStart(targetSize)
          this._viewportSizeHandler.set(targetSize)
          this._configuration.setViewportSize(targetSize)
        }

        this._isViewportSizeSet = true
        await this._sessionEventHandlers.setSizeEnded()
      } catch (err) {
        this._logger.verbose('Can not ensure ViewportSize', err)
        this._isViewportSizeSet = false
      }
    }
  }

  /**
   * @private
   * @param {Region} region - The region of the screenshot which will be set in the application output.
   * @param {EyesScreenshot} lastScreenshot - Previous application screenshot (for compression) or `null` if not
   *   available.
   * @param {CheckSettings} checkSettings - The check settings object of the current test.
   * @return {Promise<AppOutputWithScreenshot>} - The updated app output and screenshot.
   */
  async _getAppOutputWithScreenshot(region, lastScreenshot, checkSettings) {
    this._logger.verbose('getting screenshot...')
    let screenshot, screenshotUrl, screenshotBuffer

    // START NOTE (amit): the following is something I'm not proud nor confident of. I copied it from EyesSelenium::getScreenshot, and it is to solve https://trello.com/c/O5sTPAU1. This should be rewritten asap.
    let isMobileDevice, originalPosition
    const positionProvider = this.getPositionProvider()
    if (this._driver) {
      isMobileDevice = await this._driver.isNative

      if (!isMobileDevice && positionProvider) {
        originalPosition = await positionProvider.getState()
      }
    }
    // END NOTE

    // Getting the screenshot (abstract function implemented by each SDK).
    screenshot = await this.getScreenshot()
    this._logger.verbose('Done getting screenshot!')

    if (screenshot) {
      // Cropping by region if necessary
      if (!region.isSizeEmpty()) {
        screenshot = await screenshot.getSubScreenshot(region, false)
        await this._debugScreenshotsProvider.save(screenshot.getImage(), 'SUB_SCREENSHOT')
      }

      const targetBuffer = await screenshot.getImage().getImageBuffer()
      screenshotBuffer = targetBuffer

      if (this._useImageDeltaCompression && lastScreenshot) {
        try {
          this._logger.verbose('Compressing screenshot...')
          const sourceData = await lastScreenshot.getImage().getImageData()
          const targetData = await screenshot.getImage().getImageData()

          screenshotBuffer = ImageDeltaCompressor.compressByRawBlocks(
            targetData,
            targetBuffer,
            sourceData,
          )
          const savedSize = targetBuffer.length - screenshotBuffer.length
          if (savedSize === 0) {
            this._logger.verbose('Compression skipped, because of significant difference.')
          } else {
            this._logger.verbose(`Compression finished, saved size is ${savedSize}.`)
          }
        } catch (err) {
          this._logger.log('Failed to compress screenshot!', err)
        }
      }
    } else {
      this._logger.verbose('getting screenshot url...')
      screenshotUrl = await this.getScreenshotUrl()
      this._logger.verbose('Done getting screenshotUrl!')
    }

    this._logger.verbose('Getting title, domUrl, imageLocation...')
    const title = await this.getTitle()
    let domUrl = await this.getDomUrl()
    const imageLocation = await this.getImageLocation()
    this._logger.verbose('Done getting title, domUrl, imageLocation!')

    if (!domUrl && TypeUtils.getOrDefault(checkSettings.getSendDom(), await this.getSendDom())) {
      // START NOTE (amit): the following is something I'm not proud nor confident of. I copied it from EyesSelenium::getScreenshot, and it is to solve https://trello.com/c/O5sTPAU1. This should be rewritten asap.
      const forceFullPageScreenshot = this._configuration.getForceFullPageScreenshot()
      if ((forceFullPageScreenshot || this._stitchContent) && !isMobileDevice) {
        await positionProvider.setPosition(Location.ZERO)
      }
      // END NOTE

      const domJson = await this.tryCaptureDom()

      domUrl = await this._tryPostDomSnapshot(domJson)
      this._logger.verbose(`domUrl: ${domUrl}`)
    }

    // START NOTE (amit): the following is something I'm not proud nor confident of. I copied it from EyesSelenium::getScreenshot, and it is to solve https://trello.com/c/O5sTPAU1. This should be rewritten asap.
    if (originalPosition) {
      await positionProvider.restoreState(originalPosition)
    }
    // END NOTE

    const appOutput = new AppOutput({
      title,
      screenshot: screenshotBuffer,
      screenshotUrl,
      domUrl,
      imageLocation,
    })
    const result = new AppOutputWithScreenshot(appOutput, screenshot)
    this._logger.verbose('Done!')
    return result
  }

  /**
   * @return {SessionEventHandlers}
   */
  getSessionEventHandlers() {
    return this._sessionEventHandlers
  }

  /**
   * @param {SessionEventHandler} eventHandler
   */
  addSessionEventHandler(eventHandler) {
    this._sessionEventHandlers.addEventHandler(eventHandler)
  }

  /**
   * @param {SessionEventHandler} eventHandler
   */
  removeSessionEventHandler(eventHandler) {
    this._sessionEventHandlers.removeEventHandler(eventHandler)
  }

  clearSessionEventHandlers() {
    this._sessionEventHandlers.clearEventHandlers()
  }

  /**
   * @return {RunningSession} - An object containing data about the currently running session.
   */
  getRunningSession() {
    return this._runningSession
  }

  /**
   * @protected
   * @abstract
   * @return {string} - The base agent id of the SDK.
   */
  getBaseAgentId() {
    throw new TypeError('The method "getBaseAgentId" is not implemented!')
  }

  /**
   * Get the session id.
   *
   * @protected
   * @return {Promise<?string>} - A promise which resolves to the webdriver's session ID.
   */
  async getAUTSessionId() {
    return undefined
  }

  /**
   * @protected
   * @abstract
   * @return {Promise<RectangleSize>} - The viewport size of the AUT.
   */
  async getViewportSize() {
    throw new TypeError('The method is not implemented!')
  }

  /**
   * @protected
   * @abstract
   * @param {RectangleSize} size - The required viewport size.
   * @return {Promise}
   */
  async setViewportSize(_size) {
    // eslint-disable-line no-unused-vars
    throw new TypeError('The method is not implemented!')
  }

  /**
   * The inferred string is in the format "source:info" where source is either "useragent" or "pos".
   * Information associated with a "useragent" source is a valid browser user agent string. Information associated with
   * a "pos" source is a string of the format "process-name;os-name" where "process-name" is the name of the main
   * module of the executed process and "os-name" is the OS name.
   *
   * @protected
   * @abstract
   * @return {Promise<string>} - The inferred environment string or {@code null} if none is available.
   */
  async getInferredEnvironment() {
    throw new TypeError('The method is not implemented!')
  }

  /**
   * An updated screenshot.
   *
   * @protected
   * @abstract
   * @return {Promise<EyesScreenshot>}
   */
  async getScreenshot() {
    throw new TypeError('The method is not implemented!')
  }

  /**
   * An updated screenshot.
   *
   * @protected
   * @return {Promise<?string>}
   */
  async getScreenshotUrl() {
    return undefined
  }

  /**
   * The current title of of the AUT.
   *
   * @protected
   * @abstract
   * @return {Promise<string>}
   */
  async getTitle() {
    throw new TypeError('The method is not implemented!')
  }

  /**
   * A url pointing to a DOM capture of the AUT at the time of screenshot
   *
   * @protected
   * @return {Promise<?string>}
   */
  async getDomUrl() {
    return undefined
  }

  /**
   * The location of the image relative to the logical full page image, when cropping an image e.g. with checkRegion
   *
   * @protected
   * @return {Promise<?Location>}
   */
  async getImageLocation() {
    return undefined
  }

  /**
   * @return {boolean}
   */
  isVisualGrid() {
    return this._isVisualGrid
  }

  /**
   * @ignore
   * @param {boolean} isVisualGrid
   */
  setIsVisualGrid(isVisualGrid) {
    this._isVisualGrid = isVisualGrid
  }
}

module.exports = EyesBase
