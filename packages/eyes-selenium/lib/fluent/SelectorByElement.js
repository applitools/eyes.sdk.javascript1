'use strict';

const { GetSelector } = require('@applitools/eyes-sdk-core');

const EYES_SELECTOR_TAG = 'data-eyes-selector';

/**
 * @ignore
 */
class SelectorByElement extends GetSelector {
  /**
   * @param {WebElement} webElement
   */
  constructor(webElement) {
    super();
    this._element = webElement;
  }

  // noinspection JSCheckFunctionSignatures
  /**
   * @inheritDoc
   * @param {Eyes} eyes
   * @return {Promise<string>}
   */
  async getSelector(eyes) { // eslint-disable-line no-unused-vars
    const randomId = Math.random().toString(36).substring(2);
    await eyes._driver.executeScript(`arguments[0].setAttribute('${EYES_SELECTOR_TAG}', '${randomId}');`, this._element);
    return `[${EYES_SELECTOR_TAG}="${randomId}"]`;
  }
}

exports.SelectorByElement = SelectorByElement;
