'use strict'

const debug = require('debug')

const LogHandler = require('./LogHandler')

/**
 * Write log messages to the browser/node console
 */
class DebugLogHandler extends LogHandler {
  /**
   * @param {boolean} [isVerbose=false] - Whether to handle or ignore verbose log messages.
   * @param {string} [appName] - The app name to use
   * @param {object} [debugInstance] - Another instance which should be extended
   */
  constructor(isVerbose = false, appName, debugInstance) {
    super(isVerbose)

    this._debug = debugInstance || debug(appName || 'eyes')
  }

  /**
   * Handle a message to be logged.
   *
   * @override
   * @param {boolean} verbose - is the message verbose
   * @param {string} logString
   */
  onMessage(verbose, logString) {
    if (!verbose || this.getIsVerbose()) {
      this._debug(logString)
    }
  }

  /**
   * @param {string} name
   * @return {DebugLogHandler}
   */
  extend(name) {
    return new DebugLogHandler(this.getIsVerbose(), undefined, this._debug.extend(name))
  }
}

module.exports = DebugLogHandler
