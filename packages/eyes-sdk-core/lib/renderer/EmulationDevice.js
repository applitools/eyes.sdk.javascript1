'use strict'

const {GeneralUtils} = require('../..')

class EmulationDevice {
  /**
   * @param data
   * @param {number} data.width
   * @param {number} data.height
   * @param {string} data.deviceScaleFactor
   * @param {string} data.mobile
   */
  constructor({width, height, deviceScaleFactor, mobile} = {}) {
    this._width = width
    this._height = height
    this._deviceScaleFactor = deviceScaleFactor
    this._mobile = mobile
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
   * @return {string}
   */
  getDeviceScaleFactor() {
    return this._deviceScaleFactor
  }

  /**
   * @param {string} value
   */
  setDeviceScaleFactor(value) {
    this._deviceScaleFactor = value
  }

  /**
   * @return {string}
   */
  getMobile() {
    return this._mobile
  }

  /**
   * @param {string} value
   */
  setMobile(value) {
    this._mobile = value
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
    return `EmulationDevice { ${JSON.stringify(this)} }`
  }
}

module.exports = EmulationDevice
