'use strict'

const {Enum} = require('../utils/Enum')

/**
 * The extent in which to check the image visual accessibility level.
 *
 * @readonly
 * @enum {string}
 */
const AccessibilityLevel = {
  /**
   * Low accessibility level.
   */
  AA: 'AA',
  /**
   * Highest accessibility level.
   */
  AAA: 'AAA',
}

exports.AccessibilityLevel = Enum('AccessibilityLevel', AccessibilityLevel)
