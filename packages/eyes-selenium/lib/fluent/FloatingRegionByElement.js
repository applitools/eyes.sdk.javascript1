'use strict';

const { Location, CoordinatesType, FloatingMatchSettings } = require('@applitools/eyes-common');
const { GetFloatingRegion } = require('@applitools/eyes-sdk-core');

/**
 * @ignore
 */
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
   * @inheritDoc
   * @param {Eyes} eyes
   * @param {EyesScreenshot} screenshot
   * @return {Promise<FloatingMatchSettings[]>}
   */
  async getRegion(eyes, screenshot) { // eslint-disable-line no-unused-vars
    const rect = await this._element.getRect();
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
    return [floatingRegion];
  }
}

exports.FloatingRegionByElement = FloatingRegionByElement;
