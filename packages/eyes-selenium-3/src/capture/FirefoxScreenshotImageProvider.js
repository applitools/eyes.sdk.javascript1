'use strict'

const {ImageProvider, MutableImage} = require('@applitools/eyes-sdk-core-legacy')

const {EyesWebDriverScreenshot} = require('./EyesWebDriverScreenshot')

/**
 * This class is needed because in certain versions of firefox, a frame screenshot only brings the frame viewport.
 * To solve this issue, we create an image with the full size of the browser viewport and place the frame image on it
 * in the appropriate place.
 */
class FirefoxScreenshotImageProvider extends ImageProvider {
  /**
   * @param {Eyes} eyes
   * @param {Logger} logger
   * @param {EyesWebDriver} tsInstance
   */
  constructor(eyes, logger, tsInstance) {
    super()

    this._eyes = eyes
    this._logger = logger
    this._tsInstance = tsInstance
  }

  /**
   * @override
   * @return {Promise<MutableImage>}
   */
  getImage() {
    const that = this
    this._logger.verbose('Getting screenshot as base64...')
    return this._tsInstance.takeScreenshot().then(screenshot64 => {
      that._logger.verbose('Done getting base64! Creating BufferedImage...')
      const image = MutableImage.fromBase64(screenshot64, that._eyes.getPromiseFactory())

      return that._eyes._promiseFactory.resolve().then(() => {
        const frameChain = that._tsInstance.getFrameChain()
        if (frameChain.size() > 0) {
          // Frame frame = frameChain.peek();
          // Region region = eyes.getRegionToCheck();
          const screenshot = new EyesWebDriverScreenshot(
            that._logger,
            that._tsInstance,
            image,
            that._eyes.getPromiseFactory(),
          )

          return screenshot
            .buildScreenshot()
            .then(() => that._eyes.getViewportSize())
            .then(viewportSize => {
              const loc = screenshot.getFrameWindow().getLocation()
              that._logger.verbose(`frame.getLocation(): ${loc}`)

              const scaleRatio = that._eyes.getDevicePixelRatio()
              return image.cropImage({
                left: loc.x * scaleRatio,
                top: loc.y * scaleRatio,
                width: viewportSize.width * scaleRatio,
                height: viewportSize.height * scaleRatio,
              })
            })
        }

        return image
      })
    })
  }
}

exports.FirefoxScreenshotImageProvider = FirefoxScreenshotImageProvider
