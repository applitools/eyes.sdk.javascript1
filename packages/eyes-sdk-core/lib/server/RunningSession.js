'use strict'
const {GeneralUtils} = require('../..')
const RenderingInfo = require('./RenderingInfo')

/**
 * Encapsulates data for the session currently running in the agent.
 */
class RunningSession {
  /**
   * @param session
   * @param {string} session.id
   * @param {string} session.sessionId
   * @param {string} session.batchId
   * @param {string} session.baselineId
   * @param {string} session.url
   * @param {RenderingInfo|object} session.renderingInfo
   */
  constructor({id, sessionId, batchId, baselineId, url, renderingInfo, isNew} = {}) {
    if (renderingInfo && !(renderingInfo instanceof RenderingInfo)) {
      renderingInfo = new RenderingInfo(renderingInfo)
    }

    this._id = id
    this._sessionId = sessionId
    this._batchId = batchId
    this._baselineId = baselineId
    this._url = url
    this._renderingInfo = renderingInfo
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
   * @return {string}
   */
  getSessionId() {
    return this._sessionId
  }

  /**
   * @param {string} value
   */
  setSessionId(value) {
    this._sessionId = value
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
  getUrl() {
    return this._url
  }

  /**
   * @param {string} value
   */
  setUrl(value) {
    this._url = value
  }

  /**
   * @return {RenderingInfo}
   */
  getRenderingInfo() {
    return this._renderingInfo
  }

  /**
   * @param {RenderingInfo} value
   */
  setRenderingInfo(value) {
    this._renderingInfo = value
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
    return `RunningSession { ${JSON.stringify(this)} }`
  }
}

module.exports = RunningSession
