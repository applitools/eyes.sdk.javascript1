/* global fetch */
'use strict';

const throatPkg = require('throat');
const {
  Logger,
  GeneralUtils: {backwardCompatible},
} = require('@applitools/eyes-common');
const {ptimeoutWithError} = require('@applitools/functional-commons');
const makeGetAllResources = require('./getAllResources');
const extractCssResources = require('./extractCssResources');
const makeFetchResource = require('./fetchResource');
const createResourceCache = require('./createResourceCache');
const makeWaitForRenderedStatus = require('./waitForRenderedStatus');
const makeGetRenderStatus = require('./getRenderStatus');
const makePutResources = require('./putResources');
const makeRenderBatch = require('./renderBatch');
const makeOpenEyes = require('./openEyes');
const makeCreateRGridDOMAndGetResourceMapping = require('./createRGridDOMAndGetResourceMapping');
const getBatch = require('./getBatch');
const makeCloseBatch = require('./makeCloseBatch');
const makeTestWindow = require('./makeTestWindow');
const transactionThroat = require('./transactionThroat');
const getRenderMethods = require('./getRenderMethods');
const makeGlobalState = require('./globalState');

const {
  createRenderWrapper,
  authorizationErrMsg,
  blockedAccountErrMsg,
  badRequestErrMsg,
} = require('./wrapperUtils');
require('@applitools/isomorphic-fetch');

// TODO when supporting only Node version >= 8.6.0 then we can use ...config for all the params that are just passed on to makeOpenEyes
function makeRenderingGridClient({
  renderWrapper, // for tests
  logger,
  showLogs,
  renderStatusTimeout,
  renderStatusInterval,
  concurrency = Infinity,
  renderConcurrencyFactor = 5,
  appName,
  browser = {width: 1024, height: 768},
  apiKey,
  saveDebugData,
  batchSequenceName,
  batchSequence,
  batchName,
  batchId,
  properties,
  baselineBranchName,
  baselineBranch,
  baselineEnvName,
  baselineName,
  envName,
  ignoreCaret,
  isDisabled,
  matchLevel,
  accessibilityLevel,
  useDom,
  enablePatterns,
  ignoreDisplacements,
  parentBranchName,
  parentBranch,
  branchName,
  branch,
  proxy,
  saveFailedTests,
  saveNewTests,
  compareWithParentBranch,
  ignoreBaseline,
  serverUrl,
  agentId,
  fetchResourceTimeout = 120000,
  userAgent,
  notifyOnCompletion,
  batchNotify,
  globalState: _globalState,
  dontCloseBatches,
}) {
  const openEyesConcurrency = Number(concurrency);

  if (isNaN(openEyesConcurrency)) {
    throw new Error('concurrency is not a number');
  }

  ({batchSequence, baselineBranch, parentBranch, branch, batchNotify} = backwardCompatible(
    [{batchSequenceName}, {batchSequence}],
    [{baselineBranchName}, {baselineBranch}],
    [{parentBranchName}, {parentBranch}],
    [{branchName}, {branch}],
    [{notifyOnCompletion}, {batchNotify}],
    logger,
  ));

  let renderInfoPromise;
  const eyesTransactionThroat = transactionThroat(openEyesConcurrency);
  const renderThroat = throatPkg(openEyesConcurrency * renderConcurrencyFactor);
  logger = logger || new Logger(showLogs, 'visual-grid-client');
  renderWrapper =
    renderWrapper ||
    createRenderWrapper({
      apiKey,
      logHandler: logger.getLogHandler(),
      serverUrl,
      proxy,
      agentId,
    });
  const {
    doGetRenderInfo,
    doRenderBatch,
    doPutResource,
    doGetRenderStatus,
    setRenderingInfo,
  } = getRenderMethods(renderWrapper);
  const resourceCache = createResourceCache();
  const fetchCache = createResourceCache();

  const fetchWithTimeout = (url, opt) =>
    ptimeoutWithError(fetch(url, opt), fetchResourceTimeout, 'fetche timed out');
  const fetchResource = makeFetchResource({logger, fetchCache, fetch: fetchWithTimeout});
  const putResources = makePutResources({doPutResource});
  const renderBatch = makeRenderBatch({
    putResources,
    resourceCache,
    fetchCache,
    logger,
    doRenderBatch,
  });
  const getRenderStatus = makeGetRenderStatus({
    logger,
    doGetRenderStatus,
    getStatusInterval: renderStatusInterval,
  });
  const waitForRenderedStatus = makeWaitForRenderedStatus({
    timeout: renderStatusTimeout,
    logger,
    getRenderStatus,
  });
  const getAllResources = makeGetAllResources({
    resourceCache,
    extractCssResources,
    fetchResource,
    logger,
  });
  const createRGridDOMAndGetResourceMapping = makeCreateRGridDOMAndGetResourceMapping({
    getAllResources,
  });

  const {
    batchId: defaultBatchId,
    batchName: defaultBatchName,
    batchSequence: defaultBatchSequence,
  } = getBatch({batchSequence, batchName, batchId});

  const globalState = _globalState || makeGlobalState({logger});

  const openConfig = {
    appName,
    browser,
    apiKey,
    saveDebugData,
    batchSequence: defaultBatchSequence,
    batchName: defaultBatchName,
    batchId: defaultBatchId,
    properties,
    baselineBranch,
    baselineEnvName,
    baselineName,
    envName,
    ignoreCaret,
    isDisabled,
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
    logger,
    renderBatch,
    waitForRenderedStatus,
    renderThroat,
    getRenderInfoPromise,
    getHandledRenderInfoPromise,
    getRenderInfo,
    createRGridDOMAndGetResourceMapping,
    eyesTransactionThroat,
    agentId,
    userAgent,
    batchNotify,
    globalState,
  };

  const openEyes = makeOpenEyes(openConfig);
  const closeBatch = makeCloseBatch({globalState, dontCloseBatches, isDisabled});
  const testWindow = makeTestWindow(openConfig);

  return {
    openEyes,
    closeBatch,
    globalState,
    testWindow,
  };

  function getRenderInfo() {
    if (!renderWrapper.getApiKey()) {
      renderWrapper.setApiKey(apiKey);
    }

    return doGetRenderInfo();
  }

  function getRenderInfoPromise() {
    return renderInfoPromise;
  }

  function getHandledRenderInfoPromise(promise) {
    renderInfoPromise = promise
      .then(renderInfo => {
        setRenderingInfo(renderInfo);
        return renderInfo;
      })
      .catch(err => {
        if (err.response) {
          if (err.response.status === 401) {
            return new Error(authorizationErrMsg);
          }
          if (err.response.status === 403) {
            return new Error(blockedAccountErrMsg);
          }
          if (err.response.status === 400) {
            return new Error(badRequestErrMsg);
          }
        }

        return err;
      });

    return renderInfoPromise;
  }
}

module.exports = makeRenderingGridClient;
