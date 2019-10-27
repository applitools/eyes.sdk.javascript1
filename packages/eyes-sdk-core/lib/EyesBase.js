'use strict';

const {
  ArgumentGuard, TypeUtils, EyesError, Region, Location, RectangleSize, CoordinatesType, ImageDeltaCompressor,
  SimplePropertyHandler, ReadOnlyPropertyHandler, FileDebugScreenshotsProvider, NullDebugScreenshotProvider, GeneralUtils
} = require('@applitools/eyes-common');

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
const { MatchWindowData } = require('./match/MatchWindowData');

const { DiffsFoundError } = require('./errors/DiffsFoundError');
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
const { TestResultsStatus } = require('./TestResultsStatus');
const { TestResults } = require('./TestResults');
const { ServerConnector } = require('./server/ServerConnector');

const { EyesAbstract } = require('./EyesAbstract');
const { FailureReports } = require('./FailureReports');
const { AppEnvironment } = require('./AppEnvironment');
const { MatchWindowTask } = require('./MatchWindowTask');
const { MatchSingleWindowTask } = require('./MatchSingleWindowTask');

const USE_DEFAULT_TIMEOUT = -1;

/**
 * Core/Base class for Eyes - to allow code reuse for different SDKs (images, selenium, etc).
 */
class EyesBase extends EyesAbstract {
  /** @var {Logger} EyesBase#_logger */
  /** @var {Configuration} EyesBase#_configuration */

  /**
   * Creates a new {@code EyesBase}instance that interacts with the Eyes Server at the specified url.
   *
   * @param {?string} [serverUrl] - The Eyes server URL.
   * @param {?boolean} [isDisabled=false] - Will be checked <b>before</b> any argument validation. If true, all method
   *   will immediately return without performing any action.
   * @param {Configuration} [configuration]
   */
  constructor(serverUrl, isDisabled, configuration) {
    super(configuration);

    this._configuration.setServerUrl(serverUrl);
    this._configuration.setIsDisabled(isDisabled);

    if (this._configuration.getIsDisabled()) {
      this._userInputs = [];
      return;
    }

    this._initProviders();

    /** @type {ServerConnector} */ this._serverConnector = new ServerConnector(this._logger, this._configuration);
    /** @type {FailureReports} */ this._failureReports = FailureReports.ON_CLOSE;

    /** @type {number} */
    this._validationId = -1;
    /** @type {SessionEventHandlers} */
    this._sessionEventHandlers = new SessionEventHandlers();

    // noinspection JSUnusedGlobalSymbols
    /** @type {RenderWindowTask} */ this._renderWindowTask = new RenderWindowTask(this._logger, this._serverConnector);
    /** @type {MatchWindowTask} */ this._matchWindowTask = undefined;
    /** @type {RunningSession} */ this._runningSession = undefined;
    /** @type {SessionStartInfo} */ this._sessionStartInfo = undefined;

    /** @type {boolean} */ this._shouldMatchWindowRunOnceOnTimeout = undefined;
    /** @type {boolean} */ this._isViewportSizeSet = undefined;

    /** @type {boolean} */ this._isOpen = false;
    /** @type {boolean} */ this._isVisualGrid = false;

    /** @type {boolean} */ this._useImageDeltaCompression = true;
    /** @type {boolean} */ this._render = false;

    /**
     * Will be set for separately for each test.
     * @type {string}
     */
    this._currentAppName = undefined;

    /**
     * The session ID of webdriver instance
     * @type {string}
     */
    this._autSessionId = undefined;

    /**
     * @type {Trigger[]}
     */
    this._userInputs = [];
  }

  // noinspection FunctionWithMoreThanThreeNegationsJS
  /**
   * @param {boolean} [hardReset=false] - If false, init providers only if they're not initialized.
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

  /**
   * @return {?RenderInfo}
   */
  async getRenderingInfo() {
    if (TypeUtils.isNull(this._serverConnector.getRenderingInfo())) {
      return this._serverConnector.renderInfo();
    }

    return this._serverConnector.getRenderingInfo();
  }

