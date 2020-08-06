'use strict'
const Configuration = require('../config/Configuration')
const CorsIframeHandles = require('../capture/CorsIframeHandles')
const EyesRunner = require('../runner/EyesRunner')
const ClassicRunner = require('../runner/ClassicRunner')
const VisualGridRunner = require('../runner/VisualGridRunner')

/**
 * @typedef {import('../runner/EyesRunner')} EyesRunner
 */

/**
 * @template TDriver, TElement, TSelector
 * @typedef {import('./EyesClassic')<TDriver, TElement, TSelector>} EyesClassic
 */

/**
 * @template TDriver, TElement, TSelector
 * @typedef {import('./EyesVisualGrid')<TDriver, TElement, TSelector>} EyesVisualGrid
 */

/**
 * @template TDriver, TElement, TSelector
 * @typedef {new (serverUrl?: string|boolean|EyesRunner, isDisabled?: boolean, runner?: EyesRunner) => EyesClassic<TDriver, TElement, TSelector>} EyesFactoryCtor
 */

/**
 * This class represents an abstraction for construction of {@link EyesClassic} and {@link EyesVisualGrid}
 *
 * @template TDriver
 * @template TElement
 * @template TSelector
 */
class EyesFactory {
  /**
   * Return a specialized
   * @template TDriver, TElement, TSelector
   * @param {Object} implementations - implementations of related classes
   * @param {new (...args: any[]) => EyesClassic<TDriver, TElement, TSelector>} implementations.EyesClassic - specialized implementation of {@link EyesClassic} class
   * @param {new (...args: any[]) => EyesVisualGrid<TDriver, TElement, TSelector>} implementations.EyesVisualGrid - specialized implementation of {@link EyesVisualGrid} class
   * @return {EyesFactoryCtor<TDriver, TElement, TSelector>} specialized version of {@link EyesFactory}
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

      /**
       * Sets the browser's viewport size
       * @param {TDriver} driver - driver object for the specific framework
       * @param {RectangleSize|{width: number, height: number}} viewportSize - viewport size
       */
      static async setViewportSize(driver, viewportSize) {
        return EyesClassic.setViewportSize(driver, viewportSize)
      }
    }
  }
  /**
   * @param {string|boolean|EyesRunner} [serverUrl=EyesBase.getDefaultServerUrl()] - Eyes server URL
   * @param {boolean} [isDisabled=false] - set to true to disable Applitools Eyes and use the webdriver directly
   * @param {EyesRunner} [runner=new ClassicRunner()] - runner related to the wanted Eyes implementation
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

    eyes._corsIframeHandle = CorsIframeHandles.BLANK

    return eyes
  }
}

module.exports = EyesFactory
