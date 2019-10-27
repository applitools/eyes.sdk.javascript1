'use strict';

/* eslint-disable no-unused-vars */

/**
 * @ignore
 * @abstract
 */
class GetFloatingRegion {
  // noinspection JSMethodCanBeStatic
  /**
   * @param {EyesBase} eyesBase
   * @param {EyesScreenshot} screenshot
   * @return {Promise<FloatingMatchSettings[]>}
   */
  async getRegion(eyesBase, screenshot) {
    throw new TypeError('The method is not implemented!');
  }
}

exports.GetFloatingRegion = GetFloatingRegion;
