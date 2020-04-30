'use strict'

const {AccessibilityMatchSettings, CoordinatesType} = require('@applitools/eyes-common')
const {GetAccessibilityRegion} = require('./GetAccessibilityRegion')
const EyesUtils = require('../EyesUtils')

class AccessibilityRegionByElement extends GetAccessibilityRegion {
  /**
   * @param {EyesWrappedElement} element
   * @param {AccessibilityRegionType} regionType
   */
  constructor(element, regionType) {
    super()
    this._element = element
    this._regionType = regionType
  }

  /**
   * @inheritDoc
   * @param {Eyes} eyes
   * @param {EyesScreenshot} screenshot
   * @return {Promise<AccessibilityMatchSettings[]>}
   */
  async getRegion(eyes, screenshot) {
    this._element.bind(eyes.getDriver())
    const rect = await this._element.getRect()
    const pTag = screenshot.convertLocation(
      rect.getLocation(),
      CoordinatesType.CONTEXT_RELATIVE,
      CoordinatesType.SCREENSHOT_AS_IS,
    )

    const accessibilityRegion = new AccessibilityMatchSettings({
      left: pTag.getX(),
      top: pTag.getY(),
      width: rect.getWidth(),
      height: rect.getHeight(),
      type: this._regionType,
    })
    return [accessibilityRegion]
  }

  async toPersistedRegions(driver) {
    const xpath = await EyesUtils.getElementAbsoluteXpath(
      driver._logger,
      driver.executor,
      this._element,
    )
    return [
      {
        type: 'xpath',
        selector: xpath,
        accessibilityType: this._regionType,
      },
    ]
  }
}

module.exports = AccessibilityRegionByElement
