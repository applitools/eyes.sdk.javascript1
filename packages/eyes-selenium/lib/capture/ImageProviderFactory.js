'use strict';

const { BrowserNames } = require('@applitools/eyes-common');

const { TakesScreenshotImageProvider } = require('./TakesScreenshotImageProvider');
const { FirefoxScreenshotImageProvider } = require('./FirefoxScreenshotImageProvider');
const { SafariScreenshotImageProvider } = require('./SafariScreenshotImageProvider');

/**
 * @ignore
 */
class ImageProviderFactory {
  /**
   * @param {UserAgent} userAgent
   * @param {Eyes} eyes
   * @param {Logger} logger
   * @param {EyesWebDriver} driver
   * @return {ImageProvider}
   */
  static getImageProvider(userAgent, eyes, logger, driver) {
    if (userAgent) {
      if (userAgent.getBrowser() === BrowserNames.Firefox) {
        try {
          if (parseInt(userAgent.getBrowserMajorVersion(), 10) >= 48) {
            return new FirefoxScreenshotImageProvider(eyes, logger, driver);
          }
        } catch (ignored) {
          return new TakesScreenshotImageProvider(logger, driver);
        }
      } else if (userAgent.getBrowser() === BrowserNames.Safari) {
        return new SafariScreenshotImageProvider(eyes, logger, driver, userAgent);
      }
    }
    return new TakesScreenshotImageProvider(logger, driver);
  }
}

exports.ImageProviderFactory = ImageProviderFactory;
