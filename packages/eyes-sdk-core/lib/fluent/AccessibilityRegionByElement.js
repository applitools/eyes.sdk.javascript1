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
 * @template TElement
 * @typedef {import('../wrappers/EyesWrappedElement')<any, TElement, any>} EyesWrappedElement
 */

/**
 * @typedef {EyesSelector & {accessibilityType: AccessibilityRegionType}} AccessibilityPersistedRegion
 */

/**
 * @internal
 * @template TElement
 */
class AccessibilityRegionByElement extends GetAccessibilityRegion {
  /**
   * @param {EyesWrappedElement<TElement>} element
   * @param {AccessibilityRegionType} [type]
   */
  constructor(element, type) {
    super()
    this._element = element
    this._type = type
  }
  /**
   * @param {EyesClassic} eyes
   * @param {EyesScreenshot} screenshot
   * @return {Promise<AccessibilityMatchSettings[]>}
   */
  async getRegion(_eyes, screenshot) {
    // TODO eyes should be replaced with driver once all SDKs will use this implementation
    this._element = await this._element
    const rect = await this._element.getRect()
    const pTag = screenshot.convertLocation(
      rect.getLocation(),
      CoordinatesTypes.CONTEXT_RELATIVE,
      CoordinatesTypes.SCREENSHOT_AS_IS,
    )

    const accessibilityRegion = new AccessibilityMatchSettings({
      left: pTag.getX(),
      top: pTag.getY(),
      width: rect.getWidth(),
      height: rect.getHeight(),
      type: this._type,
    })
    return [accessibilityRegion]
  }
  /**
   * @template TDriver, TSelector
   * @param {EyesWrappedDriver<TDriver, TElement, TSelector>} driver
   * @return {Promise<AccessibilityPersistedRegion[]>}
   */
  async toPersistedRegions(context) {
    const xpath = await EyesUtils.getElementXpath(context._logger, context, await this._element)
    return [
      {
        type: 'xpath',
        selector: xpath,
        accessibilityType: this._type,
      },
    ]
  }
}

module.exports = AccessibilityRegionByElement
