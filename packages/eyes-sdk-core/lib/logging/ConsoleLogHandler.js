'use strict'

const LogHandler = require('./LogHandler')

/**
 * Write log messages to the browser/node console
 */
class ConsoleLogHandler extends LogHandler {
  /**
   * Handle a message to be logged.
   *
   * @override
   * @param {boolean} verbose - is the message verbose
   * @param {string} logString
   */
  onMessage(verbose, logString) {
    if (!verbose || this.getIsVerbose()) {
      console.log(logString) // eslint-disable-line no-console
    }
  }
}

module.exports = ConsoleLogHandler
