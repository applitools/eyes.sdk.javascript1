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

function isDriver(page) {
  return page.constructor.name === 'Browser'
}
function isElement(element) {
  if (!element) return false
  return Boolean(element.elementId || element[ELEMENT_ID] || element[LEGACY_ELEMENT_ID])
}
function isSelector(selector) {
  return (
    TypeUtils.isString(selector) ||
    TypeUtils.isFunction(selector) ||
    TypeUtils.has(selector, ['type', 'selector']) ||
    selector instanceof LegacySelector
  )
}
function transformElement(element) {
  const elementId = extractElementId(element)
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
function isStaleElementError(error) {
  if (!error) return false
  const errOrResult = error.originalError || error
  return errOrResult instanceof Error && errOrResult.name === 'stale element reference'
}
async function isEqualElements(browser, element1, element2) {
  if (browser.isDevTools) {
    return browser
      .execute((element1, element2) => element1 === element2, element1, element2)
      .catch(() => false)
  }
  if (!element1 || !element2) return false
  const elementId1 = extractElementId(element1)
  const elementId2 = extractElementId(element2)
  return elementId1 === elementId2
}

// #endregion

// #region COMMANDS

async function executeScript(browser, script, ...args) {
  return browser.execute(script, ...args)
}
async function mainContext(browser) {
  await browser.switchToFrame(null)
  return browser
}
async function parentContext(browser) {
  await browser.switchToParentFrame()
  return browser
}
async function childContext(browser, element) {
  await browser.switchToFrame(element)
  return browser
}
async function findElement(browser, selector) {
  const element = await browser.$(
    selector instanceof LegacySelector ? selector.toString() : transformSelector(selector),
  )
  return !element.error ? element : null
}
async function findElements(browser, selector) {
  const elements = await browser.$$(
    selector instanceof LegacySelector ? selector.toString() : transformSelector(selector),
  )
  return Array.from(elements)
}
async function getElementRect(browser, element) {
  const extendedElement = await browser.$(element)
  if (TypeUtils.isFunction(extendedElement.getRect)) {
    return extendedElement.getRect()
  } else {
    const rect = {x: 0, y: 0, width: 0, height: 0}
    if (TypeUtils.isFunction(extendedElement.getLocation)) {
      const location = await extendedElement.getLocation()
      rect.x = location.x
      rect.y = location.y
    }
    if (TypeUtils.isFunction(extendedElement.getSize)) {
      const size = await extendedElement.getSize()
      rect.width = size.width
      rect.height = size.height
    }
    return rect
  }
}
async function getWindowRect(browser) {
  if (TypeUtils.isFunction(browser.getWindowRect)) {
    return browser.getWindowRect()
  } else {
    const rect = {x: 0, y: 0, width: 0, height: 0}
    if (TypeUtils.isFunction(browser.getWindowPosition)) {
      const location = await browser.getWindowPosition()
      rect.x = location.x
      rect.y = location.y
    }
    if (TypeUtils.isFunction(browser.getWindowSize)) {
      const size = await browser.getWindowSize()
      rect.width = size.width
      rect.height = size.height
    }
    return rect
  }
}
async function setWindowRect(browser, rect = {}) {
  const {x = null, y = null, width = null, height = null} = rect
  if (TypeUtils.isFunction(browser.setWindowRect)) {
    await browser.setWindowRect(x, y, width, height)
  } else {
    if (TypeUtils.isFunction(browser.setWindowPosition) && x !== null && y !== null) {
      await browser.setWindowPosition(x, y)
    }
    if (TypeUtils.isFunction(browser.setWindowSize) && width !== null && height !== null) {
      await browser.setWindowSize(width, height)
    }
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
  return browser.isMobile && !browser.capabilities.browserName
}
async function getPlatformName(browser) {
  return browser.capabilities.platformName || browser.capabilities.platform
}
async function getPlatformVersion(browser) {
  return browser.capabilities.platformVersion
}
async function getBrowserName(browser) {
  return browser.capabilities.browserName
}
async function getBrowserVersion(browser) {
  return browser.capabilities.browserVersion
}
async function getSessionId(browser) {
  return browser.sessionId
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
  return driver.takeScreenshot()
}
async function click(browser, element) {
  const extendedElement = await browser.$(element)
  return extendedElement.click()
}
async function type(browser, element, keys) {
  const extendedElement = await browser.$(element)
  return extendedElement.setValue(keys)
}
async function waitUntilDisplayed(browser, selector, timeout) {
  const element = await findElement(browser, selector)
  return element.waitForDisplayed({timeout})
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
  const {
    browser,
    capabilities,
    headless,
    url,
    protocol,
    args = [],
    logLevel = 'silent',
  } = testSetup.Env(env)

  const options = {
    capabilities: {browserName: browser, ...capabilities},
    logLevel,
  }
  const browserOptionsName = browserOptionsNames[browser]
  if (protocol === 'cdp') {
    options.automationProtocol = 'devtools'
    if (browserOptionsName) {
      options.capabilities[browserOptionsName] = {headless, args}
    }
  } else if (protocol === 'wd') {
    options.protocol = url.protocol ? url.protocol.replace(/:$/, '') : undefined
    options.hostname = url.hostname
    options.port = Number(url.port)
    options.path = url.pathname
    if (browserOptionsName) {
      options.capabilities[browserOptionsName] = {
        args: headless ? args.concat('headless') : args,
      }
    }
  }
  return webdriverio.remote(options)
}
async function cleanup(browser) {
  return browser && browser.deleteSession()
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
