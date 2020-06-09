'use strict'
const {Configuration} = require('./config/Configuration')
const {CorsIframeHandle} = require('./capture/CorsIframeHandler')
const {EyesRunner} = require('./runner/EyesRunner')
const {ClassicRunner} = require('./runner/ClassicRunner')
const {VisualGridRunner} = require('./runner/VisualGridRunner')

/**
 * @typedef {import('./EyesClassic')} EyesClassic
 * @typedef {import('./EyesVisualGrid')} EyesVisualGrid
 * @typedef {import('./runner/EyesRunner').EyesRunner} EyesRunner
 * @typedef {import('./runner/ClassicRunner').ClassicRunner} ClassicRunner
 * @typedef {import('./runner/VisualGridRunner').VisualGridRunner} VisualGridRunner
 */

/**
 * This class represents an abstraction for construction of {@link EyesClassic} and {@link EyesVisualGrid}
 */
class EyesFactory {
  /**
   * Return a specialized
   * @param {Object} implementations - implementations of related classes
   * @param {EyesClassic} implementations.EyesClassic - specialized implementation of {@link EyesClassic} class
   * @param {EyesVisualGrid} implementations.EyesVisualGrid - specialized implementation of {@link EyesVisualGrid} class
   * @return {EyesFactory} specialized version of {@link EyesFactory}
   */
  static specialize({EyesClassic, EyesVisualGrid}) {
    return class extends EyesFactory {
      /**
       * @return {EyesClassic} specialized implementation of {@link EyesClassic} class
       */
      static get EyesClassic() {
        return EyesClassic
      }
      /**
       * @return {EyesClassic} specialized implementation of {@link EyesVisualGrid} class
       */
      static get EyesVisualGrid() {
        return EyesVisualGrid
      }
    }
  }
  /**
   * Creates a new (possibly disabled) Eyes instance that interacts with the Eyes Server at the specified url.
   * @param {string|boolean|VisualGridRunner} [serverUrl=EyesBase.getDefaultServerUrl()] - Eyes server URL
   * @param {boolean} [isDisabled=false] - set to true to disable Applitools Eyes and use the webdriver directly
   * @param {EyesRunner} [runner=new ClassicRunner()] - runner related to the wanted Eyes implementation
   * @return {EyesClassic|EyesVisualGrid} instance of Eyes related to the provided runner
   */
  constructor(serverUrl, isDisabled, runner = new ClassicRunner()) {
    if (serverUrl instanceof EyesRunner) {
      runner = serverUrl
      serverUrl = undefined
    }
    if (runner instanceof VisualGridRunner) {
      return new this.constructor.EyesVisualGrid(serverUrl, isDisabled, runner)
    }
    return new this.constructor.EyesClassic(serverUrl, isDisabled, runner)
  }

  /**
   * @private
   * @param {string} [serverUrl] - The Eyes server URL.
   * @param {boolean} [isDisabled=false] - Set {@code true} to disable Applitools Eyes and use the webdriver directly.
   * @param {Object} [config] - Additional configuration object.
   */
  static fromBrowserInfo(serverUrl, isDisabled, config = {}) {
    let eyes

    if (config.browser) {
      eyes = new this.EyesVisualGrid(serverUrl, isDisabled)

      const cfg = new Configuration()
      const browsers = Array.isArray(config.browser) ? config.browser : [config.browser]
      browsers.forEach(browser => {
        // If it quacks like a duck
        if (browser.name) {
          cfg.addBrowser(browser.width, browser.height, browser.name)
        } else if (browser.deviceName) {
          cfg.addDeviceEmulation(browser.deviceName, browser.screenOrientation)
        }
      })
      eyes.setConfiguration(cfg)
    } else {
      eyes = new this.EyesClassic(serverUrl, isDisabled)
    }

    eyes._corsIframeHandle = CorsIframeHandle.BLANK

    return eyes
  }
}

module.exports = EyesFactory
