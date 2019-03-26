'use strict';

/* eslint-disable no-unused-vars */

/**
 * @ignore
 * @abstract
 */
class RegionVisibilityStrategy {
  // noinspection JSMethodCanBeStatic, JSUnusedGlobalSymbols
  /**
   * @param {PositionProvider} positionProvider
   * @param {Location} location
   * @return {Promise}
   */
  async moveToRegion(positionProvider, location) {
    throw new TypeError('The method is not implemented!');
  }

  // noinspection JSMethodCanBeStatic, JSUnusedGlobalSymbols
  /**
   * @param {PositionProvider} positionProvider
   * @return {Promise}
   */
  async returnToOriginalPosition(positionProvider) {
    throw new TypeError('The method is not implemented!');
  }
}

exports.RegionVisibilityStrategy = RegionVisibilityStrategy;
