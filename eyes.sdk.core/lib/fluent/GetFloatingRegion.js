'use strict';

/**
 * @interface
 */
class GetFloatingRegion {
  // noinspection JSMethodCanBeStatic
  /**
   * @param {EyesBase} eyesBase
   * @param {EyesScreenshot} screenshot
   * @return {Promise<FloatingMatchSettings>}
   */
  async getRegion(eyesBase, screenshot) {
    throw new Error('The method should be implemented!');
  }
}

exports.GetFloatingRegion = GetFloatingRegion;
