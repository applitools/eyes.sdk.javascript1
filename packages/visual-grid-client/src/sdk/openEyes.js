'use strict';
const {
  GeneralUtils: {backwardCompatible},
} = require('@applitools/eyes-common');
const makeCheckWindow = require('./checkWindow');
const makeAbort = require('./makeAbort');
const makeClose = require('./makeClose');
const assumeEnvironment = require('./assumeEnvironment');

const {
  initWrappers,
  configureWrappers,
  openWrappers,
  appNameFailMsg,
  apiKeyFailMsg,
} = require('./wrapperUtils');

const SUPPORTED_BROWSERS = ['firefox', 'ie10', 'ie11', 'edge', 'chrome', 'ie', 'safari'];

function makeOpenEyes({
  appName: _appName,
  browser: _browser,
  saveDebugData: _saveDebugData,
  batchSequenceName: _batchSequenceName,
  batchSequence: _batchSequence,
  batchName: _batchName,
  batchId: _batchId,
  properties: _properties,
  baselineBranchName: _baselineBranchName,
  baselineBranch: _baselineBranch,
  baselineEnvName: _baselineEnvName,
  baselineName: _baselineName,
  envName: _envName,
  ignoreCaret: _ignoreCaret,
  isDisabled: _isDisabled,
  matchLevel: _matchLevel,
  accessibilityLevel: _accessibilityLevel,
  useDom: _useDom,
  enablePatterns: _enablePatterns,
  ignoreDisplacements: _ignoreDisplacements,
  parentBranchName: _parentBranchName,
  parentBranch: _parentBranch,
  branchName: _branchName,
  branch: _branch,
  saveFailedTests: _saveFailedTests,
  saveNewTests: _saveNewTests,
  compareWithParentBranch: _compareWithParentBranch,
  ignoreBaseline: _ignoreBaseline,
  userAgent: _userAgent,
  createRGridDOMAndGetResourceMapping: _createRGridDOMAndGetResourceMapping,
  apiKey,
  proxy,
  serverUrl,
  logger,
  renderBatch,
  waitForRenderedStatus,
  renderThroat,
  eyesTransactionThroat,
  getRenderInfoPromise,
  getHandledRenderInfoPromise,
  getRenderInfo,
  agentId,
  notifyOnCompletion: _notifyOnCompletion,
  batchNotify: _batchNotify,
  globalState,
  wrappers: _wrappers,
  isSingleWindow = false,
}) {
  return async function openEyes({
    testName,
    displayName,
    wrappers = _wrappers,
    userAgent = _userAgent,
    appName = _appName,
    browser = _browser,
    saveDebugData = _saveDebugData,
    batchSequenceName = _batchSequenceName,
    batchSequence = _batchSequence,
    batchName = _batchName,
    batchId = _batchId,
    properties = _properties,
    baselineBranchName = _baselineBranchName,
    baselineBranch = _baselineBranch,
    baselineEnvName = _baselineEnvName,
    baselineName = _baselineName,
    envName = _envName,
    ignoreCaret = _ignoreCaret,
    isDisabled = _isDisabled,
    matchLevel = _matchLevel,
    accessibilityLevel = _accessibilityLevel,
    useDom = _useDom,
    enablePatterns = _enablePatterns,
    ignoreDisplacements = _ignoreDisplacements,
    parentBranchName = _parentBranchName,
    parentBranch = _parentBranch,
    branchName = _branchName,
    branch = _branch,
    saveFailedTests = _saveFailedTests,
    saveNewTests = _saveNewTests,
    compareWithParentBranch = _compareWithParentBranch,
    ignoreBaseline = _ignoreBaseline,
    notifyOnCompletion = _notifyOnCompletion,
    batchNotify = _batchNotify,
  }) {
    logger.verbose(`openEyes: testName=${testName}, browser=`, browser);

    if (!apiKey) {
      throw new Error(apiKeyFailMsg);
    }

    if (isDisabled) {
      logger.verbose('openEyes: isDisabled=true, skipping checks');
      return {
        checkWindow: disabledFunc('checkWindow'),
        close: disabledFunc('close', []),
        abort: disabledFunc('abort'),
      };
    }

    if (!appName) {
      throw new Error(appNameFailMsg);
    }

    const browsers = Array.isArray(browser) ? browser : [browser];
    const browserErr = browsers.map(getBrowserError).find(Boolean);
    if (browserErr) {
      console.log('\x1b[31m', `\nInvalid browser: ${browserErr}\n`);
      throw new Error(browserErr);
    }

    ({batchSequence, baselineBranch, parentBranch, branch, batchNotify} = backwardCompatible(
      [{batchSequenceName}, {batchSequence}],
      [{baselineBranchName}, {baselineBranch}],
      [{parentBranchName}, {parentBranch}],
      [{branchName}, {branch}],
      [{notifyOnCompletion}, {batchNotify}],
      logger,
    ));

    wrappers =
      wrappers ||
      initWrappers({count: browsers.length, apiKey, logHandler: logger.getLogHandler()});

    configureWrappers({
      wrappers,
      browsers,
      isDisabled,
      displayName,
      batchSequence,
      batchName,
      batchId,
      properties,
      baselineBranch,
      baselineEnvName,
      baselineName,
      envName,
      ignoreCaret,
      matchLevel,
      accessibilityLevel,
      useDom,
      enablePatterns,
      ignoreDisplacements,
      parentBranch,
      branch,
      proxy,
      saveFailedTests,
      saveNewTests,
      compareWithParentBranch,
      ignoreBaseline,
      serverUrl,
      agentId,
      assumeEnvironment,
      batchNotify,
    });

    if (!globalState.batchStore.hasCloseBatch()) {
      globalState.batchStore.setCloseBatch(
        wrappers[0]._serverConnector.deleteBatchSessions.bind(wrappers[0]._serverConnector),
      );
    }

    const renderInfoPromise =
      getRenderInfoPromise() || getHandledRenderInfoPromise(getRenderInfo());

    const renderInfo = await renderInfoPromise;

    if (renderInfo instanceof Error) {
      throw renderInfo;
    }

    logger.verbose('openEyes: opening wrappers');
    const {openEyesPromises, resolveTests} = openWrappers({
      wrappers,
      browsers,
      appName,
      testName,
      eyesTransactionThroat,
      skipStartingSession: isSingleWindow,
    });

    let stepCounter = 0;

    let checkWindowPromises = wrappers.map(() => Promise.resolve());
    const testController = globalState.makeTestController({
      testName,
      numOfTests: wrappers.length,
      logger,
    });

    const headers = {'User-Agent': userAgent};
    const createRGridDOMAndGetResourceMapping = args =>
      _createRGridDOMAndGetResourceMapping(Object.assign({fetchOptions: {headers}}, args));

    const checkWindow = makeCheckWindow({
      globalState,
      testController,
      saveDebugData,
      createRGridDOMAndGetResourceMapping,
      renderBatch,
      waitForRenderedStatus,
      renderInfo,
      logger,
      getCheckWindowPromises,
      setCheckWindowPromises,
      browsers,
      wrappers,
      renderThroat,
      stepCounter,
      testName,
      openEyesPromises,
      matchLevel,
      accessibilityLevel,
      fetchHeaders: headers,
      isSingleWindow,
    });

    const close = makeClose({
      getCheckWindowPromises,
      openEyesPromises,
      wrappers,
      resolveTests,
      globalState,
      testController,
      logger,
      isSingleWindow,
    });
    const abort = makeAbort({
      getCheckWindowPromises,
      openEyesPromises,
      wrappers,
      resolveTests,
      globalState,
      testController,
      logger,
    });

    return {
      checkWindow,
      close,
      abort,
    };

    function getCheckWindowPromises() {
      return checkWindowPromises;
    }

    function setCheckWindowPromises(promises) {
      checkWindowPromises = promises;
    }

    function disabledFunc(name, rv) {
      return async () => {
        logger.verbose(`${name}: isDisabled=true, skipping checks`);
        return rv;
      };
    }

    function getBrowserError(browser) {
      if (browser.name && !SUPPORTED_BROWSERS.includes(browser.name.replace(/-canary$/, ''))) {
        return `browser name should be one of the following 'chrome', 'firefox', 'safari', 'ie10', 'ie11' or 'edge' but received '${browser.name}'.`;
      }
      if (browser.name && !browser.deviceName && (!browser.height || !browser.width)) {
        return `browser '${browser.name}' should include 'height' and 'width' parameters.`;
      }
    }
  };
}

module.exports = makeOpenEyes;
