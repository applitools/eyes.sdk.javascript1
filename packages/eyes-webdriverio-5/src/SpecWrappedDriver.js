const WDIOFrame = require('./WDIOFrame')
const WDIOWrappedElement = require('./WDIOWrappedElement')
const LegacySelector = require('./LegacySelector')
const {URL} = require('url')

/**
 * @typedef {Object} WDIOSyncDriver
 * @prop {boolean} isMobile
 * @prop {boolean} isAndroid
 * @prop {boolean} isIOS
 * @prop {string} sessionId
 * @prop {{platformName?: string, platformVersion?: string|number, browserName?: string}} capabilities
 * @prop {(script: string|((...args: any[]) => any), ...args: any[]) => any} execute
 * @prop {(ms: number) => void} pause
 * @prop {(reference: number|object|null) => void} switchToFrame
 * @prop {() => void} switchToParentFrame
 * @prop {(selector: string|object|Function) => Element} $
 * @prop {(selector: string|object|Function) => Element[]} $$
 * @prop {(url: string) => void} url
 * @prop {() => string} takeScreenshot
 * @prop {() => string} getOrientation
 * @prop {() => string} getTitle
 * @prop {() => {x: number, y: number, width: number, height: number}} [getWindowRect]
 * @prop {(x: number, y: number, width: number, height: number) => any} [setWindowRect]
 * @prop {() => {x: number, y: number}} [getWindowLocation]
 * @prop {(x: number, y: number) => any} [setWindowLocation]
 * @prop {() => {width: number, height: number}} [getWindowSize]
 * @prop {(width: number, height: number) => any} [setWindowSize]
 */

/**
 * @typedef {Object} WDIOAsyncDriver
 * @prop {boolean} isMobile
 * @prop {boolean} isAndroid
 * @prop {boolean} isIOS
 * @prop {string} sessionId
 * @prop {{platformName?: string, platformVersion?: string|number, browserName?: string}} capabilities
 * @prop {(script: string|((...args: any[]) => any), ...args: any[]) => Promise<any>} execute
 * @prop {(ms: number) => Promise<void>} pause
 * @prop {(reference: number|object|null) => Promise<void>} switchToFrame
 * @prop {() => Promise<void>} switchToParentFrame
 * @prop {(selector: string|object|Function) => Promise<Element>} $
 * @prop {(selector: string|object|Function) => Promise<Element[]>} $$
 * @prop {(url: string) => Promise<void>} url
 * @prop {() => Promise<string>} takeScreenshot
 * @prop {() => Promise<string>} getOrientation
 * @prop {() => Promise<string>} getTitle
 * @prop {() => Promise<{x: number, y: number, width: number, height: number}>} [getWindowRect]
 * @prop {(x: number, y: number, width: number, height: number) => Promise<any>} [setWindowRect]
 * @prop {() => Promise<{x: number, y: number}>} [getWindowLocation]
 * @prop {(x: number, y: number) => Promise<any>} [setWindowLocation]
 * @prop {() => Promise<{width: number, height: number}>} [getWindowSize]
 * @prop {(width: number, height: number) => Promise<any>} [setWindowSize]
 */

/**
 * @typedef {WDIOSyncDriver|WDIOAsyncDriver} Driver
 * @typedef {import('./SpecWrappedElement').Element} Element
 * @typedef {import('./SpecWrappedElement').Selector} Selector
 *
 * @typedef {import('@applitools/eyes-sdk-core').SpecDriver<Driver, Element, Selector>} WDIOSpecDriver
 */

