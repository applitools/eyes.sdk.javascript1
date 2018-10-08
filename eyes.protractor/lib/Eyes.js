'use strict';

const { Eyes: EyesSelenium } = require('@applitools/eyes.selenium');

const { ElementFinderWrapper, ElementArrayFinderWrapper } = require('./ElementFinderWrappers');

const VERSION = require('../package.json').version;

/**
 * The main type - to be used by the users of the library to access all functionality.
 */
class Eyes extends EyesSelenium {
  /** @override */
  getBaseAgentId() {
    return `eyes.protractor/${VERSION}`;
  }

  /** @override */
  open(driver, appName, testName, viewportSize, sessionType) {
    if (typeof protractor === 'undefined') {
      throw new Error('Protractor component not found.');
    }

    // extend protractor element to return ours
    if (!global.isEyesOverrodeProtractor) {
      const originalElementFn = global.element;

      global.element = locator => new ElementFinderWrapper(this._logger, this._driver, originalElementFn(locator));
      global.element.all = locator => new ElementArrayFinderWrapper(this._logger, this._driver, originalElementFn.all(locator));

      global.isEyesOverrodeProtractor = true;
    }

    return super.open(driver, appName, testName, viewportSize, sessionType);
  }
}

exports.Eyes = Eyes;
