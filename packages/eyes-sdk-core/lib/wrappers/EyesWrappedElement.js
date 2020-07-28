'use strict'
const ElementNotFoundError = require('../errors/ElementNotFoundError')
const EyesUtils = require('../EyesUtils')

/**
 * @typedef {import('../logging/Logger')} Logger
 * @typedef {import('../geometry/Region')} Region
 * @typedef {import('../geometry/Location')} Location
 * @typedef {import('../geometry/RectangleSize')} RectangleSize
 */

/**
 * @template TDriver, TElement, TSelector
 * @typedef {import('./EyesWrappedDriver')<TDriver, TElement, TSelector>} EyesWrappedDriver
 */

/**
 * Cross SDK selector
 * @typedef EyesSelector
 * @prop {'css'|'xpath'} type
 * @prop {string} selector
 */

/**
 * The object which implements the lowest-level functions to work with element
 * @template TDriver, TElement, TSelector
 * @typedef SpecElement
 * @prop {(element) => boolean} isCompatible - return true if the value is an element, false otherwise
 * @prop {(selector) => boolean} isSelector - return true if the value is a valid selector, false otherwise
 * @prop {(selector: EyesSelector) => TSelector} toSupportedSelector - translate cross SDK selector to SDK specific selector
 * @prop {(selector: TSelector) => EyesSelector} toEyesSelector - translate SDK specific selector to cross SDK selector
 * @prop {(element: EyesWrappedElement<TDriver, TElement, TSelector>) => Promise<string>} extractId - extract id from the unwrapped element
 * @prop {(element: TElement) => TElement} [extractElement] - extract an element from the supported element
 * @prop {(element: TElement) => TSelector} [extractSelector] - extract an element from the supported element
 * @prop {(result) => boolean} [isStaleElementReferenceResult] - check if is a stale element reference result
 */

/**
 * @template TDriver, TElement, TSelector
 * @typedef {new (logger?: Logger, driver?: EyesWrappedDriver<TDriver, TElement, TSelector>, element?: TElement, selector?: TSelector) => EyesWrappedElement<TDriver, TElement, TSelector>} EyesWrappedElementCtor
 */

/**
 * @template TDriver, TElement, TSelector
 * @typedef EyesWrappedElementStatics
 * @prop {(element: TElement) => EyesWrappedElement<TDriver, TElement, TSelector>} fromElement
 * @prop {(selector: TSelector) => EyesWrappedElement<TDriver, TElement, TSelector>} fromSelector
 * @prop {(element) => element is TElement} isCompatible
 * @prop {(selector) => selector is TSelector} isSelector
 * @prop {(selector: EyesSelector) => TSelector} toSupportedSelector
 * @prop {(selector: TSelector) => EyesSelector} toEyesSelector
 * @prop {(element: EyesWrappedElement<TDriver, TElement, TSelector>|TElement) => Promise<string>} extractId
 */

/**
 * @template TDriver - TDriver provided by wrapped framework
 * @template TElement - TElement provided by wrapped framework
 * @template TSelector - TSelector supported by framework
 */
class EyesWrappedElement {
  /**
   * @template TDriver, TElement, TSelector
   * @param {SpecElement<TDriver, TElement, TSelector>} spec - specifications for the specific framework
   * @return {EyesWrappedElementCtor<TDriver, TElement, TSelector> & EyesWrappedElementStatics<TDriver, TElement, TSelector>} specialized version of this class
   */
  static specialize(spec) {
    return class extends EyesWrappedElement {
      /** @override */
      static get spec() {
        return spec
      }
      /** @override */
      get spec() {
        return spec
      }
    }
  }
  /**
   * @type {SpecElement}
   */
  static get spec() {
    throw new TypeError('The class is not specialized')
  }
  /** @type {SpecElement<TDriver, TElement, TSelector>} */
  get spec() {
    throw new TypeError('The class is not specialized')
  }
  /**
   * Construct a wrapped element instance. An element could be created partially, which means without drive instance,
   * Only using an element object or selector.
   * Partially created elements should be initialized by calling `EyesWrappedDriver#init` method before use.
   * @param {Logger} [logger] - logger instance
   * @param {EyesWrappedDriver<TDriver, TElement, TSelector>} [driver] - parent driver instance
   * @param {TElement} [element] - supported element object to wrap
   * @param {TSelector} [selector] - universal selector object or any kind of supported selector
   */
  constructor(logger, driver, element, selector) {
    if (element instanceof EyesWrappedElement) {
      return element
    }
    if (this.constructor.isCompatible(element)) {
      this._element = this.spec.extractElement ? this.spec.extractElement(element) : element
      // Some frameworks contains information about the selector inside an element
      this._selector = selector || (this.spec.extractSelector && this.spec.extractSelector(element))
    } else if (this.constructor.isSelector(selector)) {
      this._selector = selector
    } else {
      throw new TypeError('EyesWrappedElement constructor called with argument of unknown type!')
    }
    if (logger) {
      this._logger = logger
    }
    if (driver) {
      this._driver = driver
    }
  }

