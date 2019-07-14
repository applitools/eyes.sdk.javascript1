'use strict';

const { EyesRunner } = require('./EyesRunner');
const { TestResultsSummary } = require('./TestResultsSummary');
const { TestResultContainer } = require('./TestResultContainer');

class ClassicRunner extends EyesRunner {
  constructor() {
    super();

    /** @type {TestResults[]} */
    this._allTestResult = [];
  }

  /**
   * @param {boolean} [shouldThrowException=true]
   * @return {Promise<TestResultsSummary>}
   */
  async getAllTestResults(shouldThrowException = true) { // eslint-disable-line no-unused-vars
    const allResults = [];
    for (const testResults of this._allTestResult) {
      allResults.push(new TestResultContainer(testResults));
    }
    return new TestResultsSummary(allResults);
  }
}

exports.ClassicRunner = ClassicRunner;
