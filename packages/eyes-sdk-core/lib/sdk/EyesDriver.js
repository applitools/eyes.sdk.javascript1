'use strict'
const Location = require('../geometry/Location')
const RectangleSize = require('../geometry/RectangleSize')
const Region = require('../geometry/Region')
const MutableImage = require('../images/MutableImage')
const UserAgent = require('../useragent/UserAgent')
const EyesUtils = require('./EyesUtils')

/**
 * @typedef {import('../geometry/RectangleSize').PlainRectangleSize} PlainRectangleSize
 * @typedef {import('../geometry/RectangleSize')} RectangleSize
 * @typedef {import('../geometry/Region').RegionObject} PlainRegion
 * @typedef {import('../geometry/Region')} Region
 * @typedef {import('../images/MutableImage')} MutableImage
 * @typedef {import('../useragent/UserAgent')} UserAgent
 * @typedef {import('../logging/Logger')} Logger
 * @typedef {import('./EyesContext')} EyesContext
 * @typedef {import('./EyesElement')} EyesElement
 * @typedef {{type: 'css' | 'xpath', selector: string}} EyesSelector
 * @typedef DriverInfo
 * @prop {string} [sessionId = null]
 * @prop {boolean} [isStateless = false]
 * @prop {boolean} [isMobile = false]
 * @prop {boolean} [isNative = false]
 * @prop {string} [deviceName]
 * @prop {string} [platformName]
 * @prop {string} [platformVersion]
 * @prop {string} [browserName]
 * @prop {string} [browserVersion]
 */

/**
 * @template TDriver, TContext, TElement, TSelector
 * @typedef {Object} SpecDriver
 * @prop {(driver: any) => driver is TDriver} isDriver
 * @prop {(element: any) => element is TElement} isElement
 * @prop {(selector: any) => selector is TSelector} isSelector
 * @prop {(driver: TDriver) => TDriver} [transformDriver]
 * @prop {(element: TElement) => TElement} [transformElement]
 * @prop {(element: TElement) => TSelector} [extractSelector]
 * @prop {(driver: TDriver) => TContext} [extractContext]
 * @prop {(context: TContext, element1: TElement, element2: TElement) => boolean | Promise<boolean>} isEqualElements
 * @prop {(context: TContext, selector: TSelector) => TElement} findElement
 * @prop {(context: TContext, selector: TSelector) => TElement[]} findElements
 * @prop {(context: TContext, script: string | Function, ...args: any[]) => Promise<any>} executeScript
 * @prop {(context: TContext) => Promise<TContext | void>} mainContext
 * @prop {(context: TContext) => Promise<TContext | void>} parentContext
 * @prop {(context: TContext, element: TElement) => Promise<TContext | void>} childContext
 * @prop {(driver: TDriver) => Promise<Buffer | string>} takeScreenshot
 * @prop {(driver: TDriver, size: PlainRectangleSize) => Promise<void>} [setViewportSize]
 * @prop {(driver: TDriver) => Promise<PlainRectangleSize>} [getViewportSize]
 * @prop {(driver: TDriver, rect: PlainRegion) => Promise<void>} [setWindowRect]
 * @prop {(driver: TDriver) => Promise<PlainRegion>} [setWindowRect]
 * @prop {(driver: TDriver) => Promise<'portrait' | 'landscape'>} getOrientation
 * @prop {(driver: TDriver) => Promise<string>} getTitle
 * @prop {(driver: TDriver) => Promise<string>} getUrl
 * @prop {(driver: TDriver) => Promise<DriverInfo>} getDriverInfo
 */

/**
 * @template TDriver - TDriver provided by wrapped framework
 * @template TContext - TContext provided by wrapped framework
 * @template TElement - TElement provided by wrapped framework
 * @template TSelector - TSelector supported by framework
 */
