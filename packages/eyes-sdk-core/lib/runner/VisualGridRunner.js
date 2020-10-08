'use strict'

const {GeneralUtils} = require('../..')
const EyesRunner = require('./EyesRunner')

class VisualGridRunner extends EyesRunner {
  /**
   * @param {number} [concurrentSessions]
   */
  constructor(concurrentSessions) {
    super()
    this._concurrentSessions = concurrentSessions
  }

  /**
   * @return {number}
   */
  getConcurrentSessions() {
    return this._concurrentSessions
  }

  makeGetVisualGridClient(makeVisualGridClient) {
    if (!this._getVisualGridClient) {
      this._getVisualGridClient = GeneralUtils.cachify(makeVisualGridClient)
    }
  }

  async getVisualGridClientWithCache(config) {
    if (this._getVisualGridClient) {
      return this._getVisualGridClient(config)
    } else {
      throw new Error(
        'VisualGrid runner could not get visual grid client since makeGetVisualGridClient was not called before',
      )
    }
  }
}

module.exports = VisualGridRunner
