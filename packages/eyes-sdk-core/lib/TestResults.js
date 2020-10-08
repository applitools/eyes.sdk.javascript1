'use strict'
const GeneralUtils = require('./utils/GeneralUtils')
const DateTimeUtils = require('./utils/DateTimeUtils')
const RectangleSize = require('./geometry/RectangleSize')
const TestResultsStatuses = require('./TestResultsStatus')

/**
 * @typedef {import('./TestResultsStatus').TestResultsStatus} TestResultsStatus
 */

class SessionUrls {
  /**
   * @param {Object} data
   * @param {string} data.batch
   * @param {string} data.session
   */
  constructor({batch, session} = {}) {
    this._batch = batch
    this._session = session
  }

  /**
   * @return {string}
   */
  getBatch() {
    return this._batch
  }

  /**
   * @param {string} value
   */
  setBatch(value) {
    this._batch = value
  }

  /**
   * @return {string}
   */
  getSession() {
    return this._session
  }

  /**
   * @param {string} value
   */
  setSession(value) {
    this._session = value
  }

  /**
   * @override
   */
  toJSON() {
    return GeneralUtils.toPlain(this)
  }
}

class ApiUrls {
  /**
   * @param {Object} data
   * @param {string} data.baselineImage
   * @param {string} data.currentImage
   * @param {string} data.checkpointImage
   * @param {string} data.checkpointImageThumbnail
   * @param {string} data.diffImage
   */
  constructor({
    baselineImage,
    currentImage,
    checkpointImage,
    checkpointImageThumbnail,
    diffImage,
  } = {}) {
    this._baselineImage = baselineImage
    this._currentImage = currentImage
    this._checkpointImage = checkpointImage
    this._checkpointImageThumbnail = checkpointImageThumbnail
    this._diffImage = diffImage
  }

  /**
   * @return {string}
   */
  getBaselineImage() {
    return this._baselineImage
  }

  /**
   * @param {string} value
   */
  setBaselineImage(value) {
    this._baselineImage = value
  }

  /**
   * @return {string}
   */
  getCurrentImage() {
    return this._currentImage
  }

  /**
   * @param {string} value
   */
  setCurrentImage(value) {
    this._currentImage = value
  }

  /**
   * @return {string}
   */
  getCheckpointImage() {
    return this._checkpointImage
  }

  /**
   * @param {string} value
   */
  setCheckpointImage(value) {
    this._checkpointImage = value
  }

  /**
   * @return {string}
   */
  getCheckpointImageThumbnail() {
    return this._checkpointImageThumbnail
  }

  /**
   * @param {string} value
   */
  setCheckpointImageThumbnail(value) {
    this._checkpointImageThumbnail = value
  }

  /**
   * @return {string}
   */
  getDiffImage() {
    return this._diffImage
  }

  /**
   * @param {string} value
   */
  setDiffImage(value) {
    this._diffImage = value
  }

  /**
   * @override
   */
  toJSON() {
    return GeneralUtils.toPlain(this)
  }
}

class AppUrls {
  /**
   * @param {Object} data
   * @param {string} data.step
   * @param {string} data.stepEditor
   */
  constructor({step, stepEditor} = {}) {
    this._step = step
    this._stepEditor = stepEditor
  }

  /**
   * @return {string}
   */
  getStep() {
    return this._step
  }

  /**
   * @param {string} value
   */
  setStep(value) {
    this._step = value
  }

  /**
   * @return {string}
   */
  getStepEditor() {
    return this._stepEditor
  }

  /**
   * @param {string} value
   */
  setStepEditor(value) {
    this._stepEditor = value
  }

  /**
   * @override
   */
  toJSON() {
    return GeneralUtils.toPlain(this)
  }
}

class StepInfo {
  /**
   * @param {Object} info
   * @param {string} info.name
   * @param {boolean} info.isDifferent
   * @param {boolean} info.hasBaselineImage
   * @param {boolean} info.hasCurrentImage
   * @param {AppUrls|object} info.appUrls
   * @param {ApiUrls|object} info.apiUrls
   * @param {string[]} [info.renderId]
   */
  constructor({
    name,
    isDifferent,
    hasBaselineImage,
    hasCurrentImage,
    appUrls,
    apiUrls,
    renderId,
  } = {}) {
    if (appUrls && !(appUrls instanceof AppUrls)) {
      appUrls = new AppUrls(appUrls)
    }

    if (apiUrls && !(apiUrls instanceof ApiUrls)) {
      apiUrls = new ApiUrls(apiUrls)
    }

    this._name = name
    this._isDifferent = isDifferent
    this._hasBaselineImage = hasBaselineImage
    this._hasCurrentImage = hasCurrentImage
    this._appUrls = appUrls
    this._apiUrls = apiUrls
    this._renderId = renderId
  }

