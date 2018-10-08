'use strict';

const { ContextBasedScaleProviderFactory } = require('@applitools/eyes.sdk.core');
const { Eyes: EyesSelenium, EyesSeleniumUtils } = require('@applitools/eyes.selenium');

const { AppiumImageOrientationHandler } = require('./AppiumImageOrientationHandler');
const { AppiumJavascriptHandler } = require('./AppiumJavascriptHandler');
const { EyesAppiumUtils } = require('./EyesAppiumUtils');

const VERSION = require('../package.json').version;

/**
 * Applitools SDK for Appium integration.
 */
class Eyes extends EyesSelenium {
  /** @override */
  getBaseAgentId() {
    return `eyes.appium/${VERSION}`;
  }

  /** @override */
  _init() {
    EyesSeleniumUtils.setImageOrientationHandler(new AppiumImageOrientationHandler());
    EyesSeleniumUtils.setJavascriptHandler(new AppiumJavascriptHandler(this._driver));
  }

  /** @override */
  async _getScaleProviderFactory() {
    const entireSize = await this._positionProviderHandler.get().getEntireSize();
    const isMobileDevice = await EyesAppiumUtils.isMobileDevice(this._driver);
    return new ContextBasedScaleProviderFactory(this._logger, entireSize, this._viewportSizeHandler.get(), this._devicePixelRatio, isMobileDevice, this._scaleProviderHandler);
  }

  /** @override */
  async getAppEnvironment() {
    const appEnv = await super.getAppEnvironment();

    // If hostOs isn't set, we'll try and extract and OS ourselves.
    if (!appEnv.getOs()) {
      this._logger.log('No OS set, checking for mobile OS...');
      const capabilities = await this._driver.getCapabilities();

      if (EyesAppiumUtils.isMobileDeviceFromCaps(capabilities)) {
        let platformName = null;
        this._logger.log('Mobile device detected! Checking device type..');
        if (EyesAppiumUtils.isAndroidFromCaps(capabilities)) {
          this._logger.log('Android detected.');
          platformName = 'Android';
        } else if (EyesAppiumUtils.isIOSFromCaps(capabilities)) {
          this._logger.log('iOS detected.');
          platformName = 'iOS';
        } else {
          this._logger.log('Unknown device type.');
        }

        // We only set the OS if we identified the device type.
        if (platformName) {
          let os = platformName;
          const platformVersion = EyesAppiumUtils.getPlatformVersionFromCaps(capabilities);
          if (platformVersion) {
            const majorVersion = platformVersion.split('.', 2)[0];
            if (majorVersion) {
              os += ` ${majorVersion}`;
            }
          }

          this._logger.verbose(`Setting OS: ${os}`);
          appEnv.setOs(os);
        }
      } else {
        this._logger.log('No mobile OS detected.');
      }
    }

    this._logger.log('Done!');
    return appEnv;
  }
}

exports.Eyes = Eyes;