  static get __EyesWrappedElement() {
    return true
  }

  /**
   * Create partial wrapped element object from the element, this object need to be initialized before use
   * @template TDriver, TElement, TSelector
   * @param {TElement} element - supported element object
   * @return {EyesWrappedElement<TDriver, TElement, TSelector>} partially wrapped object
   */
  static fromElement(element) {
    return new this(null, null, element)
  }
  /**
   * Create partial wrapped element object from the selector, this object need to be initialized before use
   * @template TDriver, TElement, TSelector
   * @param {TSelector} selector - any kind of supported selector
   * @return {EyesWrappedElement<TDriver, TElement, TSelector>} partially wrapped object
   */
  static fromSelector(selector) {
    return new this(null, null, null, selector)
  }
  /**
   * Check if object could be wrapped with this class
   * @template TElement
   * @param element - object to check compatibility
   * @return {element is TElement} true if object could be wrapped with this class, otherwise false
   */
  static isCompatible(element) {
    if (!element) return false
    return element instanceof EyesWrappedElement || this.spec.isCompatible(element)
  }
  /**
   * Check if passed selector is supported by current implementation
   * @template TSelector
   * @param selector
   * @return {selector is TSelector} true if selector is supported and could be passed in the {@link EyesWrappedElement.fromSelector} implementation
   */
  static isSelector(selector) {
    return this.spec.isSelector(selector)
  }
  /**
   * Translate cross SDK selector to SDK specific selector
   * @template TSelector
   * @param {EyesSelector} selector
   * @return {TSelector} translated SDK specific selector object
   */
  static toSupportedSelector(selector) {
    return this.spec.toSupportedSelector(selector)
  }
  /**
   * Translate SDK specific selector to cross SDK selector
   * @template TSelector
   * @param {TSelector} selector
   * @return {EyesSelector} translated cross SDK selector object
   */
  static toEyesSelector(selector) {
    return this.spec.toEyesSelector(selector)
  }
  /**
   * Extract element ID from this class instance or unwrapped element object
   * @template TDriver, TElement, TSelector
   * @param {EyesWrappedElement<TDriver, TElement, TSelector>|TElement} element - element to extract ID
   * @return {Promise<string>} if extraction is succeed returns ID of provided element, otherwise null
   */
  static async extractId(element) {
    return element instanceof EyesWrappedElement ? element.elementId : this.spec.extractId(element)
  }
  /**
   * Compare two elements, these elements could be an instances of this class or compatible objects
   * @template TDriver, TElement, TSelector
   * @param {EyesWrappedElement<TDriver, TElement, TSelector>|TElement} leftElement - element to compare
   * @param {EyesWrappedElement<TDriver, TElement, TSelector>|TElement} rightElement - element to compare
   * @return {Promise<boolean>} true if elements are equal, false otherwise
   */
  static async equals(leftElement, rightElement) {
    if (!leftElement || !rightElement) return false
    const leftElementId = await this.extractId(leftElement)
    const rightElementId = await this.extractId(rightElement)
    return leftElementId === rightElementId
  }
  /**
   * ID of the wrapped element
   * @type {Promise<string>}
   */
  get elementId() {
    return this.spec.extractId(this._element)
  }
  /**
   * TSelector of the wrapped element
   * @type {TSelector}
   */
  get selector() {
    return this._selector
  }
  /**
   * Unwrapped element
   * @type {TElement}
   */
  get unwrapped() {
    return this._element
  }
  /**
   * Equality check for two elements
   * @param {EyesWrappedElement<TDriver, TElement, TSelector>|TElement} otherElement - element to compare
   * @return {Promise<boolean>} true if elements are equal, false otherwise
   */
  async equals(otherElement) {
    return this.constructor.equals(this, otherElement)
  }
  /**
   * Initialize element created from element or selector
   * or other kind of supported selector
   * @param {EyesWrappedDriver<TDriver, TElement, TSelector>} driver - instance of {@link EyesWrappedDriver} implementation
   * @return {Promise<this>} initialized element
   */
  async init(driver) {
    if (!this._element) {
      const element = await driver.finder.findElement(this._selector)
      if (!element) {
        throw new ElementNotFoundError(this._selector)
      }
      this._element = element.unwrapped
    }
    if (!this._driver) {
      this._driver = driver
      if (!this._logger) {
        this._logger = driver._logger
      }
    }
    return this
  }
  /**
   * Returns element rect related to context
   * @return {Promise<Region>} rect of the element
   */
  async getRect() {
    return this.withRefresh(async () => {
      return (await this._driver.controller.isNative())
        ? EyesUtils.getNativeElementRect({driver: this._driver, element: this})
        : EyesUtils.getElementRect({executor: this._driver.executor, element: this})
    })
  }
  /**
   * Returns element client rect (element rect without borders) related to context
   * @return {Promise<Region>} rect of the element
   */
  async getClientRect() {
    return this.withRefresh(() =>
      EyesUtils.getElementClientRect(this._logger, this._driver.executor, this),
    )
  }

