'use strict';

/**
 * The extent in which to check the image visual accessibility level.
 *
 * @readonly
 * @enum {string}
 */
const AccessibilityLevel = {
  /**
   * No accessibility - default level.
   */
  None: 'None',
  /**
   * Low accessibility level.
   */
  AA: 'AA',
  /**
   * Highest accessibility level.
   */
  AAA: 'AAA',
};

Object.freeze(AccessibilityLevel);
exports.AccessibilityLevel = AccessibilityLevel;
