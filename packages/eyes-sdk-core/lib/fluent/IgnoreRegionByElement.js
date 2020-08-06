'use strict'
const Region = require('../geometry/Region')
const CoordinatesTypes = require('../geometry/CoordinatesType')
const GetRegion = require('./GetRegion')
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
 * @template TElement
 * @typedef {import('../wrappers/EyesWrappedElement')<any, TElement, any>} EyesWrappedElement
 */

/**
 * @typedef {EyesSelector} IgnorePersistedRegion
 */

/**
 * @internal
 * @template TElement
 */
class IgnoreRegionByElement extends GetRegion {
  /**
   * @param {EyesWrappedElement<TElement>} element
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
  async getRegion(_eyes, screenshot) {
    this._element = await this._element
    const rect = await this._element.getRect()
    const lTag = screenshot.convertLocation(
      rect.getLocation(),
      CoordinatesTypes.CONTEXT_RELATIVE,
      CoordinatesTypes.SCREENSHOT_AS_IS,
    )
    return [new Region(lTag.getX(), lTag.getY(), rect.getWidth(), rect.getHeight())]
  }
  /**
   * @template TDriver, TSelector
   * @param {EyesWrappedDriver<TDriver, TElement, TSelector>} driver
   * @return {Promise<IgnorePersistedRegion[]>}
   */
  async toPersistedRegions(context) {
    const xpath = await EyesUtils.getElementXpath(context._logger, context, await this._element)
    return [{type: 'xpath', selector: xpath}]
  }
}

module.exports = IgnoreRegionByElement
