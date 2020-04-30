const {
  TypeUtils,
  Location,
  RectangleSize,
  Region,
  MutableImage,
  EyesDriverOperationError,
} = require('@applitools/eyes-sdk-core')

class WDIODriverController {
  constructor(logger, driver) {
    this._logger = logger
    this._driver = driver
  }

  async getWindowRect(handle) {
    const [location, size] = await Promise.all([
      this.getWindowLocation(handle),
      this.getWindowSize(handle),
    ])
    return new Region(location, size)
  }

  async setWindowRect(rect, handle) {
    if (rect instanceof Region) {
      rect = Object.assign(rect.getLocation().toJSON(), rect.getSize().toJSON())
    }
    await Promise.all([
      this.setWindowLocation(handle, {x: rect.x, y: rect.y}),
      this.setWindowSize(handle, {width: rect.width, height: rect.height}),
    ])
  }

  async getWindowLocation(handle) {
    const {value: location} = await this._driver.windowHandlePosition(handle)
    return new Location(location)
  }

  async setWindowLocation(location, handle) {
    if (location instanceof Location) {
      location = location.toJSON()
    }
    await this._driver.windowHandlePosition(handle, location)
  }

  async getWindowSize(handle) {
    const {value: size} = await this._driver.windowHandleSize(handle)
    return new RectangleSize(size)
  }

  async setWindowSize(size, handle) {
    if (size instanceof RectangleSize) {
      size = size.toJSON()
    }
    await this._driver.windowHandleSize(handle, size)
  }

  async takeScreenshot() {
    const screenshot64 = await this._driver.saveScreenshot()
    const image = new MutableImage(screenshot64)
    return image
  }

  async isLandscapeOrientation() {
    try {
      const orientation = await this._driver.getOrientation()
      return orientation === 'landscape'
    } catch (err) {
      throw new EyesDriverOperationError('Failed to get orientation!', err)
    }
  }

  async isMobileDevice() {
    return this._driver.isMobile
  }

  async getMobileOS() {
    if (this._driver.isMobile) {
      let os = ''
      if (this._driver.isAndroid) {
        this._logger.log('Android detected.')
        os = 'Android'
      } else if (this._driver.isIOS) {
        this._logger.log('iOS detected.')
        os = 'iOS'
      } else {
        this._logger.log('Unknown device type.')
      }

      if (os) {
        let version
        if (this._driver.capabilities) {
          version = this._driver.capabilities.platformVersion
        } else if (this._driver.desiredCapabilities) {
          version = this._driver.desiredCapabilities.platformVersion
        }
        if (version) {
          os += ` ${version}`
        }
        this._logger.verbose(`Setting OS: ${os}`)
        return os
      }
    } else {
      this._logger.log('No mobile OS detected.')
    }
  }

  async getAUTSessionId() {
    return this._driver.requestHandler.sessionID || this._driver.sessionId
  }

  async getTitle() {
    return this._driver.getTitle()
  }

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

  async getSource() {
    if (!(await this.isMobileDevice())) {
      return this._driver.getUrl()
    } else {
      return null
    }
  }
}

module.exports = WDIODriverController
