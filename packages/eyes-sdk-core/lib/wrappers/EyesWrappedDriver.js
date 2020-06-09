'use strict'
const {ArgumentGuard} = require('../utils/ArgumentGuard')
const EyesJsExecutor = require('./EyesJsExecutor')
const EyesBrowsingContext = require('./EyesBrowsingContext')
const EyesElementFinder = require('./EyesElementFinder')
const EyesDriverController = require('./EyesDriverController')

/**
 * @typedef {import('../logging/Logger').Logger} Logger
 * @typedef {import('./EyesJsExecutor').SpecsJsExecutor} SpecsJsExecutor
 * @typedef {import('./EyesBrowsingContext').SpecsBrowsingContext} SpecsBrowsingContext
 * @typedef {import('./EyesElementFinder').SpecsElementFinder} SpecsElementFinder
 * @typedef {import('./EyesDriverController').SpecsDriverController} SpecsDriverController
 */

/**
 * @typedef {Object} UnwrappedDriver
 * @property {?}
 */

/**
 * @typedef {Object} DriverOverrides
 * @property {(reference) => Promise<*>} switchToFrame
 * @property {() => Promise<*>} switchToParentFrame
 * @property {(url: string) => Promise<*>} visit
 *
 */

/**
 * @typedef {SpecsJsExecutor & SpecsBrowsingContext & SpecsElementFinder & SpecsDriverController} SpecsWrappedDriver
 */

class EyesWrappedDriver {
  /**
   * @param {SpecsWrappedDriver} SpecsWrappedDriver - specifications for the specific framework
   * @return {EyesWrappedDriver} specialized version of this class
   */
  static specialize(SpecsWrappedDriver, overrides) {
    const BrowsingContext = EyesBrowsingContext.specialize(SpecsWrappedDriver)
    const JsExecutor = EyesJsExecutor.specialize(SpecsWrappedDriver)
    const ElementFinder = EyesElementFinder.specialize(SpecsWrappedDriver)
    const DriverController = EyesDriverController.specialize(SpecsWrappedDriver)
    return class extends EyesWrappedDriver {
      /** @override */
      static get overrides() {
        return overrides || {}
      }
      /** @override */
      get overrides() {
        return overrides || {}
      }
      /** @override */
      static get specs() {
        return SpecsWrappedDriver
      }
      /** @override */
      get specs() {
        return SpecsWrappedDriver
      }
      /** @override */
      static get JsExecutor() {
        return JsExecutor
      }
      /** @override */
      get JsExecutor() {
        return JsExecutor
      }
      /** @override */
      static get BrowsingContext() {
        return BrowsingContext
      }
      /** @override */
      get BrowsingContext() {
        return BrowsingContext
      }
      /** @override */
      static get ElementFinder() {
        return ElementFinder
      }
      /** @override */
      get ElementFinder() {
        return ElementFinder
      }
      /** @override */
      static get DriverController() {
        return DriverController
      }
      /** @override */
      get DriverController() {
        return DriverController
      }
    }
  }
  /** @type {Object<string, Function>} */
  static get overrides() {
    return {}
  }
  /** @type {Object<string, Function>} */
  get overrides() {
    return {}
  }
  /** @type {SpecsWrappedDriver} */
  static get specs() {
    throw new TypeError('EyesWrappedDriver is not specialized')
  }
  /** @type {SpecsWrappedDriver} */
  get specs() {
    throw new TypeError('EyesWrappedDriver is not specialized')
  }
  /** @type {EyesJsExecutor} */
  static get JsExecutor() {
    throw new TypeError('EyesWrappedDriver is not specialized')
  }
  /** @type {EyesJsExecutor} */
  get JsExecutor() {
    throw new TypeError('EyesWrappedDriver is not specialized')
  }
  /** @type {EyesBrowsingContext} */
  static get BrowsingContext() {
    throw new TypeError('EyesWrappedDriver is not specialized')
  }
  /** @type {EyesBrowsingContext} */
  get BrowsingContext() {
    throw new TypeError('EyesWrappedDriver is not specialized')
  }
  /** @type {EyesElementFinder} */
  static get ElementFinder() {
    throw new TypeError('EyesWrappedDriver is not specialized')
  }
  /** @type {EyesElementFinder} */
  get ElementFinder() {
    throw new TypeError('EyesWrappedDriver is not specialized')
  }
  /** @type {EyesDriverController} */
  static get DriverController() {
    throw new TypeError('EyesWrappedDriver is not specialized')
  }
  /** @type {EyesDriverController} */
  get DriverController() {
    throw new TypeError('EyesWrappedDriver is not specialized')
  }
  /**
   * Construct wrapped driver instance and initialize all of helpers interfaces
   * @param {Logger} logger - logger instance
   * @param {UnwrappedDriver} driver - specific driver object for the framework
   */
  constructor(logger, driver) {
    ArgumentGuard.notNull(driver, 'driver')
    if (driver instanceof EyesWrappedDriver) {
      return driver
    }
    this._logger = logger
    this._driver = this.specs.prepareDriver ? this.specs.prepareDriver(driver) : driver

    this._executor = new this.JsExecutor(this._logger, this)
    this._finder = new this.ElementFinder(this._logger, this)
    this._context = new this.BrowsingContext(this._logger, this)
    this._controller = new this.DriverController(this._logger, this)

    /**
     * The set of function which should be use to override unwrapped driver functionality
     * @type {DriverOverrides}
     */
    const overrides = this.overrides
    const proxies = {
      switchToFrame: reference => this._context.frame(reference),
      switchToParentFrame: () => this._context.frameParent(),
      visit: url => {
        this._context.reset()
        return this.specs.visit(this._driver, url)
      },
    }
    this._proxy = new Proxy(this, {
      get(target, key, receiver) {
        // WORKAROUND we couldn't return Promise-like object from the async function
        if (key === 'then') return undefined
        if (key in overrides) return overrides[key].bind(receiver, proxies)
        if (key in target) return Reflect.get(target, key, receiver)
        return Reflect.get(target._driver, key)
      },
    })
    return this._proxy
  }
  /**
   * Unwrapped driver for specific SDK
   * @type {UnwrappedDriver}
   */
  get unwrapped() {
    return this._driver
  }
  /**
   * Implementation of JavaScript executor interface for specific SDK
   * @type {EyesJsExecutor}
   */
  get executor() {
    return this._executor
  }
  /**
   * Implementation of browsing context switcher interface for specific SDK
   * @type {EyesBrowsingContext}
   */
  get context() {
    return this._context
  }
  /**
   * Implementation of element finder interface for specific SDK
   * @type {EyesElementFinder}
   */
  get finder() {
    return this._finder
  }
  /**
   * Implementation of driver controller interface for specific SDK
   * @type {EyesDriverController}
   */
  get controller() {
    return this._controller
  }
}

module.exports = EyesWrappedDriver
