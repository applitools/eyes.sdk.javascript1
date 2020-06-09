'use strict'

const {Region, CoordinatesType} = require('../..')
const {GetRegion} = require('./GetRegion')
const EyesUtils = require('../EyesUtils')

/**
 * @typedef {import('../wrappers/EyesWrappedElement')} EyesWrappedElement
 * @typedef {import('../wrappers/EyesWrappedDriver')} EyesWrappedDriver
 * @typedef {import('../EyesClassic')} EyesClassic
 *
 * @typedef {Object} PersistedRegions
 * @property {string} type - selector type (css or xpath)
 * @property {string} selector - selector itself
 */

class IgnoreRegionByElement extends GetRegion {
  /**
   * @param {EyesWrappedElement} element
   */
  constructor(element) {
    super()
    this._element = element
  }
  /**
   * @param {EyesClassic} eyes
   * @param {EyesScreenshot} screenshot
   * @return {Promise<Region[]>}
   */
  async getRegion(eyes, screenshot) {
    // TODO eyes should be replaced with driver once all SDKs will use this implementation
    await this._element.init(eyes.getDriver())
    const rect = await this._element.getRect()
    const lTag = screenshot.convertLocation(
      rect.getLocation(),
      CoordinatesType.CONTEXT_RELATIVE,
      CoordinatesType.SCREENSHOT_AS_IS,
    )
    return [new Region(lTag.getX(), lTag.getY(), rect.getWidth(), rect.getHeight())]
  }
  /**
   * @param {EyesWrappedDriver} driver
   * @return {Promise<PersistedRegions[]>}
   */
  async toPersistedRegions(driver) {
    const xpath = await EyesUtils.getElementAbsoluteXpath(
      driver._logger,
      driver.executor,
      this._element,
    )
    return [{type: 'xpath', selector: xpath}]
  }
}

module.exports = IgnoreRegionByElement
