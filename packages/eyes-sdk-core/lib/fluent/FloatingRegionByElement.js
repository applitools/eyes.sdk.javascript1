'use strict'

const {FloatingMatchSettings, CoordinatesType} = require('../..')
const {GetFloatingRegion} = require('./GetFloatingRegion')
const EyesUtils = require('../EyesUtils')

/**
 * @typedef {import('../wrappers/EyesWrappedElement')} EyesWrappedElement
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

class FloatingRegionByElement extends GetFloatingRegion {
  /**
   * @param {EyesWrappedElement} element
   * @param {number} maxUpOffset
   * @param {number} maxDownOffset
   * @param {number} maxLeftOffset
   * @param {number} maxRightOffset
   */
  constructor(element, maxUpOffset, maxDownOffset, maxLeftOffset, maxRightOffset) {
    super()
    this._element = element
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
    await this._element.init(eyes.getDriver())
    const rect = await this._element.getRect()
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
    return [floatingRegion]
  }
  /**
   * @param {EyesWrappedDriver} driver
   * @return {Promise<FloatingPersistedRegions[]>}
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
        maxUpOffset: this._maxUpOffset,
        maxDownOffset: this._maxDownOffset,
        maxLeftOffset: this._maxLeftOffset,
        maxRightOffset: this._maxRightOffset,
      },
    ]
  }
}

module.exports = FloatingRegionByElement
