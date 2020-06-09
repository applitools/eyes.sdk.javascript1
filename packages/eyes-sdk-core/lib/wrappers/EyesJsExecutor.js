'use strict'
const EyesWrappedElement = require('./EyesWrappedElement')

/**
 * @typedef {import('../logging/Logger').Logger} Logger
 * @typedef {import('./EyesWrappedDriver')} EyesWrappedDriver
 */

/**
 * The object which implements the lowest-level functions to work with element finder
 * @typedef {Object} SpecsJsExecutor
 * @property {(driver: UnwrappedDriver, script: string|Function, ...args) => Promise<*>} executeScript - execute script and return result
 * @property {(driver: UnwrappedDriver, ms: number) => Promise<void>} sleep - makes the driver sleep for the given amount of time in ms
 */

class EyesJsExecutor {
  /**
   * @param {SpecsJsExecutor} SpecsJsExecutor - specifications for the specific framework
   * @return {EyesJsExecutor} specialized version of this class
   */
  static specialize(SpecsJsExecutor) {
    return class extends EyesJsExecutor {
      /** @override */
      static get specs() {
        return SpecsJsExecutor
      }
      /** @override */
      get specs() {
        return SpecsJsExecutor
      }
    }
  }
  /** @type {SpecsJsExecutor} */
  static get specs() {
    throw new TypeError('The class is not specialized')
  }
  /** @type {SpecsJsExecutor} */
  get specs() {
    throw new TypeError('The class is not specialized')
  }
  /**
   * Construct js executor instance
   * @param {Logger} logger - logger instance
   * @param {EyesWrappedDriver} driver - wrapped driver instance
   */
  constructor(logger, driver) {
    this._logger = logger
    this._driver = driver
  }
  /**
   * Schedules a command to execute JavaScript in the context of the currently selected frame or window. The script
   * fragment will be executed as the body of an anonymous function. If the script is provided as a function object,
   * that function will be converted to a string for injection into the target window.
   *
   * @param {!(string|Function)} script - script to execute
   * @param {...*} args - arguments to pass to the script
   * @return {Promise<*>} promise that will resolve to the scripts return value
   */
  async executeScript(script, ...args) {
    try {
      const result = await this.specs.executeScript(
        this._driver.unwrapped,
        script,
        ...args.map(arg => (arg instanceof EyesWrappedElement ? arg.unwrapped : arg)),
      )
      this._logger.verbose('Done!')
      return result
    } catch (err) {
      this._logger.verbose('WARNING: execute script error: ' + err)
      throw err
    }
  }
  /**
   * Schedules a command to make the driver sleep for the given amount of time
   * @param {number} ms - amount of time, in milliseconds, to sleep
   * @return {Promise<void>} promise that will be resolved when the sleep has finished
   */
  sleep(ms) {
    return this.specs.pause(this._driver.unwrapped, ms)
  }
}

module.exports = EyesJsExecutor
