'use strict'
const GeneralUtils = require('../utils/GeneralUtils')
const Region = require('../geometry/Region')

/**
 * Encapsulates floating match settings for the a session.
 */
class FloatingMatchSettings {
  /**
   * @param settings
   * @param {number} settings.left
   * @param {number} settings.top
   * @param {number} settings.width
   * @param {number} settings.height
   * @param {number} settings.maxUpOffset
   * @param {number} settings.maxDownOffset
   * @param {number} settings.maxLeftOffset
   * @param {number} settings.maxRightOffset
   */
  constructor({
    left,
    top,
    width,
    height,
    maxUpOffset,
    maxDownOffset,
    maxLeftOffset,
    maxRightOffset,
  } = {}) {
    if (arguments.length > 1) {
      throw new TypeError('Please, use object as a parameter to the constructor!')
    }

    this._left = left
    this._top = top
    this._width = width
    this._height = height
    this._maxUpOffset = maxUpOffset
    this._maxDownOffset = maxDownOffset
    this._maxLeftOffset = maxLeftOffset
    this._maxRightOffset = maxRightOffset
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
   * @return {number}
   */
  getMaxUpOffset() {
    return this._maxUpOffset
  }

  /**
   * @param {number} value
   */
  setMaxUpOffset(value) {
    this._maxUpOffset = value
  }

  /**
   * @return {number}
   */
  getMaxDownOffset() {
    return this._maxDownOffset
  }

  /**
   * @param {number} value
   */
  setMaxDownOffset(value) {
    this._maxDownOffset = value
  }

  /**
   * @return {number}
   */
  getMaxLeftOffset() {
    return this._maxLeftOffset
  }

  /**
   * @param {number} value
   */
  setMaxLeftOffset(value) {
    this._maxLeftOffset = value
  }

  /**
   * @return {number}
   */
  getMaxRightOffset() {
    return this._maxRightOffset
  }

  /**
   * @param {number} value
   */
  setMaxRightOffset(value) {
    this._maxRightOffset = value
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
    return `FloatingMatchSettings { ${JSON.stringify(this)} }`
  }
}

module.exports = FloatingMatchSettings
