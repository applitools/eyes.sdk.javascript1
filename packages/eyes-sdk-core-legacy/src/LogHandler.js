;(function() {
  'use strict'

  var GeneralUtils = require('@applitools/eyes-common-legacy').GeneralUtils

  /**
   * Handles log messages produces by the Eyes API.
   *
   * @abstract
   * @constructor
   */
  function LogHandler() {
    this._isVerbose = false
    this._isPrintSessionId = false
    this._sessionId = undefined
  }

  //noinspection JSUnusedGlobalSymbols
  /**
   * Whether to handle or ignore verbose log messages.
   *
   * @param {boolean} isVerbose
   */
  LogHandler.prototype.setIsVerbose = function(isVerbose) {
    // noinspection PointlessBooleanExpressionJS
    this._isVerbose = !!isVerbose
  }

  //noinspection JSUnusedGlobalSymbols
  /**
   * Whether to handle or ignore verbose log messages.
   *
   * @return {boolean} isVerbose
   */
  LogHandler.prototype.getIsVerbose = function() {
    return this._isVerbose
  }

  //noinspection JSUnusedGlobalSymbols
  /**
   * If set to {@code true} then log output include session id, useful in multi-thread environment
   *
   * @param {boolean} [isPrintSessionId=false]
   */
  LogHandler.prototype.setPrintSessionId = function(isPrintSessionId) {
    this._isPrintSessionId = isPrintSessionId || false
  }

  //noinspection JSUnusedGlobalSymbols
  /**
   * @return {boolean}
   */
  LogHandler.prototype.getIsPrintSessionId = function() {
    return this._isPrintSessionId
  }

  //noinspection JSUnusedGlobalSymbols
  /**
   * @protected
   * @param {string} sessionId
   */
  LogHandler.prototype.setSessionId = function(sessionId) {
    this._sessionId = sessionId
  }

  /**
   * @return {boolean}
   */
  LogHandler.prototype.open = function() {
    return true
  }

  /**
   * @return {boolean}
   */
  LogHandler.prototype.close = function() {
    return true
  }

  /**
   * @protected
   * @param {string} logString
   */
  LogHandler.prototype.formatMessage = function(logString) {
    var eyes = 'Eyes:'
    if (this._isPrintSessionId) {
      eyes = 'Eyes[' + this._sessionId + ']:'
    }

    return GeneralUtils.toISO8601DateTime() + ' ' + eyes + ' ' + logString
  }

  /**
   * @param {boolean} verbose
   * @param {string} logString
   */
  LogHandler.prototype.onMessage = function(verbose, logString) {}

  exports.LogHandler = LogHandler
})()
