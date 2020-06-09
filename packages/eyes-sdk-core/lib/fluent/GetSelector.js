'use strict'

/**
 * @ignore
 */
class GetSelector {
  /**
   * @param {string} [selector]
   */
  constructor(selector) {
    this._selector = selector
  }

  /**
   * @param {EyesWrappedDriver} driver
   * @return {Promise<string>}
   */
  async getSelector(eyes) { // eslint-disable-line
    return this._selector
  }
}

exports.GetSelector = GetSelector
