;(function() {
  'use strict'

  const request = require('request')
  const GeneralUtils = require('@applitools/eyes-common-legacy').GeneralUtils
  const ArgumentGuard = require('@applitools/eyes-common-legacy').ArgumentGuard
  const RenderingInfo = require('./RenderingInfo').RenderingInfo

  // constants
  const TIMEOUT = 5 * 60 * 1000,
    API_PATH = '/api/sessions/running',
    DEFAULT_HEADERS = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    }

  const LONG_REQUEST_DELAY = 2000, // ms
    MAX_LONG_REQUEST_DELAY = 10000, // ms
    LONG_REQUEST_DELAY_MULTIPLICATIVE_INCREASE_FACTOR = 1.5

  const RETRY_REQUEST_INTERVAL = 500 // ms

  const HTTP_STATUS_CODES = {
    CREATED: 201,
    ACCEPTED: 202,
    OK: 200,
    GONE: 410,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
    BAD_GATEWAY: 502,
    GATEWAY_TIMEOUT: 504,
  }

  const HTTP_FAILED_CODES = [
    HTTP_STATUS_CODES.NOT_FOUND,
    HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
    HTTP_STATUS_CODES.BAD_GATEWAY,
    HTTP_STATUS_CODES.GATEWAY_TIMEOUT,
  ]

  const REQUEST_FAILED_CODES = ['ECONNRESET', 'ECONNABORTED', 'ETIMEDOUT', 'ENOTFOUND', 'EAI_AGAIN']
  const AGENT_ID_HEADER = 'x-applitools-eyes-client'

  /**
   * Provides an API for communication with the Applitools server.
   *
   * @param {PromiseFactory} promiseFactory An object which will be used for creating deferreds/promises.
   * @param {string} serverUrl
   * @param {Logger} logger
   * @constructor
   **/
  function ServerConnector({promiseFactory, serverUrl, logger, getAgentId}) {
    this._promiseFactory = promiseFactory
    this._getAgentId = getAgentId
    this._logger = logger
    this._runKey = undefined
    this._renderingInfo = undefined
    this._httpOptions = {
      proxy: null,
      strictSSL: false,
      headers: DEFAULT_HEADERS,
      timeout: TIMEOUT,
      qs: {},
    }

    this.setServerUrl(serverUrl)
    this.setApiKey(undefined)
  }

  /**
   * Activate/Deactivate HTTP client debugging.
   *
   * @param {boolean} isDebug Whether or not to activate debugging.
   */
  ServerConnector.prototype.setDebugMode = function(isDebug) {
    request.debug = isDebug
  }

  /**
   * @return {boolean} Whether or not debug mode is active.
   */
  ServerConnector.prototype.getIsDebugMode = function() {
    return request.debug
  }

  /**
   * Sets the current server URL used by the rest client.
   *
   * @param serverUrl {string} The URI of the rest server.
   */
  ServerConnector.prototype.setServerUrl = function(serverUrl) {
    this._serverUrl = serverUrl
    this._endPoint = GeneralUtils.urlConcat(serverUrl, API_PATH)
  }

  /**
   *
   * @return {string} The URI of the eyes server.
   */
  ServerConnector.prototype.getServerUrl = function() {
    return this._serverUrl
  }

  /**
   * Sets the API key of your applitools Eyes account.
   *
   * @param runKey {string} The run key to be used.
   * @param [newAuthScheme] {boolean} Whether or not the server uses the new authentication scheme.
   */
  ServerConnector.prototype.setApiKey = function(runKey, newAuthScheme) {
    this._runKey = runKey || process.env.APPLITOOLS_API_KEY
    if (newAuthScheme) {
      this._httpOptions.qs.accessKey = this._runKey
    } else {
      this._httpOptions.qs.apiKey = this._runKey
    }
  }

  /**
   *
   * @return {string} The current run key.
   */
  ServerConnector.prototype.getApiKey = function() {
    return this._runKey
  }

  /**
   * Sets the proxy settings to be used by the request module.
   *
   * @param {string} url The proxy url to be used. If {@code null} then no proxy is set.
   * @param {string} [username]
   * @param {string} [password]
   */
  ServerConnector.prototype.setProxy = function(url, username, password) {
    var proxyString
    if (username) {
      var i = url.indexOf('://')
      var protocol = 'http'
      if (i !== -1) {
        protocol = url.slice(0, i)
        url = url.slice(i + 3)
      }
      proxyString = protocol + '://' + username + ':' + password + '@' + url
    } else {
      proxyString = url
    }

    this._httpOptions.proxy = proxyString
  }

  /**
   *
   * @return {string} The current proxy settings used by the rest client, or {@code null} if no proxy is set.
   */
  ServerConnector.prototype.getProxy = function() {
    return this._httpOptions.proxy
  }

  /**
   * Whether sessions are removed immediately after they are finished.
   *
   * @param shouldRemove {boolean}
   */
  ServerConnector.prototype.setRemoveSession = function(shouldRemove) {
    this._httpOptions.qs.removeSession = shouldRemove
  }

  /**
   *
   * @return {boolean} Whether sessions are removed immediately after they are finished.
   */
  ServerConnector.prototype.getRemoveSession = function() {
    return !!this._httpOptions.qs.removeSession
  }

  ServerConnector.prototype.setRenderingInfo = function(renderingInfo) {
    this._renderingInfo = renderingInfo
  }

  ServerConnector.prototype.getRenderingInfo = function() {
    return this._renderingInfo
  }

  ServerConnector.prototype.startSession = function(sessionStartInfo) {
    this._logger.verbose('ServerConnector.startSession called with:', sessionStartInfo)

    var that = this
    var uri = this._endPoint
    var options = {
      body: JSON.stringify({startInfo: sessionStartInfo}),
    }

    return _sendLongRequest(that, 'startSession', uri, 'post', options).then(function(results) {
      if (results.status === HTTP_STATUS_CODES.OK || results.status === HTTP_STATUS_CODES.CREATED) {
        that._logger.verbose('ServerConnector.startSession - post succeeded')

        return {
          sessionId: results.body.id,
          legacySessionId: results.body.legacySessionId,
          sessionUrl: results.body.url,
          isNewSession:
            results.body.isNew === undefined
              ? results.status === HTTP_STATUS_CODES.CREATED
              : results.body.isNew,
        }
      }

      throw new Error(
        `ServerConnector.startSession - unexpected status ${_makeResponseOutputString(
          results.response,
        )}`,
      )
    })
  }

  ServerConnector.prototype.endSession = function(runningSession, isAborted, save) {
    this._logger.verbose(
      'ServerConnector.endSession called with isAborted:',
      isAborted,
      ', save:',
      save,
      'for session:',
      runningSession,
    )

    var that = this
    var uri = GeneralUtils.urlConcat(this._endPoint, runningSession.sessionId.toString())
    var options = {
      query: {
        aborted: isAborted,
        updateBaseline: save,
      },
    }

    return _sendLongRequest(that, 'stopSession', uri, 'delete', options).then(function(results) {
      if (results.status === HTTP_STATUS_CODES.OK) {
        that._logger.verbose('ServerConnector.stopSession - post succeeded')
        return results.body
      }

      throw new Error(
        `ServerConnector.stopSession - unexpected status ${_makeResponseOutputString(
          results.response,
        )}`,
      )
    })
  }

  ServerConnector.prototype.renderInfo = function() {
    this._logger.verbose('ServerConnector.renderInfo called.')

    var that = this
    var uri = GeneralUtils.urlConcat(this._serverUrl, '/api/sessions/renderinfo')

    return _sendLongRequest(this, 'renderInfo', uri, 'get').then(function(results) {
      if (results.status === HTTP_STATUS_CODES.OK) {
        that._renderingInfo = new RenderingInfo(
          results.body.serviceUrl,
          results.body.accessToken,
          results.body.resultsUrl,
        )
        that._logger.verbose('ServerConnector.renderInfo - post succeeded', that._renderingInfo)
        return that._renderingInfo
      }
      throw new Error(
        `ServerConnector.renderInfo - unexpected status ${_makeResponseOutputString(
          results.response,
        )}`,
      )
    })
  }

  ServerConnector.prototype.uploadScreenshot = function(id, screenshot) {
    var uri = this._renderingInfo.getResultsUrl().replace('__random__', id)
    var options = {
      body: screenshot,
      headers: {
        Date: new Date().toISOString(),
        'x-ms-blob-type': 'BlockBlob',
        'content-type': 'application/octet-stream',
      },
    }

    return _sendLongRequest(this, 'uploadScreenshot', uri, 'put', options, 3).then(function(
      results,
    ) {
      if (results.status !== HTTP_STATUS_CODES.CREATED) {
        throw new Error(
          `ServerConnector.uploadScreenshot - unexpected status ${_makeResponseOutputString(
            results.response,
          )}`,
        )
      }
      return uri
    })
  }

  /**
   * Matches the current window to the expected window.
   * @param {RunningSession} runningSession The current agent's running session.
   * @param {object} matchWindowData The window data.
   * @param {Buffer} screenshot The PNG bytes of the updated image.
   * @return {Promise<{asExpected: boolean}>} A promise which resolves when matching is done, or rejects on error.
   */
  ServerConnector.prototype.matchWindow = function(runningSession, matchWindowData) {
    this._logger.verbose(
      'ServerConnector.matchWindow called with ',
      matchWindowData,
      ' for session: ',
      runningSession,
    )

    var that = this
    var uri = GeneralUtils.urlConcat(this._endPoint, runningSession.sessionId.toString())
    var options = {
      body: JSON.stringify(matchWindowData),
    }

    return _sendLongRequest(that, 'matchWindow', uri, 'post', options).then(function(results) {
      if (results.status === HTTP_STATUS_CODES.OK) {
        that._logger.verbose('ServerConnector.matchWindow - post succeeded')

        return {
          asExpected: results.body.asExpected,
        }
      }

      throw new Error(
        `ServerConnector.matchWindow - unexpected status ${_makeResponseOutputString(
          results.response,
        )}`,
      )
    })
  }

  //noinspection JSValidateJSDoc
  /**
   * Replaces an actual image in the current running session.
   * @param {RunningSession} runningSession The currently running session.
   * @param {number} stepIndex The zero based index of the step in which to replace the actual image.
   * @param {object} replaceWindowData The updated window data (similar to matchWindowData only without ignoreMismatch).
   * @param {Buffer} screenshot The PNG bytes of the updated image.
   * @return {Promise<{asExpected: boolean}>} A promise which resolves when replacing is done, or rejects on error.
   */
  ServerConnector.prototype.replaceWindow = function(
    runningSession,
    stepIndex,
    replaceWindowData,
    screenshot,
  ) {
    this._logger.verbose(
      'ServerConnector.replaceWindow called with ',
      replaceWindowData,
      ' for session: ',
      runningSession,
    )

    var that = this
    var uri = GeneralUtils.urlConcat(
      this._endPoint,
      runningSession.sessionId.toString() + '/' + stepIndex,
    )
    var options = {
      contentType: 'application/octet-stream',
      body: Buffer.concat([_createDataBytes(replaceWindowData), screenshot]),
    }

    return _sendLongRequest(that, 'replaceWindow', uri, 'put', options).then(function(results) {
      if (results.status === HTTP_STATUS_CODES.OK) {
        that._logger.verbose('ServerConnector.replaceWindow - post succeeded')

        return {
          asExpected: results.body.asExpected,
        }
      }

      throw new Error(
        `ServerConnector.replaceWindow - unexpected status ${_makeResponseOutputString(
          results.response,
        )}`,
      )
    })
  }

  /**
   * @private
   * @param {ServerConnector} that
   * @param {string} name
   * @param {string} uri
   * @param {string} method
   * @param {object} options
   * @return {Promise<{status: int, body: object, response: {statusCode: int, statusMessage: string, headers: object}}>}
   */
  function _sendLongRequest(that, name, uri, method, options = {}) {
    var headers = {
      'Eyes-Expect': '202+location',
      'Eyes-Date': GeneralUtils.getRfc1123Date(),
    }

    options.headers = options.headers
      ? GeneralUtils.objectAssign(options.headers, headers)
      : headers
    return _sendRequest(that, name, uri, method, options).then(function(results) {
      if (
        results.status === HTTP_STATUS_CODES.ACCEPTED &&
        Boolean(results.response.headers.location)
      ) {
        return _longRequestCheckStatus(that, name, uri, method, options, results, true)
      } else {
        return results
      }
    })
  }

  /**
   * @private
   * @param {ServerConnector} that
   * @param {string} name
   * @param {string} uri
   * @param {string} method
   * @param {object} options
   * @param {{status: int, body: object, response: {statusCode: int, statusMessage: string, headers: object}}} results
   * @param {boolean} retryIfGone
   * @return {Promise<{status: int, body: object, response: {statusCode: int, statusMessage: string, headers: object}}>}
   */
  function _longRequestCheckStatus(that, name, uri, method, options, results, retryIfGone) {
    switch (results.status) {
      case HTTP_STATUS_CODES.OK:
        return that._promiseFactory.resolve(results)
      case HTTP_STATUS_CODES.ACCEPTED:
        var loopUri = results.response.headers.location
        return _longRequestLoop(that, name, loopUri, LONG_REQUEST_DELAY).then(function(results) {
          return _longRequestCheckStatus(that, name, uri, method, options, results, retryIfGone)
        })
      case HTTP_STATUS_CODES.CREATED:
        var deleteUri = results.response.headers.location
        var loopOptions = {headers: {'Eyes-Date': GeneralUtils.getRfc1123Date()}}
        return _sendRequest(that, name, deleteUri, 'delete', loopOptions)
      case HTTP_STATUS_CODES.GONE:
        if (retryIfGone) {
          that._logger.log(
            'ServerConnector.' + name + ' - long request gone, doing one more attempt',
          )
          return _sendRequest(that, name, uri, method, options).then(function(results) {
            return _longRequestCheckStatus(that, name, uri, method, options, results, false)
          })
        }

        that._logger.log('ServerConnector.' + name + ' - long request gone: ', results)
        return that._promiseFactory.reject(new Error('The server task has gone.'))
      default:
        that._logger.log('ServerConnector.' + name + ' - long request failed: ', results)
        return that._promiseFactory.reject(new Error('Unknown error processing long request'))
    }
  }

  /**
   * @private
   * @param {ServerConnector} that
   * @param {string} name
   * @param {string} uri
   * @param {number} delay
   * @return {Promise<{status: int, body: object, response: {statusCode: int, statusMessage: string, headers: object}}>}
   */
  function _longRequestLoop(that, name, uri, delay) {
    delay = Math.min(
      MAX_LONG_REQUEST_DELAY,
      Math.floor(delay * LONG_REQUEST_DELAY_MULTIPLICATIVE_INCREASE_FACTOR),
    )
    that._logger.verbose(name + ': Still running... Retrying in ' + delay + ' ms')

    return GeneralUtils.sleep(delay, that._promiseFactory)
      .then(function() {
        var options = {headers: {'Eyes-Date': GeneralUtils.getRfc1123Date()}}
        return _sendRequest(that, name, uri, 'get', options)
      })
      .then(function(result) {
        if (result.status !== HTTP_STATUS_CODES.OK) return result
        return _longRequestLoop(that, name, uri, delay)
      })
  }

  function _makeParamsOutputString(params) {
    if (!params) return ''
    return `with params ${JSON.stringify(params)}`
  }

  function _makeResponseOutputString(response) {
    try {
      return JSON.stringify(response)
    } catch (error) {
      return `${response}`
    }
  }

  function _makeBodyOutputString(body) {
    try {
      return JSON.parse(body)
    } catch (error) {
      return `${body}`
    }
  }

  /**
   * @private
   * @param {ServerConnector} that
   * @param {string} name
   * @param {string} uri
   * @param {string} method
   * @param {object} options
   * @param {number} [retry=1]
   * @param {boolean} [delayBeforeRetry=false]
   * @return {Promise<{status: int, body: object, response: {statusCode: int, statusMessage: string, headers: object}}>}
   */
  function _sendRequest(that, name, uri, method, options, retry = 1, delayBeforeRetry = false) {
    options = options || {}

    const req = GeneralUtils.clone(that._httpOptions)
    req.headers = {...req.headers, [AGENT_ID_HEADER]: that._getAgentId()}
    req.uri = uri
    req.method = method
    if (options.query) req.qs = GeneralUtils.objectAssign(req.qs, options.query)
    if (options.headers) req.headers = GeneralUtils.objectAssign(req.headers, options.headers)
    if (options.body) req.body = options.body
    if (options.contentType) req.headers['Content-Type'] = options.contentType

    return that._promiseFactory.makePromise(function(resolve, reject) {
      that._logger.verbose(
        `ServerConnector.${name} will now call to: ${uri} ${_makeParamsOutputString(
          options.query,
        )}`,
      )
      request(req, function(err, response, body) {
        if (err) {
          let reasonMsg = err.message
          if (err.response && err.response.statusMessage) {
            reasonMsg += ` (${err.response.statusMessage})`
          }

          that._logger.log(
            `ServerConnector.${name} - ${method} failed on ${uri}: ${reasonMsg} ${_makeParamsOutputString(
              options.query,
            )}`,
          )
          that._logger.verbose(`ServerConnector.${name} - failure body:\n${err.message}`)

          if (
            retry > 0 &&
            ((err.response && HTTP_FAILED_CODES.includes(err.response.status)) ||
              REQUEST_FAILED_CODES.includes(err.code))
          ) {
            that._logger.verbose(
              `Request failed with message '${err.message}' and error code '${err.code}'${
                err.response && err.response.statusCode
                  ? ' and status code ' + "'" + err.response.statusCode + "'"
                  : ''
              }. Retrying...`,
            )

            if (delayBeforeRetry) {
              return GeneralUtils.sleep(RETRY_REQUEST_INTERVAL, that._promiseFactory).then(
                function() {
                  return _sendRequest(that, name, uri, method, options, retry - 1, delayBeforeRetry)
                },
              )
            }

            return _sendRequest(that, name, uri, method, options, retry - 1, delayBeforeRetry)
          }

          return reject(new Error(err))
        }

        const results = {
          status: response.statusCode,
          body: body ? _makeBodyOutputString(body) : null,
          response: {
            statusCode: response.statusCode,
            statusMessage: response.statusMessage,
            headers: response.headers,
          },
        }

        that._logger.verbose(
          `ServerConnector.${name} - result ${response.statusMessage}, status code ${response.statusCode}, url ${uri}`,
        )
        return resolve(results)
      })
    })
  }

  /**
   * Creates a bytes representation of the given JSON.
   *
   * @private
   * @param {object} jsonData The data from for which to create the bytes representation.
   * @return {Buffer} a buffer of bytes which represents the stringified JSON, prefixed with size.
   */
  function _createDataBytes(jsonData) {
    var dataStr = JSON.stringify(jsonData)
    var dataLen = Buffer.byteLength(dataStr, 'utf8')

    // The result buffer will contain the length of the data + 4 bytes of size
    var result = Buffer.alloc(dataLen + 4)
    result.writeUInt32BE(dataLen, 0)
    result.write(dataStr, 4, dataLen)
    return result
  }

  exports._makeParamsOutputString = _makeParamsOutputString
  exports._makeResponseOutputString = _makeResponseOutputString
  exports._makeBodyOutputString = _makeBodyOutputString
  exports.ServerConnector = ServerConnector
})()
