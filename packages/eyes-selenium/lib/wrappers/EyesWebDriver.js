'use strict'

const {By} = require('selenium-webdriver')
const {IWebDriver} = require('selenium-webdriver/lib/webdriver')
const {ArgumentGuard, MutableImage, GeneralUtils} = require('@applitools/eyes-sdk-core')

const {FrameChain} = require('../frames/FrameChain')
const {EyesSeleniumUtils} = require('../EyesSeleniumUtils')
const {EyesWebElement} = require('./EyesWebElement')
const {EyesWebElementPromise} = require('./EyesWebElementPromise')
const {EyesTargetLocator} = require('./EyesTargetLocator')

/**
 * An Eyes implementation of the interfaces implemented by {@link IWebDriver}.
 * Used so we'll be able to return the users an object with the same functionality as {@link WebDriver}.
 *
 * @extends {WebDriver}
 * @implements {EyesJsExecutor}
 */
class EyesWebDriver extends IWebDriver {
  /**
   * @param {Logger} logger
   * @param {Eyes} eyes
   * @param {WebDriver} driver
   */
  constructor(logger, eyes, driver) {
    super()
    ArgumentGuard.notNull(logger, 'logger')
    ArgumentGuard.notNull(eyes, 'eyes')
    ArgumentGuard.notNull(driver, 'driver')

    this._logger = logger
    this._eyes = eyes
    this._driver = driver

    this._elementsIds = new Map()
    this._frameChain = new FrameChain(logger)

    /** @type {ImageRotation} */
    this._rotation = null
    /** @type {RectangleSize} */
    this._defaultContentViewportSize = null

    // this._logger.verbose("Driver session is " + this.getSessionId());
  }

  /**
   * @return {Eyes}
   */
  getEyes() {
    return this._eyes
  }

  /**
   * @return {WebDriver}
   */
  getRemoteWebDriver() {
    return this._driver.driver || this._driver
  }

  /**
   * @inheritDoc
   */
  execute(command) {
    return this._driver.execute(command)
  }

  /**
   * @inheritDoc
   */
  setFileDetector(detector) {
    return this._driver.setFileDetector(detector)
  }

  /**
   * @inheritDoc
   */
  getExecutor() {
    return this._driver.getExecutor()
  }

  /**
   * @inheritDoc
   */
  getSession() {
    return this._driver.getSession()
  }

  async getBrowserName() {
    const capabilities = await this.getCapabilities()
    return capabilities.getBrowserName()
  }

  /**
   * @inheritDoc
   */
  async getCapabilities() {
    if (this._capabilities === undefined) {
      this._capabilities = await this._driver.getCapabilities()
    }

    return this._capabilities
  }

  /**
   * Returns {@code true} if current WebDriver is mobile web driver (Android or IOS)
   *
   * @package
   * @return {boolean}
   */
  async isMobile() {
    if (this._isMobileDevice === undefined) {
      this._isMobileDevice = await EyesSeleniumUtils.isMobileDevice(this)
    }

    return this._isMobileDevice
  }

  /**
   * Returns {@code true} if current WebDriver is not mobile web driver (not Android and not IOS)
   *
   * @package
   * @return {boolean}
   */
  async isNotMobile() {
    return !(await this.isMobile())
  }

  /**
   * @inheritDoc
   */
  quit() {
    return this._driver.quit()
  }

  /**
   * @inheritDoc
   */
  actions(options) {
    return this._driver.actions(options)
  }

  /**
   * @inheritDoc
   */
  touchActions() {
    return this._driver.touchActions()
  }

  /**
   * @inheritDoc
   */

  async executeScript(script, ...varArgs) {
    EyesSeleniumUtils.handleSpecialCommands(script, ...varArgs)
    return this._driver.executeScript(script, ...varArgs)
  }

  /**
   * @inheritDoc
   */
  executeAsyncScript(script, ...varArgs) {
    EyesSeleniumUtils.handleSpecialCommands(script, ...varArgs)
    return this._driver.executeAsyncScript(script, ...varArgs)
  }

  /**
   * @inheritDoc
   */
  call(fn, optScope, ...varArgs) {
    return this._driver.call(fn, optScope, ...varArgs)
  }

  /**
   * @inheritDoc
   */
  wait(condition, optTimeout, optMessage) {
    return this._driver.wait(condition, optTimeout, optMessage)
  }

  /**
   * @inheritDoc
   */
  sleep(ms) {
    return this._driver.sleep(ms)
  }

  /**
   * @inheritDoc
   */
  getWindowHandle() {
    return this._driver.getWindowHandle()
  }

  /**
   * @inheritDoc
   */
  getAllWindowHandles() {
    return this._driver.getAllWindowHandles()
  }

  /**
   * @inheritDoc
   */
  getPageSource() {
    return this._driver.getPageSource()
  }

  /**
   * @inheritDoc
   */
  close() {
    return this._driver.close()
  }

