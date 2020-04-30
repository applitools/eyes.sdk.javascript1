'use strict'

const RegionPositionCompensation = require('./RegionPositionCompensation')

/**
 * @ignore
 */
class NullRegionPositionCompensation extends RegionPositionCompensation {
  /**
   * @inheritDoc
   */
  compensateRegionPosition(region, _pixelRatio) {
    return region
  }
}

module.exports = NullRegionPositionCompensation
