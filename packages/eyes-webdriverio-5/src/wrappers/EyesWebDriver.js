'use strict'

const {ArgumentGuard, MutableImage} = require('@applitools/eyes-sdk-core')
const FrameChain = require('../frames/FrameChain')
const EyesWebElement = require('./EyesWebElement')
const EyesTargetLocator = require('./EyesTargetLocator')
const EyesNullTargetLocator = require('./EyesNullTargetLocator')
const WebElement = require('./WebElement')
const EyesWDIOUtils = require('../EyesWDIOUtils')
const {By} = require('../By')

/*
 ---

 name: EyesWebDriver

 description: Wraps a Remote Web Driver.

 ---
 */

class EyesWebDriver {
  /**
   *
   * C'tor = initializes the module settings
   *
   * @constructor
   * @param {Object} logger
   * @param {WebDriver} webDriver
   * @param {Eyes|EyesWDIO|EyesVisualGrid} eyes An instance of Eyes
   **/
  constructor(logger, webDriver, eyes) {
    /** @type {WebDriver} */
    this._tsInstance = webDriver
    /** @type {Eyes} */
    this._eyes = eyes
    this._logger = logger

    this._frameChain = new FrameChain(this._logger, null)
    // this._defaultContentViewportSize = null;
    this._rotation = null
  }

  //noinspection JSUnusedGlobalSymbols
  get eyes() {
    return this._eyes
  }

  //noinspection JSUnusedGlobalSymbols
  set eyes(eyes) {
    this._eyes = eyes
  }

  //noinspection JSUnusedGlobalSymbols
  get webDriver() {
    return this._tsInstance
  }

  get remoteWebDriver() {
    return this._tsInstance.remoteWebDriver
  }

  /**
   * @return {number} The degrees by which to rotate.
   */
  get rotation() {
    return this._rotation
  }

  /** @override */
  sleep(ms) {
    return this.webDriver.sleep(ms)
  }

  /** @override */
  getCapabilities() {
    return this.webDriver.getCapabilities()
  }

  /** @override */
  end() {
    return this.webDriver.end()
  }

  /**
   * @param {number} rotation The image rotation data.
   */
  set rotation(rotation) {
    this._rotation = rotation
  }

  /**
   * @param {boolean} [forceQuery=false] If true, we will perform the query even if we have a cached viewport size.
   * @return {Promise.<RectangleSize>} The viewport size of the default content (outer most frame).
   */
  async getDefaultContentViewportSize(forceQuery = false) {
    this._logger.verbose('getDefaultContentViewportSize()')
    if (this._defaultContentViewportSize && !forceQuery) {
      this._logger.verbose('Using cached viewport size: ', this._defaultContentViewportSize)
      return this._defaultContentViewportSize
    }

    const switchTo = this.switchTo()
    const currentFrames = new FrameChain(this._logger, this.getFrameChain())

    // Optimization
    if (currentFrames.size() > 0) {
      await switchTo.defaultContent()
    }

    this._logger.verbose('Extracting viewport size...')
    this._defaultContentViewportSize = await EyesWDIOUtils.getViewportSizeOrDisplaySize(
      this._logger,
      this,
    )
    this._logger.verbose('Done! Viewport size: ', this._defaultContentViewportSize)

    if (currentFrames.size() > 0) {
      await switchTo.frames(currentFrames)
    }

    return this._defaultContentViewportSize
  }

  async getUserAgent() {
    try {
      if (!EyesWDIOUtils.isMobileDevice(this.remoteWebDriver)) {
        let userAgent = await this.remoteWebDriver.execute('return navigator.userAgent')
        this._logger.verbose('user agent: ' + userAgent)
        return userAgent
      } else {
        this._logger.verbose('no user agent for native apps')
      }
    } catch (e) {
      this._logger.verbose('Failed to obtain user-agent string')
      return null
    }
  }

  /**
   * @returns {FrameChain}
   */
  getFrameChain() {
    return this._frameChain
  }

  /**
   * @override
   * @return {EyesTargetLocator} The target locator interface for this instance.
   */
  switchTo() {
    this._logger.verbose('switchTo()')
    if (!EyesWDIOUtils.isMobileDevice(this.remoteWebDriver)) {
      return new EyesTargetLocator(this._logger, this, this.webDriver.switchTo())
    } else {
      return new EyesNullTargetLocator(this._logger, this)
    }
  }

