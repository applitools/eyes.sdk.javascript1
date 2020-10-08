'use strict'

const {GeneralUtils} = require('../..')

const ActualAppOutput = require('./ActualAppOutput')
const ExpectedAppOutput = require('./ExpectedAppOutput')
const Branch = require('./Branch')
const StartInfo = require('./StartInfo')
const AppEnvironment = require('../AppEnvironment')

class SessionResults {
  /**
   * @param data
   * @param {string} data.id
   * @param {number} data.revision
   * @param {string} data.runningSessionId
   * @param {boolean} data.isAborted
   * @param {boolean} data.isStarred
   * @param {StartInfo|object} data.startInfo
   * @param {string} data.batchId
   * @param {string} data.secretToken
   * @param {string} data.state
   * @param {string} data.status
   * @param {string} data.isDefaultStatus
   * @param {string} data.startedAt
   * @param {number} data.duration
   * @param {boolean} data.isDifferent
   * @param {AppEnvironment|object} data.env
   * @param {Branch|object} data.branch
   * @param {ExpectedAppOutput[]|object[]} data.expectedAppOutput
   * @param {ActualAppOutput[]|object[]} data.actualAppOutput
   * @param {string} data.baselineId
   * @param {string} data.baselineRevId
   * @param {string} data.scenarioId
   * @param {string} data.scenarioName
   * @param {string} data.appId
   * @param {string} data.baselineModelId
   * @param {string} data.baselineEnvId
   * @param {AppEnvironment|object} data.baselineEnv
   * @param {string} data.appName
   * @param {string} data.baselineBranchName
   * @param {boolean} data.isNew
   */
  constructor({
    id,
    revision,
    runningSessionId,
    isAborted,
    isStarred,
    startInfo,
    batchId,
    secretToken,
    state,
    status,
    isDefaultStatus,
    startedAt,
    duration,
    isDifferent,
    env,
    branch,
    expectedAppOutput,
    actualAppOutput,
    baselineId,
    baselineRevId,
    scenarioId,
    scenarioName,
    appId,
    baselineModelId,
    baselineEnvId,
    baselineEnv,
    appName,
    baselineBranchName,
    isNew,
  } = {}) {
    if (env && !(env instanceof AppEnvironment)) {
      env = new AppEnvironment(env)
    }

    if (baselineEnv && !(baselineEnv instanceof AppEnvironment)) {
      baselineEnv = new AppEnvironment(baselineEnv)
    }

    if (branch && !(branch instanceof Branch)) {
      branch = new Branch(branch)
    }

    if (startInfo && !(startInfo instanceof StartInfo)) {
      startInfo = new StartInfo(startInfo)
    }

    if (
      actualAppOutput &&
      actualAppOutput.length > 0 &&
      !(actualAppOutput[0] instanceof ActualAppOutput)
    ) {
      actualAppOutput = actualAppOutput.map(output => new ActualAppOutput(output))
    }

    if (
      expectedAppOutput &&
      expectedAppOutput.length > 0 &&
      !!expectedAppOutput[0] &&
      !(expectedAppOutput[0] instanceof ExpectedAppOutput)
    ) {
      expectedAppOutput = expectedAppOutput.map(output => new ExpectedAppOutput(output))
    }

    this._id = id
    this._revision = revision
    this._runningSessionId = runningSessionId
    this._isAborted = isAborted
    this._isStarred = isStarred
    this._startInfo = startInfo
    this._batchId = batchId
    this._secretToken = secretToken
    this._state = state
    this._status = status
    this._isDefaultStatus = isDefaultStatus
    this._startedAt = startedAt
    this._duration = duration
    this._isDifferent = isDifferent
    this._env = env
    this._branch = branch
    this._expectedAppOutput = expectedAppOutput
    this._actualAppOutput = actualAppOutput
    this._baselineId = baselineId
    this._baselineRevId = baselineRevId
    this._scenarioId = scenarioId
    this._scenarioName = scenarioName
    this._appId = appId
    this._baselineModelId = baselineModelId
    this._baselineEnvId = baselineEnvId
    this._baselineEnv = baselineEnv
    this._appName = appName
    this._baselineBranchName = baselineBranchName
    this._isNew = isNew
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
   * @return {number}
   */
  getRevision() {
    return this._revision
  }

  /**
   * @param {number} value
   */
  setRevision(value) {
    this._revision = value
  }

  /**
   * @return {string}
   */
  getRunningSessionId() {
    return this._runningSessionId
  }

  /**
   * @param {string} value
   */
  setRunningSessionId(value) {
    this._runningSessionId = value
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
   * @return {boolean}
   */
  getIsStarred() {
    return this._isStarred
  }

  /**
   * @param {boolean} value
   */
  setIsStarred(value) {
    this._isStarred = value
  }

  /**
   * @return {StartInfo}
   */
  getStartInfo() {
    return this._startInfo
  }

  /**
   * @param {StartInfo} value
   */
  setStartInfo(value) {
    this._startInfo = value
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
   * @return {string}
   */
  getState() {
    return this._state
  }

  /**
   * @param {string} value
   */
  setState(value) {
    this._state = value
  }

  /**
   * @return {string}
   */
  getStatus() {
    return this._status
  }

  /**
   * @param {string} value
   */
  setStatus(value) {
    this._status = value
  }

  /**
   * @return {boolean}
   */
  getIsDefaultStatus() {
    return this._isDefaultStatus
  }

  /**
   * @param {boolean} value
   */
  setIsDefaultStatus(value) {
    this._isDefaultStatus = value
  }

  /**
   * @return {string}
   */
  getStartedAt() {
    return this._startedAt
  }

  /**
   * @param {string} value
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
   * @return {AppEnvironment}
   */
  getEnv() {
    return this._env
  }

  /**
   * @param {AppEnvironment} value
   */
  setEnv(value) {
    this._env = value
  }

  /**
   * @return {Branch}
   */
  getBranch() {
    return this._branch
  }

  /**
   * @param {Branch} value
   */
  setBranch(value) {
    this._branch = value
  }

  /**
   * @return {ExpectedAppOutput[]}
   */
  getExpectedAppOutput() {
    return this._expectedAppOutput
  }

  /**
   * @param {ExpectedAppOutput[]} value
   */
  setExpectedAppOutput(value) {
    this._expectedAppOutput = value
  }

  /**
   * @return {ActualAppOutput[]}
   */
  getActualAppOutput() {
    return this._actualAppOutput
  }

  /**
   * @param {ActualAppOutput[]} value
   */
  setActualAppOutput(value) {
    this._actualAppOutput = value
  }

  /**
   * @return {string}
   */
  getBaselineId() {
    return this._baselineId
  }

  /**
   * @param {string} value
   */
  setBaselineId(value) {
    this._baselineId = value
  }

  /**
   * @return {string}
   */
  getBaselineRevId() {
    return this._baselineRevId
  }

  /**
   * @param {string} value
   */
  setBaselineRevId(value) {
    this._baselineRevId = value
  }

  /**
   * @return {string}
   */
  getScenarioId() {
    return this._scenarioId
  }

  /**
   * @param {string} value
   */
  setScenarioId(value) {
    this._scenarioId = value
  }

  /**
   * @return {string}
   */
  getScenarioName() {
    return this._scenarioName
  }

  /**
   * @param {string} value
   */
  setScenarioName(value) {
    this._scenarioName = value
  }

  /**
   * @return {string}
   */
  getAppId() {
    return this._appId
  }

  /**
   * @param {string} value
   */
  setAppId(value) {
    this._appId = value
  }

  /**
   * @return {string}
   */
  getBaselineModelId() {
    return this._baselineModelId
  }

  /**
   * @param {string} value
   */
  setBaselineModelId(value) {
    this._baselineModelId = value
  }

  /**
   * @return {string}
   */
  getBaselineEnvId() {
    return this._baselineEnvId
  }

  /**
   * @param {string} value
   */
  setBaselineEnvId(value) {
    this._baselineEnvId = value
  }

  /**
   * @return {AppEnvironment}
   */
  getBaselineEnv() {
    return this._baselineEnv
  }

  /**
   * @param {AppEnvironment} value
   */
  setBaselineEnv(value) {
    this._baselineEnv = value
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
  getBaselineBranchName() {
    return this._baselineBranchName
  }

  /**
   * @param {string} value
   */
  setBaselineBranchName(value) {
    this._baselineBranchName = value
  }

  /**
   * @return {boolean}
   */
  getIsNew() {
    return this._isNew
  }

  /**
   * @param {boolean} value
   */
  setIsNew(value) {
    this._isNew = value
  }

  /**
   * @override
   */
  toJSON() {
    return GeneralUtils.toPlain(this)
  }

  /**
   * @override
   */
  toString() {
    return `SessionResults { ${JSON.stringify(this)} }`
  }
}

module.exports = SessionResults
