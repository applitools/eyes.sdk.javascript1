'use strict';

const { RegionPositionCompensation } = require('./RegionPositionCompensation');

class NullRegionPositionCompensation extends RegionPositionCompensation {
  /** @inheritDoc */
  compensateRegionPosition(region, pixelRatio) {
    return region;
  }
}

exports.NullRegionPositionCompensation = NullRegionPositionCompensation;
