'use strict';
const makeCheckWindow = require('./checkWindow');
const makeAbort = require('./makeAbort');
const makeClose = require('./makeClose');
const makeTestContorler = require('./makeTestContorler');
const assumeEnvironment = require('./assumeEnvironment');

const {
  initWrappers,
  configureWrappers,
  openWrappers,
  appNameFailMsg,
  apiKeyFailMsg,
} = require('./wrapperUtils');

function makeOpenEyes({
  appName: _appName,
  browser: _browser,
  saveDebugData: _saveDebugData,
  batchSequenceName: _batchSequenceName,
  batchName: _batchName,
  batchId: _batchId,
  properties: _properties,
  baselineBranchName: _baselineBranchName,
  baselineEnvName: _baselineEnvName,
  baselineName: _baselineName,
  envName: _envName,
  ignoreCaret: _ignoreCaret,
  isDisabled: _isDisabled,
  matchLevel: _matchLevel,
  useDom: _useDom,
  enablePatterns: _enablePatterns,
  ignoreDisplacements: _ignoreDisplacements,
  parentBranchName: _parentBranchName,
  branchName: _branchName,
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
}) {
  return async function openEyes({
    testName,
    wrappers,
    userAgent = _userAgent,
    appName = _appName,
    browser = _browser,
    saveDebugData = _saveDebugData,
    batchSequenceName = _batchSequenceName,
    batchName = _batchName,
    batchId = _batchId,
    properties = _properties,
    baselineBranchName = _baselineBranchName,
    baselineEnvName = _baselineEnvName,
    baselineName = _baselineName,
    envName = _envName,
    ignoreCaret = _ignoreCaret,
    isDisabled = _isDisabled,
    matchLevel = _matchLevel,
    useDom = _useDom,
    enablePatterns = _enablePatterns,
    ignoreDisplacements = _ignoreDisplacements,
    parentBranchName = _parentBranchName,
    branchName = _branchName,
    saveFailedTests = _saveFailedTests,
    saveNewTests = _saveNewTests,
    compareWithParentBranch = _compareWithParentBranch,
    ignoreBaseline = _ignoreBaseline,
  }) {
    logger.log(`openEyes: testName=${testName}, browser=`, browser);

    if (!apiKey) {
      throw new Error(apiKeyFailMsg);
    }

    if (isDisabled) {
      logger.log('openEyes: isDisabled=true, skipping checks');
      return {
        checkWindow: disabledFunc('checkWindow'),
        close: disabledFunc('close'),
        abort: disabledFunc('abort'),
      };
    }

    if (!appName) {
      throw new Error(appNameFailMsg);
    }

    const browsers = Array.isArray(browser) ? browser : [browser];
    wrappers =
      wrappers ||
      initWrappers({count: browsers.length, apiKey, logHandler: logger.getLogHandler()});

    configureWrappers({
      wrappers,
      browsers,
      isDisabled,
      batchSequenceName,
      batchName,
      batchId,
      properties,
      baselineBranchName,
      baselineEnvName,
      baselineName,
      envName,
      ignoreCaret,
      matchLevel,
      useDom,
      enablePatterns,
      ignoreDisplacements,
      parentBranchName,
      branchName,
      proxy,
      saveFailedTests,
      saveNewTests,
      compareWithParentBranch,
      ignoreBaseline,
      serverUrl,
      agentId,
      assumeEnvironment,
    });

    const renderInfoPromise =
      getRenderInfoPromise() || getHandledRenderInfoPromise(getRenderInfo());

    const renderInfo = await renderInfoPromise;

    if (renderInfo instanceof Error) {
      throw renderInfo;
    }

    const {openEyesPromises, resolveTests} = openWrappers({
      wrappers,
      browsers,
      appName,
      testName,
      eyesTransactionThroat,
    });

    let stepCounter = 0;

    let checkWindowPromises = wrappers.map(() => Promise.resolve());
    const testController = makeTestContorler({testName, numOfTests: wrappers.length, logger});

    const createRGridDOMAndGetResourceMapping = userAgent
      ? async args =>
          _createRGridDOMAndGetResourceMapping(
            Object.assign({fetchOptions: {headers: {'User-Agent': userAgent}}}, args),
          )
      : _createRGridDOMAndGetResourceMapping;

    const checkWindow = makeCheckWindow({
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
    });

    const close = makeClose({
      getCheckWindowPromises,
      openEyesPromises,
      wrappers,
      resolveTests,
      testController,
      logger,
    });
    const abort = makeAbort({
      getCheckWindowPromises,
      openEyesPromises,
      wrappers,
      resolveTests,
      testController,
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

    function disabledFunc(name) {
      return async () => {
        logger.log(`${name}: isDisabled=true, skipping checks`);
      };
    }
  };
}

module.exports = makeOpenEyes;