  /**
   * @inheritDoc
   */
  get(url) {
    this._frameChain.clear()
    return this._driver.get(url)
  }

  /**
   * @inheritDoc
   */
  getCurrentUrl() {
    return this._driver.getCurrentUrl()
  }

  /**
   * @inheritDoc
   */
  getTitle() {
    return this._driver.getTitle()
  }

  /**
   * @inheritDoc
   * @param {!(By|Function)} locator The locator strategy to use when searching for the element.
   * @return {EyesWebElementPromise} - A promise that will resolve to a EyesWebElement.
   */
  findElement(locator) {
    return new EyesWebElementPromise(this._logger, this, this._driver.findElement(locator), locator)
  }

  /**
   * @inheritDoc
   * @param {!(By|Function)} locator The locator strategy to use when searching for the element.
   * @return {!Promise<!Array<!EyesWebElement>>} - A promise that will be resolved to an array of the located
   *   {@link EyesWebElement}s.
   */
  async findElements(locator) {
    const elements = await this._driver.findElements(locator)
    return elements.map(element => {
      element = new EyesWebElement(this._logger, this, element)
      // For Remote web elements, we can keep the IDs
      this._elementsIds.set(element.getId(), element)
      return element
    })
  }

  /**
   * @inheritDoc
   */
  async takeScreenshot() {
    const screenshot64 = await this._driver.takeScreenshot() // Get the image as base64.
    const screenshot = new MutableImage(screenshot64)
    await EyesWebDriver.normalizeRotation(this._logger, this._driver, screenshot, this._rotation)
    return screenshot.getImageBase64()
  }

  /**
   * @inheritDoc
   */
  manage() {
    return this._driver.manage()
  }

  /**
   * @inheritDoc
   */
  navigate() {
    return this._driver.navigate()
  }

  /**
   * @inheritDoc
   * @return {EyesTargetLocator} - The target locator interface for this instance.
   */
  switchTo() {
    return new EyesTargetLocator(this._logger, this, this._driver.switchTo())
  }

  /**
   * Found elements are sometimes accessed by their IDs (e.g. tapping an element in Appium).
   *
   * @return {Map<string, WebElement>} - Maps of IDs for found elements.
   */
  getElementIds() {
    return this._elementsIds
  }

  /**
   * @return {ImageRotation} - The image rotation data.
   */
  getRotation() {
    return this._rotation
  }

  /**
   * @param {ImageRotation} rotation - The image rotation data.
   */
  setRotation(rotation) {
    this._rotation = rotation
  }

  /**
   * @param {string} className
   * @return {EyesWebElementPromise} - A promise that will resolve to a EyesWebElement.
   */
  findElementByClassName(className) {
    return this.findElement(By.className(className))
  }

  /**
   * @param {string} className
   * @return {!Promise<!Array<!EyesWebElement>>} - A promise that will resolve to an array of EyesWebElements.
   */
  findElementsByClassName(className) {
    return this.findElements(By.className(className))
  }

  /**
   * @param {string} cssSelector
   * @return {EyesWebElementPromise} - A promise that will resolve to a EyesWebElement.
   */
  findElementByCssSelector(cssSelector) {
    return this.findElement(By.css(cssSelector))
  }

  /**
   * @param {string} cssSelector
   * @return {!Promise<!Array<!EyesWebElement>>} - A promise that will resolve to an array of EyesWebElements.
   */
  findElementsByCssSelector(cssSelector) {
    return this.findElements(By.css(cssSelector))
  }

  /**
   * @param {string} id
   * @return {EyesWebElementPromise} - A promise that will resolve to a EyesWebElement.
   */
  findElementById(id) {
    return this.findElement(By.id(id))
  }

  /**
   * @param {string} id
   * @return {!Promise<!Array<!EyesWebElement>>} - A promise that will resolve to an array of EyesWebElements.
   */
  findElementsById(id) {
    return this.findElements(By.id(id))
  }

  /**
   * @param {string} linkText
   * @return {EyesWebElementPromise} - A promise that will resolve to a EyesWebElement.
   */
  findElementByLinkText(linkText) {
    return this.findElement(By.linkText(linkText))
  }

  /**
   * @param {string} linkText
   * @return {!Promise<!Array<!EyesWebElement>>} - A promise that will resolve to an array of EyesWebElements.
   */
  findElementsByLinkText(linkText) {
    return this.findElements(By.linkText(linkText))
  }

  /**
   * @param {string} partialLinkText
   * @return {EyesWebElementPromise} - A promise that will resolve to a EyesWebElement.
   */
  findElementByPartialLinkText(partialLinkText) {
    return this.findElement(By.partialLinkText(partialLinkText))
  }

  /**
   * @param {string} partialLinkText
   * @return {!Promise<!Array<!EyesWebElement>>} - A promise that will resolve to an array of EyesWebElements.
   */
  findElementsByPartialLinkText(partialLinkText) {
    return this.findElements(By.partialLinkText(partialLinkText))
  }

