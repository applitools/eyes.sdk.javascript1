'use strict'

const {Selector} = require('testcafe')
const {ArgumentGuard, /* MutableImage, */ GeneralUtils} = require('@applitools/eyes-sdk-core')

const fs = require('fs')
const path = require('path')
const rmrf = require('rimraf')

const {ClientFunction} = require('testcafe')
const {FrameChain} = require('../frames/FrameChain')
const {EyesTestcafeUtils} = require('../EyesTestcafeUtils')
const {EyesWebElement} = require('./EyesWebElement')
// const {EyesWebElementPromise} = require('./EyesWebElementPromise')
const {EyesTargetLocator} = require('./EyesTargetLocator')
const {TestCafeExecutor} = require('../TestCafeExecutor')

const SCREENSHOTS_PREFIX = '/.applitools'
const SCREENSHOTS_FILENAME = 'screenshot.png'

const getViewport = () => ({
  // eslint-disable-next-line no-undef
  width: Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
  // eslint-disable-next-line no-undef
  height: Math.max(document.documentElement.clientHeight, window.innerHeight || 0),
})

/**
 * An Eyes implementation of the interfaces implemented by {@link IWebDriver}.
 * Used so we'll be able to return the users an object with the same functionality as {@link WebDriver}.
 *
 * @extends {WebDriver}
 * @implements {EyesJsExecutor}
 */
class EyesWebDriver {
  /**
   * @param {Logger} logger
   * @param {Eyes} eyes
   * @param {WebDriver} driver
   */
  constructor(logger, eyes, driver) {
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

    this._executor = new TestCafeExecutor(driver)
    this._clientFunctions = {}

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

  getDriver() {
    return this._driver
  }

  /**
   * @inheritDoc
   */
  getSession() {
    return this._driver.getSession()
  }

  /**
   * @inheritDoc
   */
  getCapabilities() {
    return this._driver.getCapabilities()
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
    EyesTestcafeUtils.handleSpecialCommands(script, ...varArgs)
    return this._executor.executeScript(script, ...varArgs)
  }

  async executeClientFunction(opts) {
    return this._executor.executeClientFunction(opts)
  }

  /**
   * @inheritDoc
   */
  executeAsyncScript(script, ...varArgs) {
    EyesTestcafeUtils.handleSpecialCommands(script, ...varArgs)
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
    // eslint-disable-next-line no-undef
    return this._evalWithDriver(() => window.location.href)
  }

  /**
   * @inheritDoc
   */
  async getTitle() {
    return Selector('title').with({boundTestRun: this._driver}).innerText
  }

  /**
   * @inheritDoc
   * @param {!(By|Function)} locator The locator strategy to use when searching for the element.
   * @return {EyesWebElementPromise} - A promise that will resolve to a EyesWebElement.
   */
  findElement(locator) {
    return Selector(locator).with({boundTestRun: this._driver})
  }

  /**
   * @inheritDoc
   * @param {!(By|Function)} locator The locator strategy to use when searching for the element.
   * @return {!Promise<!Array<!EyesWebElement>>} - A promise that will be resolved to an array of the located
   *   {@link EyesWebElement}s.
   */
  async findElements(locator) {
    const elements = await Selector(locator).with({boundTestRun: this._driver})
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
    this._logger.log('Getting screenshot from TestCafe')
    const guid = GeneralUtils.guid()
    const filepath = path.resolve(`${SCREENSHOTS_PREFIX}-${guid}`, SCREENSHOTS_FILENAME)
    const screenshotPath = await this._driver.takeScreenshot(filepath)
    if (!screenshotPath) {
      throw new Error('Failed to get screenshot')
    }

    this._logger.log('screenshot created at', screenshotPath)
    try {
      return fs.readFileSync(screenshotPath)
    } finally {
      const screenshotFolder = path.dirname(screenshotPath)
      rmrf.sync(screenshotFolder)
      this._logger.log('screenshot folder deleted at', screenshotFolder)
    }
  }

  async getViewport() {
    return this._executor.executeClientFunction({script: getViewport, scriptName: 'getViewport'})
  }

  async resizeWindow(width, height) {
    return this._driver.resizeWindow(width, height)
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
    return new EyesTargetLocator(this._logger, this)
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
    return this.findElement(toClassName(className))
  }

  /**
   * @param {string} className
   * @return {!Promise<!Array<!EyesWebElement>>} - A promise that will resolve to an array of EyesWebElements.
   */
  findElementsByClassName(className) {
    return this.findElements(toClassName(className))
  }

  /**
   * @param {string} cssSelector
   * @return {EyesWebElementPromise} - A promise that will resolve to a EyesWebElement.
   */
  findElementByCssSelector(cssSelector) {
    return this.findElement(cssSelector)
  }

  /**
   * @param {string} cssSelector
   * @return {!Promise<!Array<!EyesWebElement>>} - A promise that will resolve to an array of EyesWebElements.
   */
  findElementsByCssSelector(cssSelector) {
    return this.findElements(cssSelector)
  }

  /**
   * @param {string} id
   * @return {EyesWebElementPromise} - A promise that will resolve to a EyesWebElement.
   */
  findElementById(id) {
    return this.findElement(`#${escapeCss(id)}`)
  }

  /**
   * @param {string} id
   * @return {!Promise<!Array<!EyesWebElement>>} - A promise that will resolve to an array of EyesWebElements.
   */
  findElementsById(id) {
    return this.findElements(`#${escapeCss(id)}`)
  }

  /**
   * @param {string} name
   * @return {!Promise<!Array<!EyesWebElement>>} - A promise that will resolve to an array of EyesWebElements.
   */
  findElementsByName(name) {
    return this.findElements(`*[name="${escapeCss(name)}"]`)
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
    this._defaultContentViewportSize = await EyesTestcafeUtils.getViewportSizeOrDisplaySize(
      this._logger,
      this,
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
      const userAgent = this._driver.browser.userAgent
      this._logger.verbose(`user agent: ${userAgent}`)
      return userAgent
    } catch (err) {
      this._logger.verbose(`Failed to obtain user-agent string ${err}`)
      return null
    }
  }

  _evalWithDriver(func, functionName) {
    if (!this._clientFunctions[functionName]) {
      this._clientFunctions[functionName] = ClientFunction(func)
    }
    return this._clientFunctions[functionName].with({boundTestRun: this._driver})
  }

  /**
   * @return {Promise<string>} - A copy of the current frame chain.
   */
  async getSessionId() {
    return String(Math.random()).slice(2)
  }

  /**
   * Returns {@code true} if current WebDriver is mobile web driver (Android or IOS)
   *
   * @package
   * @return {boolean}
   */
  async isMobile() {
    // TODO
    return false
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
      degrees = await EyesTestcafeUtils.tryAutomaticRotation(logger, driver, image)
    }

    return image.rotate(degrees)
  }
}

