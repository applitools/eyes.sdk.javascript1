'use strict';

const { GeneralUtils, RectangleSize, DateTimeUtils } = require('@applitools/eyes-common');

const { TestResultsStatus } = require('./TestResultsStatus');

class SessionUrls {
  /**
   * @param {string} batch
   * @param {string} session
   */
  constructor({ batch, session } = {}) {
    this._batch = batch;
    this._session = session;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @return {string}
   */
  getBatch() {
    return this._batch;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @param {string} value
   */
  setBatch(value) {
    this._batch = value;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @return {string}
   */
  getSession() {
    return this._session;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @param {string} value
   */
  setSession(value) {
    this._session = value;
  }

  /**
   * @override
   */
  toJSON() {
    return GeneralUtils.toPlain(this);
  }
}

class ApiUrls {
  /**
   * @param {string} baselineImage
   * @param {string} currentImage
   * @param {string} checkpointImage
   * @param {string} checkpointImageThumbnail
   * @param {string} diffImage
   */
  constructor({ baselineImage, currentImage, checkpointImage, checkpointImageThumbnail, diffImage } = {}) {
    this._baselineImage = baselineImage;
    this._currentImage = currentImage;
    this._checkpointImage = checkpointImage;
    this._checkpointImageThumbnail = checkpointImageThumbnail;
    this._diffImage = diffImage;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @return {string}
   */
  getBaselineImage() {
    return this._baselineImage;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @param {string} value
   */
  setBaselineImage(value) {
    this._baselineImage = value;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @return {string}
   */
  getCurrentImage() {
    return this._currentImage;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @param {string} value
   */
  setCurrentImage(value) {
    this._currentImage = value;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @return {string}
   */
  getCheckpointImage() {
    return this._checkpointImage;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @param {string} value
   */
  setCheckpointImage(value) {
    this._checkpointImage = value;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @return {string}
   */
  getCheckpointImageThumbnail() {
    return this._checkpointImageThumbnail;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @param {string} value
   */
  setCheckpointImageThumbnail(value) {
    this._checkpointImageThumbnail = value;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @return {string}
   */
  getDiffImage() {
    return this._diffImage;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @param {string} value
   */
  setDiffImage(value) {
    this._diffImage = value;
  }

  /**
   * @override
   */
  toJSON() {
    return GeneralUtils.toPlain(this);
  }
}

class AppUrls {
  /**
   * @param {string} step
   * @param {string} stepEditor
   */
  constructor({ step, stepEditor } = {}) {
    this._step = step;
    this._stepEditor = stepEditor;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @return {string}
   */
  getStep() {
    return this._step;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @param {string} value
   */
  setStep(value) {
    this._step = value;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @return {string}
   */
  getStepEditor() {
    return this._stepEditor;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @param {string} value
   */
  setStepEditor(value) {
    this._stepEditor = value;
  }

  /**
   * @override
   */
  toJSON() {
    return GeneralUtils.toPlain(this);
  }
}

class StepInfo {
  /**
   * @param {string} name
   * @param {boolean} isDifferent
   * @param {boolean} hasBaselineImage
   * @param {boolean} hasCurrentImage
   * @param {AppUrls|object} appUrls
   * @param {ApiUrls|object} apiUrls
   * @param {string[]} [renderId]
   */
  constructor({ name, isDifferent, hasBaselineImage, hasCurrentImage, appUrls, apiUrls, renderId } = {}) {
    if (appUrls && !(appUrls instanceof AppUrls)) {
      appUrls = new AppUrls(appUrls);
    }

    if (apiUrls && !(apiUrls instanceof ApiUrls)) {
      apiUrls = new ApiUrls(apiUrls);
    }

    this._name = name;
    this._isDifferent = isDifferent;
    this._hasBaselineImage = hasBaselineImage;
    this._hasCurrentImage = hasCurrentImage;
    this._appUrls = appUrls;
    this._renderId = renderId;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @return {string}
   */
  getName() {
    return this._name;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @param {string} value
   */
  setName(value) {
    this._name = value;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @return {boolean}
   */
  getIsDifferent() {
    return this._isDifferent;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @param {boolean} value
   */
  setIsDifferent(value) {
    this._isDifferent = value;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @return {boolean}
   */
  getHasBaselineImage() {
    return this._hasBaselineImage;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @param {boolean} value
   */
  setHasBaselineImage(value) {
    this._hasBaselineImage = value;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @return {boolean}
   */
  getHasCurrentImage() {
    return this._hasCurrentImage;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @param {boolean} value
   */
  setHasCurrentImage(value) {
    this._hasCurrentImage = value;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @return {AppUrls}
   */
  getAppUrls() {
    return this._appUrls;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @param {AppUrls} value
   */
  setAppUrls(value) {
    this._appUrls = value;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @return {ApiUrls}
   */
  getApiUrls() {
    return this._apiUrls;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @param {ApiUrls} value
   */
  setApiUrls(value) {
    this._apiUrls = value;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @return {string} value
   */
  getRenderId() {
    return this._renderId;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @param {string} value
   */
  setRenderId(value) {
    this._renderId = value;
  }

  /**
   * @override
   */
  toJSON() {
    return GeneralUtils.toPlain(this);
  }
}

class TestAccessibilityStatus {
  /**
   * @param {AccessibilityStatus} status
   * @param {AccessibilityLevel} level
   */
  constructor({ status, level } = {}) {
    this._status = status;
    this._level = level;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @return {string}
   */
  getStatus() {
    return this._status;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @param {string} value
   */
  setStatus(value) {
    this._status = value;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @return {string}
   */
  getLevel() {
    return this._level;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @param {string} value
   */
  setLevel(value) {
    this._level = value;
  }

  /**
   * @override
   */
  toJSON() {
    return GeneralUtils.toPlain(this);
  }
}

/**
 * Eyes test results.
 */
class TestResults {
  // noinspection FunctionWithMoreThanThreeNegationsJS
  /**
   * @param {string} [id]
   * @param {string} [name]
   * @param {string} [secretToken]
   * @param {TestResultsStatus} [status]
   * @param {string} [appName]
   * @param {string} [batchName]
   * @param {string} [batchId]
   * @param {string} [branchName]
   * @param {string} [hostOS]
   * @param {string} [hostApp]
   * @param {RectangleSize|object} [hostDisplaySize]
   * @param {TestAccessibilityStatus|object} [accessibilityStatus]
   * @param {Date|string} [startedAt]
   * @param {number} [duration]
   * @param {boolean} [isNew]
   * @param {boolean} [isDifferent]
   * @param {boolean} [isAborted]
   * @param {SessionUrls|object} [appUrls]
   * @param {SessionUrls|object} [apiUrls]
   * @param {StepInfo[]|object[]} [stepsInfo]
   * @param {number} [steps]
   * @param {number} [matches]
   * @param {number} [mismatches]
   * @param {number} [missing]
   * @param {number} [exactMatches]
   * @param {number} [strictMatches]
   * @param {number} [contentMatches]
   * @param {number} [layoutMatches]
   * @param {number} [noneMatches]
   * @param {string} [url]
   */
  constructor({ id, name, secretToken, status, appName, batchName, batchId, branchName, hostOS, hostApp,
    hostDisplaySize, startedAt, duration, isNew, isDifferent, isAborted, appUrls, apiUrls, stepsInfo, steps,
    matches, mismatches, missing, exactMatches, strictMatches, contentMatches, layoutMatches, noneMatches, url, accessibilityStatus } = {}) {
    if (hostDisplaySize && !(hostDisplaySize instanceof RectangleSize)) {
      hostDisplaySize = new RectangleSize(hostDisplaySize);
    }

    if (appUrls && !(appUrls instanceof SessionUrls)) {
      appUrls = new SessionUrls(appUrls);
    }

    if (apiUrls && !(apiUrls instanceof SessionUrls)) {
      apiUrls = new SessionUrls(apiUrls);
    }

    if (startedAt && !(startedAt instanceof Date)) {
      startedAt = DateTimeUtils.fromISO8601DateTime(startedAt);
    }

    if (stepsInfo && stepsInfo.length > 0 && !(stepsInfo[0] instanceof StepInfo)) {
      stepsInfo = stepsInfo.map(step => new StepInfo(step));
    }

    if (accessibilityStatus && !(accessibilityStatus instanceof TestAccessibilityStatus)) {
      accessibilityStatus = new TestAccessibilityStatus(accessibilityStatus);
    }

    this._id = id;
    this._name = name;
    this._secretToken = secretToken;
    // this._id = undefined;
    this._status = status;
    this._appName = appName;
    this._batchName = batchName;
    this._batchId = batchId;
    this._branchName = branchName;
    this._hostOS = hostOS;
    this._hostApp = hostApp;
    this._hostDisplaySize = hostDisplaySize;
    this._startedAt = startedAt;
    this._duration = duration;
    this._isNew = isNew;
    this._isDifferent = isDifferent;
    this._isAborted = isAborted;
    // this._defaultMatchSettings = undefined;
    this._appUrls = appUrls;
    this._apiUrls = apiUrls;
    this._stepsInfo = stepsInfo;
    this._steps = steps;
    this._matches = matches;
    this._mismatches = mismatches;
    this._missing = missing;
    this._exactMatches = exactMatches;
    this._strictMatches = strictMatches;
    this._contentMatches = contentMatches;
    this._layoutMatches = layoutMatches;
    this._noneMatches = noneMatches;
    this._url = url;
    this._accessibilityStatus = accessibilityStatus;

    /** @type {ServerConnector} */
    this._serverConnector = undefined;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @return {string}
   */
  getId() {
    return this._id;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @param {string} value
   */
  setId(value) {
    this._id = value;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @return {string}
   */
  getName() {
    return this._name;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @param {string} value
   */
  setName(value) {
    this._name = value;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @return {string}
   */
  getSecretToken() {
    return this._secretToken;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @param {string} value
   */
  setSecretToken(value) {
    this._secretToken = value;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @return {TestResultsStatus}
   */
  getStatus() {
    return this._status;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @param {TestResultsStatus} value
   */
  setStatus(value) {
    this._status = value;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @return {string}
   */
  getAppName() {
    return this._appName;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @param {string} value
   */
  setAppName(value) {
    this._appName = value;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @return {string}
   */
  getBatchName() {
    return this._batchName;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @param {string} value
   */
  setBatchName(value) {
    this._batchName = value;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @return {string}
   */
  getBatchId() {
    return this._batchId;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @param {string} value
   */
  setBatchId(value) {
    this._batchId = value;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @return {string}
   */
  getBranchName() {
    return this._branchName;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @param {string} value
   */
  setBranchName(value) {
    this._branchName = value;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @return {string}
   */
  getHostOS() {
    return this._hostOS;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @param {string} value
   */
  setHostOS(value) {
    this._hostOS = value;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @return {string}
   */
  getHostApp() {
    return this._hostApp;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @param {string} value
   */
  setHostApp(value) {
    this._hostApp = value;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @return {RectangleSize}
   */
  getHostDisplaySize() {
    return this._hostDisplaySize;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @param {RectangleSize} value
   */
  setHostDisplaySize(value) {
    this._hostDisplaySize = value;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @return {TestAccessibilityStatus}
   */
  getAccessibilityStatus() {
    return this._accessibilityStatus;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @param {TestAccessibilityStatus} value
   */
  setAccessibilityStatus(value) {
    this._accessibilityStatus = value;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @return {Date}
   */
  getStartedAt() {
    return this._startedAt;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @param {Date} value
   */
  setStartedAt(value) {
    this._startedAt = value;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @return {number}
   */
  getDuration() {
    return this._duration;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @param {number} value
   */
  setDuration(value) {
    this._duration = value;
  }

  /**
   * @return {boolean} - Whether or not this is a new test.
   */
  getIsNew() {
    return this._isNew;
  }

  /**
   * @param {boolean} value - Whether or not this test has an existing baseline.
   */
  setIsNew(value) {
    this._isNew = value;
  }

  /**
   * @return {boolean}
   */
  getIsDifferent() {
    return this._isDifferent;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @param {boolean} value
   */
  setIsDifferent(value) {
    this._isDifferent = value;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @return {boolean}
   */
  getIsAborted() {
    return this._isAborted;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @param {boolean} value
   */
  setIsAborted(value) {
    this._isAborted = value;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @return {SessionUrls}
   */
  getAppUrls() {
    return this._appUrls;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @param {SessionUrls} value
   */
  setAppUrls(value) {
    this._appUrls = value;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @return {SessionUrls}
   */
  getApiUrls() {
    return this._apiUrls;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @param {SessionUrls} value
   */
  setApiUrls(value) {
    this._apiUrls = value;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @return {StepInfo[]}
   */
  getStepsInfo() {
    return this._stepsInfo;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @param {StepInfo[]} value
   */
  setStepsInfo(value) {
    this._stepsInfo = value;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @return {number} - The total number of test steps.
   */
  getSteps() {
    return this._steps;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @param {number} value - The number of visual checkpoints in the test.
   */
  setSteps(value) {
    this._steps = value;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @return {number} - The total number of test steps that matched the baseline.
   */
  getMatches() {
    return this._matches;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @param {number} value - The number of visual matches in the test.
   */
  setMatches(value) {
    this._matches = value;
  }

  /**
   * @return {number} - The total number of test steps that did not match the baseline.
   */
  getMismatches() {
    return this._mismatches;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @param {number} value - The number of mismatches in the test.
   */
  setMismatches(value) {
    this._mismatches = value;
  }

  /**
   * @return {number} - The total number of baseline test steps that were missing in the test.
   */
  getMissing() {
    return this._missing;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @param {number} value - The number of visual checkpoints that were available in the baseline but were not found
   *   in the current test.
   */
  setMissing(value) {
    this._missing = value;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @return {number} - The total number of test steps that exactly matched the baseline.
   */
  getExactMatches() {
    return this._exactMatches;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @param {number} value - The number of matches performed with match level set to {@link MatchLevel#Exact}
   */
  setExactMatches(value) {
    this._exactMatches = value;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @return {number} - The total number of test steps that strictly matched the baseline.
   */
  getStrictMatches() {
    return this._strictMatches;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @param {number} value - The number of matches performed with match level set to {@link MatchLevel#Strict}
   */
  setStrictMatches(value) {
    this._strictMatches = value;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @return {number} - The total number of test steps that matched the baseline by content.
   */
  getContentMatches() {
    return this._contentMatches;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @param {number} value - The number of matches performed with match level set to {@link MatchLevel#Content}
   */
  setContentMatches(value) {
    this._contentMatches = value;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @return {number} - The total number of test steps that matched the baseline by layout.
   */
  getLayoutMatches() {
    return this._layoutMatches;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @param {number} value - The number of matches performed with match level set to {@link MatchLevel#Layout}
   */
  setLayoutMatches(value) {
    this._layoutMatches = value;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @return {number} - The total number of test steps that matched the baseline without performing any comparison.
   */
  getNoneMatches() {
    return this._noneMatches;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @param {number} value - The number of matches performed with match level set to {@link MatchLevel#None}
   */
  setNoneMatches(value) {
    this._noneMatches = value;
  }

  /**
   * @return {string} - The URL where test results can be viewed.
   */
  getUrl() {
    return this._url;
  }

  /**
   * @param {string} value - The URL of the test results.
   */
  setUrl(value) {
    this._url = value;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @return {boolean} - Whether or not this test passed.
   */
  isPassed() {
    return this._status === TestResultsStatus.Passed;
  }

  /**
   * @param {ServerConnector} serverConnector
   */
  setServerConnector(serverConnector) {
    this._serverConnector = serverConnector;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @return {Promise}
   */
  async deleteSession() {
    return this._serverConnector.deleteSession(this);
  }

  /**
   * @override
   */
  toJSON() {
    return GeneralUtils.toPlain(this, ['_serverConnector']);
  }

  /**
   * @override
   */
  toString() {
    const isNewTestStr = this._isNew ? 'new test' : 'existing test';
    return `TestResults of ${isNewTestStr} ${GeneralUtils.toString(this, ['_secretToken', '_serverConnector'])}`;
  }
}

exports.TestResults = TestResults;
