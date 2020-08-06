const {TypeUtils} = require('@applitools/eyes-sdk-core')
const {LegacySelector, withLegacyDriverAPI} = require('./LegacyAPI')

// #region HELPERS

const LEGACY_ELEMENT_ID = 'ELEMENT'
const ELEMENT_ID = 'element-6066-11e4-a52e-4f735466cecf'

function extractElementId(element) {
  return element.elementId || element[ELEMENT_ID] || element[LEGACY_ELEMENT_ID]
}

function transformSelector(selector) {
  if (TypeUtils.has(selector, ['type', 'selector'])) {
    if (selector.type === 'css') return `css selector:${selector.selector}`
    else if (selector.type === 'xpath') return `xpath:${selector.selector}`
  }
  return selector
}

// #endregion

// #region UTILITY

function isDriver(browser) {
  return Boolean(browser.getPrototype && browser.desiredCapabilities && browser.requestHandler)
}
function isElement(element) {
  if (!element) return false
  return element.value
    ? Boolean(element.value[ELEMENT_ID] || element.value[LEGACY_ELEMENT_ID])
    : Boolean(element[ELEMENT_ID] || element[LEGACY_ELEMENT_ID])
}
function isSelector(selector) {
  return (
    TypeUtils.isString(selector) ||
    TypeUtils.has(selector, ['type', 'selector']) ||
    selector instanceof LegacySelector
  )
}
function transformElement(element) {
  const elementId = extractElementId(element.value ? element.value : element)
  return {[ELEMENT_ID]: elementId, [LEGACY_ELEMENT_ID]: elementId}
}
function extractSelector(element) {
  return element.selector
}
function toEyesSelector(selector) {
  if (selector instanceof LegacySelector) {
    const {using, value} = selector
    if (using === 'css selector') return {type: 'css', selector: value}
    else if (using === 'xpath') return {type: 'xpath', selector: value}
  } else if (TypeUtils.isString(selector)) {
    const match = selector.match(/(css selector|xpath):(.+)/)
    if (match) {
      const [_, using, value] = match
      if (using === 'css selector') return {type: 'css', selector: value}
      else if (using === 'xpath') return {type: 'xpath', selector: value}
    }
  }
  return {selector}
}
function isStaleElementError(error, selector) {
  if (!error) return false
  const errOrResult = error.originalError || error
  return errOrResult instanceof Error
    ? errOrResult.seleniumStack && errOrResult.seleniumStack.type === 'StaleElementReference'
    : errOrResult.value && errOrResult.selector && errOrResult.selector === selector
}
function isEqualElements(_browser, element1, element2) {
  if (!element1 || !element2) return false
  const elementId1 = extractElementId(element1)
  const elementId2 = extractElementId(element2)
  return elementId1 === elementId2
}

// #endregion

// #region COMMANDS

