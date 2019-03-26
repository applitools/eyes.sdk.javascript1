'use strict';

/* eslint-disable no-unused-vars */

/**
 * @ignore
 * @abstract
 */
class GetRegion {
  // noinspection JSMethodCanBeStatic
  /**
   * @param {EyesBase} eyesBase
   * @param {EyesScreenshot} screenshot
   * @return {Promise<Region>}
   */
  async getRegion(eyesBase, screenshot) {
    throw new TypeError('The method is not implemented!');
  }
}

exports.GetRegion = GetRegion;
