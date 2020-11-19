'use strict'

const GeneralUtils = require('../utils/GeneralUtils')
const EyesRunner = require('./EyesRunner')

/**
 * @typedef {{testConcurrency: number}} RunnerOptions
 */

class VisualGridRunner extends EyesRunner {
  /**
   * @param {number|RunnerOptions} [concurrencyOrRunnerOptions]
   */
  constructor(concurrencyOrRunnerOptions) {
    super()
    if (typeof concurrencyOrRunnerOptions === 'number') {
      this._legacyConcurrency = concurrencyOrRunnerOptions
    } else if (concurrencyOrRunnerOptions && concurrencyOrRunnerOptions.testConcurrency) {
      this._concurrentSessions = concurrencyOrRunnerOptions.testConcurrency
    } else if (concurrencyOrRunnerOptions) {
      throw new Error(
        'VisualGridRunner expects an object argument with property testConcurrency for controlling the number of concurrent visual tests',
      )
    }
  }

  /**
   * @deprecated
   * @return {number}
   */
  getConcurrentSessions() {
    return this._concurrentSessions
  }

  get legacyConcurrency() {
    return this._legacyConcurrency
  }

  get testConcurrency() {
    return this._concurrentSessions
  }

  makeGetVisualGridClient(makeVisualGridClient) {
    if (!this._getVisualGridClient) {
      this._getVisualGridClient = makeVisualGridClient
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
