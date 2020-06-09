'use strict'

const {GeneralUtils, ArgumentGuard} = require('../..')

/**
 * Encapsulates data required to start session using the Session API.
 */
class SessionStartInfo {
  /**
   * @param {string} agentId
   * @param {SessionType} [sessionType]
   * @param {string} appIdOrName
   * @param {string} [verId]
   * @param {string} scenarioIdOrName
   * @param {string} [displayName]
   * @param {BatchInfo} batchInfo
   * @param {string} [baselineEnvName]
   * @param {string} [environmentName]
   * @param {AppEnvironment} environment
   * @param {ImageMatchSettings} defaultMatchSettings
   * @param {string} [branchName]
   * @param {string} [parentBranchName]
   * @param {string} [parentBranchBaselineSavedBefore]
   * @param {string} [baselineBranchName]
   * @param {boolean} [compareWithParentBranch]
   * @param {boolean} [ignoreBaseline]
   * @param {boolean} [saveDiffs]
   * @param {boolean} [render]
   * @param {PropertyData[]} [properties]
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
   * @return {boolean}
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

exports.SessionStartInfo = SessionStartInfo