function isEqualFrames(leftFrame, rightFrame) {
  return WDIOFrame.equals(leftFrame, rightFrame)
}
function createElement(logger, driver, element, selector) {
  return new WDIOWrappedElement(logger, driver, element, selector)
}
function createFrameReference(reference) {
  return WDIOFrame.fromReference(reference)
}
function toSupportedSelector(selector) {
  return WDIOWrappedElement.toSupportedSelector(selector)
}
function toEyesSelector(selector) {
  return WDIOWrappedElement.toEyesSelector(selector)
}
async function executeScript(driver, script, ...args) {
  return driver.execute(script, ...args)
}
async function sleep(driver, ms) {
  return driver.pause(ms)
}
async function switchToFrame(driver, reference) {
  return driver.switchToFrame(reference)
}
async function switchToParentFrame(driver) {
  return driver.switchToParentFrame()
}
async function findElement(driver, selector) {
  const element = await driver.$(
    selector instanceof LegacySelector ? selector.toString() : selector,
  )
  return !element.error ? element : null
}
async function findElements(driver, selector) {
  const elements = await driver.$$(
    selector instanceof LegacySelector ? selector.toString() : selector,
  )
  return Array.from(elements)
}
async function getWindowLocation(driver) {
  const rect = await driver.getWindowRect()
  return {x: rect.x, y: rect.y}
}
async function setWindowLocation(driver, location) {
  return driver.setWindowRect(location.x, location.y, null, null)
}
async function getWindowSize(driver) {
  const rect = driver.hasOwnProperty('getWindowRect')
    ? await driver.getWindowRect()
    : await driver.getWindowSize()
  return {width: rect.width, height: rect.height}
}
async function setWindowSize(driver, {x = null, y = null, width, height} = {}) {
  return driver.hasOwnProperty('setWindowRect')
    ? driver.setWindowRect(x, y, width, height)
    : driver.setWindowSize(width, height)
}
async function getOrientation(driver) {
  const orientation = await driver.getOrientation()
  return orientation.toLowerCase()
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
  return driver.isMobile && !driver.capabilities.browserName
}
async function getPlatformVersion(driver) {
  return driver.capabilities.platformVersion
}
async function getBrowserName(driver) {
  return driver.capabilities.browserName
}
async function getBrowserVersion(driver) {
  return driver.capabilities.browserVersion
}
async function getSessionId(driver) {
  return driver.sessionId
}
async function takeScreenshot(driver) {
  return driver.takeScreenshot()
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
  const extended = await driver.$(element)
  return extended.getLocation()
}

async function getNativeElementSize(driver, element) {
  const extended = await driver.$(element)
  return extended.getSize()
}

/* -------- FOR TESTING PURPOSES -------- */

/** @return {WDIOAsyncDriver} */
async function build({
  capabilities,
  serverUrl = process.env.CVG_TESTS_REMOTE,
  logLevel = 'silent',
}) {
  const {remote} = require('webdriverio')
  const {hostname, port, pathname, protocol} = serverUrl ? new URL(serverUrl) : {}
  let fixedPort = port
  if (protocol === 'http:' && !port) {
    fixedPort = 80
  }
  if (protocol === 'https:' && !port) {
    fixedPort = 443
  }
  const options = {
    logLevel,
    capabilities,
    path: pathname,
    port: fixedPort ? Number(fixedPort) : undefined,
    hostname,
    protocol: protocol ? protocol.replace(/:$/, '') : undefined,
  }
  return remote(options)
}
async function cleanup(driver) {
  return driver.deleteSession()
}
async function click(driver, element) {
  const extended = await driver.$(element)
  return extended.click()
}
async function type(driver, element, keys) {
  const extended = await driver.$(element)
  return extended.setValue(keys)
}
async function waitUntilDisplayed(driver, selector, timeout) {
  const el = await this.findElement(driver, selector)
  return el.waitForDisplayed({timeout})
}
async function getElementRect(driver, el) {
  return driver.getElementRect(el.elementId)
}

exports.isEqualFrames = isEqualFrames
exports.createElement = createElement
exports.createFrameReference = createFrameReference
exports.toSupportedSelector = toSupportedSelector
exports.toEyesSelector = toEyesSelector
exports.executeScript = executeScript
exports.sleep = sleep
exports.switchToFrame = switchToFrame
exports.switchToParentFrame = switchToParentFrame
exports.findElement = findElement
exports.findElements = findElements
exports.getWindowLocation = getWindowLocation
exports.setWindowLocation = setWindowLocation
exports.getWindowSize = getWindowSize
exports.setWindowSize = setWindowSize
exports.getOrientation = getOrientation
exports.isMobile = isMobile
exports.isAndroid = isAndroid
exports.isIOS = isIOS
exports.isNative = isNative
exports.getPlatformVersion = getPlatformVersion
exports.getBrowserName = getBrowserName
exports.getBrowserVersion = getBrowserVersion
exports.getSessionId = getSessionId
exports.takeScreenshot = takeScreenshot
exports.getTitle = getTitle
exports.getUrl = getUrl
exports.visit = visit
exports.build = build
exports.cleanup = cleanup
exports.click = click
exports.type = type
exports.waitUntilDisplayed = waitUntilDisplayed
exports.getElementRect = getElementRect
exports.getNativeElementLocation = getNativeElementLocation
exports.getNativeElementSize = getNativeElementSize
