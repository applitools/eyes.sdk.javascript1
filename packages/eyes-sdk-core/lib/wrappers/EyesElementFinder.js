'use strict'
/**
 * @typedef {import('../logging/Logger').Logger} Logger
 * @typedef {import('./EyesWrappedDriver')} EyesWrappedDriver
 * @typedef {import('./EyesWrappedDriver').UnwrappedDriver} UnwrappedDriver
 * @typedef {import('./EyesWrappedElement')} EyesWrappedElement
 * @typedef {import('./EyesWrappedElement').SupportedElement} SupportedElement
 * @typedef {import('./EyesWrappedElement').EyesSelector} EyesSelector
 * @typedef {import('./EyesWrappedElement').SupportedSelector} SupportedSelector
 */

/**
 * The object which implements the lowest-level functions to work with element finder
 * @typedef {Object} SpecsElementFinder
 * @property {(driver: UnwrappedDriver, selector: SupportedSelector) => EyesWrappedElement} findElement - return found element
 * @property {(driver: UnwrappedDriver, selector: SupportedSelector) => EyesWrappedElement} findElements - return found elements
 * @property {(logger: Logger, driver: EyesWrappedDriver, element: SupportedElement, selector: SupportedSelector) => EyesWrappedElement} createElement - return wrapped element instance
 * @property {(selector: EyesSelector) => SupportedSelector} toSupportedSelector - translate cross SDK selector to SDK specific selector
 * @property {(selector: SupportedSelector) => EyesSelector} toEyesSelector - translate SDK specific selector to cross SDK selector
 */

class EyesElementFinder {
  /**
   * @param {SpecsElementFinder} SpecsElementFinder - specifications for the specific framework
   * @return {EyesElementFinder} specialized version of this class
   */
  static specialize(SpecsElementFinder) {
    return class extends EyesElementFinder {
      /** @override */
      static get specs() {
        return SpecsElementFinder
      }
      /** @override */
      get specs() {
        return SpecsElementFinder
      }
    }
  }
  /** @type {SpecsElementFinder} */
  static get specs() {
    throw new TypeError('The class is not specialized')
  }
  /** @type {SpecsElementFinder} */
  get specs() {
    throw new TypeError('The class is not specialized')
  }
  /**
   * Construct an element finder instance
   * @param {Logger} logger - logger instance
   * @param {EyesWrappedDriver} driver - wrapped driver instance
   */
  constructor(logger, driver) {
    this._logger = logger
    this._driver = driver
  }
  /**
   * Returns first founded element
   * @param {SupportedSelector} selector - selector supported by current implementation
   * @return {Promise<EyesWrappedElement>}
   */
  async findElement(selector) {
    selector = this.specs.toSupportedSelector(selector)
    const element = await this.specs.findElement(this._driver.unwrapped, selector)
    return element ? this.specs.createElement(this._logger, this._driver, element, selector) : null
  }
  /**
   * Returns all founded element
   * @param {SupportedSelector} selector - selector supported by current implementation
   * @return {Promise<EyesWrappedElement[]>}
   */
  async findElements(selector) {
    const elements = await this.specs.findElements(this._driver.unwrapped, selector)
    return elements.map(element =>
      this.specs.createElement(this._logger, this._driver, element, selector),
    )
  }
}

module.exports = EyesElementFinder
