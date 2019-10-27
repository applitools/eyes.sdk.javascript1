'use strict';

const { Location, CoordinatesType } = require('@applitools/eyes-common');
const { GetAccessibilityRegion, AccessibilityMatchSettings } = require('@applitools/eyes-sdk-core');

/**
 * @ignore
 */
class AccessibilityRegionByElement extends GetAccessibilityRegion {
  /**
   * @param {WebElement} regionSelector
   * @param {AccessibilityRegionType} regionType
   */
  constructor(regionSelector, regionType) {
    super();
    this._element = regionSelector;
    this._regionType = regionType;
  }

  // noinspection JSCheckFunctionSignatures
  /**
   * @inheritDoc
   * @param {Eyes} eyes
   * @param {EyesScreenshot} screenshot
   * @return {Promise<AccessibilityMatchSettings[]>}
   */
  async getRegion(eyes, screenshot) {
    const rect = await this._element.getRect();
    const pTag = screenshot.convertLocation(
      new Location(rect),
      CoordinatesType.CONTEXT_RELATIVE,
      CoordinatesType.SCREENSHOT_AS_IS
    );

    const accessibilityRegion = new AccessibilityMatchSettings({
      left: pTag.getX(),
      top: pTag.getY(),
      width: rect.width,
      height: rect.height,
      type: this._regionType,
    });
    return [accessibilityRegion];
  }
}

exports.AccessibilityRegionByElement = AccessibilityRegionByElement;
