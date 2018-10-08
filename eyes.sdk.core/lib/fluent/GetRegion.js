'use strict';

/**
 * @interface
 */
class GetRegion {
  // noinspection JSMethodCanBeStatic
  /**
   * @param {EyesBase} eyesBase
   * @param {EyesScreenshot} screenshot
   * @return {Promise<Region>}
   */
  async getRegion(eyesBase, screenshot) {
    throw new Error('The method should be implemented!');
  }
}

exports.GetRegion = GetRegion;