function toClassName(name) {
  const names = name
    .split(/\s+/g)
    .filter(s => s.length > 0)
    .map(s => escapeCss(s))
  return Selector(`.${names.join('.')}`)
}

/**
 * Escapes a CSS string.
 * @param {string} css the string to escape.
 * @return {string} the escaped string.
 * @throws {TypeError} if the input value is not a string.
 * @see https://drafts.csswg.org/cssom/#serialize-an-identifier
 */
function escapeCss(css) {
  if (typeof css !== 'string') {
    throw new TypeError('input must be a string')
  }
  let ret = ''
  const n = css.length
  for (let i = 0; i < n; i++) {
    const c = css.charCodeAt(i)
    if (c === 0x0) {
      throw new Error('Invalid character when escaping css')
    }

    if (
      (c >= 0x0001 && c <= 0x001f) ||
      c === 0x007f ||
      (i === 0 && c >= 0x0030 && c <= 0x0039) ||
      (i === 1 && c >= 0x0030 && c <= 0x0039 && css.charCodeAt(0) === 0x002d)
    ) {
      ret += `\\${c.toString(16)} `
      continue
    }

    if (i === 0 && c === 0x002d && n === 1) {
      ret += `\\${css.charAt(i)}`
      continue
    }

    if (
      c >= 0x0080 ||
      c === 0x002d || // -
      c === 0x005f || // _
      (c >= 0x0030 && c <= 0x0039) || // [0-9]
      (c >= 0x0041 && c <= 0x005a) || // [A-Z]
      (c >= 0x0061 && c <= 0x007a)
    ) {
      // [a-z]
      ret += css.charAt(i)
      continue
    }

    ret += `\\${css.charAt(i)}`
  }
  return ret
}

exports.EyesWebDriver = EyesWebDriver
