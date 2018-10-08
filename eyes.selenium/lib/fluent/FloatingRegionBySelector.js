'use strict';

const { GetFloatingRegion, FloatingMatchSettings, Location, CoordinatesType } = require('@applitools/eyes.sdk.core');

class FloatingRegionBySelector extends GetFloatingRegion {
  /**
   * @param {By} regionSelector
   * @param {number} maxUpOffset
   * @param {number} maxDownOffset
   * @param {number} maxLeftOffset
   * @param {number} maxRightOffset
   */
  constructor(regionSelector, maxUpOffset, maxDownOffset, maxLeftOffset, maxRightOffset) {
    super();
    this._element = regionSelector;
    this._maxUpOffset = maxUpOffset;
    this._maxDownOffset = maxDownOffset;
    this._maxLeftOffset = maxLeftOffset;
    this._maxRightOffset = maxRightOffset;
  }

  // noinspection JSCheckFunctionSignatures
  /**
   * @override
   * @param {Eyes} eyes
   * @param {EyesScreenshot} screenshot
   * @return {Promise<FloatingMatchSettings>}
   */
  async getRegion(eyes, screenshot) {
    const element = await eyes.getDriver().findElement(this._element);
    const rect = await element.getRect();

    const lTag = screenshot.convertLocation(
      new Location(rect),
      CoordinatesType.CONTEXT_RELATIVE,
      CoordinatesType.SCREENSHOT_AS_IS
    );

    return new FloatingMatchSettings(
      lTag.getX(),
      lTag.getY(),
      rect.width,
      rect.height,
      this._maxUpOffset,
      this._maxDownOffset,
      this._maxLeftOffset,
      this._maxRightOffset
    );
  }
}

exports.FloatingRegionBySelector = FloatingRegionBySelector;
