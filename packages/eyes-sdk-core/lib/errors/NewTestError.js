'use strict'
const TestFailedError = require('./TestFailedError')
const SessionStartInfo = require('../server/SessionStartInfo')

/**
 * Indicates that a new test (i.e., a test for which no baseline exists) ended.
 */
class NewTestError extends TestFailedError {
  /**
   * Creates a new NewTestError instance.
   *
   * @param {TestResults} testResults - The results of the current test if available, {@code null} otherwise.
   * @param {string|SessionStartInfo} messageOrSession - The error description or SessionStartInfo with test details.
   */
  constructor(testResults, messageOrSession) {
    if (messageOrSession instanceof SessionStartInfo) {
      const testName = `'${messageOrSession.getScenarioIdOrName()}' of '${messageOrSession.getAppIdOrName()}'`
      messageOrSession = `${testName}. Please approve the new baseline at ${testResults.getUrl()}`
    }

    super(testResults, messageOrSession)
  }
}

module.exports = NewTestError
