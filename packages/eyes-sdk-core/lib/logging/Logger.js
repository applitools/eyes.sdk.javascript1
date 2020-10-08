'use strict'
const stackTrace = require('stack-trace')
const ArgumentGuard = require('../utils/ArgumentGuard')
const GeneralUtils = require('../utils/GeneralUtils')
const TypeUtils = require('../utils/TypeUtils')
const DateTimeUtils = require('../utils/DateTimeUtils')
const PerformanceUtils = require('../utils/PerformanceUtils')
const NullLogHandler = require('./NullLogHandler')
const ConsoleLogHandler = require('./ConsoleLogHandler')
const DebugLogHandler = require('./DebugLogHandler')

const timeStorage = PerformanceUtils.start()

/**
 * Write log messages using the provided Log Handler
 */
class Logger {
  /**
   * @param {boolean|string} [showLogs] - Determines which log handler will be used. If set to {@code true}, then
   *   `ConsoleLogHandler` will be used, if not set or set to {@code false} then `DebugLogHandler` used.
   * @param {string} [debugAppName] - If using `DebugLogHandler` then this is the debug app name.
   */
  constructor(showLogs = false, debugAppName) {
    if (TypeUtils.isString(showLogs)) {
      showLogs = showLogs === 'true'
    }

    ArgumentGuard.isBoolean(showLogs, 'showLogs')
    ArgumentGuard.isString(debugAppName, 'debugAppName', false)

    this._logHandler = showLogs
      ? new ConsoleLogHandler(true)
      : new DebugLogHandler(true, debugAppName)
    this._sessionId = ''
    this._isIncludeTime = false
  }

  /**
   * @param {string} sessionId
   */
  setSessionId(sessionId) {
    this._sessionId = sessionId
  }

  /**
   * @param {boolean} isIncludeTime
   */
  setIncludeTime(isIncludeTime) {
    this._isIncludeTime = isIncludeTime
  }

  /**
   * @return {LogHandler} - The currently set log handler.
   */
  getLogHandler() {
    return this._logHandler
  }

  /**
   * @param {LogHandler} [handler] - The log handler to set. If you want a log handler which does nothing, use
   *   {@link NullLogHandler}.
   */
  setLogHandler(handler) {
    this._logHandler = handler || new NullLogHandler()
  }

  /**
   * @param {string} name
   * @return {Logger}
   */
  extend(name) {
    const newLogger = new Logger()
    const handler = this._logHandler.extend ? this._logHandler.extend(name) : this._logHandler
    newLogger.setLogHandler(handler)
    newLogger.setIncludeTime(this._isIncludeTime)
    newLogger.setSessionId(this._sessionId)
    return newLogger
  }

  /**
   * Writes a verbose write message.
   *
   * @param {*} args
   */
  verbose(...args) {
    this._logHandler.onMessage(
      true,
      this._getFormattedString('VERBOSE', GeneralUtils.stringify(...args)),
    )
  }

  /**
   * Writes a (non-verbose) write message.
   *
   * @param {*} args
   */
  log(...args) {
    this._logHandler.onMessage(
      false,
      this._getFormattedString('LOG    ', GeneralUtils.stringify(...args)),
    )
  }

  /**
   * @private
   * @return {string} - The name of the method which called the logger, if possible, or an empty string.
   */
  _getFormattedString(logLevel, message) {
    const dateTime = DateTimeUtils.toISO8601DateTime()

    let elapsedTime = ''
    if (this._isIncludeTime) {
      elapsedTime = `${timeStorage.end().time} ms. `
      timeStorage.start()
    }

    return `${dateTime} Eyes: [${logLevel}] {${
      this._sessionId
    }} ${this._getMethodName()}${elapsedTime}${message}`
  }

  /**
   * @private
   * @return {string} - The name of the method which called the logger, if possible, or an empty string.
   */
  _getMethodName() {
    if (typeof Error.captureStackTrace === 'function') {
      /**
       * @typedef CallSite
       * @prop {function(): string} getTypeName returns the type of this as a string.
       * @prop {function(): string} getFunctionName returns the name of the current function, typically its name property.
       * @prop {function(): string} getMethodName returns the name of the property of this or one of its prototypes that holds the current function
       * @prop {function(): string} getFileName if this function was defined in a script returns the name of the script
       * @prop {function(): number} getLineNumber if this function was defined in a script returns the current line number
       * @prop {function(): number} getColumnNumber if this function was defined in a script returns the current column number
       * @prop {function(): boolean} isNative is this call in native V8 code?
       */

      /** @type {CallSite[]} */
      const trace = stackTrace.get()

      // _getMethodName() <- _getFormattedString <- log()/verbose() <- "actual caller"
      if (trace && trace.length >= 3) {
        const className = trace[3].getTypeName()
        const methodName = trace[3].getMethodName()
        return className ? `${className}.${methodName || '<init>'}(): ` : '(): '
      }
    }

    return ''
  }
}

module.exports = Logger
