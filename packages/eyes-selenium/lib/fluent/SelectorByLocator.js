'use strict';

const { GetSelector } = require('@applitools/eyes-sdk-core');
const { SelectorByElement } = require('./SelectorByElement');

/**
 * @ignore
 */
class SelectorByLocator extends GetSelector {
  /**
   * @param {By} regionLocator
   */
  constructor(regionLocator) {
    super();
    this._element = regionLocator;
  }

  // noinspection JSCheckFunctionSignatures
  /**
   * @inheritDoc
   * @param {Eyes} eyes
   * @return {Promise<string>}
   */
  async getSelector(eyes) { // eslint-disable-line no-unused-vars
    const element = await eyes._driver.findElement(this._element);
    return new SelectorByElement(element).getSelector(eyes);
  }
}

exports.SelectorByLocator = SelectorByLocator;
