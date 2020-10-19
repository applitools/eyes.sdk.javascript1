'use strict'
const {
  MatchResult,
  TestResults,
  RenderStatusResults,
  RenderStatus,
  Location,
  Region,
} = require('@applitools/eyes-sdk-core')
const {URL} = require('url')
const {loadJsonFixture, loadFixtureBuffer} = require('./loadFixture')
const SOME_BATCH = 'SOME_BATCH'
const getSha256Hash = require('./getSha256Hash')
const FakeRunningRender = require('./FakeRunningRender')
const EventEmitter = require('events')

let salt = 0

function compare(o1, o2) {
  return JSON.stringify(o1) === JSON.stringify(o2)
}

const devices = {
  'iPhone 4': {width: 320, height: 480},
}

const selectorsToLocations = {
  sel1: {x: 1, y: 2, width: 3, height: 4},
  sel2: {x: 5, y: 6, width: 7, height: 8},
  sel3: {x: 100, y: 101, width: 102, height: 103},
  sel4: {x: 200, y: 201, width: 202, height: 203},
  sel5: {x: 300, y: 301, width: 302, height: 303},
  sel6: {x: 400, y: 401, width: 402, height: 403},
  sel7: {x: 500, y: 501, width: 502, height: 503},
  sel8: {x: 600, y: 601, width: 602, height: 603},
  sel9: {x: 604, y: 604, width: 604, height: 604},
  sel10: {x: 605, y: 605, width: 605, height: 605},
}

class FakeEyesWrapper extends EventEmitter {
  constructor({
    goodFilename,
    goodResourceUrls = [],
    goodTags,
    goodResources = [],
    closeErr = false,
    failRender,
    batchId = '1',
  }) {
    super()
    this._logger = {
      verbose: console.log,
      log: console.log,
    }
    this.goodFilename = goodFilename
    this.goodResourceUrls = goodResourceUrls
    this.goodResources = goodResources
    this.goodTags = goodTags
    this.batch
    this.batchId = batchId
    this.baseUrl = 'http://fake'
    this.resultsRoute = '/results_url'
    this.stitchingServiceUrl = '/stitching_service'
    this.matchLevel = 'Strict'
    this.closeErr = closeErr
    this.failRender = failRender
    this._serverConnector = {deleteBatchSessions: () => {}}
  }

  async open(...args) {
    this.results = []
    return new Promise(res =>
      setTimeout(() => {
        this.emit('openEnd', args)
        res()
      }, 100),
    )
  }

  async renderBatch(renderRequests) {
    if (this.failRender) {
      throw new Error('render error')
    }
    const renderInfo = renderRequests[0].getRenderInfo()
    this.sizeMode = renderInfo.getSizeMode()
    this.selector = renderInfo.getSelector()
    this.region = renderInfo.getRegion()
    this.emulationInfo = renderInfo.getEmulationInfo()
    this.iosDeviceInfo = renderInfo.getIosDeviceInfo()
    this.selectorsToFindRegionsFor = renderRequests[0].getSelectorsToFindRegionsFor()
    this.platform = renderRequests[0].getPlatform()

    return renderRequests.map(renderRequest => this.getRunningRenderForRequest(renderRequest))
  }

  getRunningRenderForRequest(renderRequest) {
    const resources = renderRequest.getResources()
    const actualResources = resources.map(resource => ({
      url: resource.getUrl(),
      hashOrErrorStatusCode: resource.getErrorStatusCode() || resource.getSha256Hash(),
    }))
    const isGoodResources =
      !actualResources.length ||
      this.getExpectedResources().every(er => !!actualResources.find(ar => compare(er, ar)))

    const cdt = JSON.parse(
      renderRequest
        .getDom()
        .getContent()
        .toString(),
    ).domNodes
    const isGoodCdt = cdt.length === 0 || compare(cdt, this.getExpectedCdt()) // allowing [] for easier testing (only need to pass `cdt:[]` in the test)
    const renderInfo = renderRequest.getRenderInfo()
    const sizeMode = renderInfo.getSizeMode()
    const browserName = renderRequest.getBrowserName()
    const selector = renderInfo.getSelector()
    const region = renderInfo.getRegion()
    const emulationInfo = renderInfo.getEmulationInfo()
    const iosDeviceInfo = renderInfo.getIosDeviceInfo()
    const selectorsToFindRegionsFor = renderRequest.getSelectorsToFindRegionsFor()
    const platform = renderRequest.getPlatform()
    const visualGridOptions = renderRequest.getVisualGridOptions()

    const isGood = isGoodCdt && isGoodResources
    const renderId = JSON.stringify({
      isGood,
      region,
      browserName,
      selector,
      sizeMode,
      emulationInfo,
      iosDeviceInfo,
      selectorsToFindRegionsFor,
      platform,
      visualGridOptions,
      salt: salt++,
    })

    return new FakeRunningRender(renderId, RenderStatus.RENDERED)
  }

