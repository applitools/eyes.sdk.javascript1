/* global fetch */
'use strict'

const {
  BatchInfo,
  Logger,
  GeneralUtils: {backwardCompatible, deprecationWarning},
  RunnerStartedEvent,
} = require('@applitools/eyes-sdk-core')
const {ptimeoutWithError, presult} = require('@applitools/functional-commons')
const makeGetAllResources = require('./getAllResources')
const extractCssResources = require('./extractCssResources')
const makeFetchResource = require('./fetchResource')
const createResourceCache = require('./createResourceCache')
const makeWaitForRenderedStatus = require('./waitForRenderedStatus')
const makeGetRenderStatus = require('./getRenderStatus')
const makePutResources = require('./putResources')
const makeGetRenderJobInfo = require('./getRenderJobInfo')
const makeRender = require('./render')
const makeOpenEyes = require('./openEyes')
const makeCreateRGridDOMAndGetResourceMapping = require('./createRGridDOMAndGetResourceMapping')
const makeCloseBatch = require('./makeCloseBatch')
const makeTestWindow = require('./makeTestWindow')
const transactionThroat = require('./transactionThroat')
const getRenderMethods = require('./getRenderMethods')
const makeGlobalState = require('./globalState')

const {
  createRenderWrapper,
  authorizationErrMsg,
  blockedAccountErrMsg,
  badRequestErrMsg,
} = require('./wrapperUtils')
const getFinalConcurrency = require('./getFinalConcurrency')
require('@applitools/isomorphic-fetch')

// TODO when supporting only Node version >= 8.6.0 then we can use ...config for all the params that are just passed on to makeOpenEyes
function makeRenderingGridClient({
  renderWrapper, // for tests
  logger,
  showLogs,
  renderTimeout,
  renderJobInfoTimeout,
  putResourcesTimeout,
  renderStatusTimeout,
  renderStatusInterval,
  concurrency,
  testConcurrency,
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
  accessibilitySettings,
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
  visualGridOptions,
  concurrentRendersPerTest = 1,
}) {
  if (saveDebugData) {
    deprecationWarning({deprecatedThing: 'saveDebugData', isDead: true})
  }

  let finalConcurrency = getFinalConcurrency({concurrency, testConcurrency})
  let defaultConcurrency
  if (!finalConcurrency) {
    finalConcurrency = defaultConcurrency = 5
  }

  logger = logger || new Logger(showLogs, 'visual-grid-client')
  logger.verbose('vgc concurrency is', finalConcurrency)
  ;({batchSequence, baselineBranch, parentBranch, branch, batchNotify} = backwardCompatible(
    [{batchSequenceName}, {batchSequence}],
    [{baselineBranchName}, {baselineBranch}],
    [{parentBranchName}, {parentBranch}],
    [{branchName}, {branch}],
    [{notifyOnCompletion}, {batchNotify}],
    logger,
  ))

  let initialDataPromise
  const eyesTransactionThroat = transactionThroat(finalConcurrency)
  renderWrapper =
    renderWrapper ||
    createRenderWrapper({
      apiKey,
      logHandler: logger.getLogHandler(),
      serverUrl,
      proxy,
      agentId,
    })
  const {
    doGetRenderInfo,
    doRenderBatch,
    doCheckResources,
    doPutResource,
    doGetRenderStatus,
    setRenderingInfo,
    doGetRenderJobInfo,
    doLogEvents,
  } = getRenderMethods(renderWrapper)
  const resourceCache = createResourceCache()
  const fetchCache = createResourceCache()

  const fetchWithTimeout = (url, opt) =>
    ptimeoutWithError(fetch(url, opt), fetchResourceTimeout, 'fetch timed out')
  const fetchResource = makeFetchResource({logger, fetchCache, fetch: fetchWithTimeout})
  const putResources = makePutResources({
    logger,
    doPutResource,
    doCheckResources,
    fetchCache,
    resourceCache,
    timeout: putResourcesTimeout,
  })
  const render = makeRender({logger, doRenderBatch, timeout: renderTimeout})
  const getRenderJobInfo = makeGetRenderJobInfo({doGetRenderJobInfo, timeout: renderJobInfoTimeout})
  const getRenderStatus = makeGetRenderStatus({
    logger,
    doGetRenderStatus,
    getStatusInterval: renderStatusInterval,
  })
  const waitForRenderedStatus = makeWaitForRenderedStatus({
    timeout: renderStatusTimeout,
    logger,
    getRenderStatus,
  })
  const getAllResources = makeGetAllResources({
    resourceCache,
    extractCssResources,
    fetchResource,
    logger,
  })
  const createRGridDOMAndGetResourceMapping = makeCreateRGridDOMAndGetResourceMapping({
    getAllResources,
  })

  const batch = new BatchInfo({
    name: batchName,
    id: batchId,
    sequenceName: batchSequence,
    notifyOnCompletion: batchNotify,
  })

  const globalState = _globalState || makeGlobalState({logger})

  const openConfig = {
    appName,
    browser,
    apiKey,
    batch,
    properties,
    baselineBranch,
    baselineEnvName,
    baselineName,
    envName,
    ignoreCaret,
    isDisabled,
    matchLevel,
    accessibilitySettings,
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
    putResources,
    getRenderJobInfo,
    render,
    waitForRenderedStatus,
    concurrentRendersPerTest,
    getInitialData,
    createRGridDOMAndGetResourceMapping,
    eyesTransactionThroat,
    agentId,
    userAgent,
    globalState,
    visualGridOptions,
  }

  const openEyes = makeOpenEyes(openConfig)
  const closeBatch = makeCloseBatch({globalState, dontCloseBatches, isDisabled})
  const testWindow = makeTestWindow(openConfig)

  return {
    openEyes,
    closeBatch,
    globalState,
    testWindow,
  }

  async function getInitialData() {
    if (initialDataPromise) return initialDataPromise

    initialDataPromise = doGetInitialData()
    return initialDataPromise
  }

  async function doGetInitialData() {
    if (!renderWrapper.getApiKey()) {
      renderWrapper.setApiKey(apiKey)
    }

    const runnerStaredEvent = RunnerStartedEvent({concurrency, testConcurrency, defaultConcurrency})
    logger.verbose('runnerStartedEvent', runnerStaredEvent)
    const [[err, renderInfo]] = await Promise.all([
      presult(doGetRenderInfo()),
      doLogEvents([runnerStaredEvent]).catch(err =>
        logger.log('error when logging batchStart', err),
      ),
    ])

    if (err) {
      if (err.response) {
        if (err.response.status === 401) {
          throw new Error(authorizationErrMsg)
        }
        if (err.response.status === 403) {
          throw new Error(blockedAccountErrMsg)
        }
        if (err.response.status === 400) {
          throw new Error(badRequestErrMsg)
        }
      }

      throw err
    }

    setRenderingInfo(renderInfo)
    return {renderInfo}
  }
}

module.exports = makeRenderingGridClient
