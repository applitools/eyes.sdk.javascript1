'use strict'

/* eslint-disable no-unused-vars */

/**
 * @ignore
 * @abstract
 */
class GetAccessibilityRegion {
  /**
   * @param {EyesWrappedDriver} driver
   * @param {EyesScreenshot} screenshot
   * @return {Promise<AccessibilityMatchSettings[]>}
   */
  async getRegion(eyesBase, screenshot) {
    throw new TypeError('The method is not implemented!')
  }
}

exports.GetAccessibilityRegion = GetAccessibilityRegion
