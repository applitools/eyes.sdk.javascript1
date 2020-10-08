'use strict'

const {GeneralUtils, RectangleSize} = require('..')

/**
 * The environment in which the application under test is executing.
 */
class AppEnvironment {
  /**
   * Creates a new AppEnvironment instance.
   * @param data
   * @param {string} [data.os]
   * @param {string} [data.hostingApp]
   * @param {RectangleSize} [data.displaySize]
   * @param {string} [data.deviceInfo]
   * @param {string} [data.osInfo]
   * @param {string} [data.hostingAppInfo]
   */
  constructor({os, hostingApp, displaySize, deviceInfo, osInfo, hostingAppInfo} = {}) {
    if (displaySize && !(displaySize instanceof RectangleSize)) {
      displaySize = new RectangleSize(displaySize)
    }

    this._os = os
    this._hostingApp = hostingApp
    this._displaySize = displaySize
    this._deviceInfo = deviceInfo
    this._osInfo = osInfo
    this._hostingAppInfo = hostingAppInfo

    /** @type {string} */
    this._inferred = undefined
  }

  /**
   * Creates a new AppEnvironment instance.
   *
   * @param {string} inferred
   * @return {AppEnvironment}
   */
  static fromInferred(inferred) {
    const env = new AppEnvironment()
    env.setInferred(inferred)
    return env
  }

  /**
   * Gets the information inferred from the execution environment or {@code null} if no information could be inferred.
   *
   * @return {string}
   */
  geInferred() {
    return this._inferred
  }

  /**
   * Sets the inferred environment information.
   *
   * @param {string} value
   */
  setInferred(value) {
    this._inferred = value
  }

  /**
   * Gets the OS hosting the application under test or {@code null} if unknown.
   *
   * @return {string}
   */
  getOs() {
    return this._os
  }

  /**
   * Sets the OS hosting the application under test or {@code null} if unknown.
   *
   * @param {string} value
   */
  setOs(value) {
    this._os = value
  }

  /**
   * Gets the application hosting the application under test or {@code null} if unknown.
   *
   * @return {string}
   */
  getHostingApp() {
    return this._hostingApp
  }

  /**
   * Sets the application hosting the application under test or {@code null} if unknown.
   *
   * @param {string} value
   */
  setHostingApp(value) {
    this._hostingApp = value
  }

  /**
   * Gets the display size of the application or {@code null} if unknown.
   *
   * @return {RectangleSize}
   */
  getDisplaySize() {
    return this._displaySize
  }

  /**
   * Sets the display size of the application or {@code null} if unknown.
   *
   * @param {RectangleSize} value
   */
  setDisplaySize(value) {
    this._displaySize = value
  }

  /**
   * Gets the OS hosting the application under test or {@code null} if unknown. (not part of test signature)
   *
   * @return {string}
   */
  getOsInfo() {
    return this._osInfo
  }

  /**
   * Sets the OS hosting the application under test or {@code null} if unknown. (not part of test signature)
   *
   * @param {string} value
   */
  setOsInfo(value) {
    this._osInfo = value
  }

  /**
   * Gets the application hosting the application under test or {@code null} if unknown. (not part of test signature)
   *
   * @return {string}
   */
  getHostingAppInfo() {
    return this._hostingAppInfo
  }

  /**
   * Sets the application hosting the application under test or {@code null} if unknown. (not part of test signature)
   *
   * @param {string} value
   */
  setHostingAppInfo(value) {
    this._hostingAppInfo = value
  }

  /**
   * Gets the device info (not part of test signature)
   *
   * @return {string}
   */
  getDeviceInfo() {
    return this._deviceInfo
  }

  /**
   * Sets the device info (not part of test signature)
   *
   * @param {string} value
   */
  setDeviceInfo(value) {
    this._deviceInfo = value
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
    return `[OS = ${this._os == null ? '?' : `'${this._os}'`} HostingApp = ${
      this._hostingApp == null ? '?' : `'${this._hostingApp}'`
    } DisplaySize = ${this._displaySize}]`
  }
}

module.exports = AppEnvironment