  async getRenderStatus(renderIds) {
    return renderIds.map(renderId => {
      const {browserName, emulationInfo, iosDeviceInfo, selectorsToFindRegionsFor} = JSON.parse(
        renderId,
      )
      const deviceName =
        emulationInfo && emulationInfo.deviceName
          ? emulationInfo.deviceName
          : iosDeviceInfo
          ? iosDeviceInfo.deviceName
          : undefined

      return new RenderStatusResults({
        status: RenderStatus.RENDERED,
        imageLocation: renderId,
        userAgent: browserName,
        deviceSize: deviceName && devices[deviceName],
        selectorRegions: selectorsToFindRegionsFor
          ? selectorsToFindRegionsFor.map(selector => [
              selectorsToLocations[selector.selector || selector],
            ])
          : undefined,
      })
    })
  }

  async getRenderInfo() {
    return {
      getResultsUrl: () => `${this.baseUrl}${this.resultsRoute}`,
      getStitchingServiceUrl: () => `${this.baseUrl}${this.stitchingServiceUrl}`,
    }
  }

  setRenderingInfo(val) {
    this.renderingInfo = val
  }

  async putResource() {}

  async getUserAgents() {
    return {
      chrome: 'chrome-ua',
      'chrome-1': 'chrome-1-ua',
      'chrome-2': 'chrome-2-ua',
      firefox: 'firefox-ua',
      'firefox-1': 'firefox-1-ua',
      'firefox-2': 'firefox-2-ua',
      safari: 'safari-ua',
      'safari-2': 'safari-2-ua',
      'safari-1': 'safari-1-ua',
      edge: 'edge-ua',
      ie: 'ie-ua',
      ie10: 'ie10-ua',
    }
  }

  async checkWindow({screenshotUrl, tag, domUrl, checkSettings, imageLocation}) {
    if (tag && this.goodTags && !this.goodTags.includes(tag))
      throw new Error(`Tag ${tag} should be one of the good tags ${this.goodTags}`)

    const result = new MatchResult()
    const {
      isGood,
      sizeMode,
      browserName,
      selector,
      region,
      emulationInfo,
      iosDeviceInfo,
      selectorsToFindRegionsFor,
      platform,
    } = JSON.parse(screenshotUrl)

    let expectedImageLocation = undefined
    if (sizeMode === 'selector') {
      expectedImageLocation = new Location(selectorsToLocations[selectorsToFindRegionsFor[0]])
    } else if (sizeMode === 'region') {
      expectedImageLocation = new Region(this.region).getLocation()
    }

    const asExpected =
      isGood &&
      (!this.sizeMode || sizeMode === this.sizeMode) &&
      (!this.selector || selector === this.selector) &&
      compare(region, this.region) &&
      compare(emulationInfo, this.emulationInfo) &&
      compare(iosDeviceInfo, this.iosDeviceInfo) &&
      compare(selectorsToFindRegionsFor, this.selectorsToFindRegionsFor) &&
      compare(platform, this.platform) &&
      compare(imageLocation, expectedImageLocation)

    result.setAsExpected(asExpected)

    result.__domUrl = domUrl
    result.__checkSettings = checkSettings
    result.__tag = tag
    result.__browserName = browserName
    result.__platform = platform
    this.results.push(result)
    return new Promise(res =>
      setTimeout(() => {
        this.emit('checkWindowEnd')
        res(result)
      }, 100),
    )
  }

  async testWindow(...args) {
    return new Promise(res =>
      setTimeout(() => {
        this.emit('testWindowEnd', args)
        const results = new TestResults({stepsInfo: [{}]})
        res(results)
      }, 100),
    )
  }

  async closeTestWindow(results, throwEx) {
    return new Promise(res =>
      setTimeout(() => {
        this.emit('closeTestWindowEnd', [results, throwEx])
        res(results)
      }, 100),
    )
  }

