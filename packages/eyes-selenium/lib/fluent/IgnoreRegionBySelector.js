'use strict';

const { Region, Location, CoordinatesType } = require('@applitools/eyes-common');
const { GetRegion } = require('@applitools/eyes-sdk-core');

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
    const rect = await element.getRect();
    const lTag = screenshot.convertLocation(
      new Location(rect),
      CoordinatesType.CONTEXT_RELATIVE,
      CoordinatesType.SCREENSHOT_AS_IS
    );

    return new Region(lTag.getX(), lTag.getY(), rect.width, rect.height);
  }
}

exports.IgnoreRegionBySelector = IgnoreRegionBySelector;
