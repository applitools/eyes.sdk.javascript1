'use strict'

const {GeneralUtils, Region} = require('../..')

const {EmulationInfo} = require('./EmulationInfo')

/**
 * @typedef {{iosDeviceInfo: {deviceName: IosDevieName, screenOrientation: (IosScreenOrientation|undefined)})}} IosDeviceInfo
 */

class RenderInfo {
  /**
   * @param {number} width
   * @param {number} height
   * @param {string} sizeMode
   * @param {string} selector
   * @param {Region|Object} region
   * @param {EmulationInfo|Object} emulationInfo
   * @param {IosDeviceInfo} iosDeviceInfo
   */
  constructor({width, height, sizeMode, selector, region, emulationInfo, iosDeviceInfo} = {}) {
    if (region && !(region instanceof Region)) {
      region = new Region(region)
    }

    if (emulationInfo && !(emulationInfo instanceof EmulationInfo)) {
      emulationInfo = new EmulationInfo(emulationInfo)
    }

    this._width = width
    this._height = height
    this._sizeMode = sizeMode
    this._selector = selector
    this._region = region
    this._emulationInfo = emulationInfo
    this._iosDeviceInfo = iosDeviceInfo
  }

  /**
   * @param {RectangleSize} size
   * @param {string} [sizeMode='full-page'] supported values [viewport|full-page]
   * @return {RenderInfo}
   */
  static fromRectangleSize(size, sizeMode = 'full-page') {
    const renderInfo = new RenderInfo()
    renderInfo.setWidth(size.getWidth())
    renderInfo.setHeight(size.getHeight())
    renderInfo.setSizeMode(sizeMode)
    return renderInfo
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
  getSizeMode() {
    return this._sizeMode
  }

  /**
   * @param {string} value
   */
  setSizeMode(value) {
    this._sizeMode = value
  }

  /**
   * @return {string}
   */
  getSelector() {
    return this._selector
  }

  /**
   * @param {string} value
   */
  setSelector(value) {
    this._selector = value
  }

  /**
   * @return {Region}
   */
  getRegion() {
    return this._region
  }

  /**
   * @param {Region} value
   */
  setRegion(value) {
    this._region = value
  }

  /**
   * @return {EmulationInfo}
   */
  getEmulationInfo() {
    return this._emulationInfo
  }

  /**
   * @param {EmulationInfo} value
   */
  setEmulationInfo(value) {
    this._emulationInfo = value
  }

  getIosDeviceInfo() {
    return this._iosDeviceInfo
  }

  /**
   * @override
   */
  toJSON() {
    const obj = GeneralUtils.toPlain(this, ['_emulationInfo', '_iosDeviceInfo'])

    if (this._emulationInfo) {
      obj.emulationInfo = this._emulationInfo.toJSON()
    }

    if (this._iosDeviceInfo) {
      obj.iosDeviceInfo = GeneralUtils.toPlain(this._iosDeviceInfo, undefined, {deviceName: 'name'})
    }

    // TODO remove this when rendering-grid changes x/y to left/top
    if (obj.region) {
      obj.region.x = obj.region.left
      obj.region.y = obj.region.top
      delete obj.region.left
      delete obj.region.top
    }
    return obj
  }

  /**
   * @override
   */
  toString() {
    return `RenderInfo { ${JSON.stringify(this)} }`
  }
}

exports.RenderInfo = RenderInfo
