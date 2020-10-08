'use strict'
const Region = require('../geometry/Region')
const ImageProvider = require('./ImageProvider')
const EyesUtils = require('../sdk/EyesUtils')

class SafariScreenshotImageProvider extends ImageProvider {
  /**
   * @param {Logger} logger A Logger instance.
   * @param {EyesWrappedDriver} driver
   * @param {Eyes} eyes
   */
  constructor(logger, driver, rotation, eyes) {
    super()

    this._logger = logger
    this._driver = driver
    this._rotation = rotation
    this._eyes = eyes
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
    await this._eyes.getDebugScreenshotsProvider().save(image, 'SAFARI')

    if (this._eyes.getIsCutProviderExplicitlySet()) {
      return image
    }

    const scaleRatio = this._eyes.getDevicePixelRatio()
    const originalViewportSize = await this._eyes.getViewportSize()
    const viewportSize = originalViewportSize.scale(scaleRatio)

    this._logger.verbose(`logical viewport size: ${originalViewportSize}`)

    if (
      this._driver.userAgent.getBrowserMajorVersion() === '11' &&
      !this._eyes.getForceFullPageScreenshot()
    ) {
      const location = await EyesUtils.getScrollOffset(this._logger, this._driver.mainContext)
      await image.crop(new Region(location.scale(scaleRatio), viewportSize))
    }

    return image
  }
}

module.exports = SafariScreenshotImageProvider
