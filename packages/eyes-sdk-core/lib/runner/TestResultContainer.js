'use strict'

class TestResultContainer {
  /**
   * @param {TestResults} [testResults]
   * @param {Error} [exception]
   */
  constructor(testResults, exception) {
    this._testResults = testResults
    this._exception = exception
  }

  /**
   * @return {TestResults}
   */
  getTestResults() {
    return this._testResults
  }

  /**
   * @return {Error}
   */
  getException() {
    return this._exception
  }

  /**
   * @override
   * @return {string}
   */
  toString() {
    return `${this._testResults ? this._testResults.toString() : ''} - ${
      this._exception ? this._exception.toString() : ''
    }`
  }
}

module.exports = TestResultContainer
