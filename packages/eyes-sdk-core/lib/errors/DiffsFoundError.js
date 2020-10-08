'use strict'

const TestFailedError = require('./TestFailedError')
const SessionStartInfo = require('../server/SessionStartInfo')

/**
 * Indicates that an existing test ended, and that differences where found from the baseline.
 */
class DiffsFoundError extends TestFailedError {
  /**
   * Creates a new DiffsFoundError instance.
   *
   * @param {TestResults} testResults - The results of the current test if available, {@code null} otherwise.
   * @param {string|SessionStartInfo} messageOrSession - The error description or SessionStartInfo with test details.
   */
  constructor(testResults, messageOrSession) {
    if (messageOrSession instanceof SessionStartInfo) {
      const testName = `'${messageOrSession.getScenarioIdOrName()}' of '${messageOrSession.getAppIdOrName()}'`
      messageOrSession = `Test ${testName} detected differences!. See details at: ${testResults.getUrl()}`
    }

    super(testResults, messageOrSession)
  }
}

module.exports = DiffsFoundError
