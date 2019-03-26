'use strict';

const { EyesScreenshotFactory } = require('@applitools/eyes-sdk-core');

const { EyesWebDriverScreenshot } = require('./EyesWebDriverScreenshot');

/**
 * Encapsulates the instantiation of an {@link EyesWebDriverScreenshot} .
 *
 * @ignore
 */
class EyesWebDriverScreenshotFactory extends EyesScreenshotFactory {
  /**
   * @param {Logger} logger
   * @param {EyesWebDriver} driver
   */
  constructor(logger, driver) {
    super();

    this._logger = logger;
    this._driver = driver;
  }

  /**
   * @inheritDoc
   */
  async makeScreenshot(image) {
    return await EyesWebDriverScreenshot.fromScreenshotType(this._logger, this._driver, image);
  }
}

exports.EyesWebDriverScreenshotFactory = EyesWebDriverScreenshotFactory;
