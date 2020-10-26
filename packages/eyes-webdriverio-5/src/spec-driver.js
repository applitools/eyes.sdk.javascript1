const {TypeUtils} = require('@applitools/eyes-sdk-core')
const {LegacySelector, withLegacyDriverAPI} = require('./legacy-api')

// #region HELPERS

const LEGACY_ELEMENT_ID = 'ELEMENT'
const ELEMENT_ID = 'element-6066-11e4-a52e-4f735466cecf'

function extractElementId(element) {
  return element.elementId || element[ELEMENT_ID] || element[LEGACY_ELEMENT_ID]
}

function transformSelector(selector) {
  if (selector instanceof LegacySelector) {
    return selector.toString()
  } else if (TypeUtils.has(selector, ['type', 'selector'])) {
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
function isStaleElementError(error) {
  if (!error) return false
  const errOrResult = error.originalError || error
  return errOrResult instanceof Error && errOrResult.name === 'stale element reference'
}
async function isEqualElements(browser, element1, element2) {
  // NOTE: wdio wraps puppeteer and generate ids by itself just incrementing a counter
  // NOTE: appium for ios could return different ids for same element
  if (browser.isDevTools || browser.isIOS) {
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
  const element = await browser.$(transformSelector(selector))
  return !element.error ? element : null
}
async function findElements(browser, selector) {
  const elements = await browser.$$(transformSelector(selector))
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
async function getDriverInfo(browser) {
  return {
    sessionId: browser.sessionId,
    isMobile: browser.isMobile,
    isNative: browser.isMobile && !browser.capabilities.browserName,
    deviceName: browser.capabilities.desired
      ? browser.capabilities.desired.deviceName
      : browser.capabilities.deviceName,
    platformName: browser.capabilities.platformName || browser.capabilities.platform,
    platformVersion: browser.capabilities.platformVersion,
    browserName: browser.capabilities.browserName,
    browserVersion: browser.capabilities.browserVersion,
  }
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
  if (isSelector(element)) element = await findElement(browser, element)
  return element.click()
}
async function type(browser, element, keys) {
  if (isSelector(element)) element = await findElement(browser, element)
  return element.setValue(keys)
}
async function waitUntilDisplayed(browser, selector, timeout) {
  const element = await findElement(browser, selector)
  return element.waitForDisplayed({timeout})
}
async function scrollIntoView(browser, element, align = false) {
  if (isSelector(element)) element = await findElement(browser, element)
  return element.scrollIntoView(align)
}
async function hover(browser, element, {x, y} = {}) {
  if (isSelector(element)) element = await findElement(browser, element)
  // NOTE: WDIO6 changed the signature of moveTo method
  if (process.env.APPLITOOLS_WDIO_MAJOR_VERSION === '5') {
    await element.moveTo(x, y)
  } else {
    await element.moveTo({xOffset: x, yOffset: y})
  }
}

// #endregion

// #region TESTING

const browserOptionsNames = {
  chrome: 'goog:chromeOptions',
  firefox: 'moz:firefoxOptions',
}
async function build(env) {
  const webdriverio = require('webdriverio')
  const chromedriver = require('chromedriver')
  const {testSetup} = require('@applitools/sdk-shared')
  const {
    protocol = 'wd',
    browser = '',
    capabilities,
    url,
    attach,
    proxy,
    configurable = true,
    args = [],
    headless,
    logLevel = 'silent',
  } = testSetup.Env(env)

  const options = {
    capabilities: {browserName: browser, ...capabilities},
    logLevel,
  }
  if (browser === 'chrome' && protocol === 'cdp') {
    options.automationProtocol = 'devtools'
    options.capabilities[browserOptionsNames.chrome] = {headless, args}
  } else if (protocol === 'wd') {
    options.automationProtocol = 'webdriver'
    options.protocol = url.protocol ? url.protocol.replace(/:$/, '') : undefined
    options.hostname = url.hostname
    if (url.port) options.port = Number(url.port)
    else if (options.protocol === 'http') options.port = 80
    else if (options.protocol === 'https') options.port = 443
    options.path = url.pathname
    if (configurable) {
      if (browser === 'chrome' && attach) {
        await chromedriver.start(['--port=9515'], true)
        options.protocol = 'http'
        options.hostname = 'localhost'
        options.port = 9515
        options.path = '/'
      }
      const browserOptionsName = browserOptionsNames[browser || options.capabilities.browserName]
      if (browserOptionsName) {
        const browserOptions = options.capabilities[browserOptionsName] || {}
        browserOptions.args = [...(browserOptions.args || []), ...args]
        if (headless) browserOptions.args.push('headless')
        if (attach) {
          browserOptions.debuggerAddress = attach === true ? 'localhost:9222' : attach
          if (browser !== 'firefox') browserOptions.w3c = false
        }
        options.capabilities[browserOptionsName] = browserOptions
      }
    }
  }
  if (proxy) {
    options.capabilities.proxy = {
      proxyType: 'manual',
      httpProxy: proxy.http || proxy.server,
      sslProxy: proxy.https || proxy.server,
      ftpProxy: proxy.ftp,
      noProxy: proxy.bypass.join(','),
    }
  }
  const driver = await webdriverio.remote(options)
  return [driver, () => driver.deleteSession().then(() => chromedriver.stop())]
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
exports.getDriverInfo = getDriverInfo
exports.getTitle = getTitle
exports.getUrl = getUrl
exports.visit = visit
exports.takeScreenshot = takeScreenshot
exports.click = click
exports.type = type
exports.waitUntilDisplayed = waitUntilDisplayed
exports.scrollIntoView = scrollIntoView
exports.hover = hover

exports.build = build

exports.wrapDriver = wrapDriver