  /**
   * @return {string}
   */
  getName() {
    return this._name
  }

  /**
   * @param {string} value
   */
  setName(value) {
    this._name = value
  }

  /**
   * @return {boolean}
   */
  getIsDifferent() {
    return this._isDifferent
  }

  /**
   * @param {boolean} value
   */
  setIsDifferent(value) {
    this._isDifferent = value
  }

  /**
   * @return {boolean}
   */
  getHasBaselineImage() {
    return this._hasBaselineImage
  }

  /**
   * @param {boolean} value
   */
  setHasBaselineImage(value) {
    this._hasBaselineImage = value
  }

  /**
   * @return {boolean}
   */
  getHasCurrentImage() {
    return this._hasCurrentImage
  }

  /**
   * @param {boolean} value
   */
  setHasCurrentImage(value) {
    this._hasCurrentImage = value
  }

  /**
   * @return {AppUrls}
   */
  getAppUrls() {
    return this._appUrls
  }

  /**
   * @param {AppUrls} value
   */
  setAppUrls(value) {
    this._appUrls = value
  }

  /**
   * @return {ApiUrls}
   */
  getApiUrls() {
    return this._apiUrls
  }

  /**
   * @param {ApiUrls} value
   */
  setApiUrls(value) {
    this._apiUrls = value
  }

  /**
   * @return {string} value
   */
  getRenderId() {
    return this._renderId
  }

  /**
   * @param {string} value
   */
  setRenderId(value) {
    this._renderId = value
  }

  /**
   * @override
   */
  toJSON() {
    return GeneralUtils.toPlain(this)
  }
}

/**
 * @typedef SessionAccessibilityStatus
 * @prop {AccessibilityLevel} level - accessibility level.
 * @prop {AccessibilityGuidelinesVersion} version - accessibility guidelines version.
 * @prop {AccessibilityStatus} status - test accessibility status.
 */

/**
 * Eyes test results.
 */
class TestResults {
  /**
   * @param {Object} results
   * @param {string} [results.id]
   * @param {string} [results.name]
   * @param {string} [results.secretToken]
   * @param {TestResultsStatus} [results.status]
   * @param {string} [results.appName]
   * @param {string} [results.batchName]
   * @param {string} [results.batchId]
   * @param {string} [results.branchName]
   * @param {string} [results.hostOS]
   * @param {string} [results.hostApp]
   * @param {RectangleSize|object} [results.hostDisplaySize]
   * @param {SessionAccessibilityStatus} [results.accessibilityStatus]
   * @param {Date|string} [results.startedAt]
   * @param {number} [results.duration]
   * @param {boolean} [results.isNew]
   * @param {boolean} [results.isDifferent]
   * @param {boolean} [results.isAborted]
   * @param {SessionUrls|object} [results.appUrls]
   * @param {SessionUrls|object} [results.apiUrls]
   * @param {StepInfo[]|object[]} [results.stepsInfo]
   * @param {number} [results.steps]
   * @param {number} [results.matches]
   * @param {number} [results.mismatches]
   * @param {number} [results.missing]
   * @param {number} [results.exactMatches]
   * @param {number} [results.strictMatches]
   * @param {number} [results.contentMatches]
   * @param {number} [results.layoutMatches]
   * @param {number} [results.noneMatches]
   * @param {string} [results.url]
   */
  constructor({
    id,
    name,
    secretToken,
    status,
    appName,
    batchName,
    batchId,
    branchName,
    hostOS,
    hostApp,
    hostDisplaySize,
    startedAt,
    duration,
    isNew,
    isDifferent,
    isAborted,
    appUrls,
    apiUrls,
    stepsInfo,
    steps,
    matches,
    mismatches,
    missing,
    exactMatches,
    strictMatches,
    contentMatches,
    layoutMatches,
    noneMatches,
    url,
    accessibilityStatus,
  } = {}) {
    if (hostDisplaySize && !(hostDisplaySize instanceof RectangleSize)) {
      hostDisplaySize = new RectangleSize(hostDisplaySize)
    }

    if (appUrls && !(appUrls instanceof SessionUrls)) {
      appUrls = new SessionUrls(appUrls)
    }

    if (apiUrls && !(apiUrls instanceof SessionUrls)) {
      apiUrls = new SessionUrls(apiUrls)
    }

    if (startedAt && !(startedAt instanceof Date)) {
      startedAt = DateTimeUtils.fromISO8601DateTime(startedAt)
    }

    if (stepsInfo && stepsInfo.length > 0 && !(stepsInfo[0] instanceof StepInfo)) {
      stepsInfo = stepsInfo.map(step => new StepInfo(step))
    }

    this._id = id
    this._name = name
    this._secretToken = secretToken
    // this._id = undefined;
    this._status = status
    this._appName = appName
    this._batchName = batchName
    this._batchId = batchId
    this._branchName = branchName
    this._hostOS = hostOS
    this._hostApp = hostApp
    this._hostDisplaySize = hostDisplaySize
    this._startedAt = startedAt
    this._duration = duration
    this._isNew = isNew
    this._isDifferent = isDifferent
    this._isAborted = isAborted
    // this._defaultMatchSettings = undefined;
    this._appUrls = appUrls
    this._apiUrls = apiUrls
    this._stepsInfo = stepsInfo
    this._steps = steps
    this._matches = matches
    this._mismatches = mismatches
    this._missing = missing
    this._exactMatches = exactMatches
    this._strictMatches = strictMatches
    this._contentMatches = contentMatches
    this._layoutMatches = layoutMatches
    this._noneMatches = noneMatches
    this._url = url
    this._accessibilityStatus = accessibilityStatus

    /** @type {ServerConnector} */
    this._serverConnector = undefined
  }

