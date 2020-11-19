'use strict'

const {
  BatchInfo,
  GeneralUtils: {backwardCompatible, cachify},
  BrowserType,
} = require('@applitools/eyes-sdk-core')
const makeCheckWindow = require('./checkWindow')
const makeAbort = require('./makeAbort')
const makeClose = require('./makeClose')
const isEmulation = require('./isEmulation')
const mapChromeEmulationInfo = require('./mapChromeEmulationInfo')
const getSupportedBrowsers = require('./supportedBrowsers')
const chalk = require('chalk')
const throatPkg = require('throat')

const {
  initWrappers,
  configureWrappers,
  openWrappers,
  appNameFailMsg,
  apiKeyFailMsg,
} = require('./wrapperUtils')

function makeOpenEyes({
  appName: _appName,
  browser: _browser,
  batch: _batch,
  properties: _properties,
  baselineBranchName: _baselineBranchName,
  baselineBranch: _baselineBranch,
  baselineEnvName: _baselineEnvName,
  baselineName: _baselineName,
  envName: _envName,
  ignoreCaret: _ignoreCaret,
  isDisabled: _isDisabled,
  matchLevel: _matchLevel,
  accessibilitySettings: _accessibilitySettings,
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
  createRGridDOMAndGetResourceMapping,
  apiKey,
  proxy,
  serverUrl,
  logger,
  putResources,
  getRenderJobInfo,
  render,
  waitForRenderedStatus,
  eyesTransactionThroat,
  getInitialData,
  agentId,
  globalState,
  wrappers: _wrappers,
  visualGridOptions: _visualGridOptions,
  concurrentRendersPerTest,
}) {
  return async function openEyes({
    testName,
    displayName,
    wrappers = _wrappers,
    userAgent = _userAgent,
    appName = _appName,
    browser = _browser,
    batchSequenceName,
    batchSequence,
    batchName,
    batchId,
    batchNotify,
    batch = _batch,
    properties = _properties,
    baselineBranchName = _baselineBranchName,
    baselineBranch = _baselineBranch,
    baselineEnvName = _baselineEnvName,
    baselineName = _baselineName,
    envName = _envName,
    ignoreCaret = _ignoreCaret,
    isDisabled = _isDisabled,
    matchLevel = _matchLevel,
    accessibilitySettings = _accessibilitySettings,
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
    notifyOnCompletion,
    visualGridOptions = _visualGridOptions,
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

    const supportedBrowsers = getSupportedBrowsers()
    const supportedBrowserKeys = Object.keys(supportedBrowsers)
    const supportedBrowserKeysStr = `\n* ${supportedBrowserKeys
      .filter(x => x !== BrowserType.EDGE)
      .join('\n* ')}\n`

    let browsersArray = Array.isArray(browser) ? browser : [browser]
    browsersArray = browsersArray.map(mapChromeEmulationInfo)
    const browserError = browsersArray.length
      ? browsersArray.map(getBrowserError).find(Boolean)
      : getBrowserError()
    if (browserError) {
      console.log('\x1b[31m', `\nInvalid browser: ${browserError}\n`)
      throw new Error(browserError)
    }

    showBrowserWarning(browsersArray)

    const browsers = browsersArray.map(browser => ({
      ...browser,
      name: supportedBrowsers[browser.name] || browser.name,
    }))

    ;({batchSequence, baselineBranch, parentBranch, branch, batchNotify} = backwardCompatible(
      [{batchSequenceName}, {batchSequence}],
      [{baselineBranchName}, {baselineBranch}],
      [{parentBranchName}, {parentBranch}],
      [{branchName}, {branch}],
      [{notifyOnCompletion}, {batchNotify}],
      logger,
    ))

    const mergedBatch = mergeBatchProperties({
      batch,
      batchId,
      batchName,
      batchSequence,
      batchNotify,
    })

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

    const {renderInfo} = await getInitialData()

    configureWrappers({
      wrappers,
      browsers,
      isDisabled,
      displayName,
      batch: mergedBatch,
      properties,
      baselineBranch,
      baselineEnvName,
      baselineName,
      envName,
      ignoreCaret,
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
      agentId,
    })

    if (!globalState.batchStore.hasCloseBatch()) {
      const serverConnector = getServerConnector(wrappers)
      globalState.batchStore.setCloseBatch(
        serverConnector.deleteBatchSessions.bind(serverConnector),
      )
    }

    logger.verbose('openEyes: opening wrappers')
    const {openEyesPromises, resolveTests} = openWrappers({
      wrappers,
      browsers,
      appName,
      testName,
      eyesTransactionThroat,
      skipStartingSession: false,
    })

    let stepCounter = 0

    let checkWindowPromises = wrappers.map(() => Promise.resolve())
    const testController = globalState.makeTestController({
      testName,
      numOfTests: wrappers.length,
      logger,
    })

    const renderThroat = throatPkg(concurrentRendersPerTest * browsers.length)

    const checkWindow = makeCheckWindow({
      globalState,
      testController,
      createRGridDOMAndGetResourceMapping,
      putResources,
      getRenderJobInfo,
      render,
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
      userAgent,
      visualGridOptions,
      resolveTests,
    })

    const close = makeClose({
      getCheckWindowPromises,
      openEyesPromises,
      wrappers,
      resolveTests,
      globalState,
      testController,
      logger,
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
      if (browser.name && !supportedBrowserKeys.includes(browser.name)) {
        return `browser name should be one of the following:${supportedBrowserKeysStr}\nReceived: '${browser.name}'.`
      }
      if (
        browser.name &&
        !browser.deviceName &&
        !browser.iosDeviceInfo &&
        (!browser.height || !browser.width)
      ) {
        return `browser '${browser.name}' should include 'height' and 'width' parameters.`
      }
      if (isEmulation(browser) && !isSupportsDeviceEmulation(browser.name)) {
        return `browser '${browser.name}' does not support mobile device emulation. Please remove 'mobile:true' or 'deviceName' from the browser configuration`
      }
    }

    function isSupportsDeviceEmulation(browserName) {
      return !browserName || /^chrome/.test(browserName)
    }

    function showBrowserWarning(browsersArr) {
      if (browsersArr.some(({name}) => name === BrowserType.EDGE)) {
        console.log(
          chalk.yellow(
            `The 'edge' option that is being used in your browsers' configuration will soon be deprecated. Please change it to either 'edgelegacy' for the legacy version or to 'edgechromium' for the new Chromium-based version. Please note, when using the built-in BrowserType enum, then the values are BrowserType.EDGE_LEGACY and BrowserType.EDGE_CHROMIUM, respectively.`,
          ),
        )
      }
    }
  }
}

function mergeBatchProperties({batch, batchId, batchName, batchSequence, batchNotify}) {
  const isGeneratedId = batchId !== undefined ? false : batch.getIsGeneratedId()
  return new BatchInfo({
    id: batchId !== undefined ? batchId : batch.getId(),
    name: batchName !== undefined ? batchName : batch.getName(),
    sequenceName: batchSequence !== undefined ? batchSequence : batch.getSequenceName(),
    notifyOnCompletion: batchNotify !== undefined ? batchNotify : batch.getNotifyOnCompletion(),
    isGeneratedId,
  })
}

module.exports = makeOpenEyes
