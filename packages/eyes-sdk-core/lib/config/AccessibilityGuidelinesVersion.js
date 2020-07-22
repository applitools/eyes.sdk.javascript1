const Enum = require('../utils/Enum')

/**
 * @enum
 * @typedef {string} AccessibilityGuidelinesVersion
 */

/**
 * The spec version for which to check the image visual accessibility level.
 */
const AccessibilityGuidelinesVersions = Enum('AccessibilityGuidelinesVersion', {
  WCAG_2_0: 'WCAG_2_0',
  WCAG_2_1: 'WCAG_2_1',
})

module.exports = AccessibilityGuidelinesVersions
