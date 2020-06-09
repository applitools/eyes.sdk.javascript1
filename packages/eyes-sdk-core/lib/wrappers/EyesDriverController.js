'use strict'
const {Location} = require('../geometry/Location')
const {RectangleSize} = require('../geometry/RectangleSize')
const {MutableImage} = require('../images/MutableImage')
const EyesDriverOperationError = require('../errors/EyesDriverOperationError')

/**
 * @typedef {import('./EyesWrappedDriver')} EyesWrappedDriver
 * @typedef {import('./EyesWrappedDriver').UnwrappedDriver} UnwrappedDriver
 */

/**
 * The object which implements the lowest-level functions to work with element finder
 * @typedef {Object} SpecsDriverController
 * @property {(driver: UnwrappedDriver) => Promise<{x: number, y: number}>} getWindowLocation - return location of the window on the screen
 * @property {(driver: UnwrappedDriver, location: {x: number, y: number}) => Promise<void>} setWindowLocation - set location of the window on the screen
 * @property {(driver: UnwrappedDriver) => Promise<{width: number, height: number}>} getWindowSize - return size of the window
 * @property {(driver: UnwrappedDriver, location: {width: number, height: number}) => Promise<void>} setWindowSize - set size of the window
 * @property {(driver: UnwrappedDriver) => Promise<'landscape'|'portrait'>} getOrientation - return string which represents screen orientation
 * @property {(driver: UnwrappedDriver) => Promise<boolean>} isMobile - true if a mobile device, false otherwise
 * @property {(driver: UnwrappedDriver) => Promise<boolean>} isAndroid - true if an Android device, false otherwise
 * @property {(driver: UnwrappedDriver) => Promise<boolean>} isIOS - true if an iOS device, false otherwise
 * @property {(driver: UnwrappedDriver) => Promise<boolean>} isNative - true if a native app, false otherwise
 * @property {(driver: UnwrappedDriver) => Promise<string>} getPlatformVersion - return version of the device's platform
 * @property {(driver: UnwrappedDriver) => Promise<string>} getSessionId - return id of the running session
 * @property {(driver: UnwrappedDriver) => Promise<string|Buffer>} takeScreenshot - return screenshot of the viewport
 * @property {(driver: UnwrappedDriver) => Promise<string>} getTitle - return page title
 * @property {(driver: UnwrappedDriver) => Promise<string>} getSource - return current url
 * @property {(driver: UnwrappedDriver, url: string) => Promise<void>} visit - redirect to the specified url
 */

