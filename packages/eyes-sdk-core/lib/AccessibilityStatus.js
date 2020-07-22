'use strict'
const Enum = require('./utils/Enum')

/**
 * @enum
 * @typedef {'Passed'|'Failed'} AccessibilityStatus
 */

const AccessibilityStatuses = Enum('AccessibilityStatus', {
  Passed: 'Passed',
  Failed: 'Failed',
})

module.exports = AccessibilityStatuses
