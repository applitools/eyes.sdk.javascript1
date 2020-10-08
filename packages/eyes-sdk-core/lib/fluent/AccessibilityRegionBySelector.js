'use strict'
const AccessibilityMatchSettings = require('../config/AccessibilityMatchSettings')
const CoordinatesTypes = require('../geometry/CoordinatesType')
const GetAccessibilityRegion = require('./GetAccessibilityRegion')
const EyesUtils = require('../sdk/EyesUtils')

/**
 * @typedef {import('../config/AccessibilityRegionType').AccessibilityRegionType} AccessibilityRegionType
 * @typedef {import('../wrappers/EyesWrappedElement').EyesSelector} EyesSelector
 * @typedef {import('../EyesClassic')} EyesClassic
 */

/**
 * @template TDriver, TElement, TSelector
 * @typedef {import('../wrappers/EyesWrappedDriver')<TDriver, TElement, TSelector>} EyesWrappedDriver
 */

/**
 * @typedef {EyesSelector & {accessibilityType: AccessibilityRegionType}} AccessibilityPersistedRegion
 */

/**
 * @internal
 * @template TSelector
 */
class AccessibilityRegionBySelector extends GetAccessibilityRegion {
  /**
   * @param {TSelector} selector
   * @param {AccessibilityRegionType} [type]
   */
  constructor(selector, type) {
    super()
    this._selector = selector
    this._type = type
  }
  /**
   * @param {EyesClassic} eyes
   * @param {EyesScreenshot} screenshot
   * @return {Promise<AccessibilityMatchSettings[]>}
   */
  async getRegion(eyes, screenshot) {
    // TODO eyes should be replaced with driver once all SDKs will use this implementation
    const elements = await eyes.getDriver().elements(this._selector)

    const regions = []
    for (const element of elements) {
      const rect = await element.getRect()
      const lTag = screenshot.convertLocation(
        rect.getLocation(),
        CoordinatesTypes.CONTEXT_RELATIVE,
        CoordinatesTypes.SCREENSHOT_AS_IS,
      )
      const accessibilityRegion = new AccessibilityMatchSettings({
        left: lTag.getX(),
        top: lTag.getY(),
        width: rect.getWidth(),
        height: rect.getHeight(),
        type: this._type,
      })
      regions.push(accessibilityRegion)
    }

    return regions
  }
  /**
   * @template TDriver, TElement
   * @param {EyesWrappedDriver<TDriver, TElement, TSelector>} driver
   * @return {Promise<AccessibilityPersistedRegion[]>}
   */
  async toPersistedRegions(driver) {
    const regions = await EyesUtils.locatorToPersistedRegions(
      driver._logger,
      driver,
      this._selector,
    )
    return regions.map(reg => ({...reg, accessibilityType: this._type}))
  }
}

module.exports = AccessibilityRegionBySelector
