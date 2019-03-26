'use strict';

const { EyesJsExecutor } = require('@applitools/eyes-sdk-core');

/**
 * @ignore
 */
class SeleniumJavaScriptExecutor extends EyesJsExecutor {
  /**
   * @param {EyesWebDriver|WebDriver} driver
   */
  constructor(driver) {
    super();

    this._driver = driver;
  }

  /**
   * @inheritDoc
   */
  executeScript(script, ...args) {
    return this._driver.executeScript(script, ...args);
  }

  /**
   * @inheritDoc
   */
  sleep(millis) {
    return this._driver.sleep(millis);
  }
}

exports.SeleniumJavaScriptExecutor = SeleniumJavaScriptExecutor;
