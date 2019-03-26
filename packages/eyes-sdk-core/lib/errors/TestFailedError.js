'use strict';

const { EyesError } = require('@applitools/eyes-common');

const { SessionStartInfo } = require('../server/SessionStartInfo');

/**
 * Indicates that a test did not pass (i.e., test either failed or is a new test).
 */
class TestFailedError extends EyesError {
  /**
   * Creates a new TestFailedError instance.
   *
   * @param {?TestResults} testResults - The results of the current test if available, {@code null} otherwise.
   * @param {string|SessionStartInfo} messageOrSession - The error description or SessionStartInfo with test details.
   */
  constructor(testResults, messageOrSession) {
    if (messageOrSession instanceof SessionStartInfo) {
      const testName = `'${messageOrSession.getScenarioIdOrName()}' of '${messageOrSession.getAppIdOrName()}'`;
      messageOrSession = `${testName}. See details at ${testResults.getUrl()}`;
    }

    super(messageOrSession);
    this._testResults = testResults;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @return {TestResults} - The failed test results, or {@code null} if the test has not yet ended (e.g., when thrown
   *   due to {@link FailureReports#IMMEDIATE} settings).
   */
  getTestResults() {
    return this._testResults;
  }
}

exports.TestFailedError = TestFailedError;
