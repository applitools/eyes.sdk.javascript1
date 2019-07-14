'use strict';

const { Capability } = require('selenium-webdriver');
const { Options: ChromeOptions } = require('selenium-webdriver/chrome');
const { Options: FirefoxOptions } = require('selenium-webdriver/firefox');
const { Options: SafariOptions } = require('selenium-webdriver/safari');
const { Options: IeOptions } = require('selenium-webdriver/ie');
const { GeneralUtils } = require('@applitools/eyes-common');

/**
 * Collection of utility methods.
 */
class TestsDataProvider {
  static dp() {
    const chromeOptions = new ChromeOptions();
    chromeOptions.addArguments('disable-infobars');

    const firefoxOptions = new FirefoxOptions();

    const ie11Options = new IeOptions();
    ie11Options.set(Capability.BROWSER_VERSION, '11');

    const safariOptions = new SafariOptions();

    const runHeadless = process.env.APPLITOOLS_RUN_HEADLESS;
    if (runHeadless && runHeadless === 'true') {
      chromeOptions.headless();
      firefoxOptions.headless();
    }

    const testPlatforms = process.env.APPLITOOLS_TEST_PLATFORMS || process.platform;
    const platforms = testPlatforms.split(';');

    const permutations = [];
    permutations.push(...GeneralUtils.cartesianProduct([
      chromeOptions,
      firefoxOptions,
      // ie11Options,
      safariOptions,
    ], platforms));

    return permutations.filter((perm) => {
      const [caps, platf] = perm;

      const browser = caps.getBrowserName().toUpperCase().trim();
      const platform = platf.toUpperCase().trim();
      return !(platform.startsWith('WIN') && browser === 'SAFARI') &&
        !(platform.startsWith('MAC') && browser === 'INTERNET EXPLORER');
    });
  }
}

exports.TestsDataProvider = TestsDataProvider;