  /**
   * Returns element's size
   * @return {Promise<RectangleSize>} size of the element
   */
  async getSize() {
    return this.withRefresh(async () => {
      return (await this._driver.controller.isNative())
        ? EyesUtils.getNativeElementSize({driver: this._driver, element: this})
        : (
            await EyesUtils.getElementRect({
              executor: this._driver.executor,
              element: this,
            })
          ).getSize()
    })
  }
  /**
   * Returns element's location related to context
   * @return {Promise<Location>} location of the element
   */
  async getLocation() {
    return this.withRefresh(async () => {
      return (await this._driver.controller.isNative())
        ? EyesUtils.getNativeElementLocation({driver: this._driver, element: this})
        : (
            await EyesUtils.getElementRect({
              executor: this._driver.executor,
              element: this,
            })
          ).getLocation()
    })
  }
  /**
   * Returns computed values for specified css properties
   * @param  {...string} properties - names of css properties
   * @return {Promise<string[]|string>} returns array of css values if multiple properties were specified,
   *  otherwise returns string
   */
  async getCssProperty(...properties) {
    const values = await this.withRefresh(() =>
      EyesUtils.getElementCssProperties(this._logger, this._driver.executor, properties, this),
    )
    return properties.length <= 1 ? values[0] : values
  }
  /**
   * Returns values for specified element's properties
   * @param  {...string} properties - names of element properties
   * @return {Promise<*[]|*>} returns array of values if multiple properties were specified,
   *  otherwise returns value
   */
  async getProperty(...properties) {
    const values = await this.withRefresh(() =>
      EyesUtils.getElementProperties(this._logger, this._driver.executor, properties, this),
    )
    return properties.length <= 1 ? values[0] : values
  }
  /**
   * Set overflow `hidden` in element's style attribute
   * @return {Promise<string>}
   */
  async hideScrollbars() {
    return this.withRefresh(async () => {
      this._originalOverflow = await EyesUtils.setOverflow(
        this._logger,
        this._driver.executor,
        'hidden',
        this,
      )
      return this._originalOverflow
    })
  }
  /**
   * Set original overflow in element's style attribute
   * @return {Promise<void>}
   */
  async restoreScrollbars() {
    return this.withRefresh(async () => {
      await EyesUtils.setOverflow(this._logger, this._driver.executor, this._originalOverflow, this)
    })
  }
  /**
   * Save current element position for future restoration
   * @param {PositionProvider} - position provider which is implementing specific algorithm
   * @return {Promise<PositionMemento>} current position
   */
  async preservePosition(positionProvider) {
    return this.withRefresh(async () => {
      this._positionMemento = await positionProvider.getState(this)
      return this._positionMemento
    })
  }
  /**
   * Restore previously saved position
   * @param {PositionProvider} - position provider which is implementing specific algorithm
   * @return {Promise<PositionMemento>} current position
   */
  async restorePosition(positionProvider) {
    if (this._positionMemento) {
      return this.withRefresh(async () => {
        await positionProvider.restoreState(this._positionMemento, this)
      })
    }
  }
  /**
   * Refresh an element reference with a specified element or try to refresh it by selector if so
   * @param {TElement} [freshElement] - element to update replace internal element reference
   * @return {boolean} true if element was successfully refreshed, otherwise false
   */
  async refresh(freshElement) {
    if (this.spec.isCompatible(freshElement)) {
      this._element = freshElement
      return true
    }
    if (!this._selector) return false
    const element = await this._driver.finder.findElement(this._selector)
    if (element) {
      this._element = element.unwrapped
    }
    return Boolean(element)
  }
  /**
   * Wrap an operation on the element and handle stale element reference if such happened during operation
   * @param {Function} operation - operation on the element
   * @return {Promise<*>} promise which resolve whatever an operation will resolve
   */
  async withRefresh(operation) {
    try {
      const result = await operation()
      // Some frameworks could handle stale element reference error by itself or doesn't throw an error
      const isStaleElementReferenceResult = this.spec.isStaleElementReferenceResult
        ? this.spec.isStaleElementReferenceResult(result, this)
        : false
      if (isStaleElementReferenceResult) {
        const freshElement = this.spec.extractElement ? this.spec.extractElement(result) : result
        await this.refresh(freshElement)
        return operation()
      }
      return result
    } catch (err) {
      const isStaleElementReferenceError = this.spec.isStaleElementReferenceResult
        ? this.spec.isStaleElementReferenceResult(err, this)
        : false
      if (!isStaleElementReferenceError) throw err
      const refreshed = await this.refresh()
      if (refreshed) return operation()
      else throw err
    }
  }
}

module.exports = EyesWrappedElement
