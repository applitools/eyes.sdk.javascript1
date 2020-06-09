'use strict'

const {CoordinatesType, Region} = require('../..')
const {GetRegion} = require('./GetRegion')
const EyesUtils = require('../EyesUtils')

/**
 * @typedef {import('../wrappers/EyesWrappedElement').SupportedSelector} SupportedSelector
 * @typedef {import('../wrappers/EyesWrappedDriver')} EyesWrappedDriver
 * @typedef {import('../EyesClassic')} EyesClassic
 *
 * @typedef {Object} PersistedRegions
 * @property {string} type - selector type (css or xpath)
 * @property {string} selector - selector itself
 */

class IgnoreRegionBySelector extends GetRegion {
  /**
   * @param {SupportedSelector} selector
   */
  constructor(selector) {
    super()
    this._selector = selector
  }
  /**
   * @param {EyesClassic} eyes
   * @param {EyesScreenshot} screenshot
   * @return {Promise<Region[]>}
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
      regions.push(new Region(lTag.getX(), lTag.getY(), rect.getWidth(), rect.getHeight()))
    }
    return regions
  }
  /**
   * @param {EyesWrappedDriver} driver
   * @return {Promise<PersistedRegions[]>}
   */
  async toPersistedRegions(driver) {
    return EyesUtils.locatorToPersistedRegions(driver._logger, driver, this._selector)
  }
}

module.exports = IgnoreRegionBySelector
