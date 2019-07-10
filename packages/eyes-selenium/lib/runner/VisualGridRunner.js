'use strict';

const { EyesRunner } = require('./EyesRunner');
const { TestResultSummary } = require('./TestResultSummary');

class VisualGridRunner extends EyesRunner {
  /**
   * @param {number} [concurrentSessions]
   */
  constructor(concurrentSessions) {
    super();

    this._concurrentSessions = concurrentSessions;
  }

  /**
   * @return {number}
   */
  getConcurrentSessions() {
    return this._concurrentSessions;
  }

  /**
   * @param {boolean} [shouldThrowException=true]
   * @return {Promise<TestResultSummary>}
   */
  async getAllTestResults(shouldThrowException = true) {
    if (this._eyesInstances.length === 1) {
      return this._eyesInstances[0].closeAndReturnResults(shouldThrowException);
    } else if (this._eyesInstances.length > 1) {
      const resultsPromise = [];
      const allResults = [];

      for (const eyesInstance of this._eyesInstances) {
        resultsPromise.push(eyesInstance.closeAndReturnResults(false));
      }

      const results = await Promise.all(resultsPromise);
      for (const result of results) {
        allResults.push(...result.getAllResults());
      }

      if (shouldThrowException === true) {
        for (const result of allResults) {
          if (result.getException()) {
            throw result.getException();
          }
        }
      }

      return new TestResultSummary(allResults);
    }

    return null;
  }
}

exports.VisualGridRunner = VisualGridRunner;
