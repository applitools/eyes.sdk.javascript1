'use strict';

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
    this.setIsVerbose(isVerbose);
  }

  /**
   * Whether to handle or ignore verbose log messages.
   *
   * @param {boolean} isVerbose
   */
  setIsVerbose(isVerbose) {
    // noinspection PointlessBooleanExpressionJS
    this._isVerbose = !!isVerbose;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Whether to handle or ignore verbose log messages.
   *
   * @return {boolean} - isVerbose
   */
  getIsVerbose() {
    return this._isVerbose;
  }

  open() {}

  close() {}

  /**
   * @param {boolean} verbose
   * @param {string} logString
   */
  onMessage(verbose, logString) {} // eslint-disable-line no-unused-vars
}

exports.LogHandler = LogHandler;
