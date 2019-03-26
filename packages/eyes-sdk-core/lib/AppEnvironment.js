'use strict';

const { GeneralUtils, RectangleSize } = require('@applitools/eyes-common');

/**
 * The environment in which the application under test is executing.
 */
class AppEnvironment {
  /**
   * Creates a new AppEnvironment instance.
   *
   * @param {string} [os]
   * @param {string} [hostingApp]
   * @param {RectangleSize} [displaySize]
   * @param {string} [deviceInfo]
   * @param {string} [osInfo]
   * @param {string} [hostingAppInfo]
   */
  constructor({ os, hostingApp, displaySize, deviceInfo, osInfo, hostingAppInfo } = {}) {
    if (displaySize && !(displaySize instanceof RectangleSize)) {
      displaySize = new RectangleSize(displaySize);
    }

    this._os = os;
    this._hostingApp = hostingApp;
    this._displaySize = displaySize;
    this._deviceInfo = deviceInfo;
    this._osInfo = osInfo;
    this._hostingAppInfo = hostingAppInfo;

    /** @type {string} */
    this._inferred = undefined;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Creates a new AppEnvironment instance.
   *
   * @param {string} inferred
   * @return {AppEnvironment}
   */
  static fromInferred(inferred) {
    const env = new AppEnvironment();
    env.setInferred(inferred);
    return env;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Gets the information inferred from the execution environment or {@code null} if no information could be inferred.
   *
   * @return {string}
   */
  geInferred() {
    return this._inferred;
  }

  /**
   * Sets the inferred environment information.
   *
   * @param {string} value
   */
  setInferred(value) {
    this._inferred = value;
  }

  /**
   * Gets the OS hosting the application under test or {@code null} if unknown.
   *
   * @return {string}
   */
  getOs() {
    return this._os;
  }

  /**
   * Sets the OS hosting the application under test or {@code null} if unknown.
   *
   * @param {string} value
   */
  setOs(value) {
    this._os = value;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Gets the application hosting the application under test or {@code null} if unknown.
   *
   * @return {string}
   */
  getHostingApp() {
    return this._hostingApp;
  }

  /**
   * Sets the application hosting the application under test or {@code null} if unknown.
   *
   * @param {string} value
   */
  setHostingApp(value) {
    this._hostingApp = value;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Gets the display size of the application or {@code null} if unknown.
   *
   * @return {RectangleSize}
   */
  getDisplaySize() {
    return this._displaySize;
  }

  /**
   * Sets the display size of the application or {@code null} if unknown.
   *
   * @param {RectangleSize} value
   */
  setDisplaySize(value) {
    this._displaySize = value;
  }

  /**
   * Gets the OS hosting the application under test or {@code null} if unknown. (not part of test signature)
   *
   * @return {string}
   */
  getOsInfo() {
    return this._osInfo;
  }

  /**
   * Sets the OS hosting the application under test or {@code null} if unknown. (not part of test signature)
   *
   * @param {string} value
   */
  setOsInfo(value) {
    this._osInfo = value;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Gets the application hosting the application under test or {@code null} if unknown. (not part of test signature)
   *
   * @return {string}
   */
  getHostingAppInfo() {
    return this._hostingAppInfo;
  }

  /**
   * Sets the application hosting the application under test or {@code null} if unknown. (not part of test signature)
   *
   * @param {string} value
   */
  setHostingAppInfo(value) {
    this._hostingAppInfo = value;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Gets the device info (not part of test signature)
   *
   * @return {string}
   */
  getDeviceInfo() {
    return this._deviceInfo;
  }

  /**
   * Sets the device info (not part of test signature)
   *
   * @param {string} value
   */
  setDeviceInfo(value) {
    this._deviceInfo = value;
  }

  /**
   * @override
   */
  toJSON() {
    return GeneralUtils.toPlain(this);
  }

  /**
   * @override
   */
  toString() {
    return `AppEnvironment { ${JSON.stringify(this)} }`;
  }
}

exports.AppEnvironment = AppEnvironment;
