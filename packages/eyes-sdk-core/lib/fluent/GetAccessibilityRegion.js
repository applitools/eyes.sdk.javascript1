'use strict';

/* eslint-disable no-unused-vars */

/**
 * @ignore
 * @abstract
 */
class GetAccessibilityRegion {
  // noinspection JSMethodCanBeStatic
  /**
   * @param {EyesBase} eyesBase
   * @param {EyesScreenshot} screenshot
   * @return {Promise<AccessibilityMatchSettings[]>}
   */
  async getRegion(eyesBase, screenshot) {
    throw new TypeError('The method is not implemented!');
  }
}

exports.GetAccessibilityRegion = GetAccessibilityRegion;