  /**
   * @return {string}
   */
  getId() {
    return this._id
  }

  /**
   * @param {string} value
   */
  setId(value) {
    this._id = value
  }

  /**
   * @return {string}
   */
  getName() {
    return this._name
  }

  /**
   * @param {string} value
   */
  setName(value) {
    this._name = value
  }

  /**
   * @return {string}
   */
  getSecretToken() {
    return this._secretToken
  }

  /**
   * @param {string} value
   */
  setSecretToken(value) {
    this._secretToken = value
  }

  /**
   * @return {TestResultsStatus}
   */
  getStatus() {
    return this._status
  }

  /**
   * @param {TestResultsStatus} value
   */
  setStatus(value) {
    this._status = value
  }

  /**
   * @return {string}
   */
  getAppName() {
    return this._appName
  }

  /**
   * @param {string} value
   */
  setAppName(value) {
    this._appName = value
  }

  /**
   * @return {string}
   */
  getBatchName() {
    return this._batchName
  }

  /**
   * @param {string} value
   */
  setBatchName(value) {
    this._batchName = value
  }

  /**
   * @return {string}
   */
  getBatchId() {
    return this._batchId
  }

  /**
   * @param {string} value
   */
  setBatchId(value) {
    this._batchId = value
  }

  /**
   * @return {string}
   */
  getBranchName() {
    return this._branchName
  }

  /**
   * @param {string} value
   */
  setBranchName(value) {
    this._branchName = value
  }

  /**
   * @return {string}
   */
  getHostOS() {
    return this._hostOS
  }

  /**
   * @param {string} value
   */
  setHostOS(value) {
    this._hostOS = value
  }

  /**
   * @return {string}
   */
  getHostApp() {
    return this._hostApp
  }

  /**
   * @param {string} value
   */
  setHostApp(value) {
    this._hostApp = value
  }

  /**
   * @return {RectangleSize}
   */
  getHostDisplaySize() {
    return this._hostDisplaySize
  }

  /**
   * @param {RectangleSize} value
   */
  setHostDisplaySize(value) {
    this._hostDisplaySize = value
  }

  /**
   * @return {SessionAccessibilityStatus}
   */
  getAccessibilityStatus() {
    return this._accessibilityStatus
  }

  /**
   * @param {SessionAccessibilityStatus} value
   */
  setAccessibilityStatus(value) {
    this._accessibilityStatus = value
  }

  /**
   * @return {Date}
   */
  getStartedAt() {
    return this._startedAt
  }

  /**
   * @param {Date} value
   */
  setStartedAt(value) {
    this._startedAt = value
  }

  /**
   * @return {number}
   */
  getDuration() {
    return this._duration
  }

  /**
   * @param {number} value
   */
  setDuration(value) {
    this._duration = value
  }

  /**
   * @return {boolean} - Whether or not this is a new test.
   */
  getIsNew() {
    return this._isNew
  }

  /**
   * @param {boolean} value - Whether or not this test has an existing baseline.
   */
  setIsNew(value) {
    this._isNew = value
  }

  /**
   * @return {boolean}
   */
  getIsDifferent() {
    return this._isDifferent
  }

  /**
   * @param {boolean} value
   */
  setIsDifferent(value) {
    this._isDifferent = value
  }

