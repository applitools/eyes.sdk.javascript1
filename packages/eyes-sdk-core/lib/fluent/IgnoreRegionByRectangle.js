'use strict';

const { GetRegion } = require('./GetRegion');

/**
 * @ignore
 */
class IgnoreRegionByRectangle extends GetRegion {
  /**
   * @param {Region} region
   */
  constructor(region) {
    super();
    this._region = region;
  }

  /**
   * @inheritDoc
   */
  async getRegion(eyesBase, screenshot) { // eslint-disable-line no-unused-vars
    return [this._region];
  }
}

exports.IgnoreRegionByRectangle = IgnoreRegionByRectangle;
