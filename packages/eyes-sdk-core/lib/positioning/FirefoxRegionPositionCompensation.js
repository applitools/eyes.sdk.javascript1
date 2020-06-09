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

    const frameChain = this._eyes.getDriver().context.frameChain
    if (frameChain.size > 0) {
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