  /**
   * @return {boolean}
   */
  getIsAborted() {
    return this._isAborted
  }

  /**
   * @param {boolean} value
   */
  setIsAborted(value) {
    this._isAborted = value
  }

  /**
   * @return {SessionUrls}
   */
  getAppUrls() {
    return this._appUrls
  }

  /**
   * @param {SessionUrls} value
   */
  setAppUrls(value) {
    this._appUrls = value
  }

  /**
   * @return {SessionUrls}
   */
  getApiUrls() {
    return this._apiUrls
  }

  /**
   * @param {SessionUrls} value
   */
  setApiUrls(value) {
    this._apiUrls = value
  }

  /**
   * @return {StepInfo[]}
   */
  getStepsInfo() {
    return this._stepsInfo
  }

  /**
   * @param {StepInfo[]} value
   */
  setStepsInfo(value) {
    this._stepsInfo = value
  }

  /**
   * @return {number} - The total number of test steps.
   */
  getSteps() {
    return this._steps
  }

  /**
   * @param {number} value - The number of visual checkpoints in the test.
   */
  setSteps(value) {
    this._steps = value
  }

  /**
   * @return {number} - The total number of test steps that matched the baseline.
   */
  getMatches() {
    return this._matches
  }

  /**
   * @param {number} value - The number of visual matches in the test.
   */
  setMatches(value) {
    this._matches = value
  }

  /**
   * @return {number} - The total number of test steps that did not match the baseline.
   */
  getMismatches() {
    return this._mismatches
  }

  /**
   * @param {number} value - The number of mismatches in the test.
   */
  setMismatches(value) {
    this._mismatches = value
  }

  /**
   * @return {number} - The total number of baseline test steps that were missing in the test.
   */
  getMissing() {
    return this._missing
  }

  /**
   * @param {number} value - The number of visual checkpoints that were available in the baseline but were not found
   *   in the current test.
   */
  setMissing(value) {
    this._missing = value
  }

  /**
   * @return {number} - The total number of test steps that exactly matched the baseline.
   */
  getExactMatches() {
    return this._exactMatches
  }

  /**
   * @param {number} value - The number of matches performed with match level set to {@link MatchLevel#Exact}
   */
  setExactMatches(value) {
    this._exactMatches = value
  }

  /**
   * @return {number} - The total number of test steps that strictly matched the baseline.
   */
  getStrictMatches() {
    return this._strictMatches
  }

  /**
   * @param {number} value - The number of matches performed with match level set to {@link MatchLevel#Strict}
   */
  setStrictMatches(value) {
    this._strictMatches = value
  }

  /**
   * @return {number} - The total number of test steps that matched the baseline by content.
   */
  getContentMatches() {
    return this._contentMatches
  }

  /**
   * @param {number} value - The number of matches performed with match level set to {@link MatchLevel#Content}
   */
  setContentMatches(value) {
    this._contentMatches = value
  }

  /**
   * @return {number} - The total number of test steps that matched the baseline by layout.
   */
  getLayoutMatches() {
    return this._layoutMatches
  }

  /**
   * @param {number} value - The number of matches performed with match level set to {@link MatchLevel#Layout}
   */
  setLayoutMatches(value) {
    this._layoutMatches = value
  }

  /**
   * @return {number} - The total number of test steps that matched the baseline without performing any comparison.
   */
  getNoneMatches() {
    return this._noneMatches
  }

  /**
   * @param {number} value - The number of matches performed with match level set to {@link MatchLevel#None}
   */
  setNoneMatches(value) {
    this._noneMatches = value
  }

  /**
   * @return {string} - The URL where test results can be viewed.
   */
  getUrl() {
    return this._url
  }

  /**
   * @param {string} value - The URL of the test results.
   */
  setUrl(value) {
    this._url = value
  }

  /**
   * @return {boolean} - Whether or not this test passed.
   */
  isPassed() {
    return this._status === TestResultsStatuses.Passed
  }

  /**
   * @param {ServerConnector} serverConnector
   */
  setServerConnector(serverConnector) {
    this._serverConnector = serverConnector
  }

  /**
   * @return {Promise}
   */
  async deleteSession() {
    return this._serverConnector.deleteSession(this)
  }

  /**
   * @override
   */
  toJSON() {
    return GeneralUtils.toPlain(this, ['_serverConnector'])
  }

  /**
   * @override
   */
  toString() {
    const isNewTestStr = this._isNew ? 'new test' : 'existing test'
    return `TestResults of ${isNewTestStr} ${GeneralUtils.toString(this, [
      '_secretToken',
      '_serverConnector',
    ])}`
  }
}

module.exports = TestResults
