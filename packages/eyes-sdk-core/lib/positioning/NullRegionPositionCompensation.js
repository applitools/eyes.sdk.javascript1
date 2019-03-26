'use strict';

const { RegionPositionCompensation } = require('./RegionPositionCompensation');

/**
 * @ignore
 */
class NullRegionPositionCompensation extends RegionPositionCompensation {
  /**
   * @inheritDoc
   */
  compensateRegionPosition(region, pixelRatio) { // eslint-disable-line no-unused-vars
    return region;
  }
}

exports.NullRegionPositionCompensation = NullRegionPositionCompensation;
