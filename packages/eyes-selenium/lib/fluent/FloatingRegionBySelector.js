'use strict';

const { Location, CoordinatesType, FloatingMatchSettings } = require('@applitools/eyes-common');
const { GetFloatingRegion } = require('@applitools/eyes-sdk-core');

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
    this._selector = regionSelector;
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
   * @return {Promise<FloatingMatchSettings[]>}
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
        const floatingRegion = new FloatingMatchSettings({
          left: lTag.getX(),
          top: lTag.getY(),
          width: rect.width,
          height: rect.height,
          maxUpOffset: this._maxUpOffset,
          maxDownOffset: this._maxDownOffset,
          maxLeftOffset: this._maxLeftOffset,
          maxRightOffset: this._maxRightOffset,
        });
        values.push(floatingRegion);
      }
    }

    return values;
  }
}

exports.FloatingRegionBySelector = FloatingRegionBySelector;
