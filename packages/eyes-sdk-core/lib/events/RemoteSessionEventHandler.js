'use strict'
const axios = require('axios')
const GeneralUtils = require('../utils/GeneralUtils')
const SessionEventHandler = require('./SessionEventHandler')

// Constants
const DEFAULT_CONNECTION_TIMEOUT_MS = 30000
const SERVER_SUFFIX = '/applitools/sessions'

class RemoteSessionEventHandler extends SessionEventHandler {
  constructor(serverUrl, accessKey) {
    super()

    this._autSessionId = null
    this._serverUrl = serverUrl
    this._httpOptions = {
      strictSSL: false,
      baseUrl: GeneralUtils.urlConcat(serverUrl, SERVER_SUFFIX),
      json: true,
      params: {accessKey},
      timeout: DEFAULT_CONNECTION_TIMEOUT_MS,
    }
  }

  /**
   * @param {number} value
   */
  setTimeout(value) {
    this._httpOptions.timeout = value
  }

  /**
   * @return {number}
   */
  getTimeout() {
    return this._httpOptions.timeout
  }

  /**
   * @param {string} value
   */
  setServerUrl(value) {
    this._serverUrl = value
    this._httpOptions.baseUrl = GeneralUtils.urlConcat(value, SERVER_SUFFIX)
  }

  /**
   * @return {string}
   */
  getServerUrl() {
    return this._serverUrl
  }

  /**
   * @param {string} value
   */
  setAccessKey(value) {
    this._httpOptions.params.accessKey = value
  }

  /**
   * @return {string}
   */
  getAccessKey() {
    return this._httpOptions.params.accessKey
  }

  /**
   * @inheritDoc
   */
  initStarted() {
    const options = Object.create(this._httpOptions)
    options.uri = this._autSessionId
    options.data = {action: 'initStart'}
    options.method = 'PUT'
    return axios(options)
  }

  /**
   * @inheritDoc
   */
  initEnded() {
    const options = Object.create(this._httpOptions)
    options.uri = this._autSessionId
    options.data = {action: 'initEnd'}
    options.method = 'PUT'
    return axios(options)
  }

  /**
   * @inheritDoc
   */
  setSizeWillStart(sizeToSet) {
    const options = Object.create(this._httpOptions)
    options.uri = this._autSessionId
    options.data = {action: 'setSizeStart', size: sizeToSet}
    options.method = 'PUT'
    return axios(options)
  }

  /**
   * @inheritDoc
   */
  setSizeEnded() {
    const options = Object.create(this._httpOptions)
    options.uri = this._autSessionId
    options.data = {action: 'setSizeEnd'}
    options.method = 'PUT'
    return axios(options)
  }

  /**
   * @inheritDoc
   */
  testStarted(autSessionId) {
    this._autSessionId = autSessionId

    const options = Object.create(this._httpOptions)
    options.uri = ''
    options.data = {autSessionId}
    options.method = 'POST'
    return axios(options)
  }

  /**
   * @inheritDoc
   */
  testEnded(autSessionId, testResults) {
    const options = Object.create(this._httpOptions)
    options.uri = autSessionId
    options.data = {action: 'testEnd', testResults}
    options.method = 'PUT'
    return axios(options)
  }

  /**
   * @inheritDoc
   */
  validationWillStart(autSessionId, validationInfo) {
    const options = Object.create(this._httpOptions)
    options.uri = `${autSessionId}/validations`
    options.data = validationInfo
    options.method = 'POST'
    return axios(options)
  }

  /**
   * @inheritDoc
   */
  validationEnded(autSessionId, validationId, validationResult) {
    const options = Object.create(this._httpOptions)
    options.uri = `${autSessionId}/validations/${validationId}`
    options.data = {action: 'validationEnd', asExpected: validationResult.getAsExpected()}
    options.method = 'PUT'
    return axios(options)
  }
}

module.exports = RemoteSessionEventHandler
