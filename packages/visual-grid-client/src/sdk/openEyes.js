'use strict'
const {
  GeneralUtils: {backwardCompatible, cachify},
} = require('@applitools/eyes-common')
const makeCheckWindow = require('./checkWindow')
const makeAbort = require('./makeAbort')
const makeClose = require('./makeClose')
const translateBrowserNameVersion = require('./translateBrowserNameVersion')
const isEmulation = require('./isEmulation')

const {
  initWrappers,
  configureWrappers,
  openWrappers,
  appNameFailMsg,
  apiKeyFailMsg,
} = require('./wrapperUtils')

// This is a map from the value we get from the user to the value we send to the visual grid
// user --> VG
const SUPPORTED_BROWSERS = {
  chrome: 'chrome',
  'chrome-canary': 'chrome-canary',
  firefox: 'firefox',
  ie10: 'ie10',
  ie11: 'ie11',
  edge: 'edge',
  edgelegacy: 'edgelegacy',
  edgechromium: 'edgechromium',
  ie: 'ie',
  safari: 'safari',
  [translateBrowserNameVersion('chrome-1')]: 'chrome-1',
  [translateBrowserNameVersion('chrome-2')]: 'chrome-2',
  [translateBrowserNameVersion('firefox-1')]: 'firefox-1',
  [translateBrowserNameVersion('firefox-2')]: 'firefox-2',
  [translateBrowserNameVersion('safari-1')]: 'safari-1',
  [translateBrowserNameVersion('safari-2')]: 'safari-2',
}
const SUPPORTED_BROWSER_KEYS = Object.keys(SUPPORTED_BROWSERS)
const SUPPORTED_BROWSER_KEYS_STR = `\n* ${SUPPORTED_BROWSER_KEYS.join('\n* ')}\n`

function makeOpenEyes({
  appName: _appName,
  browser: _browser,
  saveDebugData: _saveDebugData,
  batchSequenceName: _batchSequenceName,
  batchSequence: _batchSequence,
  batchName: _batchName,
  batchId: _batchId,
  batchNotify: _batchNotify,
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
  getUserAgents: _getUserAgents,
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
    batchNotify = _batchNotify,
    batch,
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
    getUserAgents = _getUserAgents,
  }) {
    logger.verbose(`openEyes: testName=${testName}, browser=`, browser)

    if (!apiKey) {
      throw new Error(apiKeyFailMsg)
    }

    if (isDisabled) {
      logger.verbose('openEyes: isDisabled=true, skipping checks')
      return {
        checkWindow: disabledFunc('checkWindow'),
        close: disabledFunc('close', []),
        abort: disabledFunc('abort'),
      }
    }

    if (!appName) {
      throw new Error(appNameFailMsg)
    }

    const browsersArray = Array.isArray(browser) ? browser : [browser]
    const browserError = browsersArray.length
      ? browsersArray.map(getBrowserError).find(Boolean)
      : getBrowserError()
    if (browserError) {
      console.log('\x1b[31m', `\nInvalid browser: ${browserError}\n`)
      throw new Error(browserError)
    }

    const browsers = browsersArray.map(browser => ({
      ...browser,
      name: SUPPORTED_BROWSERS[browser.name] || browser.name,
    }))

    ;({batchSequence, baselineBranch, parentBranch, branch, batchNotify} = backwardCompatible(
      [{batchSequenceName}, {batchSequence}],
      [{baselineBranchName}, {baselineBranch}],
      [{parentBranchName}, {parentBranch}],
      [{branchName}, {branch}],
      [{notifyOnCompletion}, {batchNotify}],
      logger,
    ))

    let doGetBatchInfoWithCache
    const getBatchInfoWithCache = batchId => {
      if (!doGetBatchInfoWithCache) {
        const serverConnector = getServerConnector(wrappers)
        doGetBatchInfoWithCache = cachify(serverConnector.batchInfo.bind(serverConnector))
      }
      return doGetBatchInfoWithCache(batchId)
    }

    wrappers =
      wrappers ||
      initWrappers({
        count: browsers.length,
        apiKey,
        logHandler: logger.getLogHandler(),
        getBatchInfoWithCache,
      })

    configureWrappers({
      wrappers,
      browsers,
      isDisabled,
      displayName,
      batchSequence,
      batchName,
      batchId,
      batchNotify,
      batch,
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
    })

    if (!globalState.batchStore.hasCloseBatch()) {
      const serverConnector = getServerConnector(wrappers)
      globalState.batchStore.setCloseBatch(
        serverConnector.deleteBatchSessions.bind(serverConnector),
      )
    }

    const renderInfoPromise = getRenderInfoPromise() || getHandledRenderInfoPromise(getRenderInfo())

    const renderInfo = await renderInfoPromise

    if (renderInfo instanceof Error) {
      throw renderInfo
    }

    logger.verbose('openEyes: opening wrappers')
    const {openEyesPromises, resolveTests} = openWrappers({
      wrappers,
      browsers,
      appName,
      testName,
      eyesTransactionThroat,
      skipStartingSession: isSingleWindow,
    })

    let stepCounter = 0

    let checkWindowPromises = wrappers.map(() => Promise.resolve())
    const testController = globalState.makeTestController({
      testName,
      numOfTests: wrappers.length,
      logger,
    })

    const headers = {'User-Agent': userAgent}
    const createRGridDOMAndGetResourceMapping = args =>
      _createRGridDOMAndGetResourceMapping(Object.assign({fetchOptions: {headers}}, args))

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
      getUserAgents,
    })

    const close = makeClose({
      getCheckWindowPromises,
      openEyesPromises,
      wrappers,
      resolveTests,
      globalState,
      testController,
      logger,
      isSingleWindow,
    })
    const abort = makeAbort({
      getCheckWindowPromises,
      openEyesPromises,
      wrappers,
      resolveTests,
      globalState,
      testController,
      logger,
    })

    return {
      checkWindow,
      close,
      abort,
    }

    function getServerConnector(wrappers) {
      return wrappers[0]._serverConnector
    }

    function getCheckWindowPromises() {
      return checkWindowPromises
    }

    function setCheckWindowPromises(promises) {
      checkWindowPromises = promises
    }

    function disabledFunc(name, rv) {
      return async () => {
        logger.verbose(`${name}: isDisabled=true, skipping checks`)
        return rv
      }
    }

    function getBrowserError(browser) {
      if (!browser) {
        return 'invalid browser configuration provided.'
      }
      if (browser.name && !SUPPORTED_BROWSER_KEYS.includes(browser.name)) {
        return `browser name should be one of the following:${SUPPORTED_BROWSER_KEYS_STR}\nReceived: '${browser.name}'.`
      }
      if (browser.name && !browser.deviceName && (!browser.height || !browser.width)) {
        return `browser '${browser.name}' should include 'height' and 'width' parameters.`
      }
      if (isEmulation(browser) && !isSupportsDeviceEmulation(browser.name)) {
        return `browser '${browser.name}' does not support mobile device emulation. Please remove 'mobile:true' or 'deviceName' from the browser configuration`
      }
    }

    function isSupportsDeviceEmulation(browserName) {
      return !browserName || /^chrome/.test(browserName)
    }
  }
}

module.exports = makeOpenEyes