class EyesDriver {
  static specialize(spec) {
    return class SpecializedDriver extends EyesDriver {
      static get spec() {
        return spec
      }
      get spec() {
        return spec
      }
    }
  }
  /**
   * @param {Logger} logger
   * @param {TDriver} driver
   */
  constructor(logger, driver) {
    if (driver instanceof EyesDriver) {
      return driver
    } else if (this.spec.isDriver(driver)) {
      /** @type {TDriver} */
      this._driver = this.spec.transformDriver ? this.spec.transformDriver(driver) : driver
    } else {
      throw new TypeError('EyesDriver constructor called with argument of unknown type!')
    }

    /** @type {Logger} */
    this._logger = logger

    const context = this.spec.extractContext ? this.spec.extractContext(this._driver) : this._driver
    /** @type {EyesContext<TContext, TElement, TSelector>} */
    this._mainContext = this.spec.newContext(this._logger, context, {driver: this})
    /** @type {EyesContext<TContext, TElement, TSelector>} */
    this._currentContext = this._mainContext
  }

  static isDriver(driver) {
    return driver instanceof EyesDriver || this.spec.isDriver(driver)
  }

  /**
   * @template TDriver, TContext, TElement, TSelector
   * @type {SpecDriver<TDriver, TContext, TElement, TSelector>}
   */
  static get spec() {
    throw new TypeError('The class is not specialized. Create a specialize EyesDriver first')
  }
  /** @type {SpecDriver<TDriver, TContext, TElement, TSelector>} */
  get spec() {
    throw new TypeError('The class is not specialized. Create a specialize EyesDriver first')
  }
  /** @type {TDriver} */
  get wrapper() {
    return this._wrapper
  }
  /** @type {EyesContext} */
  get currentContext() {
    return this._currentContext
  }
  /** @type {EyesContext} */
  get mainContext() {
    return this._mainContext
  }
  /** @type {boolean} */
  get isNative() {
    return this._isNative || false
  }
  /** @type {boolean} */
  get isMobile() {
    return this._isMobile || false
  }
  /** @type {boolean} */
  get isIOS() {
    return this._platformName === 'iOS'
  }
  /** @type {boolean} */
  get isIE() {
    return this._browserName === 'internet explorer'
  }
  /** @type {boolean} */
  get isEdgeLegacy() {
    const browserName = String(this._browserName).toLowerCase()
    const browserVersion = Number(this._browserVersion)
    return browserName.includes('edge') && browserVersion <= 44
  }
  /** @type {string} */
  get deviceName() {
    return this._deviceName || undefined
  }
  /** @type {string} */
  get platformName() {
    return this._platformName || undefined
  }
  /** @type {string} */
  get platformVersion() {
    return this._platformVersion || undefined
  }
  /** @type {string} */
  get browserName() {
    return this._browserName || undefined
  }
  /** @type {string} */
  get browserVersion() {
    return this._browserVersion || undefined
  }
  /** @type {UserAgent} */
  get userAgent() {
    return this._userAgent
  }
  /** @type {string} */
  get userAgentString() {
    return this._userAgentString
  }

  updateCurrentContext(context) {
    this._currentContext = context
  }

  async init() {
    if (this.spec.getDriverInfo) {
      const info = await this.spec.getDriverInfo(this._driver)
      this._sessionId = info.sessionId || null
      this._isStateless = info.isStateless || false
      this._isNative = info.isNative || false
      this._isMobile = info.isMobile || false
      this._deviceName = info.deviceName
      this._platformName = info.platformName
      this._platformVersion = info.platformVersion
      this._browserName = info.browserName
      this._browserVersion = info.browserVersion

      if (!this._isNative) {
        this._userAgentString = await EyesUtils.getUserAgent(this._logger, this)
        this._userAgent = UserAgent.parseUserAgentString(this._userAgentString, true)
      }
    }
    if (this._userAgent) {
      if (!this._isMobile) this._isMobile = ['iOS', 'Android'].includes(this._userAgent.getOS())
      if (!this._platformName) this._platformName = this._userAgent.getOS()
      if (!this._platformVersion) this._platformVersion = this._userAgent.getOSMajorVersion()
      if (!this._browserName) this._browserName = this._userAgent.getBrowser()
      if (!this._browserVersion) this._browserVersion = this._userAgent.getBrowserMajorVersion()
    }
    this._wrapper = this.spec.wrapDriver ? this.spec.wrapDriver(this._driver, this) : this._driver
    return this
  }
  /**
   * @return {EyesContext}
   */
  async refreshContexts() {
    if (this._isNative || this._isStateless) return this._currentContext
    let contextInfo = await EyesUtils.getContextInfo(this._logger, this)
    if (contextInfo.isRoot) {
      return (this._currentContext = this._mainContext)
    }
    const path = []
    while (!contextInfo.isRoot) {
      await this.spec.parentContext(this._driver)
      const contextReference = await this.findChildContext(contextInfo)
      if (!contextReference) throw new Error('Unable to find out the chain of frames')
      path.unshift(contextReference)
      contextInfo = await EyesUtils.getContextInfo(this._logger, this)
    }
    this._currentContext = this._mainContext
    return this.switchToChildContext(...path)
  }