  /**
   * @param {By} locator
   * @return {Promise.<EyesWebElement>}
   */
  async findElement(locator) {
    if (!locator.value) {
      throw new Error('This strategy type is not supported')
    }

    const element = await this.remoteWebDriver.$(locator.value)
    if (element.error) {
      throw new Error(element.error.message)
    }

    return new EyesWebElement(
      this._logger,
      this,
      new WebElement(this._tsInstance, element, locator),
    )
  }

  /**
   * @param {By} locator
   * @return {Promise.<EyesWebElement[]>}
   */
  async findElements(locator) {
    if (!locator.value) {
      throw new Error('This strategy type is not supported')
    }
    const elements = await this.remoteWebDriver.$$(locator.value)

    return elements.map(element => {
      return new EyesWebElement(
        this._logger,
        this,
        new WebElement(this._tsInstance, element, locator),
      )
    })
  }

  /**
   * @param {String} id
   * @return {Promise.<EyesWebElement>} A promise that will resolve to a EyesWebElement.
   */
  findElementById(id) {
    return this.findElement(By.id(id))
  }

  /**
   * @param {String} id
   * @return {!Promise.<!Array<!EyesWebElement>>} A promise that will resolve to an array of EyesWebElements.
   */
  findElementsById(id) {
    return this.findElements(By.id(id))
  }

  /**
   * @param {String} name
   * @return {Promise.<EyesWebElement>} A promise that will resolve to a EyesWebElement.
   */
  findElementByName(name) {
    return this.findElement(By.name(name))
  }

  /**
   * @param {String} name
   * @return {!Promise.<!Array<!EyesWebElement>>} A promise that will resolve to an array of EyesWebElements.
   */
  findElementsByName(name) {
    return this.findElements(By.name(name))
  }

  /** @override */
  async takeScreenshot() {
    // Get the image as base64.
    const screenshot64 = await this._tsInstance.takeScreenshot()
    let screenshot = new MutableImage(screenshot64)
    screenshot = await EyesWebDriver.normalizeRotation(
      this._logger,
      this._tsInstance,
      screenshot,
      this._rotation,
    )
    return screenshot.getImageBase64()
  }

  /**
   *
   * @param {String} script
   * @param varArgs
   * @returns {*}
   * @override
   */
  async executeScript(script, ...varArgs) {
    try {
      const result = await this.remoteWebDriver.execute(script, ...varArgs)
      this._logger.verbose('Done!')
      return result
    } catch (e) {
      this._logger.verbose('WARNING: execute script error: ' + e)
      throw e
    }
  }

  /** @override */
  async executeAsyncScript(script, ...varArgs) {
    try {
      const result = await this.remoteWebDriver.executeAsync(script, ...varArgs)
      this._logger.verbose('Done!')
      return result
    } catch (e) {
      this._logger.verbose('WARNING: execute script error: ' + e)
      throw e
    }
  }

  /**
   * @param {By} selector
   * @return {Promise<void>}
   */
  async click(selector) {
    await this.remoteWebDriver.click(selector.value)
  }

  /**
   * @param {String} [url]
   * @return {*|Promise}
   * @override
   */
  url(url) {
    this._frameChain.clear()
    return this.webDriver.url(url)
  }

  async getCurrentUrl() {
    if (!EyesWDIOUtils.isMobileDevice(this.remoteWebDriver)) {
      return await this.getUrl()
    } else {
      return null
    }
  }

  /**
   * @deprecated
   * @return {Promise<void>|void}
   */
  end() {
    return this.remoteWebDriver.deleteSession()
  }

  deleteSession() {
    return this.remoteWebDriver.deleteSession()
  }

  /** @override */
  getUrl() {
    return this.webDriver.getUrl()
  }

  /** @override */
  close() {
    return this.webDriver.close()
  }

  /** @override */
  getTitle() {
    return this.webDriver.getTitle()
  }

  /**
   * Rotates the image as necessary. The rotation is either manually forced by passing a non-null ImageRotation, or automatically inferred.
   *
   * @param {Logger} logger The underlying driver which produced the screenshot.
   * @param {WebDriver} driver The underlying driver which produced the screenshot.
   * @param {MutableImage} image The image to normalize.
   * @param {ImageRotation} rotation The degrees by which to rotate the image:
   *                 positive values = clockwise rotation,
   *                 negative values = counter-clockwise,
   *                 0 = force no rotation,
   *                 null = rotate automatically as needed.
   * @return {Promise.<MutableImage>} A normalized image.
   */
  static async normalizeRotation(logger, driver, image, rotation) {
    ArgumentGuard.notNull(logger, 'logger')
    ArgumentGuard.notNull(driver, 'driver')
    ArgumentGuard.notNull(image, 'image')

    let degrees
    if (rotation) {
      degrees = await rotation.getRotation()
    } else {
      degrees = await EyesWDIOUtils.tryAutomaticRotation(logger, driver, image)
    }
    return image.rotate(degrees)
  }

