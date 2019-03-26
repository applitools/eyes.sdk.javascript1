'use strict';

/**
 * @ignore
 */
class GetSelector {
  /**
   * @param {string} [selector]
   */
  constructor(selector) {
    this._selector = selector;
  }

  // noinspection JSMethodCanBeStatic
  /**
   * @param {Eyes} eyes
   * @return {Promise<string>}
   */
  async getSelector(eyes) { // eslint-disable-line
    return this._selector;
  }
}

exports.GetSelector = GetSelector;
