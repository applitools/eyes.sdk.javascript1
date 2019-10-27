'use strict';

const { GetRegion, CoordinatesType, Location, Region } = require('@applitools/eyes-sdk-core');

const { SelectorByLocator } = require('./SelectorByLocator');

/**
 * @ignore
 */
class IgnoreRegionBySelector extends GetRegion {
  /**
   * @param {By} regionSelector
   */
  constructor(regionSelector) {
    super();
    this._selector = regionSelector;
  }

  // noinspection JSCheckFunctionSignatures
  /**
   * @inheritDoc
   * @param {Eyes} eyes
   * @param {EyesScreenshot} screenshot
   * @return {Promise<Region[]>}
   */
  async getRegion(eyes, screenshot) {
    const elements = await eyes.getDriver().findElements(this._selector);

    const values = [];
    if (elements && elements.length > 0) {
      for (let i = 0; i < elements.length; i += 1) {
        const rect = await elements[i].getRect();
        const lTag = screenshot.convertLocation(
          new Location(rect),
          CoordinatesType.CONTEXT_RELATIVE,
          CoordinatesType.SCREENSHOT_AS_IS
        );
        values.push(new Region(lTag.getX(), lTag.getY(), rect.width, rect.height));
      }
    }

    return values;
  }

  // noinspection JSCheckFunctionSignatures
  /**
   * @inheritDoc
   * @param {Eyes} eyes
   * @return {Promise<string>}
   */
  async getSelector(eyes) { // eslint-disable-line no-unused-vars
    return new SelectorByLocator(this._selector).getSelector(eyes);
  }
}

exports.IgnoreRegionBySelector = IgnoreRegionBySelector;