  /** @override */
  getSource() {
    return this.webDriver.getSource()
  }

  /** @override */
  windowHandle() {
    return this.webDriver.windowHandle()
  }

  /** @override */
  navigate() {
    //todo
    // return this.webDriver.navigate();
    throw new TypeError('navigate method is not implemented!')
  }

  /** @override */
  manage() {
    //todo
    // return this.webDriver.manage();
    throw new TypeError('manage method is not implemented!')
  }

  /**
   * @param {string} className
   * @return {Promise.<EyesWebElement>} A promise that will resolve to a EyesWebElement.
   */
  findElementByClassName(_className) {
    //todo
    // return this.findElement(by.By.className(className));
    throw new TypeError('findElementByClassName method is not implemented!')
  }

  /**
   * @param {string} className
   * @return {!Promise<!Array<!EyesWebElement>>} A promise that will resolve to an array of EyesWebElements.
   */
  findElementsByClassName(_className) {
    //todo
    // return this.findElements(by.By.className(className));
    throw new TypeError('findElementsByClassName method is not implemented!')
  }

  /**
   * @param {string} cssSelector
   * @return {Promise.<EyesWebElement>} A promise that will resolve to a EyesWebElement.
   */
  findElementByCssSelector(cssSelector) {
    return this.findElement(By.cssSelector(cssSelector))
  }

  /**
   * @param {string} cssSelector
   * @return {!Promise<!Array<!EyesWebElement>>} A promise that will resolve to an array of EyesWebElements.
   */
  findElementsByCssSelector(cssSelector) {
    return this.findElements(By.cssSelector(cssSelector))
  }

  /**
   * @param {string} linkText
   * @return {Promise.<EyesWebElement>} A promise that will resolve to a EyesWebElement.
   */
  findElementByLinkText(_linkText) {
    //todo
    // return this.findElement(by.By.linkText(linkText));
    throw new TypeError('findElementByLinkText method is not implemented!')
  }

  /**
   * @param {string} linkText
   * @return {!Promise.<!Array<!EyesWebElement>>} A promise that will resolve to an array of EyesWebElements.
   */
  findElementsByLinkText(_linkText) {
    //todo
    // return this.findElements(by.By.linkText(linkText));
    throw new TypeError('findElementsByLinkText method is not implemented!')
  }

  /**
   * @param {string} partialLinkText
   * @return {Promise.<EyesWebElement>} A promise that will resolve to a EyesWebElement.
   */
  findElementByPartialLinkText(_partialLinkText) {
    //todo
    // return this.findElement(by.By.partialLinkText(partialLinkText));
    throw new TypeError('findElementByPartialLinkText method is not implemented!')
  }

  /**
   * @param {string} partialLinkText
   * @return {!Promise.<!Array<!EyesWebElement>>} A promise that will resolve to an array of EyesWebElements.
   */
  findElementsByPartialLinkText(_partialLinkText) {
    //todo
    // return this.findElements(by.By.partialLinkText(partialLinkText));
    throw new TypeError('findElementsByPartialLinkText method is not implemented!')
  }

  /**
   * @param {string} tagName
   * @return {Promise.<EyesWebElement>} A promise that will resolve to a EyesWebElement.
   */
  findElementByTagName(tagName) {
    return this.findElement(By.tagName(tagName))
  }

  /**
   * @param {string} tagName
   * @return {!Promise.<!Array<!EyesWebElement>>} A promise that will resolve to an array of EyesWebElements.
   */
  findElementsByTagName(tagName) {
    return this.findElements(By.tagName(tagName))
  }

  /**
   * @param {string} xpath
   * @return {Promise.<EyesWebElement>} A promise that will resolve to a EyesWebElement.
   */
  findElementByXPath(xpath) {
    return this.findElement(By.xPath(xpath))
  }

  /**
   * @param {string} xpath
   * @return {!Promise<!Array<!EyesWebElement>>} A promise that will resolve to an array of EyesWebElements.
   */
  findElementsByXPath(xpath) {
    return this.findElements(By.xPath(xpath))
  }
}

module.exports = EyesWebDriver
