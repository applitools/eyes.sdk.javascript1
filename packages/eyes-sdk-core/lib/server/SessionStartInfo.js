'use strict';

const { GeneralUtils, ArgumentGuard } = require('@applitools/eyes-common');

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
   * @param {string} [baselineBranchName]
   * @param {boolean} [compareWithParentBranch]
   * @param {boolean} [ignoreBaseline]
   * @param {boolean} [saveDiffs]
   * @param {boolean} [render]
   * @param {PropertyData[]} [properties]
   */
  constructor({ agentId, sessionType, appIdOrName, verId, scenarioIdOrName, displayName, batchInfo, baselineEnvName, environmentName,
    environment, defaultMatchSettings, branchName, parentBranchName, baselineBranchName, compareWithParentBranch,
    ignoreBaseline, saveDiffs, render, properties } = {}) {
    ArgumentGuard.notNullOrEmpty(agentId, 'agentId');
    ArgumentGuard.notNullOrEmpty(appIdOrName, 'appIdOrName');
    ArgumentGuard.notNullOrEmpty(scenarioIdOrName, 'scenarioIdOrName');
    ArgumentGuard.notNull(batchInfo, 'batchInfo');
    ArgumentGuard.notNull(environment, 'environment');
    ArgumentGuard.notNull(defaultMatchSettings, 'defaultMatchSettings');

    this._agentId = agentId;
    this._sessionType = sessionType;
    this._appIdOrName = appIdOrName;
    this._verId = verId;
    this._scenarioIdOrName = scenarioIdOrName;
    this._displayName = displayName;
    this._batchInfo = batchInfo;
    this._baselineEnvName = baselineEnvName;
    this._environmentName = environmentName;
    this._environment = environment;
    this._defaultMatchSettings = defaultMatchSettings;
    this._branchName = branchName;
    this._parentBranchName = parentBranchName;
    this._baselineBranchName = baselineBranchName;
    this._compareWithParentBranch = compareWithParentBranch;
    this._ignoreBaseline = ignoreBaseline;
    this._saveDiffs = saveDiffs;
    this._render = render;
    this._properties = properties;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @return {string}
   */
  getAgentId() {
    return this._agentId;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @return {SessionType}
   */
  getSessionType() {
    return this._sessionType;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @return {string}
   */
  getAppIdOrName() {
    return this._appIdOrName;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @return {string}
   */
  getVerId() {
    return this._verId;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @return {string}
   */
  getScenarioIdOrName() {
    return this._scenarioIdOrName;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @return {string}
   */
  getDisplayName() {
    return this._displayName;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @return {BatchInfo}
   */
  getBatchInfo() {
    return this._batchInfo;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @return {string}
   */
  getBaselineEnvName() {
    return this._baselineEnvName;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @return {string}
   */
  getEnvironmentName() {
    return this._environmentName;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @return {AppEnvironment}
   */
  getEnvironment() {
    return this._environment;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @return {ImageMatchSettings}
   */
  getDefaultMatchSettings() {
    return this._defaultMatchSettings;
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
   * @return {string}
   */
  getParentBranchName() {
    return this._parentBranchName;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @return {string}
   */
  getBaselineBranchName() {
    return this._baselineBranchName;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @return {boolean}
   */
  getCompareWithParentBranch() {
    return this._compareWithParentBranch;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @return {boolean}
   */
  getIgnoreBaseline() {
    return this._ignoreBaseline;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @return {PropertyData[]}
   */
  getProperties() {
    return this._properties;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @return {boolean}
   */
  getRender() {
    return this._render;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @return {boolean}
   */
  getSaveDiffs() {
    return this._saveDiffs;
  }

  /**
   * @override
   */
  toJSON() {
    return GeneralUtils.toPlain(this);
  }

  /**
   * @override
   */
  toString() {
    return `SessionStartInfo { ${JSON.stringify(this)} }`;
  }
}

exports.SessionStartInfo = SessionStartInfo;
