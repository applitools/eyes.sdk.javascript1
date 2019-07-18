'use strict';

const { Location, Region, CoordinatesType, GeneralUtils } = require('@applitools/eyes-common');
const { GetRegion } = require('@applitools/eyes-sdk-core');

const EYES_SELECTOR_TAG = 'data-eyes-selector';

/**
 * @ignore
 */
class IgnoreRegionByElement extends GetRegion {
  /**
   * @param {WebElement} webElement
   */
  constructor(webElement) {
    super();
    this._element = webElement;
  }

  // noinspection JSCheckFunctionSignatures
  /**
   * @override
   * @param {Eyes} eyes
   * @param {EyesScreenshot} screenshot
   * @return {Promise<Region>}
   */
  async getRegion(eyes, screenshot) { // eslint-disable-line no-unused-vars
    const rect = await this._element.getRect();
    const lTag = screenshot.convertLocation(
      new Location(rect),
      CoordinatesType.CONTEXT_RELATIVE,
      CoordinatesType.SCREENSHOT_AS_IS
    );

    return new Region(lTag.getX(), lTag.getY(), rect.width, rect.height);
  }

  // noinspection JSCheckFunctionSignatures
  /**
   * @inheritDoc
   * @param {Eyes} eyes
   * @return {Promise<string>}
   */
  async getSelector(eyes) { // eslint-disable-line no-unused-vars
    const randId = GeneralUtils.randomAlphanumeric();
    await eyes._driver.executeScript(`arguments[0].setAttribute('${EYES_SELECTOR_TAG}', '${randId}');`, this._element);
    return `[${EYES_SELECTOR_TAG}="${randId}"]`;
  }
}

exports.IgnoreRegionByElement = IgnoreRegionByElement;
