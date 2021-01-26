'use strict'

const ImageProvider = require('./ImageProvider')

class FirefoxScreenshotImageProvider extends ImageProvider {
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
    const originalContext = this._driver.currentContext
    await this._driver.mainContext.focus()
    const image = await this._driver.takeScreenshot()
    await originalContext.focus()
    if (this._rotation) {
      await image.rotate(this._rotation)
    }
    return image
  }
}

module.exports = FirefoxScreenshotImageProvider
