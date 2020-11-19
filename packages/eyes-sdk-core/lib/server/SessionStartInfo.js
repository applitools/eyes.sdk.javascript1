'use strict'
const GeneralUtils = require('../utils/GeneralUtils')
const ArgumentGuard = require('../utils/ArgumentGuard')

/**
 * Encapsulates data required to start session using the Session API.
 */
class SessionStartInfo {
  /**
   * @param {object} info
   * @param {string} info.agentId
   * @param {SessionType} [info.sessionType]
   * @param {string} info.appIdOrName
   * @param {string} [info.verId]
   * @param {string} info.scenarioIdOrName
   * @param {string} [info.displayName]
   * @param {BatchInfo} info.batchInfo
   * @param {string} [info.baselineEnvName]
   * @param {string} [info.environmentName]
   * @param {AppEnvironment} info.environment
   * @param {ImageMatchSettings} info.defaultMatchSettings
   * @param {string} [info.branchName]
   * @param {string} [info.parentBranchName]
   * @param {string} [info.parentBranchBaselineSavedBefore]
   * @param {string} [info.baselineBranchName]
   * @param {boolean} [info.compareWithParentBranch]
   * @param {boolean} [info.ignoreBaseline]
   * @param {boolean} [info.saveDiffs]
   * @param {boolean} [info.render]
   * @param {PropertyData[]} [info.properties]
   * @param {number} [info.timeout]
   */
  constructor({
    agentId,
    sessionType,
    appIdOrName,
    verId,
    scenarioIdOrName,
    displayName,
    batchInfo,
    baselineEnvName,
    environmentName,
    environment,
    defaultMatchSettings,
    branchName,
    parentBranchName,
    parentBranchBaselineSavedBefore,
    baselineBranchName,
    compareWithParentBranch,
    ignoreBaseline,
    saveDiffs,
    render,
    properties,
    agentSessionId,
    timeout,
  } = {}) {
    ArgumentGuard.notNullOrEmpty(agentId, 'agentId')
    ArgumentGuard.notNullOrEmpty(appIdOrName, 'appIdOrName')
    ArgumentGuard.notNullOrEmpty(scenarioIdOrName, 'scenarioIdOrName')
    ArgumentGuard.notNull(batchInfo, 'batchInfo')
    ArgumentGuard.notNull(environment, 'environment')
    ArgumentGuard.notNull(defaultMatchSettings, 'defaultMatchSettings')

    this._agentId = agentId
    this._sessionType = sessionType
    this._appIdOrName = appIdOrName
    this._verId = verId
    this._scenarioIdOrName = scenarioIdOrName
    this._displayName = displayName
    this._batchInfo = batchInfo
    this._baselineEnvName = baselineEnvName
    this._environmentName = environmentName
    this._environment = environment
    this._defaultMatchSettings = defaultMatchSettings
    this._branchName = branchName
    this._parentBranchName = parentBranchName
    this._parentBranchBaselineSavedBefore = parentBranchBaselineSavedBefore
    this._baselineBranchName = baselineBranchName
    this._compareWithParentBranch = compareWithParentBranch
    this._ignoreBaseline = ignoreBaseline
    this._saveDiffs = saveDiffs
    this._render = render
    this._properties = properties
    this._concurrencyVersion = 1
    this._agentSessionId = agentSessionId
    this._timeout = timeout
  }

  /**
   * @return {string}
   */
  getAgentId() {
    return this._agentId
  }

  /**
   * @return {SessionType}
   */
  getSessionType() {
    return this._sessionType
  }

  /**
   * @return {string}
   */
  getAppIdOrName() {
    return this._appIdOrName
  }

  /**
   * @return {string}
   */
  getVerId() {
    return this._verId
  }

  /**
   * @return {string}
   */
  getScenarioIdOrName() {
    return this._scenarioIdOrName
  }

  /**
   * @return {string}
   */
  getDisplayName() {
    return this._displayName
  }

  /**
   * @return {BatchInfo}
   */
  getBatchInfo() {
    return this._batchInfo
  }

  /**
   * @return {string}
   */
  getBaselineEnvName() {
    return this._baselineEnvName
  }

  /**
   * @return {string}
   */
  getEnvironmentName() {
    return this._environmentName
  }

  /**
   * @return {AppEnvironment}
   */
  getEnvironment() {
    return this._environment
  }

  /**
   * @return {ImageMatchSettings}
   */
  getDefaultMatchSettings() {
    return this._defaultMatchSettings
  }

  /**
   * @return {string}
   */
  getBranchName() {
    return this._branchName
  }

  /**
   * @return {string}
   */
  getParentBranchName() {
    return this._parentBranchName
  }

  /**
   * @return {string}
   */
  getParentBranchBaselineSavedBefore() {
    return this._parentBranchBaselineSavedBefore
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @return {string}
   */
  getBaselineBranchName() {
    return this._baselineBranchName
  }

  /**
   * @return {boolean}
   */
  getCompareWithParentBranch() {
    return this._compareWithParentBranch
  }

  /**
   * @return {boolean}
   */
  getIgnoreBaseline() {
    return this._ignoreBaseline
  }

  /**
   * @return {PropertyData[]}
   */
  getProperties() {
    return this._properties
  }

  /**
   * @return {boolean} If true, createSession request will return renderingInfo properties
   */
  getRender() {
    return this._render
  }

  /**
   * @return {boolean}
   */
  getSaveDiffs() {
    return this._saveDiffs
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
    return `SessionStartInfo { ${JSON.stringify(this)} }`
  }
}

module.exports = SessionStartInfo
