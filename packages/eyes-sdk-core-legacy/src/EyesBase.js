/**
 * @global
 * @typedef {{triggerType: Triggers.TriggerType, location: Location, mouseAction: Triggers.MouseAction, control: Region}} Trigger
 */
/**
 * @global
 * @typedef {{sessionId: string, legacySessionId: ?string, sessionUrl: string, isNewSession: boolean}} RunningSession
 */
/**
 * @global
 * @typedef {{id: string, name: string, startedAt: string}} BatchInfo
 */
/**
 * @global
 * @typedef {{inferred: string, os: string, hostingApp: string, displaySize: RectangleSize}} AppEnvironment
 */
/**
 * @global
 * @typedef {{agentId: string, appIdOrName: string, scenarioIdOrName: string, batchInfo: BatchInfo, baselineEnvName: string, compareWithParentBranch: boolean, ignoreBaseline: boolean, environmentName: string, environment: AppEnvironment, defaultMatchSettings: {matchLevel: MatchSettings.MatchLevel, ignoreCaret: boolean, ignoreDisplacements: boolean, exact: { minDiffIntensity: number, minDiffWidth: number, minDiffHeight: number, matchThreshold: number}}, branchName: string, parentBranchName: string, baselineBranchName: string, autSessionId: string, properties: object}} SessionStartInfo
 */
/**
 * @global
 * @typedef {{name: string, secretToken: string, status: EyesBase.TestResultsStatus, appName: string, batchName: string, batchId: string, branchName: string, hostOS: string, hostApp: string, hostDisplaySize: RectangleSize, startedAt: Date, duration: number, isNew: boolean, isDifferent: boolean, isAborted: boolean, appUrls: {batch: string, session: string}, apiUrls: {batch: string, session: string}, stepsInfo: {name: string, isDifferent: boolean, hasBaselineImage: boolean, hasCurrentImage: boolean, appUrls: {step: string}, apiUrls: {baselineImage: string, currentImage: string, diffImage: string}}[], steps: number, matches: number, mismatches: number, missing: number, exactMatches: number, strictMatches: number, contentMatches: number, layoutMatches: number, noneMatches: number, url: string}} TestResults
 */

