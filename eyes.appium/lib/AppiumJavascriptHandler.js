'use strict';

const { MouseTrigger } = require('@applitools/eyes.sdk.core');
const { JavascriptHandler } = require('@applitools/eyes.selenium');

const { AppiumJsCommandExtractor } = require('./AppiumJsCommandExtractor');

class AppiumJavascriptHandler extends JavascriptHandler {
  /**
   * @param {EyesWebDriver} driver
   */
  constructor(driver) {
    super();

    this._driver = driver;
  }

  /** @inheritDoc */
  async handle(script, ...args) {
    // Appium commands are sometimes sent as Javascript
    if (AppiumJsCommandExtractor.isAppiumJsCommand(script)) {
      const windowRect = await this._driver.manage().window().getRect();
      const trigger = await AppiumJsCommandExtractor.extractTrigger(this._driver.getElementIds(), windowRect, script, args);

      if (trigger) {
        // TODO - Daniel, additional type of triggers
        if (trigger instanceof MouseTrigger) {
          this._driver.getEyes().addMouseTrigger(trigger.getMouseAction(), trigger.getControl(), trigger.getLocation());
        }
      }
    }
  }
}

exports.AppiumJavascriptHandler = AppiumJavascriptHandler;