  /**
   * @param {string} name
   * @return {EyesWebElementPromise} - A promise that will resolve to a EyesWebElement.
   */
  findElementByName(name) {
    return this.findElement(By.name(name))
  }

  /**
   * @param {string} name
   * @return {!Promise<!Array<!EyesWebElement>>} - A promise that will resolve to an array of EyesWebElements.
   */
  findElementsByName(name) {
    return this.findElements(By.name(name))
  }

  /**
   * @param {string} tagName
   * @return {EyesWebElementPromise} - A promise that will resolve to a EyesWebElement.
   */
  findElementByTagName(tagName) {
    return this.findElement(By.css(tagName))
  }

  /**
   * @param {string} tagName
   * @return {!Promise<!Array<!EyesWebElement>>} - A promise that will resolve to an array of EyesWebElements.
   */
  findElementsByTagName(tagName) {
    return this.findElements(By.css(tagName))
  }

  /**
   * @param {string} xpath
   * @return {EyesWebElementPromise} - A promise that will resolve to a EyesWebElement.
   */
  findElementByXPath(xpath) {
    return this.findElement(By.xpath(xpath))
  }

  /**
   * @param {string} xpath
   * @return {!Promise<!Array<!EyesWebElement>>} - A promise that will resolve to an array of EyesWebElements.
   */
  findElementsByXPath(xpath) {
    return this.findElements(By.xpath(xpath))
  }

  /**
   * @param {boolean} [forceQuery=true] - If true, we will perform the query even if we have a cached viewport size.
   * @return {Promise<RectangleSize>} - The viewport size of the default content (outer most frame).
   */
  async getDefaultContentViewportSize(forceQuery = true) {
    this._logger.verbose('getDefaultContentViewportSize()')
    if (this._defaultContentViewportSize && !forceQuery) {
      this._logger.verbose('Using cached viewport size: ', this._defaultContentViewportSize)
      return this._defaultContentViewportSize
    }

    const switchTo = this.switchTo()
    const currentFrames = this._frameChain.clone()

    // Optimization
    if (currentFrames.size() > 0) {
      await switchTo.defaultContent()
    }

    this._logger.verbose('Extracting viewport size...')
    this._defaultContentViewportSize = await EyesSeleniumUtils.getViewportSizeOrDisplaySize(
      this._logger,
      this._driver,
    )
    this._logger.verbose('Done! Viewport size: ', this._defaultContentViewportSize)

    if (currentFrames.size() > 0) {
      await switchTo.frames(currentFrames)
    }

    return this._defaultContentViewportSize
  }

  /**
   * @return {FrameChain} - The current frame chain.
   */
  getFrameChain() {
    return this._frameChain
  }

  /**
   * @return {Promise<string>}
   */
  async getUserAgent() {
    try {
      if (await this.isNotMobile()) {
        const userAgent = await this._driver.executeScript('return navigator.userAgent;')
        this._logger.verbose(`user agent: ${userAgent}`)
        return userAgent
      }

      this._logger.verbose('no user agent for native apps')
    } catch (err) {
      this._logger.verbose(`Failed to obtain user-agent string ${err}`)
    }

    return null
  }

  /**
   * @return {Promise<string>} - A copy of the current frame chain.
   */
  async getSessionId() {
    const session = await this._driver.getSession()
    return session.getId()
  }

  /**
   * @override
   */
  toJSON() {
    return GeneralUtils.toPlain(this, ['_logger', '_eyes'])
  }

  /**
   * @override
   */
  toString() {
    return GeneralUtils.toString(this, ['_logger', '_eyes'])
  }

  /**
   * Rotates the image as necessary. The rotation is either manually forced by passing a non-null ImageRotation, or
   * automatically inferred.
   *
   * @param {Logger} logger - The underlying driver which produced the screenshot.
   * @param {IWebDriver} driver - The underlying driver which produced the screenshot.
   * @param {MutableImage} image - The image to normalize.
   * @param {ImageRotation} rotation - The degrees by which to rotate the image: positive values = clockwise rotation,
   *   negative values = counter-clockwise, 0 = force no rotation, null = rotate automatically as needed.
   * @return {Promise<MutableImage>} - A normalized image.
   */
  static async normalizeRotation(logger, driver, image, rotation) {
    ArgumentGuard.notNull(logger, 'logger')
    ArgumentGuard.notNull(driver, 'driver')
    ArgumentGuard.notNull(image, 'image')

    let degrees
    if (rotation) {
      degrees = rotation.getRotation()
    } else {
      logger.verbose('Trying to automatically normalize rotation...')
      degrees = await EyesSeleniumUtils.tryAutomaticRotation(logger, driver, image)
    }

    return image.rotate(degrees)
  }
}

exports.EyesWebDriver = EyesWebDriver