async function executeScript(browser, script, ...args) {
  const {value} = await browser.execute(script, ...args)
  return value
}
async function mainContext(browser) {
  await browser.frame(null)
  return browser
}
async function parentContext(browser) {
  await browser.frameParent()
  return browser
}
async function childContext(browser, element) {
  await browser.frame(element)
  return browser
}
async function findElement(browser, selector) {
  const {value} = await browser.element(
    selector instanceof LegacySelector ? selector.toString() : transformSelector(selector),
  )
  return value
}
async function findElements(browser, selector) {
  const {value} = await browser.elements(
    selector instanceof LegacySelector ? selector.toString() : transformSelector(selector),
  )
  return value
}
async function getElementRect(browser, element) {
  const {value} = await browser.elementIdRect(extractElementId(element))
  return value
}
async function getWindowRect(browser) {
  const {value: location} = await browser.windowHandlePosition()
  const {value: size} = await browser.windowHandleSize()
  return {x: location.x, y: location.y, width: size.width, height: size.height}
}
async function setWindowRect(browser, rect = {}) {
  const {x = null, y = null, width = null, height = null} = rect
  if (x !== null && y !== null) {
    await browser.windowHandlePosition({x, y})
  }
  if (width !== null && height !== null) {
    await browser.windowHandleSize({width, height})
  }
}
async function getOrientation(browser) {
  const orientation = await browser.getOrientation()
  return orientation.toLowerCase()
}
async function isMobile(browser) {
  return browser.isMobile
}
async function isNative(browser) {
  return browser.isMobile && !browser.desiredCapabilities.browserName
}
async function getPlatformName(browser) {
  if (browser.isIOS) return 'iOS'
  if (browser.isAndroid) return 'Android'
  else return browser.desiredCapabilities.platformName || browser.desiredCapabilities.platform
}
async function getPlatformVersion(browser) {
  return browser.desiredCapabilities.platformVersion
}
async function getBrowserName(browser) {
  return browser.desiredCapabilities.browserName
}
async function getBrowserVersion(browser) {
  return browser.desiredCapabilities.browserVersion
}
async function getSessionId(browser) {
  return browser.requestHandler.sessionID || browser.sessionId
}
async function getTitle(browser) {
  return browser.getTitle()
}
async function getUrl(browser) {
  return browser.getUrl()
}
async function visit(browser, url) {
  return browser.url(url)
}
async function takeScreenshot(driver) {
  return driver.saveScreenshot()
}
async function click(browser, selector) {
  return browser.click(selector)
}
async function type(browser, element, keys) {
  if (TypeUtils.isString(element)) browser.setValue(element, keys)
  else browser.elementIdValue(extractElementId(element), keys)
}
async function waitUntilDisplayed(browser, selector, timeout) {
  return browser.waitForVisible(selector, timeout)
}

// #endregion

// #region TESTING

const browserOptionsNames = {
  chrome: 'goog:chromeOptions',
  firefox: 'moz:firefoxOptions',
}
async function build(env) {
  const webdriverio = require('webdriverio')
  const {testSetup} = require('@applitools/sdk-shared')
  const {browser, capabilities, headless, url, args = [], logLevel = 'silent'} = testSetup.Env(env)

  const options = {
    desiredCapabilities: {browserName: browser, ...capabilities},
    logLevel,
  }
  const browserOptionsName = browserOptionsNames[browser]
  if (browserOptionsName) {
    options.desiredCapabilities[browserOptionsName] = {
      args: headless ? args.concat('headless') : args,
    }
  }
  options.protocol = url.protocol ? url.protocol.replace(/:$/, '') : undefined
  options.host = url.hostname
  options.port = url.port
  options.path = url.pathname
  const driver = webdriverio.remote(options)
  await driver.init()

  // WORKAROUND we couldn't return Promise-like object from the async function function
  return new Proxy(driver, {
    get: (target, key) => (key !== 'then' ? Reflect.get(target, key) : undefined),
  })
}
async function cleanup(browser) {
  return browser && browser.end()
}

// #endregion

// #region LEGACY API

function wrapDriver(browser) {
  return withLegacyDriverAPI(browser)
}

// #endregion

exports.isDriver = isDriver
exports.isElement = isElement
exports.isSelector = isSelector
exports.transformElement = transformElement
exports.extractSelector = extractSelector
exports.toEyesSelector = toEyesSelector
exports.isEqualElements = isEqualElements
exports.isStaleElementError = isStaleElementError

exports.executeScript = executeScript
exports.mainContext = mainContext
exports.parentContext = parentContext
exports.childContext = childContext
exports.findElement = findElement
exports.findElements = findElements
exports.getElementRect = getElementRect
exports.getWindowRect = getWindowRect
exports.setWindowRect = setWindowRect
exports.getOrientation = getOrientation
exports.isMobile = isMobile
exports.isNative = isNative
exports.getPlatformName = getPlatformName
exports.getPlatformVersion = getPlatformVersion
exports.getBrowserName = getBrowserName
exports.getBrowserVersion = getBrowserVersion
exports.getSessionId = getSessionId
exports.getTitle = getTitle
exports.getUrl = getUrl
exports.visit = visit
exports.takeScreenshot = takeScreenshot
exports.click = click
exports.type = type
exports.waitUntilDisplayed = waitUntilDisplayed

exports.build = build
exports.cleanup = cleanup

exports.wrapDriver = wrapDriver
