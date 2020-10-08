'use strict'

const {Region} = require('../..')
const RegionPositionCompensation = require('./RegionPositionCompensation')

class FirefoxRegionPositionCompensation extends RegionPositionCompensation {
  /**
   * @param {Eyes} eyes
   * @param {Logger} logger
   */
  constructor(eyes, logger) {
    super()

    this._eyes = eyes
    this._logger = logger
  }

  /**
   * @override
   * @inheritDoc
   */
  compensateRegionPosition(region, pixelRatio) {
    if (pixelRatio === 1) {
      return region
    }

    if (!this._eyes.getDriver().currentContext.isMain) {
      return region
    }

    region = region.offset(0, -Math.ceil(pixelRatio / 2))

    if (region.getWidth() <= 0 || region.getHeight() <= 0) {
      return Region.EMPTY
    }

    return region
  }
}

module.exports = FirefoxRegionPositionCompensation