  async findChildContext(contextInfo) {
    if (contextInfo.selector) {
      return this.spec.findElement(this._driver, {
        type: 'xpath',
        selector: contextInfo.selector,
      })
    }
    const framesInfo = await EyesUtils.getChildFramesInfo(this._logger, this)
    const contextDocument = contextInfo.documentElement
    for (const frameInfo of framesInfo) {
      if (frameInfo.isCORS !== contextInfo.isCORS) continue
      await this.spec.childContext(this._driver, frameInfo.element)
      const contentDocument = await this.spec.findElement(this._driver, {
        type: 'css',
        selector: 'html',
      })
      if (await this.spec.isEqualElements(this._driver, contentDocument, contextDocument)) {
        await this.spec.parentContext(this._driver)
        return frameInfo.element
      }
      await this.spec.parentContext(this._driver)
    }
  }
  /**
   * @param {EyesContext} context
   * @return {EyesContext}
   */
  async switchTo(context) {
    if (await this._currentContext.equals(context)) return
    const currentPath = this._currentContext.path
    const requiredPath = context.path

    let diffIndex = -1
    for (const [index, context] of requiredPath.entries()) {
      if (currentPath[index] && !(await currentPath[index].equals(context))) {
        diffIndex = index
        break
      }
    }

    if (diffIndex === 0) {
      throw new Error('Cannot switch to the context, because it has different main context')
    } else if (diffIndex === -1) {
      if (currentPath.length === requiredPath.length) {
        // required and current paths are the same
        return this._currentContext
      } else if (requiredPath.length > currentPath.length) {
        // current path is a sub-path of required path
        return this.switchToChildContext(...requiredPath.slice(currentPath.length))
      } else if (currentPath.length - requiredPath.length <= requiredPath.length) {
        // required path is a sub-path of current path
        return this.switchToParentContext(currentPath.length - requiredPath.length)
      } else {
        // required path is a sub-path of current path
        await this.switchToMainContext()
        return this.switchToChildContext(...requiredPath)
      }
    } else if (currentPath.length - diffIndex <= diffIndex) {
      // required path is different from current or they are partially intersected
      // chose an optimal way to traverse from current context to target context
      await this.switchToParentContext(currentPath.length - diffIndex)
      return this.switchToChildContext(...requiredPath.slice(diffIndex))
    } else {
      await this.switchToMainContext()
      return this.switchToChildContext(...requiredPath)
    }
  }
  /**
   * @return {EyesContext}
   */
  async switchToMainContext() {
    if (this._isNative) return
    this._logger.verbose('EyesDriver.switchToMainContext()')
    if (!this._isStateless) {
      await this.spec.mainContext(this._currentContext.unwrapped)
    }
    this._currentContext = this._mainContext
    return this._currentContext
  }
  /**
   * @param {number} elevation
   * @return {EyesContext}
   */
  async switchToParentContext(elevation = 1) {
    if (this._isNative) return this._currentContext
    this._logger.verbose(`EyesDriver.switchToParentContext(${elevation})`)
    if (this._currentContext.path.length <= elevation) {
      return this.switchToMainContext()
    }

    try {
      while (elevation > 0) {
        await this.spec.parentContext(this._currentContext.unwrapped)
        this._currentContext = this._currentContext.parent
        elevation -= 1
      }
    } catch (err) {
      this._logger.verbose('WARNING: error during switch to parent frame', err)
      const path = this._currentContext.path.slice(1, -elevation)
      await this.switchToMainContext()
      await this.switchToChildContext(...path)
      elevation = 0
    }
    return this._currentContext
  }
  /**
   * @param {...(EyesContext | EyesElement)} elevation
   * @return {EyesContext}
   */
  async switchToChildContext(...references) {
    if (this._isNative) return
    this._logger.verbose('EyesDriver.childContext()')
    for (const reference of references) {
      if (reference === this._mainContext) continue
      const context = await this._currentContext.context(reference)
      await context.focus()
    }
    return this._currentContext
  }
  /**
   * @param {TSelector} selector
   * @return {EyesElement}
   */
  async element(selector) {
    return this._currentContext.element(selector)
  }
  /**
   * @param {TSelector} selector
   * @return {EyesElement[]}
   */
  async elements(selector) {
    return this._currentContext.elements(selector)
  }
  /**
   * @param {Function | string} script
   * @param {...any} args
   * @return {Promise<any>}
   */
  async execute(script, ...args) {
    return this._currentContext.execute(script, ...args)
  }
  /**
   * @return {Promise<MutableImage>}
   */
  async takeScreenshot() {
    const screenshot = await this.spec.takeScreenshot(this._driver)
    return new MutableImage(screenshot)
  }
  /**
   * @return {Promise<RectangleSize>}
   */
  async getViewportSize() {
    const size = this.spec.getViewportSize
      ? await this.spec.getViewportSize(this._driver)
      : await EyesUtils.getViewportSize(this._logger, this._mainContext)
    return new RectangleSize(size)
  }
  /**
   * @param {PlainRectangleSize | RectangleSize} rect
   * @return {Promise<void>}
   */
  async setViewportSize(size) {
    if (size instanceof RectangleSize) {
      size = size.toJSON()
    }
    return this.spec.setViewportSize
      ? this.spec.setViewportSize(this._driver, size)
      : EyesUtils.setViewportSize(this._logger, this._mainContext, new RectangleSize(size))
  }
  /**
   * @return {Promise<Region>}
   */
  async getWindowRect() {
    const {x = 0, y = 0, width, height} = this.spec.getWindowRect
      ? await this.spec.getWindowRect(this._driver)
      : await this.spec.getViewportSize(this._driver)
    return new Region({left: x, top: y, width, height})
  }
  /**
   * @param {PlainRegion | Region} rect
   * @return {Promise<void>}
   */
  async setWindowRect(rect) {
    if (rect instanceof Location || rect instanceof RectangleSize) {
      rect = rect.toJSON()
    } else if (rect instanceof Region) {
      rect = {x: rect.getLeft(), y: rect.getTop(), width: rect.getWidth(), height: rect.getHeight()}
    }
    if (this.spec.setWindowRect) {
      await this.spec.setWindowRect(this._driver, rect)
    } else if (rect.width && rect.height) {
      await this.spec.setViewportSize(this._driver, {width: rect.width, height: rect.height})
    }
  }
  /**
   * @return {Promise<'portrait' | 'landscape'>}
   */
  async getOrientation() {
    return this.spec.getOrientation(this._driver)
  }
  /**
   * @return {Promise<number>}
   */
  async getPixelRatio() {
    if (this._isNative) {
      const viewportSize = await this.getViewportSize()
      const screenshot = await this.takeScreenshot()
      return screenshot.getWidth() / viewportSize.getWidth()
    } else {
      return EyesUtils.getPixelRatio(this._logger, this._currentContext)
    }
  }
  /**
   * @return {Promise<string>}
   */
  async getTitle() {
    if (this._isNative) return null
    return this.spec.getTitle(this._driver)
  }
  /**
   * @return {Promise<string>}
   */
  async getUrl() {
    if (this._isNative) return null
    return this.spec.getUrl(this._driver)
  }
}

module.exports = EyesDriver
