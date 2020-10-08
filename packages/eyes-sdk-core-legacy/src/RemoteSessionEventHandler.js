;(function() {
  'use strict'

  var request = require('request'),
    SessionEventHandler = require('./SessionEventHandler'),
    GeneralUtils = require('@applitools/eyes-common-legacy').GeneralUtils

  // Constants
  var DEFAULT_CONNECTION_TIMEOUT_MS = 30 * 1000,
    SERVER_SUFFIX = '/applitools/sessions'

  exports.createSessionEventHandler = function(serverUrl, accessKey) {
    var sessionHandler = SessionEventHandler.createSessionEventHandler()

    sessionHandler._defaultHttpOptions = {
      strictSSL: false,
      baseUrl: GeneralUtils.urlConcat(serverUrl, SERVER_SUFFIX),
      json: true,
      qs: {},
    }

    // get/set timeout
    GeneralUtils.definePropertyWithDefaultConfig(
      sessionHandler,
      'timeout',
      function() {
        return this._defaultHttpOptions.timeout
      },
      function(timeout) {
        this._defaultHttpOptions.timeout = timeout
      },
    )

    // get/set serverUrl
    GeneralUtils.definePropertyWithDefaultConfig(
      sessionHandler,
      'serverUrl',
      function() {
        return this._serverUrl
      },
      function(serverUrl) {
        this._serverUrl = serverUrl
        this._defaultHttpOptions.baseUrl = GeneralUtils.urlConcat(serverUrl, SERVER_SUFFIX)
      },
    )

    // get/set accessKey
    GeneralUtils.definePropertyWithDefaultConfig(
      sessionHandler,
      'accessKey',
      function() {
        return this._defaultHttpOptions.qs.accessKey
      },
      function(accessKey) {
        this._defaultHttpOptions.qs.accessKey = accessKey
      },
    )

    // setting the properties' values.
    sessionHandler.timeout = DEFAULT_CONNECTION_TIMEOUT_MS
    sessionHandler.serverUrl = serverUrl
    sessionHandler.accessKey = accessKey

    // *** Overriding callbacks
    var _sendNotification = function(requestOptions, resolve, reject) {
      return request(requestOptions, function(err, response) {
        if (err) {
          reject(new Error(err))
          return
        }
        resolve(response.statusCode)
      })
    }

    sessionHandler.testStarted = function(autSessionId) {
      return this._promiseFactory.makePromise(
        function(resolve, reject) {
          var options = Object.create(this._defaultHttpOptions)
          options.uri = ''
          options.body = {autSessionId: autSessionId}
          options.method = 'post'
          _sendNotification(options, resolve, reject)
        }.bind(this),
      )
    }

    sessionHandler.testEnded = function(autSessionId, testResults) {
      return this._promiseFactory.makePromise(
        function(resolve, reject) {
          var options = Object.create(this._defaultHttpOptions)
          options.uri = autSessionId
          options.body = {action: 'testEnd', testResults: testResults}
          options.method = 'put'
          _sendNotification(options, resolve, reject)
        }.bind(this),
      )
    }

    sessionHandler.initStarted = function(autSessionId) {
      return this._promiseFactory.makePromise(
        function(resolve, reject) {
          var options = Object.create(this._defaultHttpOptions)
          options.uri = autSessionId
          options.body = {action: 'initStart'}
          options.method = 'put'
          _sendNotification(options, resolve, reject)
        }.bind(this),
      )
    }

    sessionHandler.initEnded = function(autSessionId) {
      return this._promiseFactory.makePromise(
        function(resolve, reject) {
          var options = Object.create(this._defaultHttpOptions)
          options.uri = autSessionId
          options.body = {action: 'initEnd'}
          options.method = 'put'
          _sendNotification(options, resolve, reject)
        }.bind(this),
      )
    }

    sessionHandler.setSizeWillStart = function(autSessionId, size) {
      return this._promiseFactory.makePromise(
        function(resolve, reject) {
          var options = Object.create(this._defaultHttpOptions)
          options.uri = autSessionId
          options.body = {action: 'setSizeStart', size: size}
          options.method = 'put'
          _sendNotification(options, resolve, reject)
        }.bind(this),
      )
    }

    sessionHandler.setSizeEnded = function(autSessionId) {
      return this._promiseFactory.makePromise(
        function(resolve, reject) {
          var options = Object.create(this._defaultHttpOptions)
          options.uri = autSessionId
          options.body = {action: 'setSizeEnd'}
          options.method = 'put'
          _sendNotification(options, resolve, reject)
        }.bind(this),
      )
    }

    sessionHandler.validationWillStart = function(autSessionId, validationInfo) {
      return this._promiseFactory.makePromise(
        function(resolve, reject) {
          var options = Object.create(this._defaultHttpOptions)
          options.uri = autSessionId + '/validations'
          options.body = validationInfo.toObject()
          options.method = 'post'
          _sendNotification(options, resolve, reject)
        }.bind(this),
      )
    }

    sessionHandler.validationEnded = function(autSessionId, validationId, validationResult) {
      return this._promiseFactory.makePromise(
        function(resolve, reject) {
          var options = Object.create(this._defaultHttpOptions)
          options.uri = autSessionId + '/validations/' + validationId
          options.body = {action: 'validationEnd', asExpected: validationResult.asExpected}
          options.method = 'put'
          _sendNotification(options, resolve, reject)
        }.bind(this),
      )
    }

    return sessionHandler
  }
})()
