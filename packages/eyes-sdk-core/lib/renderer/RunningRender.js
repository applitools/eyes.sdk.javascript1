'use strict'

const {GeneralUtils} = require('../..')

/**
 * Encapsulates data for the render currently running in the client.
 */
class RunningRender {
  /**
   * @param {string} renderId
   * @param {string} jobId
   * @param {RenderStatus} renderStatus
   * @param {string[]} needMoreResources
   * @param {boolean} needMoreDom
   */
  constructor({renderId, jobId, renderStatus, needMoreResources, needMoreDom} = {}) {
    this._renderId = renderId
    this._jobId = jobId
    this._renderStatus = renderStatus
    this._needMoreResources = needMoreResources
    this._needMoreDom = needMoreDom
  }

  /**
   * @return {string}
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
   * @return {string}
   */
  getJobId() {
    return this._jobId
  }

  /**
   * @param {string} value
   */
  setJobId(value) {
    this._jobId = value
  }

  /**
   * @return {RenderStatus}
   */
  getRenderStatus() {
    return this._renderStatus
  }

  /**
   * @param {RenderStatus} value
   */
  setRenderStatus(value) {
    this._renderStatus = value
  }

  /**
   * @return {string[]}
   */
  getNeedMoreResources() {
    return this._needMoreResources
  }

  /**
   * @param {string[]} value
   */
  setNeedMoreResources(value) {
    this._needMoreResources = value
  }

  /**
   * @return {boolean}
   */
  getNeedMoreDom() {
    return this._needMoreDom
  }

  /**
   * @param {boolean} value
   */
  setNeedMoreDom(value) {
    this._needMoreDom = value
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
    return `RunningRender { ${JSON.stringify(this)} }`
  }
}

exports.RunningRender = RunningRender
