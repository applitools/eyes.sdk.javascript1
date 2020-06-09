'use strict'

const {FloatingMatchSettings, CoordinatesType} = require('../..')
const {GetFloatingRegion} = require('./GetFloatingRegion')
const EyesUtils = require('../EyesUtils')

/**
 * @typedef {import('../wrappers/EyesWrappedElement').SupportedSelector} SupportedSelector
 * @typedef {import('../wrappers/EyesWrappedDriver')} EyesWrappedDriver
 * @typedef {import('../EyesClassic')} EyesClassic
 *
 * @typedef {Object} FloatingPersistedRegions
 * @property {string} type - selector type (css or xpath)
 * @property {string} selector - selector itself
 * @property {number} maxUpOffset - up offset
 * @property {number} maxDownOffset - down offset
 * @property {number} maxLeftOffset - left offset
 * @property {number} maxRightOffset - right offset
 */

class FloatingRegionBySelector extends GetFloatingRegion {
  /**
   * @param {SupportedSelector} regionSelector
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
    const elements = await eyes.getDriver().finder.findElements(this._selector)

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
   * @param {EyesWrappedDriver} driver
   * @return {Promise<FloatingPersistedRegions[]>}
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
