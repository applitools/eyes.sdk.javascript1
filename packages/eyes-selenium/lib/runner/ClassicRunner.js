'use strict';

const { EyesRunner } = require('./EyesRunner');
const { TestResultSummary } = require('./TestResultSummary');
const { TestResultContainer } = require('./TestResultContainer');

class ClassicRunner extends EyesRunner {
  constructor() {
    super();

    /** @type {TestResults[]} */
    this._allTestResult = [];
  }

  /**
   * @param {boolean} [shouldThrowException=true]
   * @return {Promise<TestResultSummary>}
   */
  async getAllTestResults(shouldThrowException = true) { // eslint-disable-line no-unused-vars
    const allResults = [];
    for (const testResults of this._allTestResult) {
      allResults.push(new TestResultContainer(testResults));
    }
    return new TestResultSummary(allResults);
  }
}

exports.ClassicRunner = ClassicRunner;
