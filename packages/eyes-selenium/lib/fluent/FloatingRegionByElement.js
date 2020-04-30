'use strict'

const {
  GetFloatingRegion,
  Location,
  CoordinatesType,
  FloatingMatchSettings,
  EyesJsBrowserUtils,
} = require('@applitools/eyes-sdk-core')

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
    super()
    this._element = webElement
    this._maxUpOffset = maxUpOffset
    this._maxDownOffset = maxDownOffset
    this._maxLeftOffset = maxLeftOffset
    this._maxRightOffset = maxRightOffset
  }

  /**
   * @inheritDoc
   * @param {Eyes} eyes
   * @param {EyesScreenshot} screenshot
   * @return {Promise<FloatingMatchSettings[]>}
   */
  // eslint-disable-next-line no-unused-vars
  async getRegion(eyes, screenshot) {
    const rect = await this._element.getRect()
    const lTag = screenshot.convertLocation(
      new Location(rect),
      CoordinatesType.CONTEXT_RELATIVE,
      CoordinatesType.SCREENSHOT_AS_IS,
    )

    const floatingRegion = new FloatingMatchSettings({
      left: lTag.getX(),
      top: lTag.getY(),
      width: rect.width,
      height: rect.height,
      maxUpOffset: this._maxUpOffset,
      maxDownOffset: this._maxDownOffset,
      maxLeftOffset: this._maxLeftOffset,
      maxRightOffset: this._maxRightOffset,
    })
    return [floatingRegion]
  }

  async toPersistedRegions(driver) {
    const xpath = await EyesJsBrowserUtils.getElementXpath(driver, this._element)
    return [
      {
        type: 'xpath',
        selector: xpath,
        maxUpOffset: this._maxUpOffset,
        maxDownOffset: this._maxDownOffset,
        maxLeftOffset: this._maxLeftOffset,
        maxRightOffset: this._maxRightOffset,
      },
    ]
  }
}

exports.FloatingRegionByElement = FloatingRegionByElement
