'use strict'

/**
 * Handles log messages produces by the Eyes API.
 *
 * @abstract
 */
class LogHandler {
  /**
   * @param {boolean} [isVerbose=false] - Whether to handle or ignore verbose log messages.
   */
  constructor(isVerbose = false) {
    this.setIsVerbose(isVerbose)
  }

  /**
   * Whether to handle or ignore verbose log messages.
   *
   * @param {boolean} isVerbose
   */
  setIsVerbose(isVerbose) {
    this._isVerbose = !!isVerbose
  }

  /**
   * Whether to handle or ignore verbose log messages.
   *
   * @return {boolean} - isVerbose
   */
  getIsVerbose() {
    return this._isVerbose
  }

  open() {}

  close() {}

  /**
   * @param {boolean} verbose
   * @param {string} logString
   */
  onMessage(verbose, logString) {} // eslint-disable-line no-unused-vars
}

module.exports = LogHandler
