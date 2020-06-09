'use strict'

const {GeneralUtils} = require('../..')

class RenderingInfo {
  /**
   * @param {string} serviceUrl
   * @param {string} accessToken
   * @param {string} resultsUrl
   */
  constructor({serviceUrl, accessToken, resultsUrl, stitchingServiceUrl} = {}) {
    this._serviceUrl = serviceUrl
    this._accessToken = accessToken
    this._resultsUrl = resultsUrl
    this._stitchingServiceUrl = stitchingServiceUrl
  }

  /**
   * @return {string}
   */
  getServiceUrl() {
    return this._serviceUrl
  }

  /**
   * @param {string} value
   */
  setServiceUrl(value) {
    this._serviceUrl = value
  }

  /**
   * @return {string}
   */
  getAccessToken() {
    return this._accessToken
  }

  /**
   * @param {string} value
   */
  setAccessToken(value) {
    this._accessToken = value
  }

  /**
   * @return {string}
   */
  getResultsUrl() {
    return this._resultsUrl
  }

  /**
   * @param {string} value
   */
  setResultsUrl(value) {
    this._resultsUrl = value
  }

  /**
   * @return {{sub: string, exp: number, iss: string}}
   */
  getDecodedAccessToken() {
    if (this._payload) {
      this._payload = GeneralUtils.jwtDecode(this._accessToken)
    }
    return this._payload
  }

  /**
   * @return {string}
   */
  getStitchingServiceUrl() {
    return this._stitchingServiceUrl
  }

  /**
   * @override
   */
  toJSON() {
    return GeneralUtils.toPlain(this, ['_payload'])
  }

  /**
   * @override
   */
  toString() {
    return `RenderingInfo { ${JSON.stringify(this)} }`
  }
}

exports.RenderingInfo = RenderingInfo
