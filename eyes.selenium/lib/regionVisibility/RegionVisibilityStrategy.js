'use strict';

/**
 * @interface
 */
class RegionVisibilityStrategy {
  // noinspection JSMethodCanBeStatic
  /**
   * @param {PositionProvider} positionProvider
   * @param {Location} location
   * @return {Promise<void>}
   */
  async moveToRegion(positionProvider, location) {
    throw new Error('The method should be implemented!');
  }

  // noinspection JSMethodCanBeStatic
  /**
   * @param {PositionProvider} positionProvider
   * @return {Promise<void>}
   */
  async returnToOriginalPosition(positionProvider) {
    throw new Error('The method should be implemented!');
  }
}

exports.RegionVisibilityStrategy = RegionVisibilityStrategy;