class EyesDriverController {
  /**
   * @param {SpecsDriverController} SpecsDriverController - specifications for the specific framework
   * @return {EyesDriverController} specialized version of this class
   */
  static specialize(SpecsDriverController) {
    return class extends EyesDriverController {
      /** @override */
      static get specs() {
        return SpecsDriverController
      }
      /** @override */
      get specs() {
        return SpecsDriverController
      }
    }
  }
  /** @type {SpecsDriverController} */
  static get specs() {
    throw new TypeError('EyesDriverController is not specialized')
  }
  /** @type {SpecsDriverController} */
  get specs() {
    throw new TypeError('EyesDriverController is not specialized')
  }
  /**
   * Construct a driver controller instance
   * @param {Logger} logger - logger instance
   * @param {EyesWrappedDriver} driver - wrapped driver instance
   */
  constructor(logger, driver) {
    this._logger = logger
    this._driver = driver
  }
  /**
   * Get window location
   * @return {Promise<Location>} windows location
   */
  async getWindowLocation() {
    const location = await this.specs.getWindowLocation(this._driver.unwrapped)
    return new Location(location)
  }
  /**
   * Set window location
   * @param {Location} location - required  windows location
   * @returns {Promise<void>}
   */
  async setWindowLocation(location) {
    if (location instanceof Location) {
      location = location.toJSON()
    }
    await this.specs.setWindowLocation(this._driver.unwrapped, location)
  }
  /**
   * Get window size
   * @return {Promise<RectangleSize>} windows size
   */
  async getWindowSize() {
    const size = await this.specs.getWindowSize(this._driver.unwrapped)
    return new RectangleSize(size)
  }
  /**
   * Set window size
   * @param {RectangleSize} size - required windows size
   * @returns {Promise<void>}
   */
  async setWindowSize(size) {
    if (size instanceof RectangleSize) {
      size = size.toJSON()
    }
    await this.specs.setWindowSize(this._driver.unwrapped, size)
  }
  /**
   * Take screenshot of the current viewport
   * @return {Promise<MutableImage>} image of screenshot
   */
  async takeScreenshot() {
    const screenshot64 = await this.specs.takeScreenshot(this._driver.unwrapped)
    const image = new MutableImage(screenshot64)
    return image
  }
  /**
   * Check if running in landscape orientation
   * @return {Promise<boolean>} true if landscape orientation detected, false otherwise
   */
  async isLandscapeOrientation() {
    try {
      const orientation = await this.specs.getOrientation(this._driver.unwrapped)
      return orientation === 'landscape'
    } catch (err) {
      throw new EyesDriverOperationError('Failed to get orientation!', err)
    }
  }
  /**
   * Check if running in mobile device
   * @return {Promise<boolean>} true if mobile, false otherwise
   */
  async isMobile() {
    return this.specs.isMobile(this._driver.unwrapped)
  }
  /**
   * Check if running in mobile device with native context
   * @return {Promise<boolean>} true if native, false otherwise
   */
  async isNative() {
    return this.specs.isNative(this._driver.unwrapped)
  }
  /**
   * Get mobile OS if detected
   * @return {Promise<?string>} mobile OS if detected, null otherwise
   */
  async getMobileOS() {
    if (!(await this.specs.isMobile(this._driver.unwrapped))) {
      this._logger.log('No mobile OS detected.')
      return
    }
    let os = ''
    if (await this.specs.isAndroid(this._driver.unwrapped)) {
      this._logger.log('Android detected.')
      os = 'Android'
    } else if (await this.specs.isIOS(this._driver.unwrapped)) {
      this._logger.log('iOS detected.')
      os = 'iOS'
    } else {
      this._logger.log('Unknown device type.')
      return
    }
    const version = await this.specs.getPlatformVersion(this._driver.unwrapped)
    if (version) {
      os += ` ${version}`
    }
    this._logger.verbose(`Setting OS: ${os}`)
    return os
  }
  /**
   * Get browser name
   * @return {Promise<?string>} browser name if detected, null otherwise
   */
  async getBrowserName() {
    const browserName = await this.specs.getBrowserName(this._driver.unwrapped)
    return browserName || null
  }
  /**
   * Get browser version
   * @return {Promise<?string>} browser version if detected, null otherwise
   */
  async getBrowserVersion() {
    const browserVersion = await this.specs.getBrowserVersion(this._driver.unwrapped)
    return browserVersion || null
  }
  /**
   * Get AUT session ID
   * @return {Promise<string>} AUT session ID
   */
  async getAUTSessionId() {
    return this.specs.getSessionId(this._driver.unwrapped)
  }
  /**
   * Get user agent
   * @return {Promise<string>} user agent
   */
  async getUserAgent() {
    try {
      const userAgent = await this._driver.executor.executeScript('return navigator.userAgent')
      this._logger.verbose(`user agent: ${userAgent}`)
      return userAgent
    } catch (err) {
      this._logger.verbose('Failed to obtain user-agent string')
      return null
    }
  }
  /**
   * Get current page title
   * @return {Promise<string>} current page title
   */
  async getTitle() {
    return this.specs.getTitle(this._driver.unwrapped)
  }
  /**
   * Get current page url
   * @return {Promise<string>} current page url
   */
  async getSource() {
    if (!(await this.specs.isMobile(this._driver.unwrapped))) {
      return this.specs.getUrl(this._driver.unwrapped)
    } else {
      return null
    }
  }
}

module.exports = EyesDriverController
