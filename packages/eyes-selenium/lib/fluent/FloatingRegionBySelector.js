'use strict';

const { Location, CoordinatesType } = require('@applitools/eyes-common');
const { GetFloatingRegion, FloatingMatchSettings } = require('@applitools/eyes-sdk-core');

/**
 * @ignore
 */
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
   * @inheritDoc
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

    return new FloatingMatchSettings({
      left: lTag.getX(),
      top: lTag.getY(),
      width: rect.width,
      height: rect.height,
      maxUpOffset: this._maxUpOffset,
      maxDownOffset: this._maxDownOffset,
      maxLeftOffset: this._maxLeftOffset,
      maxRightOffset: this._maxRightOffset,
    });
  }
}

exports.FloatingRegionBySelector = FloatingRegionBySelector;
