'use strict';

const { GetFloatingRegion } = require('./GetFloatingRegion');
const { FloatingMatchSettings } = require('../match/FloatingMatchSettings');

class FloatingRegionByRectangle extends GetFloatingRegion {
  /**
   * @param {Region} rect
   * @param {number} maxUpOffset
   * @param {number} maxDownOffset
   * @param {number} maxLeftOffset
   * @param {number} maxRightOffset
   */
  constructor(rect, maxUpOffset, maxDownOffset, maxLeftOffset, maxRightOffset) {
    super();
    this._rect = rect;
    this._maxUpOffset = maxUpOffset;
    this._maxDownOffset = maxDownOffset;
    this._maxLeftOffset = maxLeftOffset;
    this._maxRightOffset = maxRightOffset;
  }

  /** @inheritDoc */
  async getRegion(eyesBase, screenshot) {
    const region = new FloatingMatchSettings(
      this._rect.getLeft(),
      this._rect.getTop(),
      this._rect.getWidth(),
      this._rect.getHeight(),
      this._maxUpOffset,
      this._maxDownOffset,
      this._maxLeftOffset,
      this._maxRightOffset
    );

    return region;
  }
}

exports.FloatingRegionByRectangle = FloatingRegionByRectangle;
