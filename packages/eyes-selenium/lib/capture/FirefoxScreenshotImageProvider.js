'use strict';

const { MutableImage, Region } = require('@applitools/eyes-common');
const { ImageProvider } = require('@applitools/eyes-sdk-core');

const { EyesWebDriverScreenshot } = require('./EyesWebDriverScreenshot');

/**
 * This class is needed because in certain versions of firefox, a frame screenshot only brings the frame viewport.
 * To solve this issue, we create an image with the full size of the browser viewport and place the frame image on it
 * in the appropriate place.
 *
 * @ignore
 */
class FirefoxScreenshotImageProvider extends ImageProvider {
  /**
   * @param {Eyes} eyes
   * @param {Logger} logger
   * @param {EyesWebDriver} tsInstance
   */
  constructor(eyes, logger, tsInstance) {
    super();

    this._eyes = eyes;
    this._logger = logger;
    this._tsInstance = tsInstance;
  }

  /**
   * @inheritDoc
   * @return {Promise<MutableImage>}
   */
  async getImage() {
    this._logger.verbose('Getting screenshot as base64...');
    const screenshot64 = await this._tsInstance.takeScreenshot();
    this._logger.verbose('Done getting base64! Creating BufferedImage...');

    const image = new MutableImage(screenshot64);
    await this._eyes.getDebugScreenshotsProvider().save(image, 'FIREFOX_FRAME');

    const frameChain = this._eyes.getDriver().getFrameChain();
    if (frameChain.size() > 0) {
      // Frame frame = frameChain.peek();
      // Region region = this._eyes.getRegionToCheck();
      const screenshot = await EyesWebDriverScreenshot.fromScreenshotType(this._logger, this._eyes.getDriver(), image);

      const viewportSize = await this._eyes.getViewportSize();
      const location = screenshot.getFrameWindow().getLocation();
      this._logger.verbose(`frame.getLocation(): ${location}`);

      const scaleRatio = this._eyes.getDevicePixelRatio();
      return image.crop(new Region(location.scale(scaleRatio), viewportSize.scale(scaleRatio)));
    }

    return image;
  }
}

exports.FirefoxScreenshotImageProvider = FirefoxScreenshotImageProvider;
