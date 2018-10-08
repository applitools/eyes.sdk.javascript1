'use strict';

const { ArgumentGuard } = require('@applitools/eyes.sdk.core');
const { ImageOrientationHandler, EyesDriverOperationError } = require('@applitools/eyes.selenium');

const { EyesAppiumUtils } = require('./EyesAppiumUtils');

class AppiumImageOrientationHandler extends ImageOrientationHandler {
  /** @inheritDoc */
  async isLandscapeOrientation(driver) {
    try {
      const capabilities = await driver.getCapabilities();
      return EyesAppiumUtils.isMobileDeviceFromCaps(capabilities) &&
        EyesAppiumUtils.isLandscapeOrientationFromCaps(capabilities);
    } catch (err) {
      throw new EyesDriverOperationError('Failed to get orientation!', err);
    }
  }

  /** @inheritDoc */
  async tryAutomaticRotation(logger, driver, image) {
    ArgumentGuard.notNull(logger, 'logger');
    ArgumentGuard.notNull(driver, 'driver');
    ArgumentGuard.notNull(image, 'image');
    let degrees = 0;

    try {
      logger.verbose('Trying to automatically normalize rotation...');
      const capabilities = await driver.getCapabilities();

      if (
        EyesAppiumUtils.isMobileDeviceFromCaps(capabilities) &&
        EyesAppiumUtils.isLandscapeOrientationFromCaps(capabilities) &&
        image.getHeight() > image.getWidth()
      ) {
        // noinspection MagicNumberJS
        degrees = EyesAppiumUtils.isAndroidFromCaps(capabilities) ? 90 : -90;
      }

      return degrees;
    } catch (err) {
      logger.verbose(`Got exception: ${err}`);
      logger.verbose('Skipped automatic rotation handling.');
      return degrees;
    }
  }
}

exports.AppiumImageOrientationHandler = AppiumImageOrientationHandler;
