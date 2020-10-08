'use strict'
const Enum = require('./utils/Enum')

/**
 * @typedef {import('./utils/Enum').EnumValues<typeof AccessibilityStatuses>} AccessibilityStatus
 */

const AccessibilityStatuses = Enum('AccessibilityStatus', {
  /** @type {'Passed'} */
  Passed: 'Passed',
  /** @type {'Failed'} */
  Failed: 'Failed',
})

module.exports = AccessibilityStatuses
