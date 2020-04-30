;(function() {
  'use strict'

  var GeneralUtils = require('@applitools/eyes-common-legacy').GeneralUtils
  var NullLogHandler = require('./NullLogHandler').NullLogHandler

  /**
   * Write log massages using the provided Log Handler
   *
   * @constructor
   **/
  function Logger() {
    this._logHandler = new NullLogHandler()
  }

  /**
   * Set the log handler
   *
   * @param {LogHandler} logHandler
   */
  Logger.prototype.setLogHandler = function(logHandler) {
    this._logHandler = logHandler || new NullLogHandler()
  }

  /**
   * Get the log handler
   *
   * @return {LogHandler} logHandler
   */
  Logger.prototype.getLogHandler = function() {
    return this._logHandler
  }

  function _stringify(args) {
    return args
      .map(function(arg) {
        if (typeof arg === 'object') {
          if (arg && typeof arg.secretToken !== 'undefined') {
            arg = GeneralUtils.clone(arg)
            arg.secretToken = 'REMOVED_FROM_LOGS'
          }
          return JSON.stringify(arg)
        }

        return arg
      })
      .join(' ')
  }

  Logger.prototype.verbose = function() {
    this._logHandler.onMessage(true, _stringify(Array.prototype.slice.call(arguments, 0)))
  }

  Logger.prototype.log = function() {
    this._logHandler.onMessage(false, _stringify(Array.prototype.slice.call(arguments, 0)))
  }

  exports.Logger = Logger
})()
