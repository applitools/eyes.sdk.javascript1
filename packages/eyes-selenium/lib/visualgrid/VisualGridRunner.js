'use strict';

class VisualGridRunner {
  // noinspection JSAnnotator
  /***
   * @param {number} [concurrentSessions]
   */
  constructor(concurrentSessions) {
    this._concurrentSessions = concurrentSessions;
  }

  get concurrentSessions() {
    return this._concurrentSessions;
  }
}

exports.VisualGridRunner = VisualGridRunner;
