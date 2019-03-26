'use strict';

const { MutableImage } = require('@applitools/eyes-common');
const { ImageProvider } = require('@applitools/eyes-sdk-core');

/**
 * An image provider based on WebDriver's interface.
 *
 * @ignore
 */
class TakesScreenshotImageProvider extends ImageProvider {
  /**
   * @param {Logger} logger - A Logger instance.
   * @param {EyesWebDriver} tsInstance
   */
  constructor(logger, tsInstance) {
    super();

    this._logger = logger;
    this._tsInstance = tsInstance;
  }

  /**
   * @override
   * @return {Promise<MutableImage>}
   */
  async getImage() {
    this._logger.verbose('Getting screenshot as base64...');
    const screenshot64 = await this._tsInstance.takeScreenshot();
    this._logger.verbose('Done getting base64! Creating MutableImage...');
    return new MutableImage(screenshot64);
  }
}

exports.TakesScreenshotImageProvider = TakesScreenshotImageProvider;
