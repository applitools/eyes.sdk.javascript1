'use strict'

const {CoordinatesType, AccessibilityMatchSettings} = require('../..')
const {GetAccessibilityRegion} = require('./GetAccessibilityRegion')
const EyesUtils = require('../EyesUtils')

/**
 * @typedef {import('../config/AccessibilityRegionType').AccessibilityRegionType} AccessibilityRegionType
 * @typedef {import('../wrappers/EyesWrappedElement').SupportedSelector} SupportedSelector
 * @typedef {import('../wrappers/EyesWrappedDriver')} EyesWrappedDriver
 * @typedef {import('../EyesClassic')} EyesClassic
 *
 * @typedef {Object} AccessibilityPersistedRegions
 * @property {string} type - selector type (css or xpath)
 * @property {string} selector - selector itself
 * @property {AccessibilityRegionType} accessibilityType - accessibility region type
 */

class AccessibilityRegionBySelector extends GetAccessibilityRegion {
  /**
   * @param {SupportedSelector} selector
   * @param {AccessibilityRegionType} regionType
   */
  constructor(selector, regionType) {
    super()
    this._selector = selector
    this._regionType = regionType
  }
  /**
   * @param {EyesClassic} eyes
   * @param {EyesScreenshot} screenshot
   * @return {Promise<AccessibilityMatchSettings[]>}
   */
  async getRegion(eyes, screenshot) {
    // TODO eyes should be replaced with driver once all SDKs will use this implementation
    const elements = await eyes.getDriver().finder.findElements(this._selector)

    const regions = []
    for (const element of elements) {
      const rect = await element.getRect()
      const lTag = screenshot.convertLocation(
        rect.getLocation(),
        CoordinatesType.CONTEXT_RELATIVE,
        CoordinatesType.SCREENSHOT_AS_IS,
      )
      const accessibilityRegion = new AccessibilityMatchSettings({
        left: lTag.getX(),
        top: lTag.getY(),
        width: rect.getWidth(),
        height: rect.getHeight(),
        type: this._regionType,
      })
      regions.push(accessibilityRegion)
    }

    return regions
  }
  /**
   * @param {EyesWrappedDriver} driver
   * @return {Promise<AccessibilityPersistedRegions[]>}
   */
  async toPersistedRegions(driver) {
    const regions = await EyesUtils.locatorToPersistedRegions(
      driver._logger,
      driver,
      this._selector,
    )
    return regions.map(reg => ({
      ...reg,
      accessibilityType: this._regionType,
    }))
  }
}

module.exports = AccessibilityRegionBySelector
