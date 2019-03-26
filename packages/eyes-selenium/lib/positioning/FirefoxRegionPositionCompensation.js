'use strict';

const { Region } = require('@applitools/eyes-common');
const { RegionPositionCompensation } = require('@applitools/eyes-sdk-core');

/**
 * @ignore
 */
class FirefoxRegionPositionCompensation extends RegionPositionCompensation {
  /**
   * @param {Eyes} eyes
   * @param {Logger} logger
   */
  constructor(eyes, logger) {
    super();

    this._eyes = eyes;
    this._logger = logger;
  }

  /**
   * @inheritDoc
   */
  compensateRegionPosition(region, pixelRatio) {
    if (pixelRatio === 1) {
      return region;
    }

    const eyesWebDriver = this._eyes.getDriver();
    const frameChain = eyesWebDriver.getFrameChain();
    if (frameChain.size() > 0) {
      return region;
    }

    region = region.offset(0, -Math.ceil(pixelRatio / 2));

    if (region.getWidth() <= 0 || region.getHeight() <= 0) {
      return Region.EMPTY;
    }

    return region;
  }
}

exports.FirefoxRegionPositionCompensation = FirefoxRegionPositionCompensation;
