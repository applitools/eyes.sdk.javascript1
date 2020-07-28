const {TypeUtils} = require('@applitools/eyes-sdk-core')
const WDIOFrame = require('./WDIOFrame')
const WDIOWrappedElement = require('./WDIOWrappedElement')
const {remote} = require('webdriverio')
const {URL} = require('url')

/**
 * @typedef {import('webdriverio').Client<void>} Driver
 * @typedef {import('./SpecWrappedElement').Element} Element
 * @typedef {import('./SpecWrappedElement').Selector} Selector
 *
 * @typedef {import('@applitools/eyes-sdk-core').SpecDriver<Driver, Element, Selector>} WDIOSpecDriver
 */

function isEqualFrames(leftFrame, rightFrame) {
  return WDIOFrame.equals(leftFrame, rightFrame)
}
function createFrameReference(reference) {
  return WDIOFrame.fromReference(reference)
}
function createElement(logger, driver, element, selector) {
  return new WDIOWrappedElement(logger, driver, element, selector)
}
function toSupportedSelector(selector) {
  return WDIOWrappedElement.toSupportedSelector(selector)
}
function toEyesSelector(selector) {
  return WDIOWrappedElement.toEyesSelector(selector)
}
async function executeScript(driver, script, ...args) {
  const resp = await driver.execute(script, ...args)
  return resp.value
}
async function sleep(driver, ms) {
  return driver.pause(ms)
}
async function switchToFrame(driver, reference) {
  return driver.frame(reference)
}
async function switchToParentFrame(driver) {
  return driver.frameParent()
}
async function findElement(driver, selector) {
  const resp = await driver.element(selector.toString())
  return resp.value
}
async function findElements(driver, selector) {
  const resp = await driver.elements(selector.toString())
  return resp.value
}
async function getWindowLocation(driver) {
  const {value} = await driver.windowHandlePosition()
  return value
}
async function setWindowLocation(driver, location) {
  await driver.windowHandlePosition(location)
}
async function getWindowSize(driver) {
  const {value} = await driver.windowHandleSize()
  return value
}
async function setWindowSize(driver, size) {
  await driver.windowHandleSize(size)
}
async function getOrientation(driver) {
  return driver.getOrientation()
}
async function isMobile(driver) {
  return driver.isMobile
}
async function isAndroid(driver) {
  return driver.isAndroid
}
async function isIOS(driver) {
  return driver.isIOS
}
async function isNative(driver) {
  return driver.isMobile && !driver.desiredCapabilities.browserName
}
async function getPlatformVersion(driver) {
  return driver.desiredCapabilities.platformVersion
}
async function getBrowserName(driver) {
  return driver.desiredCapabilities.browserName
}
async function getBrowserVersion(driver) {
  return driver.desiredCapabilities.browserVersion
}
async function getSessionId(driver) {
  return driver.requestHandler.sessionID || driver.sessionId
}
async function takeScreenshot(driver) {
  return driver.saveScreenshot()
}
async function getTitle(driver) {
  return driver.getTitle()
}
async function getUrl(driver) {
  return driver.getUrl()
}
async function visit(driver, url) {
  return driver.url(url)
}
async function getNativeElementLocation(driver, element) {
  const resp = await driver.elementIdLocation(element.ELEMENT)
  return resp.value
}

async function getNativeElementSize(driver, element) {
  const resp = await driver.elementIdSize(element.ELEMENT)
  return resp.value
}

/* -------- FOR TESTING PURPOSES -------- */

async function build({capabilities, serverUrl = process.env.CVG_TESTS_REMOTE}) {
  const {hostname, port, pathname, protocol} = serverUrl ? new URL(serverUrl) : {}

  if ('sauce:options' in capabilities) {
    capabilities = {...capabilities, ...capabilities['sauce:options']}
  }

  const browser = remote({
    logLevel: 'silent',
    desiredCapabilities: capabilities,
    path: pathname,
    port,
    host: hostname,
    protocol: protocol.replace(/:$/, ''),
  })

  await browser.init()

  // WORKAROUND we couldn't return Promise-like object from the async function function
  return new Proxy(browser, {
    get(target, key, receiver) {
      if (key === 'then') return undefined
      return Reflect.get(target, key, receiver)
    },
  })
}
async function cleanup(driver) {
  return driver.end()
}
async function click(driver, el) {
  if (TypeUtils.isString(el)) {
    el = await findElement(driver, el)
  }
  return driver.elementIdClick(el.ELEMENT)
}
async function type(driver, element, keys) {
  return driver.elementIdValue(element.ELEMENT, keys)
}
async function waitUntilDisplayed(driver, selector, timeout) {
  return driver.waitForVisible(selector, timeout)
}
async function getElementRect(driver, el) {
  const resp = await driver.elementIdRect(el.ELEMENT)
  return resp.value
}

/** @type {WDIOSpecDriver} */
module.exports = {
  isEqualFrames,
  createFrameReference,
  createElement,
  toSupportedSelector,
  toEyesSelector,
  executeScript,
  sleep,
  switchToFrame,
  switchToParentFrame,
  findElement,
  findElements,
  getWindowLocation,
  setWindowLocation,
  getWindowSize,
  setWindowSize,
  getOrientation,
  isMobile,
  isAndroid,
  isIOS,
  isNative,
  getPlatformVersion,
  getBrowserName,
  getBrowserVersion,
  getSessionId,
  takeScreenshot,
  getTitle,
  getUrl,
  visit,
  getNativeElementLocation,
  getNativeElementSize,
  build,
  cleanup,
  click,
  type,
  waitUntilDisplayed,
  getElementRect,
}
