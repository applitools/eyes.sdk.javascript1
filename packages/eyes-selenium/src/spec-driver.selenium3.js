const {TypeUtils} = require('@applitools/eyes-sdk-core')
const {withLegacyDriverAPI} = require('./legacy-api')

// #region HELPERS

const byHash = [
  'className',
  'css',
  'id',
  'js',
  'linkText',
  'name',
  'partialLinkText',
  'tagName',
  'xpath',
]

function extractElementId(element) {
  return element.getId()
}

function transformSelector(selector) {
  if (TypeUtils.has(selector, ['type', 'selector'])) {
    if (selector.type === 'css') return {css: selector.selector}
    else if (selector.type === 'xpath') return {xpath: selector.selector}
  }
  return selector
}

// #endregion

// #region UTILITY

function isDriver(driver) {
  return TypeUtils.instanceOf(driver, 'WebDriver')
}
function isElement(element) {
  return TypeUtils.instanceOf(element, 'WebElement')
}
function isSelector(selector) {
  if (!selector) return false
  return (
    TypeUtils.instanceOf(selector, 'By') ||
    TypeUtils.has(selector, ['type', 'selector']) ||
    TypeUtils.has(selector, ['using', 'value']) ||
    Object.keys(selector).some(key => byHash.includes(key)) ||
    TypeUtils.isString(selector)
  )
}
function transformDriver(driver) {
  const cmd = require('selenium-webdriver/lib/command')

  cmd.Name.SWITCH_TO_PARENT_FRAME = 'switchToParentFrame'
  driver
    .getExecutor()
    .defineCommand(cmd.Name.SWITCH_TO_PARENT_FRAME, 'POST', '/session/:sessionId/frame/parent')
  return driver
}
function isStaleElementError(error) {
  if (!error) return false
  error = error.originalError || error
  return error instanceof Error && error.name === 'StaleElementReferenceError'
}
async function isEqualElements(_driver, element1, element2) {
  if (!element1 || !element2) return false
  const elementId1 = await extractElementId(element1)
  const elementId2 = await extractElementId(element2)
  return elementId1 === elementId2
}

// #endregion

// #region COMMANDS

