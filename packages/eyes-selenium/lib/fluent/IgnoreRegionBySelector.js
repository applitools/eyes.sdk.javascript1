'use strict';

const { GetRegion } = require('@applitools/eyes-sdk-core');

const { IgnoreRegionByElement } = require('./IgnoreRegionByElement');

/**
 * @ignore
 */
class IgnoreRegionBySelector extends GetRegion {
  /**
   * @param {By} regionSelector
   */
  constructor(regionSelector) {
    super();
    this._element = regionSelector;
  }

  // noinspection JSCheckFunctionSignatures
  /**
   * @inheritDoc
   * @param {Eyes} eyes
   * @param {EyesScreenshot} screenshot
   * @return {Promise<Region>}
   */
  async getRegion(eyes, screenshot) {
    const element = await eyes.getDriver().findElement(this._element);
    return new IgnoreRegionByElement(element).getRegion(eyes, screenshot);
  }

  // noinspection JSCheckFunctionSignatures
  /**
   * @inheritDoc
   * @param {Eyes} eyes
   * @return {Promise<string>}
   */
  async getSelector(eyes) { // eslint-disable-line no-unused-vars
    const element = await eyes.getDriver().findElement(this._element);
    return new IgnoreRegionByElement(element).getSelector(eyes);
  }
}

exports.IgnoreRegionBySelector = IgnoreRegionBySelector;
