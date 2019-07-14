'use strict';

const { Configuration: CommonConfiguration, ArgumentGuard, TypeUtils } = require('@applitools/eyes-common');

const { StitchMode } = require('./StitchMode');
const { ScreenOrientation } = require('./ScreenOrientation');

/**
 * @typedef {{width: number, height: number, name: BrowserType}} RenderBrowserInfo
 * @typedef {{deviceName: string, screenOrientation: ScreenOrientation}} DeviceInfo
 */

const DEFAULT_VALUES = {
  waitBeforeScreenshots: 100, // ms
  stitchMode: StitchMode.SCROLL,
  hideScrollbars: true,
  hideCaret: true,
  stitchOverlap: 50, // px

  concurrentSessions: 3,
  isThrowExceptionOn: false,
};

class Configuration extends CommonConfiguration {
  /**
   * @param {Configuration|object} [configuration]
   */
  constructor(configuration) {
    super();

    // selenium
    /** @type {boolean} */
    this._forceFullPageScreenshot = undefined;
    /** @type {number} */
    this._waitBeforeScreenshots = undefined;
    /** @type {StitchMode} */
    this._stitchMode = undefined;
    /** @type {boolean} */
    this._hideScrollbars = undefined;
    /** @type {boolean} */
    this._hideCaret = undefined;
    /** @type {number} */
    this._stitchOverlap = undefined;

    // visual grid
    /** @type {number} */
    this._concurrentSessions = undefined;
    /** @type {boolean} */
    this._isThrowExceptionOn = undefined;
    /** @type {RenderBrowserInfo[]|DeviceInfo[]} */
    this._browsersInfo = [];

    if (configuration) {
      this.mergeConfig(configuration);
    }
  }

  /**
   * @return {boolean} - Whether Eyes should force a full page screenshot.
   */
  getForceFullPageScreenshot() {
    return this._forceFullPageScreenshot;
  }

  /**
   * Forces a full page screenshot (by scrolling and stitching) if the browser only supports viewport screenshots).
   *
   * @param {boolean} value - Whether to force a full page screenshot or not.
   * @return {this}
   */
  setForceFullPageScreenshot(value) {
    this._forceFullPageScreenshot = value;
    return this;
  }

  /**
   * @return {number} - The time to wait just before taking a screenshot.
   */
  getWaitBeforeScreenshots() {
    return TypeUtils.getOrDefault(this._waitBeforeScreenshots, DEFAULT_VALUES.waitBeforeScreenshots);
  }

  /**
   * Sets the time to wait just before taking a screenshot (e.g., to allow positioning to stabilize when performing a
   * full page stitching).
   *
   * @param {number} value - The time to wait (Milliseconds). Values smaller or equal to 0, will cause the
   *   default value to be used.
   * @return {this}
   */
  setWaitBeforeScreenshots(value) {
    if (value <= 0) {
      this._waitBeforeScreenshots = undefined;
    } else {
      this._waitBeforeScreenshots = value;
    }
    return this;
  }

  /**
   * @return {StitchMode} - The current stitch mode settings.
   */
  getStitchMode() {
    return TypeUtils.getOrDefault(this._stitchMode, DEFAULT_VALUES.stitchMode);
  }

  /**
   * Set the type of stitching used for full page screenshots. When the page includes fixed position header/sidebar,
   * use {@link StitchMode#CSS}. Default is {@link StitchMode#SCROLL}.
   *
   * @param {StitchMode} value - The stitch mode to set.
   * @return {this}
   */
  setStitchMode(value) {
    this._stitchMode = value;
    return this;
  }

  /**
   * @return {boolean} - Whether or not scrollbars are hidden when taking screenshots.
   */
  getHideScrollbars() {
    return TypeUtils.getOrDefault(this._hideScrollbars, DEFAULT_VALUES.hideScrollbars);
  }

  /**
   * Hide the scrollbars when taking screenshots.
   *
   * @param {boolean} value - Whether to hide the scrollbars or not.
   * @return {this}
   */
  setHideScrollbars(value) {
    this._hideScrollbars = value;
    return this;
  }

  /**
   * @return {boolean}
   */
  getHideCaret() {
    return TypeUtils.getOrDefault(this._hideCaret, DEFAULT_VALUES.hideCaret);
  }

  /**
   * @param {boolean} value
   * @return {this}
   */
  setHideCaret(value) {
    this._hideCaret = value;
    return this;
  }

  /**
   * @return {number} - Returns the stitching overlap in pixels.
   */
  getStitchOverlap() {
    return TypeUtils.getOrDefault(this._stitchOverlap, DEFAULT_VALUES.stitchOverlap);
  }

  /**
   * Sets the stitch overlap in pixels.
   *
   * @param {number} value - The width (in pixels) of the overlap.
   * @return {this}
   */
  setStitchOverlap(value) {
    this._stitchOverlap = value;
    return this;
  }

  /* ------------ Visual Grid properties ------------ */

  /**
   * @return {number}
   */
  getConcurrentSessions() {
    return TypeUtils.getOrDefault(this._concurrentSessions, DEFAULT_VALUES.concurrentSessions);
  }

  /**
   * @param {number} value
   * @return {this}
   */
  setConcurrentSessions(value) {
    this._concurrentSessions = value;
    return this;
  }

  /**
   * @return {boolean}
   */
  getIsThrowExceptionOn() {
    return TypeUtils.getOrDefault(this._isThrowExceptionOn, DEFAULT_VALUES.isThrowExceptionOn);
  }

  /**
   * @param {boolean} value
   * @return {this}
   */
  setIsThrowExceptionOn(value) {
    this._isThrowExceptionOn = value;
    return this;
  }

  /**
   * @return {RenderBrowserInfo[]|DeviceInfo[]}
   */
  getBrowsersInfo() {
    return this._browsersInfo;
  }

  /**
   * @param {RenderBrowserInfo[]|DeviceInfo[]|object[]} value
   * @return {this}
   */
  setBrowsersInfo(value) {
    ArgumentGuard.isArray(value, 'properties');

    for (const data of value) {
      this._browsersInfo.push(data);
    }
    return this;
  }

  /**
   * @param {...RenderBrowserInfo} browsersInfo
   * @return {this}
   */
  addBrowsers(...browsersInfo) {
    this._browsersInfo.push(...browsersInfo);
    return this;
  }

  /**
   * @param {number} width
   * @param {number} height
   * @param {BrowserType} browserType
   * @return {this}
   */
  addBrowser(width, height, browserType) {
    const browserInfo = {
      width,
      height,
      name: browserType,
    };

    this.addBrowsers(browserInfo);
    return this;
  }

  /**
   * @param {DeviceName} deviceName
   * @param {ScreenOrientation} [screenOrientation=ScreenOrientation.PORTRAIT]
   * @return {this}
   */
  addDeviceEmulation(deviceName, screenOrientation = ScreenOrientation.PORTRAIT) {
    const deviceInfo = {
      deviceName, screenOrientation,
    };

    if (this._browsersInfo === undefined) {
      this._browsersInfo = [];
    }

    this._browsersInfo.push(deviceInfo);
    return this;
  }

  /**
   * @return {Configuration}
   */
  cloneConfig() {
    return new Configuration(this);
  }
}

exports.Configuration = Configuration;
