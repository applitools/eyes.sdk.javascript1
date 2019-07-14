'use strict';

const { CorsIframeHandle } = require('@applitools/eyes-sdk-core');

const { VisualGridRunner } = require('./runner/VisualGridRunner');
const { EyesRunner } = require('./runner/EyesRunner');
const { EyesSelenium } = require('./EyesSelenium');
const { EyesVisualGrid } = require('./EyesVisualGrid');
const { Configuration } = require('./config/Configuration');

/**
 * @ignore
 */
class EyesFactory {
  // noinspection JSAnnotator
  /**
   * Creates a new (possibly disabled) Eyes instance that interacts with the Eyes Server at the specified url.
   *
   * @param {string|EyesRunner} [serverUrl] - The Eyes server URL or {@code EyesRunner} to use.
   * @param {boolean} [isDisabled=false] - Set {@code true} to disable Applitools Eyes and use the webdriver directly.
   * @param {EyesRunner} [runner] - Set {@code EyesRunner} to use, default is ClassicRunner.
   * @return {Eyes}
   */
  constructor(serverUrl, isDisabled, runner) {
    if (serverUrl instanceof EyesRunner) {
      runner = serverUrl;
      serverUrl = undefined;
    }

    if (runner && runner instanceof VisualGridRunner) {
      return new EyesVisualGrid(serverUrl, isDisabled, runner);
    }

    return new EyesSelenium(serverUrl, isDisabled, runner);
  }

  /**
   * For Selenium IDE initialization
   *
   * @private
   * @param {string} [serverUrl] - The Eyes server URL.
   * @param {boolean} [isDisabled=false] - Set {@code true} to disable Applitools Eyes and use the webdriver directly.
   * @param {object} [config] - Additional configuration object.
   */
  static fromBrowserInfo(serverUrl, isDisabled, config = {}) {
    let eyes;

    if (config.browser) {
      eyes = new EyesVisualGrid(serverUrl, isDisabled);

      const cfg = new Configuration();
      const browsers = Array.isArray(config.browser) ? config.browser : [config.browser];
      browsers.forEach((browser) => {
        // If it quacks like a duck
        if (browser.name) {
          cfg.addBrowser(browser.width, browser.height, browser.name);
        } else if (browser.deviceName) {
          cfg.addDeviceEmulation(browser.deviceName, browser.screenOrientation);
        }
      });
      eyes.setConfiguration(cfg);
    } else {
      eyes = new EyesSelenium(serverUrl, isDisabled);
    }

    eyes._corsIframeHandle = CorsIframeHandle.BLANK;

    return eyes;
  }
}

exports.EyesFactory = EyesFactory;
