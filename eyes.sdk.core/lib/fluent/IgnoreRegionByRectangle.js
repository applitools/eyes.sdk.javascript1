'use strict';

const { GetRegion } = require('./GetRegion');

class IgnoreRegionByRectangle extends GetRegion {
  /**
   * @param {Region} region
   */
  constructor(region) {
    super();
    this._region = region;
  }

  /** @inheritDoc */
  async getRegion(eyesBase, screenshot) {
    return this._region;
  }
}

exports.IgnoreRegionByRectangle = IgnoreRegionByRectangle;
