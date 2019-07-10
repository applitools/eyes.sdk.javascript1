'use strict';

class EyesRunner {
  constructor() {
    /** @type {Eyes[]} */
    this._eyesInstances = [];
  }

  // noinspection JSMethodCanBeStatic
  /**
   * @abstract
   * @param {boolean} [shouldThrowException=true]
   * @return {Promise<TestResultSummary>}
   */
  async getAllTestResults(shouldThrowException) { // eslint-disable-line no-unused-vars
    throw new TypeError('The method is not implemented!');
  }
}

exports.EyesRunner = EyesRunner;
