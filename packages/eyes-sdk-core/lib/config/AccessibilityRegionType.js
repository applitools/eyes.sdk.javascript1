const Enum = require('../utils/Enum')

/**
 * @typedef {import('../utils/Enum').EnumValues<typeof AccessibilityRegionTypes>} AccessibilityRegionType
 */

/**
 * The type of accessibility for a region.
 */
const AccessibilityRegionTypes = Enum('AccessibilityRegionType', {
  /** @type {'IgnoreContrast'} */
  IgnoreContrast: 'IgnoreContrast',
  /** @type {'RegularText'} */
  RegularText: 'RegularText',
  /** @type {'LargeText'} */
  LargeText: 'LargeText',
  /** @type {'BoldText'} */
  BoldText: 'BoldText',
  /** @type {'GraphicalObject'} */
  GraphicalObject: 'GraphicalObject',
})

module.exports = AccessibilityRegionTypes
