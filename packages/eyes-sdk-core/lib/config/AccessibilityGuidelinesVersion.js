const Enum = require('../utils/Enum')

/**
 * @typedef {import('../utils/Enum').EnumValues<typeof AccessibilityGuidelinesVersions>} AccessibilityGuidelinesVersion
 */

/**
 * The spec version for which to check the image visual accessibility level.
 */
const AccessibilityGuidelinesVersions = Enum('AccessibilityGuidelinesVersion', {
  /** @type {'WCAG_2_0'} */
  WCAG_2_0: 'WCAG_2_0',
  /** @type {'WCAG_2_1'} */
  WCAG_2_1: 'WCAG_2_1',
})

module.exports = AccessibilityGuidelinesVersions
