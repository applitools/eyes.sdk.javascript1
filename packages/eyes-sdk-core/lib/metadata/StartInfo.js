'use strict'

const {GeneralUtils} = require('../..')

const {ImageMatchSettings} = require('./ImageMatchSettings')
const {BatchInfo} = require('./BatchInfo')
const {AppEnvironment} = require('../AppEnvironment')

class StartInfo {
  /**
   * @param {string} sessionType
   * @param {boolean} isTransient
   * @param {boolean} ignoreBaseline
   * @param {string} appIdOrName
   * @param {boolean} compareWithParentBranch
   * @param {string} scenarioIdOrName
   * @param {string} displayName
   * @param {BatchInfo|object} batchInfo
   * @param {AppEnvironment|object} environment
   * @param {MatchLevel|string} matchLevel
   * @param {ImageMatchSettings|object} defaultMatchSettings
   * @param {string} agentId
   * @param {object[]} properties
   * @param {boolean} render
   */
  constructor({
    sessionType,
    isTransient,
    ignoreBaseline,
    appIdOrName,
    compareWithParentBranch,
    scenarioIdOrName,
    displayName,
    batchInfo,
    environment,
    matchLevel,
    defaultMatchSettings,
    agentId,
    properties,
    render,
  } = {}) {
    if (batchInfo && !(batchInfo instanceof BatchInfo)) {
      batchInfo = new BatchInfo(batchInfo)
    }

    if (defaultMatchSettings && !(defaultMatchSettings instanceof ImageMatchSettings)) {
      defaultMatchSettings = new ImageMatchSettings(defaultMatchSettings)
    }

    if (environment && !(environment instanceof AppEnvironment)) {
      environment = new AppEnvironment(environment)
    }

    this._sessionType = sessionType
    this._isTransient = isTransient
    this._ignoreBaseline = ignoreBaseline
    this._appIdOrName = appIdOrName
    this._compareWithParentBranch = compareWithParentBranch
    this._scenarioIdOrName = scenarioIdOrName
    this._displayName = displayName
    this._batchInfo = batchInfo
    this._environment = environment
    this._matchLevel = matchLevel
    this._defaultMatchSettings = defaultMatchSettings
    this._agentId = agentId
    this._properties = properties
    this._render = render
  }

  /**
   * @return {string}
   */
  getSessionType() {
    return this._sessionType
  }

  /**
   * @param {string} value
   */
  setSessionType(value) {
    this._sessionType = value
  }

  /**
   * @return {boolean}
   */
  getIsTransient() {
    return this._isTransient
  }

  /**
   * @param {boolean} value
   */
  setIsTransient(value) {
    this._isTransient = value
  }

  /**
   * @return {boolean}
   */
  getIgnoreBaseline() {
    return this._ignoreBaseline
  }

  /**
   * @param {boolean} value
   */
  setIgnoreBaseline(value) {
    this._ignoreBaseline = value
  }

  /**
   * @return {string}
   */
  getAppIdOrName() {
    return this._appIdOrName
  }

  /**
   * @param {string} value
   */
  setAppIdOrName(value) {
    this._appIdOrName = value
  }

  /**
   * @return {boolean}
   */
  getCompareWithParentBranch() {
    return this._compareWithParentBranch
  }

  /**
   * @param {boolean} value
   */
  setCompareWithParentBranch(value) {
    this._compareWithParentBranch = value
  }

  /**
   * @return {string}
   */
  getScenarioIdOrName() {
    return this._scenarioIdOrName
  }

  /**
   * @param {string} value
   */
  setScenarioIdOrName(value) {
    this._scenarioIdOrName = value
  }

  /**
   * @return {string}
   */
  getDisplayName() {
    return this._displayName
  }

  /**
   * @param {string} value
   */
  setDisplayName(value) {
    this._displayName = value
  }

  /**
   * @return {BatchInfo}
   */
  getBatchInfo() {
    return this._batchInfo
  }

  /**
   * @param {BatchInfo} value
   */
  setBatchInfo(value) {
    this._batchInfo = value
  }

  /**
   * @return {AppEnvironment}
   */
  getEnvironment() {
    return this._environment
  }

  /**
   * @param {AppEnvironment} value
   */
  setEnvironment(value) {
    this._environment = value
  }

  /**
   * @return {string}
   */
  getMatchLevel() {
    return this._matchLevel
  }

  /**
   * @param {string} value
   */
  setMatchLevel(value) {
    this._matchLevel = value
  }

  /**
   * @return {ImageMatchSettings}
   */
  getDefaultMatchSettings() {
    return this._defaultMatchSettings
  }

  /**
   * @param {ImageMatchSettings} value
   */
  setDefaultMatchSettings(value) {
    this._defaultMatchSettings = value
  }

  /**
   * @return {string}
   */
  getAgentId() {
    return this._agentId
  }

  /**
   * @param {string} value
   */
  setAgentId(value) {
    this._agentId = value
  }

  /**
   * @return {object[]}
   */
  getProperties() {
    return this._properties
  }

  /**
   * @param {object[]} value
   */
  setProperties(value) {
    this._properties = value
  }

  /**
   * @return {boolean}
   */
  getRender() {
    return this._render
  }

  /**
   * @param {boolean} value
   */
  setRender(value) {
    this._render = value
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
    return `StartInfo { ${JSON.stringify(this)} }`
  }
}

exports.StartInfo = StartInfo
