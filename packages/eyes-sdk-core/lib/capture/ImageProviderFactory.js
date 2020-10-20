'use strict'

const BrowserNames = require('../useragent/BrowserNames')
const OSNames = require('../useragent/OSNames')
const TakesScreenshotImageProvider = require('./TakesScreenshotImageProvider')
const FirefoxScreenshotImageProvider = require('./FirefoxScreenshotImageProvider')
const SafariScreenshotImageProvider = require('./SafariScreenshotImageProvider')
const IOSSafariScreenshotImageProvider = require('./IOSSafariScreenshotImageProvider')
const MobileApplicationScreenshotImageProvider = require('./MobileApplicationScreenshotImageProvider')

class ImageProviderFactory {
  /**
   * @param {Logger} logger
   * @param {EyesWrappedDriver} driver
   * @param {ImageRotation} rotation
   * @param {Eyes} eyes
   * @return {ImageProvider}
   */
  static getImageProvider(logger, driver, rotation, eyes) {
    if (driver.userAgent) {
      if (driver.userAgent.getBrowser() === BrowserNames.Firefox) {
        try {
          if (Number.parseInt(driver.userAgent.getBrowserMajorVersion(), 10) >= 48) {
            return new FirefoxScreenshotImageProvider(logger, driver, rotation, eyes)
          }
        } catch (ignored) {
          return new TakesScreenshotImageProvider(logger, driver, rotation)
        }
      } else if (driver.userAgent.getBrowser() === BrowserNames.Safari) {
        if (driver.userAgent.getOS() === OSNames.IOS) {
          return new IOSSafariScreenshotImageProvider(logger, driver, rotation, eyes)
        } else {
          return new SafariScreenshotImageProvider(logger, driver, rotation, eyes)
        }
      }
    }
    if (driver.isNative)
      return new MobileApplicationScreenshotImageProvider(logger, driver, rotation)
    return new TakesScreenshotImageProvider(logger, driver, rotation)
  }
}

module.exports = ImageProviderFactory
