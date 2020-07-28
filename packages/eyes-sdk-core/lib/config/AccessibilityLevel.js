const Enum = require('../utils/Enum')

/**
 * @typedef {import('../utils/Enum').EnumValues<typeof AccessibilityLevels>} AccessibilityLevel
 */

/**
 * The extent in which to check the image visual accessibility level.
 */
const AccessibilityLevels = Enum('AccessibilityLevel', {
  /**
   * Low accessibility level.
   * @type {'AA'}
   */
  AA: 'AA',
  /**
   * Highest accessibility level.
   * @type {'AAA'}
   */
  AAA: 'AAA',
})

module.exports = AccessibilityLevels
