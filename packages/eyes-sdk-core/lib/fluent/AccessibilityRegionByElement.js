'use strict'

const {AccessibilityMatchSettings, CoordinatesType} = require('../..')
const {GetAccessibilityRegion} = require('./GetAccessibilityRegion')
const EyesUtils = require('../EyesUtils')

/**
 * @typedef {import('../config/AccessibilityRegionType').AccessibilityRegionType} AccessibilityRegionType
 * @typedef {import('../wrappers/EyesWrappedElement')} EyesWrappedElement
 * @typedef {import('../wrappers/EyesWrappedDriver')} EyesWrappedDriver
 * @typedef {import('../EyesClassic')} EyesClassic
 *
 * @typedef {Object} AccessibilityPersistedRegions
 * @property {string} type - selector type (css or xpath)
 * @property {string} selector - selector itself
 * @property {AccessibilityRegionType} accessibilityType - accessibility region type
 */

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
   * @param {EyesClassic} eyes
   * @param {EyesScreenshot} screenshot
   * @return {Promise<AccessibilityMatchSettings[]>}
   */
  async getRegion(eyes, screenshot) {
    // TODO eyes should be replaced with driver once all SDKs will use this implementation
    await this._element.init(eyes.getDriver())
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
  /**
   * @param {EyesWrappedDriver} driver
   * @return {Promise<AccessibilityPersistedRegions[]>}
   */
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
