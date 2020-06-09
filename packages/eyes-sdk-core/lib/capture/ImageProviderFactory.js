'use strict'

const {BrowserNames} = require('../..')

const TakesScreenshotImageProvider = require('./TakesScreenshotImageProvider')
const FirefoxScreenshotImageProvider = require('./FirefoxScreenshotImageProvider')
const SafariScreenshotImageProvider = require('./SafariScreenshotImageProvider')

class ImageProviderFactory {
  /**
   * @param {Logger} logger
   * @param {EyesWrappedDriver} driver
   * @param {ImageRotation} rotation
   * @param {Eyes} eyes
   * @param {UserAgent} userAgent
   * @return {ImageProvider}
   */
  static getImageProvider(logger, driver, rotation, eyes, userAgent) {
    if (userAgent) {
      if (userAgent.getBrowser() === BrowserNames.Firefox) {
        try {
          if (Number.parseInt(userAgent.getBrowserMajorVersion(), 10) >= 48) {
            return new FirefoxScreenshotImageProvider(logger, driver, rotation, eyes)
          }
        } catch (ignored) {
          return new TakesScreenshotImageProvider(logger, driver, rotation)
        }
      } else if (userAgent.getBrowser() === BrowserNames.Safari) {
        return new SafariScreenshotImageProvider(logger, driver, rotation, eyes, userAgent)
      }
    }
    return new TakesScreenshotImageProvider(logger, driver, rotation)
  }
}

module.exports = ImageProviderFactory