  createRGridDom({cdt: _cdt, resources: _resources}) {}

  async close() {
    this.emit('closed')
    this.closed = !this.aborted
    if (this.closeErr || this.results.find(r => !r.getAsExpected())) throw new Error('mismatch')
    return this.resultsToTestResults(this.results)
  }

  async abort() {
    this.emit('aborted')
    this.aborted = !this.closed
  }

  async ensureAborted() {}

  resultsToTestResults(results) {
    const steps = Array.from(new Array(results.length).map(() => ({})))
    const tr = new TestResults({stepsInfo: steps})
    const trSteps = tr.getStepsInfo()
    for (const [i, result] of results.entries()) {
      trSteps[i].result = result
    }
    return tr
  }

  setDummyTestResults() {
    this.results.push({getAsExpected: () => true})
  }

  getExpectedCdt() {
    return loadJsonFixture(this.goodFilename)
  }

  getExpectedResources() {
    const urlResources = this.goodResourceUrls.map(resourceUrl => ({
      url: resourceUrl,
      hashOrErrorStatusCode: getSha256Hash(
        loadFixtureBuffer(new URL(resourceUrl).pathname.slice(1)),
      ),
    }))

    const recs = this.goodResources.map(resource => ({
      url: resource.url,
      hashOrErrorStatusCode: getSha256Hash(resource.content),
    }))
    return [...urlResources, ...recs]
  }

  getBatch() {
    return this.batch || SOME_BATCH
  }

  setBatch(batch) {
    this.batch = batch
  }

  setBaselineBranchName(value) {
    this.baselineBranchName = value
  }

  setBaselineEnvName(value) {
    this.baselineEnvName = value
  }

  setBaselineName(value) {
    this.baselineName = value
  }

  setEnvName(value) {
    this.envName = value
  }

  setIgnoreCaret(value) {
    this.ignoreCaret = value
  }

  setIsDisabled(value) {
    this.isDisabled = value
  }

  setMatchLevel(value) {
    this.matchLevel = value
  }

  getMatchLevel() {
    return this.matchLevel
  }

  setAccessibilityValidation(value) {
    this.accessibilitySettings = value
  }

  getAccessibilityValidation() {
    return this.accessibilitySettings
  }

  setParentBranchName(value) {
    this.parentBranchName = value
  }

  setBranchName(value) {
    this.branchName = value
  }

  setProxy(value) {
    this.proxy = value
  }

  setSaveFailedTests(value) {
    this.saveFailedTests = value
  }

  setSaveNewTests(value) {
    this.saveNewTests = value
  }

  setCompareWithParentBranch(value) {
    this.compareWithParentBranch = value
  }

  setIgnoreBaseline(value) {
    this.ignoreBaseline = value
  }

  setServerUrl(value) {
    this.serverUrl = value
  }

  async getInferredEnvironment() {
    return this.inferredEnvironment
  }

  setInferredEnvironment(value) {
    this.inferredEnvironment = value
  }

  setViewportSize(value) {
    this.viewportSize = value
  }

  setDeviceInfo(value) {
    this.deviceInfo = value
  }

  setBaseAgentId(value) {
    this.baseAgentId = value
  }

  getBaseAgentId() {
    return this.baseAgentId || 'fake wrapper'
  }

  getApiKey() {
    return this.apiKey
  }

  setApiKey(value) {
    this.apiKey = value
  }

  setUseDom(useDom) {
    this.useDom = useDom
  }

  getUseDom() {
    return this.useDom
  }

  setDisplayName(displayName) {
    this.displayName = displayName
  }

  getDisplayName() {
    return this.displayName
  }

  getDeviceInfo() {
    return this.deviceInfo
  }

  getViewportSize() {
    return this.viewportSize
  }

  setEnablePatterns(enablePatterns) {
    this.enablePatterns = enablePatterns
  }

  getEnablePatterns() {
    return this.enablePatterns
  }

  setIgnoreDisplacements(ignoreDisplacements) {
    this.ignoreDisplacements = ignoreDisplacements
  }

  getIgnoreDisplacements() {
    return this.ignoreDisplacements
  }

  getUserSetBatchId() {
    return this.batchId
  }

  getProxy() {
    return this.proxy
  }
}

module.exports = FakeEyesWrapper
module.exports.selectorsToLocations = selectorsToLocations
module.exports.devices = devices
