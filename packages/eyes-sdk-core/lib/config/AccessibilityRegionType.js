const Enum = require('../utils/Enum')

/**
 * @enum
 * @typedef {'IgnoreContrast'|'RegularText'|'LargeText'|'BoldText'|'GraphicalObject'} AccessibilityRegionType
 */

/**
 * The type of accessibility for a region.
 */
const AccessibilityRegionTypes = Enum('AccessibilityRegionType', {
  IgnoreContrast: 'IgnoreContrast',
  RegularText: 'RegularText',
  LargeText: 'LargeText',
  BoldText: 'BoldText',
  GraphicalObject: 'GraphicalObject',
})

module.exports = AccessibilityRegionTypes
