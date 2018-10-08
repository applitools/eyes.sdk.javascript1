'use strict';

const { GetRegion, Region, Location, CoordinatesType } = require('@applitools/eyes.sdk.core');

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
   * @override
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
