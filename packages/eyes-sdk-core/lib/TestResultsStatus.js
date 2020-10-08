const Enum = require('./utils/Enum')

/**
 * @enum
 * @typedef {string} TestResultsStatus
 */

const TestResultsStatuses = Enum('TestResultsStatus', {
  Passed: 'Passed',
  Unresolved: 'Unresolved',
  Failed: 'Failed',
})

module.exports = TestResultsStatuses