;(function() {
  'use strict'

  var EyesUtils = require('@applitools/eyes-common-legacy'),
    MatchSettings = require('./MatchSettings'),
    ServerConnector = require('./ServerConnector').ServerConnector,
    MatchWindowTask = require('./MatchWindowTask').MatchWindowTask,
    SessionEventHandler = require('./SessionEventHandler'),
    FixedScaleProvider = require('./FixedScaleProvider').FixedScaleProvider,
    NullScaleProvider = require('./NullScaleProvider').NullScaleProvider,
    NullCutProvider = require('./NullCutProvider').NullCutProvider,
    Triggers = require('./Triggers').Triggers,
    Logger = require('./Logger').Logger

  var ImageUtils = EyesUtils.ImageUtils,
    GeneralUtils = EyesUtils.GeneralUtils,
    GeometryUtils = EyesUtils.GeometryUtils,
    ImageDeltaCompressor = EyesUtils.ImageDeltaCompressor,
    SimplePropertyHandler = EyesUtils.SimplePropertyHandler,
    ReadOnlyPropertyHandler = EyesUtils.ReadOnlyPropertyHandler,
    PromiseFactory = EyesUtils.PromiseFactory

  var FailureReport = {
    // Failures are reported immediately when they are detected.
    Immediate: 'Immediate',
    // Failures are reported when tests are completed (i.e., when Eyes.close() is called).
    OnClose: 'OnClose',
  }
  Object.freeze(FailureReport)

  var TestResultsStatus = {
    Passed: 'Passed',
    Unresolved: 'Unresolved',
    Failed: 'Failed',
  }
  Object.freeze(TestResultsStatus)

  /**
   * Utility function for creating the test results object
   *
   * @param {Logger} logger - The logger to use.
   * @param {string} testName - The test's name.
   * @param {string} appName - The application name
   * @param {RunningSession} runningSession - The running session data received from the server.
   * @param {TestResults} serverResults - The tests results data received from the server.
   * @param {boolean} isSaved  - Whether or not the test was automatically saved.
   * @param {boolean} isAborted - Whether or not the test was aborted.
   * @return {TestResults} - A test results object.
   * @private
   */
  var _buildTestResults = function(
    logger,
    testName,
    appName,
    runningSession,
    serverResults,
    isSaved,
    isAborted,
  ) {
    // It's possible that the test wasn't ever started.
    if (!runningSession) {
      logger.log('No running session. Creating empty test results.')
      return {
        name: testName,
        appName: appName,
        steps: 0,
        matches: 0,
        mismatches: 0,
        missing: 0,
        isNew: false,
        sessionId: null,
        legacySessionId: null,
        appUrls: null,
        isPassed: !isAborted,
        isAborted: isAborted,
        isSaved: false,
        stepsInfo: [],
      }
    }

    // If we're here, the test was actually started, and we have results from the server.
    var results = GeneralUtils.clone(serverResults)
    results.isSaved = isSaved

    // for backwards compatibility with outdated servers
    if (!results.status) {
      if (
        results.isNew ||
        (!results.isAborted && !results.isNew && results.mismatches === 0 && results.missing === 0)
      ) {
        results.status = 'Passed'
      } else {
        results.status = 'Unresolved'
      }
    }
    results.isPassed = results.status === 'Passed'

    return results
  }

  /**
   * Notifies all handlers of an event.
   *
   * @param {Logger} logger - A logger to use.
   * @param {PromiseFactory} promiseFactory - The promise factory to use.
   * @param {SessionEventHandler[]} handlers - The list of handlers to be notified.
   * @param {string} eventName - The event to notify
   * @param {...*} [param1] - The first of what may be a list of "hidden" parameters, to be passed to the event
   *                            notification function. May also be undefined.
   * @return {Promise<void>} - A promise which resolves when the event was delivered/failed to all handlers.
   *
   * @private
   */
  var _notifyEvent = function(logger, promiseFactory, handlers, eventName, param1) {
    var args = arguments

    return promiseFactory.makePromise(function(resolve) {
      logger.verbose('notifying event: ', eventName)
      var notificationPromises = []
      for (var i = 0; i < handlers.length; ++i) {
        var currentHanlder = handlers[i]
        // Call the event with the rest of the (hidden) parameters supplied to this function.
        var currentPromise = currentHanlder[eventName]
          .apply(currentHanlder, Array.prototype.slice.call(args, 4))
          .then(null, function(err) {
            if (logger) {
              logger.verbose("'" + eventName + "' notification handler returned an error: " + err)
            }
          })
        notificationPromises.push(currentPromise)
      }

      Promise.all(notificationPromises).then(function() {
        resolve()
      })
    })
  }

  var _createRenderingInfoWithCache = function(createRenderingInfo) {
    let renderingInfoPromise
    return function getRenderingInfo() {
      if (!renderingInfoPromise) {
        renderingInfoPromise = createRenderingInfo()
      }
      return renderingInfoPromise
    }
  }

  /**
   * Core/Base class for Eyes - to allow code reuse for different SDKs (images, selenium, etc).
   *
   * @param {PromiseFactory} [promiseFactory] - An object which will be used for creating deferreds/promises.
   * @param {string} [serverUrl]
   * @param {boolean} [isDisabled]
   * @constructor
   */
  function EyesBase(
    promiseFactory = new PromiseFactory(asyncAction => new Promise(asyncAction), undefined),
    serverUrl = EyesBase.DEFAULT_EYES_SERVER,
    isDisabled = false,
  ) {
    this._promiseFactory = promiseFactory
    this._logger = new Logger()
    this._serverUrl = serverUrl
    this._defaultMatchSettings = new MatchSettings.ImageMatchSettings(
      MatchSettings.MatchLevel.Strict,
    )
    this._compareWithParentBranch = false
    this._ignoreBaseline = false
    this._failureReport = EyesBase.FailureReport.OnClose
    this._userInputs = []
    this._saveNewTests = true
    this._saveFailedTests = false
    this._serverConnector = new ServerConnector({
      promiseFactory,
      serverUrl: this._serverUrl,
      logger: this._logger,
      getAgentId: this._getFullAgentId.bind(this),
    })
    this._positionProvider = null
    this._scaleProviderHandler = new SimplePropertyHandler(new NullScaleProvider())
    this._cutProviderHandler = new SimplePropertyHandler(new NullCutProvider())
    this._isDisabled = isDisabled
    this._defaultMatchTimeout = 2000
    this._agentId = undefined
    this._os = undefined
    this._hostingApp = undefined
    this._baselineEnvName = undefined
    this._environmentName = undefined
    this._testName = null
    this._appName = null
    this.validationId = -1
    this._sessionEventHandlers = []
    this._autSessionId = undefined
    /** @type {{imageBuffer: Buffer, width: number, height: number}} */
    this._lastScreenshot = undefined
    this._saveDebugScreenshots = false
    this._debugScreenshotsPath = null
    this._properties = []

    this.getRenderingInfo = _createRenderingInfoWithCache(
      this._serverConnector.renderInfo.bind(this._serverConnector),
    )
  }

  //noinspection JSUnusedGlobalSymbols
  /**
   * @return {boolean} - Whether eyes are open or not.
   */
  EyesBase.prototype.getIsOpen = function() {
    return this._isOpen
  }

  EyesBase.prototype.addSessionEventHandler = function(eventHandler) {
    eventHandler.promiseFactory = this._promiseFactory
    this._sessionEventHandlers.push(eventHandler)
  }

  /**
   * Set the log handler
   *
   * @param {LogHandler} logHandler
   */
  EyesBase.prototype.setLogHandler = function(logHandler) {
    this._logger.setLogHandler(logHandler)
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @return {LogHandler} - The currently set log handler.
   */
  EyesBase.prototype.getLogHandler = function() {
    return this._logger.getLogHandler()
  }

  //noinspection JSUnusedGlobalSymbols
  /**
   * Sets the current server URL used by the rest client.
   *
   * @param serverUrl  {string} - The URI of the rest server.
   */
  EyesBase.prototype.setServerUrl = function(serverUrl) {
    this._serverUrl = serverUrl
    this._serverConnector.setServerUrl(serverUrl)
  }

  //noinspection JSUnusedGlobalSymbols
  /**
   * @return {string} - The URI of the eyes server.
   */
  EyesBase.prototype.getServerUrl = function() {
    return this._serverConnector.getServerUrl()
  }

  /**
   * Sets the API key of your applitools Eyes account.
   *
   * @param apiKey {string} - The api key to be used.
   * @param [newAuthScheme] {boolean} - Whether or not the server uses the new authentication scheme.
   */
  EyesBase.prototype.setApiKey = function(apiKey, newAuthScheme) {
    this._serverConnector.setApiKey(apiKey, newAuthScheme)
  }

  /**
   * @return {string} - The currently set api key.
   */
  EyesBase.prototype.getApiKey = function() {
    return this._serverConnector.getApiKey()
  }

  /**
   * Whether sessions are removed immediately after they are finished.
   *
   * @param shouldRemove {boolean}
   */
  EyesBase.prototype.setRemoveSession = function(shouldRemove) {
    this._serverConnector.setRemoveSession(shouldRemove)
  }

  /**
   * @return {boolean} - Whether sessions are removed immediately after they are finished.
   */
  EyesBase.prototype.getRemoveSession = function() {
    return this._serverConnector.getRemoveSession()
  }

  //noinspection JSUnusedGlobalSymbols
  /**
   * Sets the user given agent id of the SDK.
   *
   * @param agentId {string} - The agent ID to set.
   */
  EyesBase.prototype.setAgentId = function(agentId) {
    this._agentId = agentId
  }

  /**
   * @return {string} - The user given agent id of the SDK.
   */
  EyesBase.prototype.getAgentId = function() {
    return this._agentId
  }

  //noinspection JSUnusedGlobalSymbols
  /**
   * @return {string}- The user given agent id of the SDK.
   */
  EyesBase.prototype._getFullAgentId = function() {
    //noinspection JSUnresolvedVariable
    if (!this._getBaseAgentId) {
      throw new Error('_getBaseAgentId not implemented!')
    }
    var agentId = this.getAgentId()
    if (!agentId) {
      //noinspection JSUnresolvedFunction
      return this._getBaseAgentId()
    }
    //noinspection JSUnresolvedFunction
    return agentId + ' [' + this._getBaseAgentId() + ']'
  }

  //noinspection JSUnusedGlobalSymbols
  /**
   * Sets the host OS name - overrides the one in the agent string.
   *
   * @param os {string} - The host OS.
   */
  EyesBase.prototype.setHostOS = function(os) {
    this._os = os
  }

  //noinspection JSUnusedGlobalSymbols
  /**
   * @return {string}- The host OS as set by the user.
   */
  EyesBase.prototype.getHostOS = function() {
    return this._os
  }

  //noinspection JSUnusedGlobalSymbols
  /**
   * @deprecated
   * This function is deprecated, please use {@link setHostOS} instead.
   *
   * Sets the host OS name - overrides the one in the agent string.
   *
   * @param os {string} - The host OS.
   */
  EyesBase.prototype.setOs = function(os) {
    this._os = os
  }

  //noinspection JSUnusedGlobalSymbols
  /**
   * @deprecated
   * This function is deprecated, please use {@link getHostOS} instead.
   *
   * @return {string}- The host OS as set by the user.
   */
  EyesBase.prototype.getOs = function() {
    return this._os
  }

  //noinspection JSUnusedGlobalSymbols
  /**
   * Sets the hosting application - overrides the one in the agent string.
   *
   * @param hostingApp {string} - The hosting application.
   */
  EyesBase.prototype.setHostingApp = function(hostingApp) {
    this._hostingApp = hostingApp
  }

  //noinspection JSUnusedGlobalSymbols
  /**
   * @return {string}- The hosting application as set by the user.
   */
  EyesBase.prototype.getHostingApp = function() {
    return this._hostingApp
  }

  //noinspection JSUnusedGlobalSymbols
  /**
   * If specified, determines the baseline to compare with and disables automatic baseline inference.
   *
   * @deprecated - Only available for backward compatibility. See {@link #setBaselineEnvName(string)}.
   * @param baselineName {string} - The hosting application.
   */
  EyesBase.prototype.setBaselineName = function(baselineName) {
    this._logger.log('Baseline environment name: ' + baselineName)

    if (!baselineName) {
      this._baselineEnvName = null
    } else {
      this._baselineEnvName = baselineName.trim()
    }
  }

  //noinspection JSUnusedGlobalSymbols
  /**
   * @deprecated - Only available for backward compatibility. See {@link #getBaselineEnvName()}.
   * @return {string}- The baseline name, if it was specified.
   */
  EyesBase.prototype.getBaselineName = function() {
    return this._baselineEnvName
  }

  //noinspection JSUnusedGlobalSymbols
  /**
   * If not {@code null}, determines the name of the environment of the baseline.
   *
   * @param baselineEnvName {string} - The name of the baseline's environment.
   */
  EyesBase.prototype.setBaselineEnvName = function(baselineEnvName) {
    this._logger.log('Baseline environment name: ' + baselineEnvName)

    if (!baselineEnvName) {
      this._baselineEnvName = null
    } else {
      this._baselineEnvName = baselineEnvName.trim()
    }
  }

  //noinspection JSUnusedGlobalSymbols
  /**
   * If not {@code null}, determines the name of the environment of the baseline.
   *
   * @return {string}- The name of the baseline's environment, or {@code null} if no such name was set.
   */
  EyesBase.prototype.getBaselineEnvName = function() {
    return this._baselineEnvName
  }

  //noinspection JSUnusedGlobalSymbols
  /**
   * If not {@code null} specifies a name for the environment in which the application under test is running.
   *
   * @param envName {string} - The name of the environment of the baseline.
   */
  EyesBase.prototype.setEnvName = function(envName) {
    this._logger.log('Environment name: ' + envName)

    if (!envName) {
      this._environmentName = null
    } else {
      this._environmentName = envName.trim()
    }
  }

  //noinspection JSUnusedGlobalSymbols
  /**
   * If not {@code null} specifies a name for the environment in which the application under test is running.
   *
   * @return {string}- The name of the environment of the baseline, or {@code null} if no such name was set.
   */
  EyesBase.prototype.getEnvName = function() {
    return this._environmentName
  }

  //noinspection JSUnusedGlobalSymbols
  /**
   * Sets the batch in which context future tests will run or {@code null} if tests are to run standalone.
   *
   * @param batchOrName {{id: string, name: string, startedAt: string}|string} - the batch object or batch name
   * @param [batchId] {string} - ID of the batch, should be generated using GeneralUtils.guid()
   * @param [batchDate] {string} - start date of the batch, can be created as new Date().toUTCString()
   */
  EyesBase.prototype.setBatch = function(batchOrName, batchId, batchDate) {
    if (this._isDisabled) {
      this._logger.verbose('Ignored')
      return
    }

    if (typeof batchOrName === 'object') {
      this._batch = batchOrName
    } else {
      this._batch = {
        id: batchId || process.env.APPLITOOLS_BATCH_ID || GeneralUtils.guid(),
        name: batchOrName || process.env.APPLITOOLS_BATCH_NAME,
        startedAt: batchDate || new Date().toUTCString(),
      }
    }
  }

  //noinspection JSUnusedGlobalSymbols
  /**
   * @return {{id: string, name: string, startedAt: string}} - gets the test batch.
   */
  EyesBase.prototype.getBatch = function() {
    if (!this._batch) {
      this._logger.verbose('No batch set')
      this._batch = {
        id: process.env.APPLITOOLS_BATCH_ID || GeneralUtils.guid(),
        name: process.env.APPLITOOLS_BATCH_NAME,
        startedAt: new Date().toUTCString(),
      }
    }

    return this._batch
  }

  //noinspection JSUnusedGlobalSymbols
  /**
   * Set whether or not new tests are saved by default.
   * @param {boolean} shouldSave - True if new tests should be saved by default.
   *                     False otherwise.
   */
  EyesBase.prototype.setSaveNewTests = function(shouldSave) {
    this._saveNewTests = shouldSave
  }

  //noinspection JSUnusedGlobalSymbols
  /**
   *
   * @return {boolean} - True if new tests are saved by default.
   */
  EyesBase.prototype.getSaveNewTests = function() {
    return this._saveNewTests
  }

  //noinspection JSUnusedGlobalSymbols
  /**
   * Set whether or not failed tests are saved by default.
   * @param {boolean} shouldSave - True if failed tests should be saved by
   *                        default, false otherwise.
   */
  EyesBase.prototype.setSaveFailedTests = function(shouldSave) {
    this._saveFailedTests = shouldSave
  }

  //noinspection JSUnusedGlobalSymbols
  /**
   * @return {boolean} - True if failed tests are saved by default.
   */
  EyesBase.prototype.getSaveFailedTests = function() {
    return this._saveFailedTests
  }

  //noinspection JSUnusedGlobalSymbols
  /**
   * Sets the maximal time a match operation tries to perform a match.
   * @param {number} timeout - Timeout in milliseconds.
   */
  EyesBase.prototype.setDefaultMatchTimeout = function(timeout) {
    this._defaultMatchTimeout = timeout
  }

  //noinspection JSUnusedGlobalSymbols
  /**
   *
   * @return {number}- The maximal time in milliseconds a match operation tries to perform a match.
   */
  EyesBase.prototype.getDefaultMatchTimeout = function() {
    return this._defaultMatchTimeout
  }

  /**
   * Activate/Deactivate HTTP client debugging.
   *
   * @param {boolean} isDebug - Whether or not debug mode is active.
   */
  EyesBase.prototype.setDebugMode = function(isDebug) {
    this._serverConnector.setDebugMode(isDebug)
  }

  /**
   * @return {boolean} - Whether or not HTTP client debugging mode is active.
   */
  EyesBase.prototype.getIsDebugMode = function() {
    return this._serverConnector.getIsDebugMode()
  }

  //noinspection JSUnusedGlobalSymbols
  /**
   *
   * @param {FailureReport} mode - Use one of the values in EyesBase.FailureReport.
   */
  EyesBase.prototype.setFailureReport = function(mode) {
    switch (mode) {
      case EyesBase.FailureReport.OnClose:
        this._failureReport = EyesBase.FailureReport.OnClose
        break
      case EyesBase.FailureReport.Immediate:
        this._failureReport = EyesBase.FailureReport.Immediate
        break
      default:
        this._failureReport = EyesBase.FailureReport.OnClose
        break
    }
  }

  //noinspection JSUnusedGlobalSymbols
  /**
   *
   * @return {FailureReport} - The currently set FailureReport.
   */
  EyesBase.prototype.getFailureReport = function() {
    return this._failureReport
  }

  //noinspection JSUnusedGlobalSymbols
  /**
   * @deprecated
   * This function is superseded by {@link setDefaultMatchSettings}.
   *
   * @param {MatchLevel} level - The test-wide match level to use when checking application screenshot with the
   *                           expected output.
   */
  EyesBase.prototype.setMatchLevel = function(level) {
    this._defaultMatchSettings.setMatchLevel(level)
  }

  //noinspection JSUnusedGlobalSymbols
  /**
   * @deprecated
   * This function is superseded by {@link getDefaultMatchSettings}
   *
   * @return {MatchLevel} - The test-wide match level.
   */
  EyesBase.prototype.getMatchLevel = function() {
    //noinspection JSValidateTypes
    return this._defaultMatchSettings.getMatchLevel()
  }

  //noinspection JSUnusedGlobalSymbols
  /**
   * @param {ImageMatchSettings} defaultMatchSettings - The match settings for the session.
   */
  EyesBase.prototype.setDefaultMatchSettings = function(defaultMatchSettings) {
    this._defaultMatchSettings = defaultMatchSettings
  }

  //noinspection JSUnusedGlobalSymbols
  /**
   * @return {ImageMatchSettings}- The match settings for the session.
   */
  EyesBase.prototype.getDefaultMatchSettings = function() {
    return this._defaultMatchSettings
  }

  //noinspection JSUnusedGlobalSymbols
  /**
   * Sets the ignore blinking caret value.
   *
   * @param {boolean} ignoreCaret - The ignore value.
   */
  EyesBase.prototype.setIgnoreCaret = function(ignoreCaret) {
    this._defaultMatchSettings.setIgnoreCaret(ignoreCaret)
  }

  //noinspection JSUnusedGlobalSymbols
  /**
   * @return {boolean} - Whether to ignore or the blinking caret or not when comparing images.
   */
  EyesBase.prototype.getIgnoreCaret = function() {
    var ignoreCaret = this._defaultMatchSettings.getIgnoreCaret()
    return ignoreCaret || true
  }

  /**
   * @return {boolean} - The test-wide ignoreDisplacements to use in match requests.
   */
  EyesBase.prototype.getIgnoreDisplacements = function() {
    return this._defaultMatchSettings.getIgnoreDisplacements()
  }

  /**
   * The test-wide ignoreDisplacements to use.
   *
   * @param {boolean} value - The test-wide ignoreDisplacements to use in match requests.
   */
  EyesBase.prototype.setIgnoreDisplacements = function(value) {
    this._defaultMatchSettings.setIgnoreDisplacements(value)
  }

  //noinspection JSUnusedGlobalSymbols
  /**
   * @return {boolean}- The currently compareWithParentBranch value
   */
  EyesBase.prototype.isCompareWithParentBranch = function() {
    return this._compareWithParentBranch
  }

  //noinspection JSUnusedGlobalSymbols
  /**
   * @param {boolean} compareWithParentBranch - New compareWithParentBranch value, default is false
   */
  EyesBase.prototype.setCompareWithParentBranch = function(compareWithParentBranch) {
    this._compareWithParentBranch = compareWithParentBranch
  }

  //noinspection JSUnusedGlobalSymbols
  /**
   * @return {boolean}- The currently ignoreBaseline value
   */
  EyesBase.prototype.isIgnoreBaseline = function() {
    return this._ignoreBaseline
  }

  //noinspection JSUnusedGlobalSymbols
  /**
   * @param {boolean} ignoreBaseline - New ignoreBaseline value, default is false
   */
  EyesBase.prototype.setIgnoreBaseline = function(ignoreBaseline) {
    this._ignoreBaseline = ignoreBaseline
  }

  //noinspection JSUnusedGlobalSymbols
  /**
   * @return {PositionProvider} - The currently set position provider.
   */
  EyesBase.prototype.getPositionProvider = function() {
    return this._positionProvider
  }

  //noinspection JSUnusedGlobalSymbols
  /**
   * @param {PositionProvider} positionProvider - The position provider to be used.
   */
  EyesBase.prototype.setPositionProvider = function(positionProvider) {
    this._positionProvider = positionProvider
  }

  //noinspection JSUnusedGlobalSymbols
  /**
   * Manually set the the sizes to cut from an image before it's validated.
   *
   * @param {CutProvider} [cutProvider] - the provider doing the cut.
   */
  EyesBase.prototype.setImageCut = function(cutProvider) {
    if (cutProvider) {
      this._cutProviderHandler = new ReadOnlyPropertyHandler(this._logger, cutProvider)
    } else {
      this._cutProviderHandler = new SimplePropertyHandler(new NullCutProvider())
    }
  }

  //noinspection JSUnusedGlobalSymbols
  /**
   * @return {boolean}
   */
  EyesBase.prototype.getIsCutProviderExplicitlySet = function() {
    return this._cutProviderHandler && !(this._cutProviderHandler.get() instanceof NullCutProvider)
  }

  //noinspection JSUnusedGlobalSymbols
  /**
   * @return {number} - The ratio used to scale the images being validated.
   */
  EyesBase.prototype.getScaleRatio = function() {
    return this._scaleProviderHandler.get().getScaleRatio()
  }

  //noinspection JSUnusedGlobalSymbols
  /**
   * Manually set the scale ratio for the images being validated.
   *
   * @param {number} [scaleRatio=1] - The scale ratio to use, or {@code null} to reset back to automatic scaling.
   */
  EyesBase.prototype.setScaleRatio = function(scaleRatio) {
    if (scaleRatio != null) {
      this._scaleProviderHandler = new ReadOnlyPropertyHandler(
        this._logger,
        new FixedScaleProvider(scaleRatio),
      )
    } else {
      this._scaleProviderHandler = new SimplePropertyHandler(new NullScaleProvider())
    }
  }

  //noinspection JSUnusedGlobalSymbols
  /**
   * @param {boolean} saveDebugScreenshots - If true, will save all screenshots to local directory
   * @param {string} pathToSave - Path where you want to save debug screenshots
   */
  EyesBase.prototype.setSaveDebugScreenshots = function(saveDebugScreenshots, pathToSave) {
    this._saveDebugScreenshots = saveDebugScreenshots
    var lastChar = pathToSave.substr(pathToSave.length - 1)
    this._debugScreenshotsPath = lastChar === '/' ? pathToSave : pathToSave + '/'
  }

  //noinspection JSUnusedGlobalSymbols
  /**
   * @return {boolean}
   */
  EyesBase.prototype.getSaveDebugScreenshots = function() {
    return this._saveDebugScreenshots
  }

  //noinspection JSUnusedGlobalSymbols
  /**
   * Sets the branch name.
   *
   * @param branchName {string} - The branch name.
   */
  EyesBase.prototype.setBranchName = function(branchName) {
    this._branchName = branchName
  }

  //noinspection JSUnusedGlobalSymbols
  /**
   * @return {string} - The branch name.
   */
  EyesBase.prototype.getBranchName = function() {
    return this._branchName || process.env.APPLITOOLS_BRANCH
  }

  //noinspection JSUnusedGlobalSymbols
  /**
   * Sets the parent branch name.
   *
   * @param parentBranchName {string} - The parent branch name.
   */
  EyesBase.prototype.setParentBranchName = function(parentBranchName) {
    this._parentBranchName = parentBranchName
  }

  //noinspection JSUnusedGlobalSymbols
  /**
   * @return {string} - The parent branch name.
   */
  EyesBase.prototype.getParentBranchName = function() {
    return this._parentBranchName || process.env.APPLITOOLS_PARENT_BRANCH
  }

  //noinspection JSUnusedGlobalSymbols
  /**
   * Sets the baseline branch under which new branches are created.
   *
   * @param baselineBranchName {String} - Branch name or {@code null} to specify the default branch.
   */
  EyesBase.prototype.setBaselineBranchName = function(baselineBranchName) {
    this._baselineBranchName = baselineBranchName
  }

  //noinspection JSUnusedGlobalSymbols
  /**
   * @return {String} - The name of the baseline branch.
   */
  EyesBase.prototype.getBaselineBranchName = function() {
    return this._baselineBranchName || process.env.APPLITOOLS_BASELINE_BRANCH
  }

  //noinspection JSUnusedGlobalSymbols
  /**
   * Sets the proxy settings to be used by the request module.
   *
   * @param {string} url - The proxy url to be used by the serverConnector. If {@code null} then no proxy is set.
   * @param {string} [username]
   * @param {string} [password]
   */
  EyesBase.prototype.setProxy = function(url, username, password) {
    this._serverConnector.setProxy(url, username, password)
  }

  //noinspection JSUnusedGlobalSymbols
  /**
   * @return {string} - current proxy settings used by the server connector, or {@code null} if no proxy is set.
   */
  EyesBase.prototype.getProxy = function() {
    return this._serverConnector.getProxy()
  }

  //noinspection JSUnusedGlobalSymbols
  /**
   * Used for grouping test results by custom test properties
   *
   * @param {string} name - The name of property
   * @param {string} value - The value of property
   */
  EyesBase.prototype.addProperty = function(name, value) {
    return this._properties.push({name: name, value: value})
  }

  //noinspection JSUnusedGlobalSymbols
  /**
   * @return {?string}- The name of the currently running test.
   */
  EyesBase.prototype.getTestName = function() {
    return this._testName
  }

  //noinspection JSUnusedGlobalSymbols
  /**
   * @return {?string}- The name of the currently tested application.
   */
  EyesBase.prototype.getAppName = function() {
    return this._appName
  }

  //noinspection JSUnusedGlobalSymbols
  /**
   * @return {boolean} - Whether eyes is disabled.
   */
  EyesBase.prototype.getIsDisabled = function() {
    return this._isDisabled
  }

  //noinspection JSUnusedGlobalSymbols
  /**
   * @param isDisabled {boolean} - If true, all interactions with this API will be silently ignored.
   */
  EyesBase.prototype.setIsDisabled = function(isDisabled) {
    this._isDisabled = isDisabled
  }

  //noinspection JSUnusedGlobalSymbols
  /**
   * @return {RunningSession} - An object containing data about the currently running session.
   */
  EyesBase.prototype.getRunningSession = function() {
    return this._runningSession
  }

  // noinspection JSUnusedGlobalSymbols
  EyesBase.prototype.openBase = function(appName, testName, viewportSize) {
    return this.open(appName, testName, viewportSize)
  }

  EyesBase.prototype.open = function(appName, testName, viewportSize) {
    this._logger.getLogHandler().open()
    return this._promiseFactory.makePromise(
      function(resolve, reject) {
        if (this._isDisabled) {
          this._logger.log('Eyes Open ignored - disabled')
          resolve()
          return
        }

        var errMsg
        if (!this._serverConnector.getApiKey()) {
          errMsg = 'API key is missing! Please set it via Eyes.setApiKey'
          this._logger.log(errMsg)
          this._logger.getLogHandler().close()
          reject(new Error(errMsg))
          return
        }

        if (this._isOpen) {
          errMsg = 'A test is already running'
          this._logger.log(errMsg)
          return this.abort().then(function() {
            reject(new Error(errMsg))
          })
        }

        if (!this._renderingInfoPromise) {
          this._renderingInfoPromise = this.getRenderingInfo().then(
            function(renderingInfo) {
              this._serverConnector.setRenderingInfo(renderingInfo)
            }.bind(this),
          )
        }

        this._isOpen = true
        this._userInputs = []
        this._viewportSize = viewportSize
        this._scaleProviderHandler.set(new NullScaleProvider())
        this._testName = testName
        this._appName = appName
        this._validationId = -1
        resolve()
      }.bind(this),
    )
  }

  // TODO - Separate this method to 2 methods, one to be used by "_endTest" and one to be used by "checkWindow".
  /**
   * Creates an error object based on the test results. This method is also used by wrapper SDKs (which is why it is
   * defined as a method) for creating an error for immediate failure reports (i.e., when the user wants
   * to know immediately when a checkWindow returns false).
   *
   * @param {TestResults} results - The TestResults object.
   * @param {string} testName - The test name.
   * @param {string} appName - The application name
   * @return {Error|null} - An error object representing the test.
   */
  EyesBase.buildTestError = function(results, testName, appName) {
    var header,
      message = "Test '" + testName + "' of '" + appName + "'.", // Default
      instructions = 'See details at', // Default
      url = results.appUrls && results.appUrls.session ? results.appUrls.session : ''

    // Specifically handle the build test error
    if (results.status === 'Unresolved' && results.isNew) {
      header = '[EYES: NEW TEST ENDED]'
      instructions = 'It is recommended to review the new baseline at'
    } else if (results.status === 'Unresolved') {
      header = '[EYES: DIFFS FOUND]'
      message = "Test '" + testName + "' of '" + appName + "' detected differences!"
    } else if (results.isAborted) {
      header = '[EYES: TEST ABORTED]'
      // We explicitly check 'asExpected' as this method is also called by "checkWindow" in wrapper SDKs.
    } else if (results.status === 'Failed') {
      header = '[EYES: TEST FAILED]'
    } else {
      // TODO - Do we really need this? (Is there a case when this function is called when a test is not failed/all the above?)
      return null
    }

    message = header + ' ' + message + ' ' + instructions + ' ' + url
    var error = new Error(message + '\r\nResults: ' + JSON.stringify(results))
    error.results = results
    return error
  }

  /**
   * Utility function for ending a session on the server.
   *
   * @param {boolean} isAborted - Whether or not the test was aborted.
   * @param {boolean} throwEx - Whether 'reject' should be called if the results returned from the server indicate
   *   a test failure.
   * @return {Promise<void>} - A promise which resolves (or rejected, dependeing on 'throwEx' and the test result)
   *   after ending the session.
   * @private
   */
  EyesBase.prototype._endSession = function(isAborted, throwEx) {
    return this._promiseFactory.makePromise(
      function(resolve, reject) {
        this._logger.verbose((isAborted ? 'Aborting' : 'Closing') + ' server session...')

        this._isOpen = false
        this._matchWindowTask = undefined

        var autSessionId = this._autSessionId
        this._autSessionId = undefined

        var runningSession = this._runningSession
        this._runningSession = undefined

        // If a session wasn't started, use empty results.
        if (!runningSession) {
          this._logger.log('Closed (server session was not started).')
          var testResults = _buildTestResults(
            this._logger,
            this._testName,
            this._appName,
            undefined,
            undefined,
            false,
            isAborted,
          )
          // TODO - you can remove check after moving getAUTSessionId to open instead of startSession (currently problematic because of wrapping SDK).
          if (autSessionId) {
            return _notifyEvent(
              this._logger,
              this._promiseFactory,
              this._sessionEventHandlers,
              'testEnded',
              autSessionId,
              null,
            ).then(
              function() {
                resolve(testResults)
                this._logger.getLogHandler().close()
              }.bind(this),
            )
          } else {
            resolve(testResults)
            this._logger.getLogHandler().close()
            return
          }
        }

        var save =
          !isAborted &&
          ((runningSession.isNewSession && this._saveNewTests) ||
            (!runningSession.isNewSession && this._saveFailedTests))

        // Session was started, call the server to end the session.
        var serverResults
        return this._serverConnector
          .endSession(runningSession, isAborted, save)
          .then(
            function(serverResults_) {
              serverResults = serverResults_
              var testResults = _buildTestResults(
                this._logger,
                this._testName,
                this._appName,
                runningSession,
                serverResults,
                save,
                isAborted,
              )

              // printing the results
              var flattenedResults = {}
              for (var key of Object.keys(testResults)) {
                flattenedResults[key] = testResults[key]
              }
              this._logger.log('Results:', flattenedResults)

              if (testResults.status === 'Unresolved') {
                if (testResults.isNew) {
                  this._logger.log(
                    '--- New test ended. Please approve the new baseline at ' +
                      runningSession.sessionUrl,
                  )

                  if (throwEx) {
                    return reject(
                      EyesBase.buildTestError(testResults, this._testName, this._appName),
                    )
                  }
                  return resolve(testResults)
                } else {
                  this._logger.log(
                    '--- Failed test ended. See details at ' + runningSession.sessionUrl,
                  )

                  if (throwEx) {
                    return reject(
                      EyesBase.buildTestError(testResults, this._testName, this._appName),
                    )
                  }
                  return resolve(testResults)
                }
              } else if (testResults.status === 'Failed') {
                this._logger.log(
                  '--- Failed test ended. See details at ' + runningSession.sessionUrl,
                )

                if (throwEx) {
                  return reject(EyesBase.buildTestError(testResults, this._testName, this._appName))
                }
                return resolve(testResults)
              } else {
                this._logger.log('--- Test passed. See details at ' + runningSession.sessionUrl)
                return resolve(testResults)
              }
            }.bind(this),
            function(err) {
              serverResults = null
              this._logger.log(err)
              reject(err)
            }.bind(this),
          )
          .then(
            function() {
              return _notifyEvent(
                this._logger,
                this._promiseFactory,
                this._sessionEventHandlers,
                'testEnded',
                autSessionId,
                serverResults,
              )
            }.bind(this),
          )
          .then(
            function() {
              this._logger.getLogHandler().close()
            }.bind(this),
          )
      }.bind(this),
    )
  }

  /**
   * Ends the currently running test.
   *
   * @param {boolean} [throwEx=true] - If true, then the returned promise will 'reject' for failed/aborted tests.
   * @return {Promise<TestResults>} - A promise which resolves/rejects (depending on the value of 'throwEx') to the test results.
   */
  EyesBase.prototype.close = function(throwEx) {
    if (throwEx === undefined) {
      throwEx = true
    }

    this._logger.verbose('EyesBase.close()')
    this._lastScreenshot = null

    if (this._isDisabled) {
      this._logger.log('EyesBase.close ignored - disabled')
      // Create an empty tests results.
      var testResults = _buildTestResults(this._logger, null, null, undefined, null, false, false)
      this._logger.getLogHandler().close()
      return this._promiseFactory.makePromise(function(resolve) {
        resolve(testResults)
      })
    }

    if (!this._isOpen) {
      var errMsg = 'close called with Eyes not open'
      this._logger.log(errMsg)
      this._logger.getLogHandler().close()
      return this._promiseFactory.makePromise(function(resolve, reject) {
        reject(errMsg)
      })
    }

    return this._endSession(false, throwEx)
  }

  /**
   * Aborts the currently running test.
   *
   * @alias abort
   * @return {Promise<TestResults>} - A promise which resolves to the test results.
   */
  EyesBase.prototype.abortIfNotClosed = function() {
    return this.abort()
  }

  /**
   * Aborts the currently running test.
   *
   * @return {Promise<TestResults>} - A promise which resolves to the test results.
   */
  EyesBase.prototype.abort = function() {
    this._logger.verbose('EyesBase.abort()')
    this._lastScreenshot = null

    if (this._isDisabled) {
      this._logger.log('Eyes abort ignored. (disabled)')
      // Create an empty tests results.
      var testResults = _buildTestResults(this._logger, null, null, undefined, null, false, true)
      this._logger.getLogHandler().close()
      return this._promiseFactory.makePromise(function(resolve) {
        resolve(testResults)
      })
    }

    // If open was not called / "close" was already called, there's nothing to do.
    if (!this._isOpen) {
      this._logger.log('Session not open, nothing to do.')
      this._logger.getLogHandler().close()
      return this._promiseFactory.makePromise(function(resolve) {
        resolve()
      })
    }

    return this._endSession(true, false).then(
      function(testResults) {
        return testResults
      },
      function(err) {
        this._logger.log('An error occurred during preform abort: ', err)
      }.bind(this),
    )
  }

  /**
   * The viewport size of the AUT.
   *
   * @abstract
   * @return {Promise<{width: number, height: number}>}
   */
  EyesBase.prototype.getViewportSize = function() {
    throw new Error('getViewportSize method is not implemented!')
  }

  /**
   * @abstract
   * @param {{width: number, height: number}} size - The required viewport size.
   * @return {Promise<void>}
   */
  EyesBase.prototype.setViewportSize = function(size) {
    throw new Error('setViewportSize method is not implemented!')
  }

  /**
   * An updated screenshot.
   *
   * @abstract
   * @return {Promise<EyesScreenshot>}
   */
  EyesBase.prototype.getScreenShot = function() {
    throw new Error('getScreenShot method is not implemented!')
  }

  /**
   * The current title of of the AUT.
   *
   * @abstract
   * @return {Promise<string>}
   */
  EyesBase.prototype.getTitle = function() {
    throw new Error('getTitle method is not implemented!')
  }

  /**
   * @private
   * @param {RegionProvider} regionProvider
   * @param {{imageBuffer: Buffer, width: number, height: number}} lastScreenshot
   * @return {Promise<{appOutput: {screenShot64: string, title: string},
   *                     screenShot: {imageBuffer: Buffer, width: number, height: number}}>}
   */
  function _getAppData(regionProvider, lastScreenshot) {
    /** @type {!EyesBase} */ var that = this
    var screenshot
    return this._promiseFactory.makePromise(function(resolve) {
      that._logger.verbose(
        'EyesBase.checkWindow - getAppOutput callback is running - getting screenshot',
      )
      var data = {appOutput: {}, screenShot: null}
      return that
        .getScreenShot()
        .then(function(eyesScreenshot) {
          that._logger.verbose('EyesBase.checkWindow - getAppOutput received the screenshot')
          if (regionProvider && !GeometryUtils.isRegionEmpty(regionProvider.getRegion())) {
            return eyesScreenshot.getSubScreenshot(
              regionProvider.getRegion(),
              regionProvider.getCoordinatesType(),
              false,
            )
          }
          return eyesScreenshot
        })
        .then(function(eyesScreenshot) {
          data.eyesScreenshot = eyesScreenshot
          screenshot = eyesScreenshot.getImage()
        })
        .then(function() {
          return screenshot.asObject().then(function(imageObj) {
            that._logger.verbose('EyesBase.checkWindow - getAppOutput image is ready')
            data.screenShot = imageObj
            that._logger.verbose('EyesBase.checkWindow - getAppOutput compressing screenshot...')
            return _compressScreenshot64(screenshot, lastScreenshot, that._promiseFactory).then(
              function(compressResult) {
                data.compressScreenshot = compressResult
              },
              function(err) {
                that._logger.verbose(
                  'EyesBase.checkWindow - getAppOutput failed to compress screenshot!',
                  err,
                )
              },
            )
          })
        })
        .then(function() {
          that._logger.verbose('EyesBase.checkWindow - getAppOutput getting title')
          return that.getTitle().then(
            function(title) {
              that._logger.verbose('EyesBase.checkWindow - getAppOutput received the title')
              data.appOutput.title = title
            },
            function() {
              that._logger.verbose(
                'EyesBase.checkWindow - getAppOutput failed to get title. Using "" instead.',
              )
              data.appOutput.title = ''
            },
          )
        })
        .then(function() {
          resolve(data)
        })
    })
  }

  /**
   * @private
   * @param {MutableImage} screenshot
   * @param {{imageBuffer: Buffer, width: number, height: number}} lastScreenshot
   * @param {PromiseFactory} promiseFactory
   * @return {Promise<Buffer>}
   */
  function _compressScreenshot64(screenshot, lastScreenshot, promiseFactory) {
    return promiseFactory.makePromise(function(resolve, reject) {
      var targetData, sourceData

      var promise = promiseFactory.makePromise(function(resolve2) {
        if (lastScreenshot) {
          return ImageUtils.parseImage(lastScreenshot.imageBuffer, promiseFactory)
            .then(function(imageData) {
              sourceData = imageData
              return screenshot.getImageData()
            })
            .then(function(imageData) {
              targetData = imageData
              resolve2()
            })
        } else {
          resolve2()
        }
      })

      promise
        .then(function() {
          return screenshot.getImageBuffer()
        })
        .then(function(targetBuffer) {
          try {
            var compressedBuffer = ImageDeltaCompressor.compressByRawBlocks(
              targetData,
              targetBuffer,
              sourceData,
            )
            resolve(compressedBuffer)
          } catch (err) {
            reject(err)
          }
        })
    })
  }

  //noinspection JSUnusedGlobalSymbols
  EyesBase.prototype.checkWindowBase = function(
    tag,
    ignoreMismatch,
    retryTimeout,
    regionProvider,
    imageMatchSettings,
    source,
  ) {
    return this.checkWindow(
      tag,
      ignoreMismatch,
      retryTimeout,
      regionProvider,
      imageMatchSettings,
      source,
    )
  }

  EyesBase.prototype.checkWindow = function(
    tag,
    ignoreMismatch,
    retryTimeout,
    regionProvider,
    imageMatchSettings,
    source,
  ) {
    tag = tag || ''
    ignoreMismatch = ignoreMismatch || false
    retryTimeout = retryTimeout || -1
    imageMatchSettings = imageMatchSettings || {
      matchLevel: null,
      ignoreCaret: null,
      ignoreDisplacements: null,
      exact: null,
      ignore: [],
      floating: [],
    }

    return this._promiseFactory.makePromise(
      function(resolve, reject) {
        this._logger.verbose('EyesBase.checkWindow - running')
        if (this._isDisabled) {
          this._logger.verbose('Eyes checkWindow ignored - disabled')
          resolve()
          return
        }

        if (!this._isOpen) {
          var errMsg = 'checkWindow called with Eyes not open'
          this._logger.log(errMsg)
          throw new Error(errMsg)
        }

        //noinspection JSUnresolvedFunction
        return this.startSession().then(
          function() {
            this._logger.verbose(
              'EyesBase.checkWindow - session started - creating match window task',
            )
            this._matchWindowTask = new MatchWindowTask(
              this._promiseFactory,
              this._serverConnector,
              this._runningSession,
              this._defaultMatchTimeout,
              _getAppData.bind(this),
              this._waitTimeout.bind(this),
              this._logger,
            )

            //noinspection JSLint
            var validationInfo = new SessionEventHandler.ValidationInfo()
            validationInfo.validationId = ++this._validationId
            validationInfo.tag = tag
            // default result
            var validationResult = new SessionEventHandler.ValidationResult()

            // copy matchLevel and exact from defaultMatchSettings
            if (!imageMatchSettings.matchLevel) {
              imageMatchSettings.matchLevel = this._defaultMatchSettings.getMatchLevel()
            }
            if (!imageMatchSettings.ignoreCaret) {
              imageMatchSettings.ignoreCaret = this._defaultMatchSettings.isIgnoreCaret()
            }
            if (!imageMatchSettings.ignoreDisplacements) {
              imageMatchSettings.ignoreDisplacements = this._defaultMatchSettings.getIgnoreDisplacements()
            }
            if (!imageMatchSettings.exact && this._defaultMatchSettings.getExact()) {
              var exactObj = this._defaultMatchSettings.getExact()
              imageMatchSettings.exact = {
                minDiffIntensity: exactObj.getMinDiffIntensity(),
                minDiffWidth: exactObj.getMinDiffWidth(),
                minDiffHeight: exactObj.getMinDiffHeight(),
                matchThreshold: exactObj.getMatchThreshold(),
              }
            }
            return _notifyEvent(
              this._logger,
              this._promiseFactory,
              this._sessionEventHandlers,
              'validationWillStart',
              this._autSessionId,
              validationInfo,
            )
              .then(
                function() {
                  return this._renderingInfoPromise
                }.bind(this),
              )
              .then(
                function() {
                  this._logger.verbose('EyesBase.checkWindow - calling matchWindowTask.matchWindow')
                  return this._matchWindowTask.matchWindow(
                    this._userInputs,
                    this._lastScreenshot,
                    regionProvider,
                    tag,
                    this._shouldMatchWindowRunOnceOnTimeout,
                    ignoreMismatch,
                    retryTimeout,
                    imageMatchSettings,
                    source,
                  )
                }.bind(this),
              )
              .then(
                function(result) {
                  this._logger.verbose('EyesBase.checkWindow - match window returned result.')

                  validationResult.asExpected = result.asExpected

                  if (!result.asExpected) {
                    if (!ignoreMismatch) {
                      this._userInputs = []
                      this._lastScreenshot = result.screenshot
                    }

                    this._logger.verbose(
                      'EyesBase.checkWindow - match window result was not success',
                    )
                    this._shouldMatchWindowRunOnceOnTimeout = true

                    if (!this._runningSession.isNewSession) {
                      this._logger.log('Mismatch!', tag)
                    }

                    if (this._failureReport === EyesBase.FailureReport.Immediate) {
                      var error = EyesBase.buildTestError(
                        result,
                        this._sessionStartInfo.scenarioIdOrName,
                        this._sessionStartInfo.appIdOrName,
                      )
                      this._logger.log(error.message)
                      return reject(error)
                    }
                  } else {
                    // Match successful
                    this._userInputs = []
                    this._lastScreenshot = result.screenshot
                  }

                  delete result.screenshot
                  resolve(result)
                }.bind(this),
                function(err) {
                  this._logger.log(err)
                  validationResult.asExpected = false
                  reject(err)
                }.bind(this),
              )
              .then(
                function() {
                  return _notifyEvent(
                    this._logger,
                    this._promiseFactory,
                    this._sessionEventHandlers,
                    'validationEnded',
                    this._autSessionId,
                    validationInfo.validationId,
                    validationResult,
                  )
                }.bind(this),
              )
          }.bind(this),
          function(err) {
            this._logger.log(err)
            reject(err)
          }.bind(this),
        )
      }.bind(this),
    )
  }

  //noinspection JSValidateJSDoc
  /**
   * Replaces an actual image in the current running session.
   * @param {number} stepIndex - The zero based index of the step in which to replace the actual image.
   * @param {Buffer} screenshot - The PNG bytes of the updated screenshot.
   * @param {string} [tag] - The updated tag for the step.
   * @param {string} [title] - The updated title for the step.
   * @param {Trigger[]} [userInputs] - The updated userInputs for the step.
   * @return {Promise<void>} - A promise which resolves when replacing is done, or rejects on error.
   */
  EyesBase.prototype.replaceWindow = function(stepIndex, screenshot, tag, title, userInputs) {
    tag = tag || ''
    title = title || ''
    userInputs = userInputs || []

    return this._promiseFactory.makePromise(
      function(resolve, reject) {
        this._logger.verbose('EyesBase.replaceWindow - running')
        if (this._isDisabled) {
          this._logger.verbose('Eyes replaceWindow ignored - disabled')
          resolve()
          return
        }

        if (!this._isOpen) {
          var errMsg = 'replaceWindow called with Eyes not open'
          this._logger.log(errMsg)
          throw new Error(errMsg)
        }

        this._logger.verbose('EyesBase.replaceWindow - calling serverConnector.replaceWindow')
        var screenshot64 = screenshot.toString('base64')
        var replaceWindowData = {
          userInputs: userInputs,
          tag: tag,
          appOutput: {
            title: title,
            screenshot64: screenshot64,
          },
        }
        return this._serverConnector
          .replaceWindow(this._runningSession, stepIndex, replaceWindowData, screenshot)
          .then(
            function() {
              this._logger.verbose('EyesBase.replaceWindow done')
              resolve()
            }.bind(this),
            function(err) {
              this._logger.log(err)
              reject(err)
            }.bind(this),
          )
      }.bind(this),
    )
  }

  EyesBase.prototype.startSession = function() {
    return this._promiseFactory.makePromise(
      function(resolve, reject) {
        this._logger.verbose('startSession()')

        if (this._runningSession) {
          resolve()
          return
        }

        var inferredEnv = null
        return this.getAUTSessionId()
          .then(
            function(autSessionId) {
              this._autSessionId = autSessionId
            }.bind(this),
          )
          .then(
            function() {
              return _notifyEvent(
                this._logger,
                this._promiseFactory,
                this._sessionEventHandlers,
                'testStarted',
                this._autSessionId,
              )
            }.bind(this),
          )
          .then(
            function() {
              return _notifyEvent(
                this._logger,
                this._promiseFactory,
                this._sessionEventHandlers,
                'setSizeWillStart',
                this._autSessionId,
                this._viewportSize,
              )
            }.bind(this),
          )
          .then(
            function() {
              return this._viewportSize
                ? this.setViewportSize(this._viewportSize)
                : this.getViewportSize()
            }.bind(this),
          )
          .then(
            function(vpSizeResult) {
              this._viewportSize = this._viewportSize || vpSizeResult
              if (!this._viewportSize) {
                throw new Error("ViewportSize can't be null.")
              }
              return _notifyEvent(
                this._logger,
                this._promiseFactory,
                this._sessionEventHandlers,
                'setSizeEnded',
                this._autSessionId,
              )
            }.bind(this),
            function(err) {
              this._logger.log(err)
              reject(err)
              return _notifyEvent(
                this._logger,
                this._promiseFactory,
                this._sessionEventHandlers,
                'setSizeEnded',
                this._autSessionId,
              ).then(function() {
                // Throw to skip execution of all consecutive "then" blocks.
                throw new Error('Failed to set/get viewport size.')
              })
            }.bind(this),
          )
          .then(
            function() {
              return _notifyEvent(
                this._logger,
                this._promiseFactory,
                this._sessionEventHandlers,
                'initStarted',
                this._autSessionId,
              )
            }.bind(this),
          )
          .then(
            function() {
              // getInferredEnvironment is implemented in the wrapping SDK.
              return this.getInferredEnvironment().then(
                function(inferredEnv_) {
                  inferredEnv = inferredEnv_
                },
                function(err) {
                  this._logger.log(err)
                }.bind(this),
              )
            }.bind(this),
          )
          .then(
            function() {
              return _notifyEvent(
                this._logger,
                this._promiseFactory,
                this._sessionEventHandlers,
                'initEnded',
                this._autSessionId,
              )
            }.bind(this),
          )
          .then(
            function() {
              var testBatch = this.getBatch()

              //noinspection JSUnresolvedFunction
              var appEnv = {
                os: this._os || null,
                hostingApp: this._hostingApp || null,
                displaySize: this._viewportSize,
                inferred: inferredEnv,
              }

              var exactObj = this._defaultMatchSettings.getExact()
              var exact = null
              if (exactObj) {
                exact = {
                  minDiffIntensity: exactObj.getMinDiffIntensity(),
                  minDiffWidth: exactObj.getMinDiffWidth(),
                  minDiffHeight: exactObj.getMinDiffHeight(),
                  matchThreshold: exactObj.getMatchThreshold(),
                }
              }
              var defaultMatchSettings = {
                matchLevel: this._defaultMatchSettings.getMatchLevel(),
                ignoreCaret: this._defaultMatchSettings.isIgnoreCaret(),
                ignoreDisplacements: this._defaultMatchSettings.getIgnoreDisplacements(),
                exact: exact,
              }
              this._sessionStartInfo = {
                agentId: this._getFullAgentId(),
                appIdOrName: this._appName,
                scenarioIdOrName: this._testName,
                batchInfo: testBatch,
                baselineEnvName: this._baselineEnvName,
                compareWithParentBranch: this._compareWithParentBranch,
                ignoreBaseline: this._ignoreBaseline,
                environmentName: this._environmentName,
                environment: appEnv,
                defaultMatchSettings: defaultMatchSettings,
                branchName: this.getBranchName(),
                parentBranchName: this.getParentBranchName(),
                baselineBranchName: this.getBaselineBranchName(),
                autSessionId: this._autSessionId,
                properties: this._properties,
              }

              return this._serverConnector.startSession(this._sessionStartInfo).then(
                function(result) {
                  this._logger.getLogHandler().setSessionId(result.sessionId)
                  this._runningSession = result
                  this._shouldMatchWindowRunOnceOnTimeout = result.isNewSession
                  resolve()
                }.bind(this),
                function(err) {
                  this._logger.log(err)
                  reject(err)
                }.bind(this),
              )
            }.bind(this),
            function(err) {
              reject(err)
            },
          )
      }.bind(this),
    )
  }

  EyesBase.prototype.addKeyboardTrigger = function(control, text) {
    this._logger.verbose('addKeyboardTrigger called with text:', text, 'for control:', control)

    if (!this._matchWindowTask) {
      this._logger.verbose('addKeyboardTrigger: No screen shot - ignoring text:', text)
      return
    }

    if (control.width > 0 && control.height > 0) {
      var sb = this._matchWindowTask.getLastScreenshotBounds()
      control = GeometryUtils.intersect(control, sb)
      if (control.width === 0 || control.height === 0) {
        this._logger.verbose('addKeyboardTrigger: out of bounds - ignoring text:', text)
        return
      }

      // Even after we intersected the control, we need to make sure it's location
      // is based on the last screenshot location (remember it might be with offset).
      control.left -= sb.left
      control.top -= sb.top
    }

    var trigger = Triggers.createTextTrigger(control, text)
    this._userInputs.push(trigger)
    this._logger.verbose('AddKeyboardTrigger: Added', trigger)
  }

  EyesBase.prototype.addMouseTrigger = function(mouseAction, control, cursor) {
    if (!this._matchWindowTask) {
      this._logger.verbose('addMouseTrigger: No screen shot - ignoring event')
      return
    }

    var sb = this._matchWindowTask.getLastScreenshotBounds()
    cursor.x += control.left
    cursor.y += control.top
    if (!GeometryUtils.isRegionContainsLocation(sb, cursor)) {
      this._logger.verbose('AddMouseTrigger: out of bounds - ignoring mouse event')
      return
    }

    control = GeometryUtils.intersect(control, sb)
    if (control.width > 0 && control.height > 0) {
      cursor.x -= control.left
      cursor.y -= control.top
      control.left -= sb.left
      control.top -= sb.top
    } else {
      cursor.x -= sb.left
      cursor.y -= sb.top
    }

    var trigger = Triggers.createMouseTrigger(mouseAction, control, cursor)
    this._userInputs.push(trigger)

    this._logger.verbose('AddMouseTrigger: Added', trigger)
  }

  /**
   * @return {PromiseFactory}
   */
  EyesBase.prototype.getPromiseFactory = function() {
    return this._promiseFactory
  }

  /**
   * @param {...any} args
   */
  EyesBase.prototype.log = function(...args) {
    this._logger.log(...args)
  }

  EyesBase.DEFAULT_EYES_SERVER = 'https://eyesapi.applitools.com'
  EyesBase.FailureReport = FailureReport
  EyesBase.TestResultsStatus = TestResultsStatus

  exports.EyesBase = EyesBase
})()
