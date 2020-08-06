'use strict'

const Region = require('../geometry/Region')
const ImageProvider = require('./ImageProvider')
const EyesScreenshot = require('./EyesScreenshotNew')

/**
 * This class is needed because in certain versions of firefox, a frame screenshot only brings the frame viewport.
 * To solve this issue, we create an image with the full size of the browser viewport and place the frame image
 * on it in the appropriate place.
 */
class FirefoxScreenshotImageProvider extends ImageProvider {
  /**
   * @param {Logger} logger
   * @param {EyesDriver} driver
   * @param {ImageRotation} rotation
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
    await this._eyes.getDebugScreenshotsProvider().save(image, 'FIREFOX_FRAME')

    const context = this._driver.currentContext
    if (!context.isMain) {
      const screenshotType = await EyesScreenshot.getScreenshotType(image, this._eyes)
      let location = context.getLocationInViewport()
      if (screenshotType === EyesScreenshot.ScreenshotTypes.ENTIRE_FRAME) {
        location = location.offsetByLocation(await context.main.getInnerOffset())
      }
      const viewportSize = await this._eyes.getViewportSize()
      const scaleRatio = this._eyes.getDevicePixelRatio()
      return image.crop(new Region(location.scale(scaleRatio), viewportSize.scale(scaleRatio)))
    }

    return image
  }
}

module.exports = FirefoxScreenshotImageProvider