async function executeScript(driver, script, ...args) {
  return driver.executeScript(script, ...args)
}
async function mainContext(driver) {
  await driver.switchTo().defaultContent()
  return driver
}
async function parentContext(driver) {
  const cmd = require('selenium-webdriver/lib/command')

  await driver.schedule(new cmd.Command(cmd.Name.SWITCH_TO_PARENT_FRAME))
  return driver
}
async function childContext(driver, element) {
  await driver.switchTo().frame(element)
  return driver
}
async function findElement(driver, selector) {
  try {
    if (TypeUtils.isString(selector)) {
      selector = {css: selector}
    }
    return await driver.findElement(transformSelector(selector))
  } catch (err) {
    if (err.name === 'NoSuchElementError') return null
    else throw err
  }
}
async function findElements(driver, selector) {
  if (TypeUtils.isString(selector)) {
    selector = {css: selector}
  }
  return driver.findElements(transformSelector(selector))
}
async function getElementRect(_driver, element) {
  const {x, y} = await element.getLocation()
  const {width, height} = await element.getSize()
  return {x, y, width, height}
}
async function getWindowRect(driver) {
  try {
    if (TypeUtils.isFunction(driver.manage().window().getRect)) {
      return driver
        .manage()
        .window()
        .getRect()
    } else {
      const rect = {x: 0, y: 0, width: 0, height: 0}
      if (TypeUtils.isFunction(driver.manage().window().getPosition)) {
        const {x, y} = await driver
          .manage()
          .window()
          .getPosition()
        rect.x = x
        rect.y = y
      }
      if (TypeUtils.isFunction(driver.manage().window().getSize)) {
        const {width, height} = await driver
          .manage()
          .window()
          .getSize()
        rect.width = width
        rect.height = height
      }
      return rect
    }
  } catch (err) {
    // workaround for Appium
    const cmd = require('selenium-webdriver/lib/command')

    return driver.execute(
      new cmd.Command(cmd.Name.GET_WINDOW_SIZE).setParameter('windowHandle', 'current'),
    )
  }
}
async function setWindowRect(driver, rect = {}) {
  const {x = null, y = null, width = null, height = null} = rect
  if (TypeUtils.isFunction(driver.manage().window().setRect)) {
    await driver
      .manage()
      .window()
      .setRect({x, y, width, height})
  } else {
    if (x !== null && y !== null) {
      await driver
        .manage()
        .window()
        .setPosition(x, y)
    }
    if (width !== null && height !== null) {
      await driver
        .manage()
        .window()
        .setSize(width, height)
    }
  }
}
async function getOrientation(driver) {
  const capabilities = await driver.getCapabilities()
  const orientation = capabilities.get('orientation') || capabilities.get('deviceOrientation')
  return orientation.toLowerCase()
}
async function getDriverInfo(driver) {
  const capabilities = await driver.getCapabilities()
  const session = await driver.getSession()
  const sessionId = session.getId()
  const deviceName = capabilities.has('desired')
    ? capabilities.get('desired').deviceName
    : capabilities.get('deviceName')
  const platformName = capabilities.get('platformName') || capabilities.get('platform')
  const platformVersion = capabilities.get('platformVersion')
  const browserName = capabilities.get('browserName')
  const browserVersion = capabilities.get('browserVersion')
  const isMobile = ['android', 'ios'].includes(platformName && platformName.toLowerCase())
  return {
    sessionId,
    isMobile,
    isNative: isMobile && !browserName,
    deviceName,
    platformName,
    platformVersion,
    browserName,
    browserVersion,
  }
}
async function getTitle(driver) {
  return driver.getTitle()
}
async function getUrl(driver) {
  return driver.getCurrentUrl()
}
async function visit(driver, url) {
  return driver.get(url)
}
async function takeScreenshot(driver) {
  return driver.takeScreenshot()
}
async function click(driver, element) {
  if (isSelector(element)) {
    element = await findElement(driver, element)
  }
  return element.click()
}
async function type(driver, element, keys) {
  if (isSelector(element)) {
    element = await findElement(driver, element)
  }
  return element.sendKeys(keys)
}
async function waitUntilDisplayed(driver, selector, timeout) {
  const {until} = require('selenium-webdriver')

  const element = await findElement(driver, selector)
  return driver.wait(until.elementIsVisible(element), timeout)
}
async function scrollIntoView(driver, element, align = false) {
  if (isSelector(element)) {
    element = await findElement(driver, element)
  }
  await driver.executeScript('arguments[0].scrollIntoView(arguments[1])', element, align)
}
async function hover(driver, element, {x, y} = {}) {
  const {ActionSequence} = require('selenium-webdriver')

  if (isSelector(element)) {
    element = await findElement(driver, element)
  }
  const action = new ActionSequence(driver)
  await action.mouseMove(element, {x, y}).perform()
}

// #endregion

// #region TESTING

const browserOptionsNames = {
  chrome: 'goog:chromeOptions',
  firefox: 'moz:firefoxOptions',
}
async function build(env) {
  const {Builder} = require('selenium-webdriver')
  const {testSetup} = require('@applitools/sdk-shared')
  const {
    browser = '',
    capabilities,
    url,
    attach,
    proxy,
    configurable = true,
    args = [],
    headless,
  } = testSetup.Env({legacy: true, ...env})
  const desiredCapabilities = {browserName: browser, ...capabilities}
  if (configurable) {
    const browserOptionsName = browserOptionsNames[browser || desiredCapabilities.browserName]
    if (browserOptionsName) {
      const browserOptions = desiredCapabilities[browserOptionsName] || {}
      browserOptions.args = [...(browserOptions.args || []), ...args]
      if (headless) browserOptions.args.push('headless')
      if (attach) {
        browserOptions.debuggerAddress = attach === true ? 'localhost:9222' : attach
      }
      desiredCapabilities[browserOptionsName] = browserOptions
    }
  }
  const builder = new Builder().withCapabilities(desiredCapabilities)
  if (url && !attach) builder.usingServer(url.href)
  if (proxy) {
    builder.setProxy({
      proxyType: 'manual',
      httpProxy: proxy.http || proxy.server,
      sslProxy: proxy.https || proxy.server,
      ftpProxy: proxy.ftp,
      noProxy: proxy.bypass,
    })
  }
  const driver = await builder.build()
  return [driver, () => driver.quit()]
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
exports.transformDriver = transformDriver
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
