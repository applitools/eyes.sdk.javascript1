'use strict'

const {GeneralUtils} = require('../..')

const EmulationDevice = require('./EmulationDevice')

class EmulationInfo {
  /**
   * @param info
   * @param {EmulationDevice|object} info.device
   * @param {string} info.deviceName
   * @param {ScreenOrientation} info.screenOrientation
   */
  constructor({device, deviceName, screenOrientation} = {}) {
    if (device && !(device instanceof EmulationDevice)) {
      device = new EmulationDevice(device)
    }

    this._device = device
    this._deviceName = deviceName
    this._screenOrientation = screenOrientation
  }

  /**
   * @return {EmulationDevice}
   */
  getDevice() {
    return this._device
  }

  /**
   * @param {EmulationDevice} value
   */
  setDevice(value) {
    this._device = value
  }

  /**
   * @return {string}
   */
  getDeviceName() {
    return this._deviceName
  }

  /**
   * @param {string} value
   */
  setDeviceName(value) {
    this._deviceName = value
  }

  /**
   * @return {ScreenOrientation}
   */
  getScreenOrientation() {
    return this._screenOrientation
  }

  /**
   * @param {ScreenOrientation} value
   */
  setScreenOrientation(value) {
    this._screenOrientation = value
  }

  /**
   * @override
   */
  toJSON() {
    if (this._device) {
      return Object.assign(
        {
          screenOrientation: this._screenOrientation,
        },
        this._device.toJSON(),
      )
    }

    return GeneralUtils.toPlain(this, ['_device'])
  }

  /**
   * @override
   */
  toString() {
    return `EmulationInfo { ${JSON.stringify(this)} }`
  }
}

module.exports = EmulationInfo
