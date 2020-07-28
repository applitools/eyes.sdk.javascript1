'use strict'
const Location = require('../geometry/Location')
const RectangleSize = require('../geometry/RectangleSize')
const MutableImage = require('../images/MutableImage')
const EyesDriverOperationError = require('../errors/EyesDriverOperationError')

/**
 * @template TDriver, TElement, TSelector
 * @typedef {import('./EyesWrappedDriver')<TDriver, TElement, TSelector>} EyesWrappedDriver
 */

/**
 * The object which implements the lowest-level functions to work with element finder
 * @template TDriver, TElement, TSelector
 * @typedef SpecDriverController
 * @prop {(driver: TDriver) => Promise<{x: number, y: number}>} getWindowLocation - return location of the window on the screen
 * @prop {(driver: TDriver, location: {x: number, y: number}) => Promise<void>} setWindowLocation - set location of the window on the screen
 * @prop {(driver: TDriver) => Promise<{width: number, height: number}>} getWindowSize - return size of the window
 * @prop {(driver: TDriver, size: {width: number, height: number}) => Promise<void>} setWindowSize - set size of the window
 * @prop {(driver: TDriver) => Promise<'landscape'|'portrait'>} getOrientation - return string which represents screen orientation
 * @prop {(driver: TDriver) => Promise<boolean>} isMobile - true if a mobile device, false otherwise
 * @prop {(driver: TDriver) => Promise<boolean>} isAndroid - true if an Android device, false otherwise
 * @prop {(driver: TDriver) => Promise<boolean>} isIOS - true if an iOS device, false otherwise
 * @prop {(driver: TDriver) => Promise<boolean>} isNative - true if a native app, false otherwise
 * @prop {(driver: TDriver) => Promise<string>} getPlatformVersion - return version of the device's platform
 * @prop {(driver: TDriver) => Promise<string>} getSessionId - return id of the running session
 * @prop {(driver: TDriver) => Promise<MutableImage>} takeScreenshot - return screenshot of the viewport
 * @prop {(driver: TDriver) => Promise<string>} getTitle - return page title
 * @prop {(driver: TDriver) => Promise<string>} getSource - return current url
 * @prop {(driver: TDriver, url: string) => Promise<void>} visit - redirect to the specified url
 */

/**
 * @template TDriver, TElement, TSelector
 * @typedef {new (logger: Logger, driver: EyesWrappedDriver<TDriver, TElement, TSelector>) => EyesDriverController<TDriver, TElement, TSelector>} EyesDriverControllerCtor
 */

/**
 * @template TDriver - TDriver provided by wrapped framework
 * @template TElement - TElement provided by wrapped framework
 * @template TSelector - TSelector supported by framework
 */
class EyesDriverController {
  /**
   * @template TDriver, TElement, TSelector
   * @param {SpecDriverController<TDriver, TElement, TSelector>} spec - specifications for the specific framework
   * @return {EyesDriverControllerCtor<TDriver, TElement, TSelector>} specialized version of this class
   */
  static specialize(spec) {
    return class extends EyesDriverController {
      /** @override */
      static get spec() {
        return spec
      }
      /** @override */
      get spec() {
        return spec
      }
    }
  }
  /**
   * @type {SpecDriverController}
   */
  static get spec() {
    throw new TypeError('EyesDriverController is not specialized')
  }
  /** @type {SpecDriverController<TDriver, TElement, TSelector>} */
  get spec() {
    throw new TypeError('EyesDriverController is not specialized')
  }
  /**
   * Construct a driver controller instance
   * @param {Logger} logger - logger instance
   * @param {EyesWrappedDriver<TDriver, TElement, TSelector>} driver - wrapped driver instance
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
    const location = await this.spec.getWindowLocation(this._driver.unwrapped)
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
    await this.spec.setWindowLocation(this._driver.unwrapped, location)
  }
  /**
   * Get window size
   * @return {Promise<RectangleSize>} windows size
   */
  async getWindowSize() {
    const size = await this.spec.getWindowSize(this._driver.unwrapped)
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
    await this.spec.setWindowSize(this._driver.unwrapped, size)
  }
  /**
   * Take screenshot of the current viewport
   * @return {Promise<MutableImage>} image of screenshot
   */
  async takeScreenshot() {
    const screenshot64 = await this.spec.takeScreenshot(this._driver.unwrapped)
    const image = new MutableImage(screenshot64)
    return image
  }
  /**
   * Check if running in landscape orientation
   * @return {Promise<boolean>} true if landscape orientation detected, false otherwise
   */
  async isLandscapeOrientation() {
    try {
      const orientation = await this.spec.getOrientation(this._driver.unwrapped)
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
    return (
      this._isMobilePromise || (this._isMobilePromise = this.spec.isMobile(this._driver.unwrapped))
    )
  }
  /**
   * Check if running in mobile device with native context
   * @return {Promise<boolean>} true if native, false otherwise
   */
  async isNative() {
    return (
      this._isNativePromise || (this._isNativePromise = this.spec.isNative(this._driver.unwrapped))
    )
  }
  /**
   * Get mobile OS if detected
   * @return {Promise<?string>} mobile OS if detected, null otherwise
   */
  async getMobileOS() {
    if (!(await this.spec.isMobile(this._driver.unwrapped))) {
      this._logger.log('No mobile OS detected.')
      return
    }
    let os = ''
    if (await this.spec.isAndroid(this._driver.unwrapped)) {
      this._logger.log('Android detected.')
      os = 'Android'
    } else if (await this.spec.isIOS(this._driver.unwrapped)) {
      this._logger.log('iOS detected.')
      os = 'iOS'
    } else {
      this._logger.log('Unknown device type.')
      return
    }
    const version = await this.spec.getPlatformVersion(this._driver.unwrapped)
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
    const browserName = await this.spec.getBrowserName(this._driver.unwrapped)
    return browserName || null
  }
  /**
   * Get browser version
   * @return {Promise<?string>} browser version if detected, null otherwise
   */
  async getBrowserVersion() {
    const browserVersion = await this.spec.getBrowserVersion(this._driver.unwrapped)
    return browserVersion || null
  }
  /**
   * Get AUT session ID
   * @return {Promise<string>} AUT session ID
   */
  async getAUTSessionId() {
    return this.spec.getSessionId(this._driver.unwrapped)
  }
  /**
   * Get user agent
   * @return {Promise<string>} user agent
   */
  async getUserAgent() {
    if (await this.spec.isNative(this._driver.unwrapped)) return null
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
    if (await this.spec.isNative(this._driver.unwrapped)) return null
    return this.spec.getTitle(this._driver.unwrapped)
  }
  /**
   * Get current page url
   * @return {Promise<string>} current page url
   */
  async getSource() {
    if (await this.spec.isNative(this._driver.unwrapped)) return null
    return this.spec.getUrl(this._driver.unwrapped)
  }
}

module.exports = EyesDriverController
