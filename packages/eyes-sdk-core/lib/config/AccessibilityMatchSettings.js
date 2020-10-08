'use strict'
const AccessibilityRegionTypes = require('./AccessibilityRegionType')
const GeneralUtils = require('../utils/GeneralUtils')
const ArgumentGuard = require('../utils/ArgumentGuard')
const Region = require('../geometry/Region')

/**
 * @typedef {import('./AccessibilityRegionType').AccessibilityRegionType} AccessibilityRegionType
 */

/**
 * Encapsulates Accessibility match settings.
 */
class AccessibilityMatchSettings {
  /**
   * @param {object} settings
   * @param {number} settings.left
   * @param {number} settings.top
   * @param {number} settings.width
   * @param {number} settings.height
   * @param {AccessibilityRegionType} [settings.type]
   */
  constructor({left, top, width, height, type} = {}) {
    if (arguments.length > 1) {
      throw new TypeError('Please, use object as a parameter to the constructor!')
    }
    ArgumentGuard.isValidEnumValue(type, AccessibilityRegionTypes, false)

    this._left = left
    this._top = top
    this._width = width
    this._height = height
    this._type = type
  }

  /**
   * @return {number}
   */
  getLeft() {
    return this._left
  }

  /**
   * @param {number} value
   */
  setLeft(value) {
    this._left = value
  }

  /**
   * @return {number}
   */
  getTop() {
    return this._top
  }

  /**
   * @param {number} value
   */
  setTop(value) {
    this._top = value
  }

  /**
   * @return {number}
   */
  getWidth() {
    return this._width
  }

  /**
   * @param {number} value
   */
  setWidth(value) {
    this._width = value
  }

  /**
   * @return {number}
   */
  getHeight() {
    return this._height
  }

  /**
   * @param {number} value
   */
  setHeight(value) {
    this._height = value
  }

  /**
   * @return {AccessibilityRegionType}
   */
  getType() {
    return this._type
  }

  /**
   * @param {AccessibilityRegionType} value
   */
  setType(value) {
    ArgumentGuard.isValidEnumValue(value, AccessibilityRegionTypes)
    this._type = value
  }

  /**
   * @return {Region}
   */
  getRegion() {
    return new Region(this._left, this._top, this._width, this._height)
  }

  /**
   * @override
   */
  toJSON() {
    return GeneralUtils.toPlain(this)
  }

  /**
   * @override
   */
  toString() {
    return `AccessibilityMatchSettings { ${JSON.stringify(this)} }`
  }
}

module.exports = AccessibilityMatchSettings
