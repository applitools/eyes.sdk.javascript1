'use strict'

const ImageProvider = require('./ImageProvider')
const MutableImage = require('../images/MutableImage')

/**
 * An image provider based on WebDriver's interface.
 */
class MobileApplicationScreenshotImageProvider extends ImageProvider {
  /**
   * @param {Logger} logger A Logger instance.
   * @param {ImageRotation} rotation
   * @param {EyesWrappedDriver} driver
   */
  constructor(logger, driver, rotation) {
    super()

    this._logger = logger
    this._driver = driver
    this._rotation = rotation
  }

  set rotation(rotation) {
    this._rotation = rotation
  }

  // Uses Appium hook available through the JS executor
  // http://appium.io/docs/en/commands/mobile-command/
  // Supported on iOS (XCUITest) and Android (UIAutomator2 only)
  /**
   * @override
   * @return {Promise<MutableImage>}
   */
  async getImage() {
    this._logger.verbose('Getting screenshot as base64...')
    let screenshot = await this._driver.execute('mobile: viewportScreenshot')
    // trimming line breaks since 3rd party grid providers can return them
    screenshot = screenshot.replace(/\r\n/g, '')
    const image = new MutableImage(screenshot)
    if (this._rotation) {
      await image.rotate(this._rotation)
    }
    return image
  }
}

module.exports = MobileApplicationScreenshotImageProvider