  /**
   * @param {RenderingInfo} renderingInfo
   */
  setRenderingInfo(renderingInfo) {
    this._serverConnector.setRenderingInfo(renderingInfo);
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @return {string} - The name of the application under test.
   */
  getAppName() {
    return this._currentAppName || this._configuration.getAppName();
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Clears the user inputs list.
   *
   * @protected
   */
  clearUserInputs() {
    if (this._configuration.getIsDisabled()) {
      return;
    }
    this._userInputs.length = 0;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @protected
   * @return {Trigger[]} - User inputs collected between {@code checkWindowBase} invocations.
   */
  getUserInputs() {
    if (this._configuration.getIsDisabled()) {
      return null;
    }

    return this._userInputs.map(input => Object.assign(Object.create(input), input));
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @param {FailureReports} failureReports - Use one of the values in FailureReports.
   */
  setFailureReports(failureReports) {
    ArgumentGuard.isValidEnumValue(failureReports, FailureReports);
    this._failureReports = failureReports;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @return {FailureReports} - The failure reports setting.
   */
  getFailureReports() {
    return this._failureReports;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @return {string} - The full agent id composed of both the base agent id and the user given agent id.
   */
  getFullAgentId() {
    const agentId = this._configuration.getAgentId();
    if (!agentId) {
      return this.getBaseAgentId();
    }
    // noinspection JSUnresolvedFunction
    return `${agentId} [${this.getBaseAgentId()}]`;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @return {boolean} - Whether a session is open.
   */
  getIsOpen() {
    return this._isOpen;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Manually set the the sizes to cut from an image before it's validated.
   *
   * @param {CutProvider} [cutProvider] - the provider doing the cut.
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
   * @param {number} [scaleRatio=1] - The scale ratio to use, or {@code null} to reset back to automatic scaling.
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
   * @return {number} - The ratio used to scale the images being validated.
   */
  getScaleRatio() {
    return this._scaleProviderHandler.get().getScaleRatio();
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @param {boolean} value - If true, createSession request will return renderingInfo properties
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
   * @param {boolean} saveDebugScreenshots - If true, will save all screenshots to local directory.
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
   * @param {string} pathToSave - Path where you want to save the debug screenshots.
   */
  setDebugScreenshotsPath(pathToSave) {
    this._debugScreenshotsProvider.setPath(pathToSave);
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @return {string} - The path where you want to save the debug screenshots.
   */
  getDebugScreenshotsPath() {
    return this._debugScreenshotsProvider.getPath();
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @param {string} prefix - The prefix for the screenshots' names.
   */
  setDebugScreenshotsPrefix(prefix) {
    this._debugScreenshotsProvider.setPrefix(prefix);
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @return {string} - The prefix for the screenshots' names.
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
        this._logger.verbose('Eyes close ignored. (disabled)');
        return null;
      }

      this._logger.verbose(`EyesBase.close(${throwEx})`);
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
      const save = (isNewSession && this._configuration.getSaveNewTests()) || (!isNewSession && this._configuration.getSaveFailedTests());
      this._logger.verbose(`Automatically save test? ${save}`);

      // Session was started, call the server to end the session.
      const results = await this._serverConnector.stopSession(this._runningSession, false, save);
      results.setIsNew(isNewSession);
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

      results.setServerConnector(this._serverConnector);
      return results;
    } catch (err) {
      this._logger.log(`Failed to abort server session: ${err.message}`);
      throw err;
    } finally {
      // Making sure that we reset the running session even if an exception was thrown during close.
      this._matchWindowTask = null;
      this._autSessionId = undefined;
      this._runningSession = null;
      this._currentAppName = undefined;
      this._logger.getLogHandler().close();
    }
  }

  /**
   * If a test is running, aborts it. Otherwise, does nothing.
   *
   * @alias abort
   * @return {Promise<?TestResults>} - A promise which resolves to the test results.
   */
  async abortIfNotClosed() {
    return this.abort();
  }

  /**
   * If a test is running, aborts it. Otherwise, does nothing.
   *
   * @return {Promise<?TestResults>} - A promise which resolves to the test results.
   */
  async abort() {
    try {
      if (this._configuration.getIsDisabled()) {
        this._logger.verbose('Eyes abort ignored. (disabled)');
        return null;
      }

      this._isOpen = false;

      this._lastScreenshot = null;
      this.clearUserInputs();

      if (!this._runningSession) {
        this._logger.verbose('Closed');
        return null;
      }

      this._logger.verbose('Aborting server session...');
      const testResults = await this._serverConnector.stopSession(this._runningSession, true, false);

      this._logger.log('--- Test aborted.');
      return testResults;
    } catch (err) {
      this._logger.log(`Failed to abort server session: ${err}`);
      return null;
    } finally {
      this._runningSession = null;
      this._logger.getLogHandler().close();
    }
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @return {PositionProvider} - The currently set position provider.
   */
  getPositionProvider() {
    return this._positionProviderHandler.get();
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @param {PositionProvider} positionProvider - The position provider to be used.
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
   * @param {RegionProvider} regionProvider - Returns the region to check or empty region to check the entire window.
   * @param {string} [tag=''] - An optional tag to be associated with the snapshot.
   * @param {boolean} [ignoreMismatch=false] - Whether to ignore this check if a mismatch is found.
   * @param {CheckSettings} [checkSettings] - The settings to use.
   * @param {string} [source] - The tested source page.
   * @return {Promise<MatchResult>} - The result of matching the output with the expected output.
   * @throws DiffsFoundError - Thrown if a mismatch is detected and immediate failure reports are enabled.
   */
  async checkWindowBase(regionProvider, tag = '', ignoreMismatch = false, checkSettings = new CheckSettings(USE_DEFAULT_TIMEOUT), source) {
    if (this._configuration.getIsDisabled()) {
      this._logger.verbose('Ignored');
      const result = new MatchResult();
      result.setAsExpected(true);
      return result;
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
    const matchResult = await EyesBase.matchWindow(regionProvider, tag, ignoreMismatch, checkSettings, this, undefined, source);
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
   * @param {RegionProvider} regionProvider - Returns the region to check or empty rectangle to check the entire window.
   * @param {string} [tag=''] - An optional tag to be associated with the snapshot.
   * @param {boolean} [ignoreMismatch=false] - Whether to ignore this check if a mismatch is found.
   * @param {CheckSettings} [checkSettings] - The settings to use.
   * @return {Promise<TestResults>} - The result of matching the output with the expected output.
   */
  async checkSingleWindowBase(regionProvider, tag = '', ignoreMismatch = false, checkSettings = new CheckSettings(USE_DEFAULT_TIMEOUT)) {
    if (this._configuration.getIsDisabled()) {
      this._logger.verbose('checkSingleWindowBase Ignored');
      const result = new TestResults();
      result.setStatus(TestResultsStatus.Passed);
      return result;
    }

    ArgumentGuard.isValidState(this._isOpen, 'Eyes not open');
    ArgumentGuard.notNull(regionProvider, 'regionProvider');

    await this._ensureViewportSize();

    const appEnvironment = await this.getAppEnvironment();
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
      baselineBranchName: this._configuration.getBaselineBranchName(),
      compareWithParentBranch: this._configuration.getCompareWithParentBranch(),
      ignoreBaseline: this._configuration.getIgnoreBaseline(),
      render: this._render,
      saveDiffs: this._configuration.getSaveDiffs(),
      properties: this._configuration.getProperties(),
    });

    // noinspection JSClosureCompilerSyntax
    const outputProvider = new AppOutputProvider();
    // A callback which will call getAppOutput
    // noinspection AnonymousFunctionJS
    outputProvider.getAppOutput = (region, lastScreenshot, checkSettingsLocal) => (
      this._getAppOutputWithScreenshot(region, lastScreenshot, checkSettingsLocal)
    );

    this._shouldMatchWindowRunOnceOnTimeout = true;
    this._matchWindowTask = new MatchSingleWindowTask(
      this._logger,
      this._serverConnector,
      this._configuration.getMatchTimeout(),
      this,
      outputProvider,
      this._sessionStartInfo,
      this._configuration.getSaveNewTests()
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
   * @return {Promise}
   */
  async beforeMatchWindow() {
    return undefined;
  }

  // noinspection JSMethodCanBeStatic
  /**
   * @protected
   * @return {Promise}
   */
  async afterMatchWindow() {
    return undefined;
  }

  // noinspection JSMethodCanBeStatic
  /**
   * @protected
   * @return {Promise<?string>}
   */
  async tryCaptureDom() {
    return undefined;
  }

  // noinspection JSMethodCanBeStatic, JSUnusedGlobalSymbols
  /**
   * @protected
   * @return {Promise<?string>}
   */
  async getOrigin() {
    return undefined;
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
    this._logger.verbose('EyesBase.replaceWindow - running');

    if (this._configuration.getIsDisabled()) {
      this._logger.verbose('Ignored');
      const result = new MatchResult();
      result.setAsExpected(true);
      return result;
    }

    ArgumentGuard.isValidState(this._isOpen, 'Eyes not open');

    this._logger.verbose('EyesBase.replaceWindow - calling serverConnector.replaceWindow');

    const replaceWindowData = new MatchWindowData({ userInputs, appOutput: new AppOutput({ title, screenshot }), tag });

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
   * @param {string} [source]
   * @return {Promise<MatchResult>}
   */
  static async matchWindow(regionProvider, tag, ignoreMismatch, checkSettings, self, skipStartingSession = false, source) {
    let retryTimeout = -1;

    if (checkSettings) {
      retryTimeout = checkSettings.getTimeout();
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
      ignoreMismatch, checkSettings, retryTimeout, source
    );
  }

  /**
   * @private
   * @param {string} domJson
   * @return {Promise<?string>}
   */
  async _tryPostDomSnapshot(domJson) {
    if (!domJson) {
      return null;
    }

    return this._serverConnector.postDomSnapshot(domJson);
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
   * @param {string} appName - The name of the application under test.
   * @param {string} testName - The test name.
   * @param {RectangleSize|RectangleSizeObject} [viewportSize] - The client's viewport size (i.e., the
   *   visible part of the document's body) or {@code null} to allow any viewport size.
   * @param {SessionType} [sessionType=SessionType.SEQUENTIAL] - The type of test (e.g., Progression for timing tests),
   *   or {@code null} to use the default.
   * @return {Promise}
   */
  async openBase(appName, testName, viewportSize, sessionType = SessionType.SEQUENTIAL) {
    this._logger.getLogHandler().open();

    // noinspection NonBlockStatementBodyJS
    if (viewportSize) this._configuration.setViewportSize(viewportSize);

    try {
      if (this._configuration.getIsDisabled()) {
        this._logger.verbose('Eyes Open ignored - disabled');
        return;
      }

      // If there's no default application name, one must be provided for the current test.
      if (!this._configuration.getAppName()) {
        ArgumentGuard.notNull(appName, 'appName');
      }
      ArgumentGuard.notNull(testName, 'testName');

      this._logger.verbose(`Agent = ${this.getFullAgentId()}`);
      this._logger.verbose(`openBase('${appName}', '${testName}', '${this._configuration.getViewportSize()}')`);

      await this._sessionEventHandlers.testStarted(await this.getAUTSessionId());

      this._validateApiKey();
      this._logOpenBase();
      await this._validateSessionOpen();

      this._initProviders();
      this._isViewportSizeSet = false;
      await this.beforeOpen();

      this._currentAppName = appName || this._configuration.getAppName();
      this._configuration.setTestName(testName);
      this._viewportSizeHandler.set(this._configuration.getViewportSize());
      this._configuration.setSessionType(sessionType);
      this._validationId = -1;

      if (this._configuration.getViewportSize()) {
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
   * @return {Promise}
   */
  async beforeOpen() {
    return undefined;
  }

  // noinspection JSMethodCanBeStatic
  /**
   * @protected
   * @return {Promise}
   */
  async afterOpen() {
    return undefined;
  }

  /**
   * @private
   * @return {Promise}
   */
  async _ensureRunningSession() {
    if (this._runningSession) {
      this._logger.verbose('session already running.');
      return;
    }

    this._logger.verbose('No running session, calling start session...');
    await this.startSession();
    this._logger.setSessionId(this._runningSession.getSessionId());
    this._logger.verbose('Done!');

    // noinspection JSClosureCompilerSyntax
    const outputProvider = new AppOutputProvider();
    // A callback which will call getAppOutput
    outputProvider.getAppOutput = (region, lastScreenshot, checkSettingsLocal) => (
      this._getAppOutputWithScreenshot(region, lastScreenshot, checkSettingsLocal)
    );

    this._matchWindowTask = new MatchWindowTask(
      this._logger,
      this._serverConnector,
      this._runningSession,
      this._configuration.getMatchTimeout(),
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
    this._logger.verbose(`Eyes server URL is '${this._configuration.getServerUrl()}'`);
    this._logger.verbose(`Timeout = '${this._configuration.getConnectionTimeout()}'`);
    this._logger.verbose(`matchTimeout = '${this._configuration.getMatchTimeout()}'`);
    this._logger.verbose(`Default match settings = '${this._configuration.getDefaultMatchSettings()}'`);
    this._logger.verbose(`FailureReports = '${this._failureReports}'`);
  }

  /**
   * @private
   * @return {Promise}
   */
  async _validateSessionOpen() {
    if (this._isOpen) {
      await this.abort();
      const errMsg = 'A test is already running';
      this._logger.log(errMsg);
      throw new Error(errMsg);
    }
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Define the viewport size as {@code size} without doing any actual action on the
   *
   * @param {RectangleSize} explicitViewportSize - The size of the viewport. {@code null} disables the explicit size.
   */
  setExplicitViewportSize(explicitViewportSize) {
    if (!explicitViewportSize) {
      this._viewportSizeHandler = new SimplePropertyHandler();
      this._viewportSizeHandler.set(null);
      this._configuration.setViewportSize(undefined);
      this._isViewportSizeSet = false;
      return;
    }

    this._logger.verbose(`Viewport size explicitly set to ${explicitViewportSize}`);
    this._viewportSizeHandler = new ReadOnlyPropertyHandler(this._logger, new RectangleSize(explicitViewportSize));
    this._configuration.setViewportSize(explicitViewportSize);
    this._isViewportSizeSet = true;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Adds a trigger to the current list of user inputs.
   *
   * @protected
   * @param {Trigger} trigger - The trigger to add to the user inputs list.
   */
  addUserInput(trigger) {
    if (this._configuration.getIsDisabled()) {
      return;
    }

    ArgumentGuard.notNull(trigger, 'trigger');
    this._userInputs.push(trigger);
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
   * @param {MouseTrigger.MouseAction} action - Mouse action.
   * @param {Region} control - The control on which the trigger is activated (location is relative to the window).
   * @param {Location} cursor - The cursor's position relative to the control.
   */
  addMouseTriggerBase(action, control, cursor) {
    if (this._configuration.getIsDisabled()) {
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

    // We don't want to change the objects we received.
    const newControl = new Region(control);
    // Getting the location of the cursor in the screenshot
    let cursorInScreenshot = new Location(cursor);
    // First we need to getting the cursor's coordinates relative to the context (and not to the control).
    cursorInScreenshot.offsetByLocation(newControl.getLocation());
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
      .getIntersectedRegion(newControl, CoordinatesType.SCREENSHOT_AS_IS);

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
   * @return {Promise<AppEnvironment>} - The current application environment.
   */
  async getAppEnvironment() {
    const appEnv = new AppEnvironment();

    // If hostOS isn't set, we'll try and extract and OS ourselves.
    if (this._configuration.getHostOS()) {
      appEnv.setOs(this._configuration.getHostOS());
    }

    if (this._configuration.getHostApp()) {
      appEnv.setHostingApp(this._configuration.getHostApp());
    }

    if (this._configuration.getDeviceInfo()) {
      appEnv.setDeviceInfo(this._configuration.getDeviceInfo());
    }

    if (this._configuration.getHostAppInfo()) {
      appEnv.setHostingAppInfo(this._configuration.getHostAppInfo());
    }

    if (this._configuration.getHostOSInfo()) {
      appEnv.setOsInfo(this._configuration.getHostOSInfo());
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
   * @return {Promise}
   */
  async startSession() {
    this._logger.verbose('startSession()');

    if (this._runningSession) {
      return;
    }

    this._logger.verbose(`Batch is ${this._configuration.getBatch()}`);
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
      baselineBranchName: this._configuration.getBaselineBranchName(),
      compareWithParentBranch: this._configuration.getCompareWithParentBranch(),
      ignoreBaseline: this._configuration.getIgnoreBaseline(),
      render: this._render,
      saveDiffs: this._configuration.getSaveDiffs(),
      properties: this._configuration.getProperties(),
    });

    this._logger.verbose('Starting server session...');
    this._runningSession = await this._serverConnector.startSession(this._sessionStartInfo);
    this._logger.verbose(`Server session ID is ${this._runningSession.getId()}`);

    if (this._runningSession.getRenderingInfo()) {
      this._serverConnector.setRenderingInfo(this._runningSession.getRenderingInfo());
    }

    const testInfo = `'${this._configuration.getTestName()}' of '${this.getAppName()}' "${appEnvironment}`;
    if (this._runningSession.getIsNewSession()) {
      this._logger.log(`--- New test started - ${testInfo}`);
      this._shouldMatchWindowRunOnceOnTimeout = true;
    } else {
      this._logger.log(`--- Test started - ${testInfo}`);
      this._shouldMatchWindowRunOnceOnTimeout = false;
    }
  }

  /**
   * @return {boolean}
   * @private
   */
  _getDontCloseBatches() {
    return GeneralUtils.getEnvValue('DONT_CLOSE_BATCHES', true) || false;
  }

  /**
   * @package
   * @return {Promise}
   */
  async closeBatch() {
    if (this._configuration.getIsDisabled() || this._getDontCloseBatches()) {
      this._logger.verbose('closeBatch Ignored');
      return;
    }

    try {
      if (this._configuration._batch) { // if use .getBatch(), it will create an empty batch. If session is open, batch should exists
        const batchId = this._configuration._batch.getId();
        await this._serverConnector.deleteBatchSessions(batchId);
      } else {
        this._logger.log('Failed to close batch: no batch found.');
      }
    } catch (e) {
      this._logger.log('Failed to close batch: error occurred', e);
    }
  }

  /**
   * @private
   * @return {Promise}
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
          this._configuration.setViewportSize(targetSize);
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
   * @param {Region} region - The region of the screenshot which will be set in the application output.
   * @param {EyesScreenshot} lastScreenshot - Previous application screenshot (for compression) or `null` if not
   *   available.
   * @param {CheckSettings} checkSettings - The check settings object of the current test.
   * @return {Promise<AppOutputWithScreenshot>} - The updated app output and screenshot.
   */
  async _getAppOutputWithScreenshot(region, lastScreenshot, checkSettings) {
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
    let domUrl = await this.getDomUrl();
    const imageLocation = await this.getImageLocation();
    this._logger.verbose('Done getting title, domUrl, imageLocation!');

    if (!domUrl && TypeUtils.getOrDefault(checkSettings.getSendDom(), this.getSendDom())) {
      const domJson = await this.tryCaptureDom();

      domUrl = await this._tryPostDomSnapshot(domJson);
      this._logger.verbose(`domUrl: ${domUrl}`);
    }

    const appOutput = new AppOutput({ title, screenshot: screenshotBuffer, screenshotUrl, domUrl, imageLocation });
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
   * @return {RunningSession} - An object containing data about the currently running session.
   */
  getRunningSession() {
    return this._runningSession;
  }

  // noinspection JSMethodCanBeStatic
  /**
   * @protected
   * @abstract
   * @return {string} - The base agent id of the SDK.
   */
  getBaseAgentId() {
    throw new TypeError('The method is not implemented!');
  }

  // noinspection JSMethodCanBeStatic
  /**
   * Get the session id.
   *
   * @protected
   * @return {Promise<?string>} - A promise which resolves to the webdriver's session ID.
   */
  async getAUTSessionId() {
    return undefined;
  }

  // noinspection JSMethodCanBeStatic
  /**
   * @protected
   * @abstract
   * @return {Promise<RectangleSize>} - The viewport size of the AUT.
   */
  async getViewportSize() {
    throw new TypeError('The method is not implemented!');
  }

  // noinspection JSMethodCanBeStatic
  /**
   * @protected
   * @abstract
   * @param {RectangleSize} size - The required viewport size.
   * @return {Promise}
   */
  async setViewportSize(size) { // eslint-disable-line no-unused-vars
    throw new TypeError('The method is not implemented!');
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
   * @return {Promise<string>} - The inferred environment string or {@code null} if none is available.
   */
  async getInferredEnvironment() {
    throw new TypeError('The method is not implemented!');
  }

  // noinspection JSMethodCanBeStatic
  /**
   * An updated screenshot.
   *
   * @protected
   * @abstract
   * @return {Promise<EyesScreenshot>}
   */
  async getScreenshot() {
    throw new TypeError('The method is not implemented!');
  }

  // noinspection JSMethodCanBeStatic
  /**
   * An updated screenshot.
   *
   * @protected
   * @return {Promise<?string>}
   */
  async getScreenshotUrl() {
    return undefined;
  }

  // noinspection JSMethodCanBeStatic
  /**
   * The current title of of the AUT.
   *
   * @protected
   * @abstract
   * @return {Promise<string>}
   */
  async getTitle() {
    throw new TypeError('The method is not implemented!');
  }

  // noinspection JSMethodCanBeStatic
  /**
   * A url pointing to a DOM capture of the AUT at the time of screenshot
   *
   * @protected
   * @return {Promise<?string>}
   */
  async getDomUrl() {
    return undefined;
  }

  // noinspection JSMethodCanBeStatic
  /**
   * The location of the image relative to the logical full page image, when cropping an image e.g. with checkRegion
   *
   * @protected
   * @return {Promise<?Location>}
   */
  async getImageLocation() {
    return undefined;
  }

  /**
   * @return {boolean}
   */
  isVisualGrid() {
    return this._isVisualGrid;
  }

  /**
   * @ignore
   * @param {boolean} isVisualGrid
   */
  setIsVisualGrid(isVisualGrid) {
    this._isVisualGrid = isVisualGrid;
  }
}

exports.EyesBase = EyesBase;
