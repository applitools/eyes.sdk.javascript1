'use strict'
const Region = require('../geometry/Region')
const ImageProvider = require('./ImageProvider')
const Location = require('../geometry/Location')
const EyesUtils = require('../sdk/EyesUtils')
const ImageUtils = require('../utils/ImageUtils')

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

  async getCropRegion() {
    const marker = await EyesUtils.addPageMarker(this._logger, this._driver.mainContext)
    const image = await this._driver.takeScreenshot()
    if (this._rotation) {
      await image.rotate(this._rotation)
    }

    await this._eyes.getDebugScreenshotsProvider().save(image, 'SAFARI_MARKER')

    const markerPosition = ImageUtils.findMarkerPosition(await image.getImageData(), marker)
    if (!markerPosition) return null

    const scaleRatio = this._eyes.getDevicePixelRatio()
    const viewportSize = await this._eyes.getViewportSize()
    const scaledViewportSize = viewportSize.scale(scaleRatio)

    this._logger.verbose(`logical viewport size: ${viewportSize}`)
    this._logger.verbose(`physical device pixel size: ${image.getWidth()}x${image.getHeight()}`)

    await EyesUtils.cleanupPageMarker(this._logger, this._driver.mainContext)
    return new Region(new Location(markerPosition), scaledViewportSize)
  }

  /**
   * @override
   * @return {Promise<MutableImage>}
   */
  async getImage() {
    this._logger.verbose('Getting screenshot...')

    const image = await this._driver.takeScreenshot()

    if (this._rotation) {
      await image.rotate(this._rotation)
    }

    if (!this._cropRegion) {
      this._cropRegion = await this.getCropRegion()
    }

    await this._eyes.getDebugScreenshotsProvider().save(image, 'SAFARI')

    if (this._eyes.getIsCutProviderExplicitlySet()) {
      return image
    }

    await image.crop(this._cropRegion)

    return image
  }
}

module.exports = SafariScreenshotImageProvider
