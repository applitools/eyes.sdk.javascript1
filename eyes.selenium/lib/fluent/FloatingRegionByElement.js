'use strict';

const { GetFloatingRegion, FloatingMatchSettings, Location, CoordinatesType } = require('@applitools/eyes.sdk.core');

class FloatingRegionByElement extends GetFloatingRegion {
  /**
   * @param {WebElement} webElement
   * @param {number} maxUpOffset
   * @param {number} maxDownOffset
   * @param {number} maxLeftOffset
   * @param {number} maxRightOffset
   */
  constructor(webElement, maxUpOffset, maxDownOffset, maxLeftOffset, maxRightOffset) {
    super();
    this._element = webElement;
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
    const rect = await this._element.getRect();
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

exports.FloatingRegionByElement = FloatingRegionByElement;
