'use strict';

const { Configuration, ArgumentGuard, TypeUtils } = require('@applitools/eyes-common');

const { StitchMode } = require('./StitchMode');

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

class SeleniumConfiguration extends Configuration {
  /**
   * @param {SeleniumConfiguration|object} [configuration]
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
  get forceFullPageScreenshot() {
    return this._forceFullPageScreenshot;
  }

  /**
   * Forces a full page screenshot (by scrolling and stitching) if the browser only supports viewport screenshots).
   *
   * @param {boolean} value - Whether to force a full page screenshot or not.
   */
  set forceFullPageScreenshot(value) {
    this._forceFullPageScreenshot = value;
  }

  /**
   * @return {number} - The time to wait just before taking a screenshot.
   */
  get waitBeforeScreenshots() {
    return TypeUtils.getOrDefault(this._waitBeforeScreenshots, DEFAULT_VALUES.waitBeforeScreenshots);
  }

  /**
   * Sets the time to wait just before taking a screenshot (e.g., to allow positioning to stabilize when performing a
   * full page stitching).
   *
   * @param {number} value - The time to wait (Milliseconds). Values smaller or equal to 0, will cause the
   *   default value to be used.
   */
  set waitBeforeScreenshots(value) {
    if (value <= 0) {
      this._waitBeforeScreenshots = undefined;
    } else {
      this._waitBeforeScreenshots = value;
    }
  }

  /**
   * @return {StitchMode} - The current stitch mode settings.
   */
  get stitchMode() {
    return TypeUtils.getOrDefault(this._stitchMode, DEFAULT_VALUES.stitchMode);
  }

  /**
   * Set the type of stitching used for full page screenshots. When the page includes fixed position header/sidebar,
   * use {@link StitchMode#CSS}. Default is {@link StitchMode#SCROLL}.
   *
   * @param {StitchMode} value - The stitch mode to set.
   */
  set stitchMode(value) {
    this._stitchMode = value;
  }

  /**
   * @return {boolean} - Whether or not scrollbars are hidden when taking screenshots.
   */
  get hideScrollbars() {
    return TypeUtils.getOrDefault(this._hideScrollbars, DEFAULT_VALUES.hideScrollbars);
  }

  /**
   * Hide the scrollbars when taking screenshots.
   *
   * @param {boolean} value - Whether to hide the scrollbars or not.
   */
  set hideScrollbars(value) {
    this._hideScrollbars = value;
  }

  /**
   * @return {boolean}
   */
  get hideCaret() {
    return TypeUtils.getOrDefault(this._hideCaret, DEFAULT_VALUES.hideCaret);
  }

  /**
   * @param {boolean} value
   */
  set hideCaret(value) {
    this._hideCaret = value;
  }

  /**
   * @return {number} - Returns the stitching overlap in pixels.
   */
  get stitchOverlap() {
    return TypeUtils.getOrDefault(this._stitchOverlap, DEFAULT_VALUES.stitchOverlap);
  }

  /**
   * Sets the stitch overlap in pixels.
   *
   * @param {number} value - The width (in pixels) of the overlap.
   */
  set stitchOverlap(value) {
    this._stitchOverlap = value;
  }

  /*----------- Visual Grid properties -----------*/

  /**
   * @return {number}
   */
  get concurrentSessions() {
    return TypeUtils.getOrDefault(this._concurrentSessions, DEFAULT_VALUES.concurrentSessions);
  }

  /**
   * @param {number} value
   */
  set concurrentSessions(value) {
    this._concurrentSessions = value;
  }

  /**
   * @return {boolean}
   */
  get isThrowExceptionOn() {
    return TypeUtils.getOrDefault(this._isThrowExceptionOn, DEFAULT_VALUES.isThrowExceptionOn);
  }

  /**
   * @param {boolean} value
   */
  set isThrowExceptionOn(value) {
    this._isThrowExceptionOn = value;
  }

  /**
   * @return {RenderBrowserInfo[]|DeviceInfo[]}
   */
  get browsersInfo() {
    return this._browsersInfo;
  }

  /**
   * @param {RenderBrowserInfo[]|DeviceInfo[]|object[]} value
   */
  set browsersInfo(value) {
    ArgumentGuard.isArray(value, 'properties');

    for (const data of value) {
      this._browsersInfo.push(data);
    }
  }

  /**
   * @param {...RenderBrowserInfo} browsersInfo
   * @return {SeleniumConfiguration}
   */
  addBrowsers(...browsersInfo) {
    this._browsersInfo.push(...browsersInfo);
    return this;
  }

  /**
   * @param {number} width
   * @param {number} height
   * @param {BrowserType} browserType
   * @return {SeleniumConfiguration}
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
   * @param {DeviceName|string} deviceName
   * @param {ScreenOrientation} screenOrientation
   * @return {SeleniumConfiguration}
   */
  addDevice(deviceName, screenOrientation) {
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
   * @return {SeleniumConfiguration}
   */
  cloneConfig() {
    return new SeleniumConfiguration(this);
  }
}

exports.SeleniumConfiguration = SeleniumConfiguration;
