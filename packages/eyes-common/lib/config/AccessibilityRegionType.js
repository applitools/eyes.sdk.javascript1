'use strict';

/**
 * The type of accessibility for a resion.
 *
 * @readonly
 * @enum {string}
 */
const AccessibilityRegionType = {
  IgnoreContrast: 'IgnoreContrast',
  RegularText: 'RegularText',
  LargeText: 'LargeText',
  BoldText: 'BoldText',
  GraphicalObject: 'GraphicalObject',
};

Object.freeze(AccessibilityRegionType);
exports.AccessibilityRegionType = AccessibilityRegionType;
