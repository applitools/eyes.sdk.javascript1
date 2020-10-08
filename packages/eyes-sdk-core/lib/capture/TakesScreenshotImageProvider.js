'use strict'

const ImageProvider = require('./ImageProvider')

/**
 * An image provider based on WebDriver's interface.
 */
class TakesScreenshotImageProvider extends ImageProvider {
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

  /**
   * @override
   * @return {Promise<MutableImage>}
   */
  async getImage() {
    this._logger.verbose('Getting screenshot as base64...')
    const image = await this._driver.takeScreenshot()
    if (this._rotation) {
      await image.rotate(this._rotation)
    }
    return image
  }
}

module.exports = TakesScreenshotImageProvider
