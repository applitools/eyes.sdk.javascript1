'use strict'
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
 * @template TElement, TSelector
 * @typedef {import('../wrappers/EyesWrappedElement')<any, TElement, TSelector>} EyesWrappedElement
 */

/**
 * @typedef {EyesSelector} TargetPersistedRegion
 */

/**
 * @internal
 * @template TElement
 * @template TSelector
 */
class TargetRegionByElement extends GetRegion {
  /**
   * @param {EyesWrappedElement<TElement, TSelector>} element
   */
  constructor(element) {
    super()
    this._element = element
  }
  /**
   * @template TDriver
   * @param {EyesWrappedDriver<TDriver, TElement, TSelector>} driver
   * @return {Promise<TargetPersistedRegion[]>}
   */
  async toPersistedRegions(context) {
    this._element = await this._element
    await this._element.init(context)
    const xpath = await EyesUtils.getElementXpath(context._logger, context, this._element)
    return [{type: 'xpath', selector: xpath}]
  }
}

module.exports = TargetRegionByElement
