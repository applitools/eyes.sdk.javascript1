'use strict';

const debug = require('debug');

const { LogHandler } = require('./LogHandler');

/**
 * Write log messages to the browser/node console
 */
class DebugLogHandler extends LogHandler {
  /**
   * @param {boolean} [isVerbose=false] - Whether to handle or ignore verbose log messages.
   * @param {string} [appName] - The app name to use
   */
  constructor(isVerbose = false, appName) {
    super(isVerbose);

    this._debug = debug(appName ? `eyes:${appName}` : 'eyes');
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
      this._debug(logString);
    }
  }
}

exports.DebugLogHandler = DebugLogHandler;
