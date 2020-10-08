'use strict'
const CoordinatesType = require('../geometry/CoordinatesType')
const FloatingMatchSettings = require('../config/FloatingMatchSettings')
const GetFloatingRegion = require('./GetFloatingRegion')
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
 * @typedef {EyesSelector & {maxUpOffset: number, maxDownOffset: number, maxLeftOffset: number, maxRightOffset: number}} FloatingPersistedRegion
 */

/**
 * @internal
 * @template TSelector
 */
class FloatingRegionBySelector extends GetFloatingRegion {
  /**
   * @param {TSelector} regionSelector
   * @param {number} maxUpOffset
   * @param {number} maxDownOffset
   * @param {number} maxLeftOffset
   * @param {number} maxRightOffset
   */
  constructor(regionSelector, maxUpOffset, maxDownOffset, maxLeftOffset, maxRightOffset) {
    super()
    this._selector = regionSelector
    this._maxUpOffset = maxUpOffset
    this._maxDownOffset = maxDownOffset
    this._maxLeftOffset = maxLeftOffset
    this._maxRightOffset = maxRightOffset
  }
  /**
   * @param {EyesClassic} eyes
   * @param {EyesScreenshot} screenshot
   * @return {Promise<FloatingMatchSettings[]>}
   */
  async getRegion(eyes, screenshot) {
    // TODO eyes should be replaced with driver once all SDKs will use this implementation
    const elements = await eyes.getDriver().elements(this._selector)

    const regions = []
    for (const element of elements) {
      const rect = await element.getRect()
      const lTag = screenshot.convertLocation(
        rect.getLocation(),
        CoordinatesType.CONTEXT_RELATIVE,
        CoordinatesType.SCREENSHOT_AS_IS,
      )
      const floatingRegion = new FloatingMatchSettings({
        left: lTag.getX(),
        top: lTag.getY(),
        width: rect.getWidth(),
        height: rect.getHeight(),
        maxUpOffset: this._maxUpOffset,
        maxDownOffset: this._maxDownOffset,
        maxLeftOffset: this._maxLeftOffset,
        maxRightOffset: this._maxRightOffset,
      })
      regions.push(floatingRegion)
    }

    return regions
  }
  /**
   * @template TDriver, TElement
   * @param {EyesWrappedDriver<TDriver, TElement, TSelector>} driver
   * @return {Promise<FloatingPersistedRegion[]>}
   */
  async toPersistedRegions(driver) {
    const regions = await EyesUtils.locatorToPersistedRegions(
      driver._logger,
      driver,
      this._selector,
    )
    return regions.map(reg => ({
      ...reg,
      maxUpOffset: this._maxUpOffset,
      maxDownOffset: this._maxDownOffset,
      maxLeftOffset: this._maxLeftOffset,
      maxRightOffset: this._maxRightOffset,
    }))
  }
}

module.exports = FloatingRegionBySelector
