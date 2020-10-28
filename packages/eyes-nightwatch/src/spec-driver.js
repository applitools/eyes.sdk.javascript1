const {TypeUtils} = require('@applitools/eyes-sdk-core')

//// #region HELPERS
const LEGACY_ELEMENT_ID = 'ELEMENT'
const ELEMENT_ID = 'element-6066-11e4-a52e-4f735466cecf'
function extractElementId(element) {
  const _element = element.value || element
  return _element[ELEMENT_ID] || _element[LEGACY_ELEMENT_ID]
}
function transformSelector(selector) {
  if (TypeUtils.has(selector, ['type', 'selector'])) {
    if (selector.type === 'css') return [`css selector`, selector.selector]
    else if (selector.type === 'xpath') return ['xpath', selector.selector]
  }
  return ['css selector', selector]
}
function transformElement(element) {
  const elementId = extractElementId(element)
  return {[ELEMENT_ID]: elementId, [LEGACY_ELEMENT_ID]: elementId}
}
function getCapabilities(driver, opts) {
  return opts.using ? opts.using : driver.capabilities
}
// #endregion

//// #region UTILITY
function isDriver(driver) {
  return TypeUtils.instanceOf(driver, 'NightwatchAPI')
}
function isElement(element) {
  if (!element || element.error) return false
  return !!extractElementId(element)
}
function isSelector(selector) {
  if (!selector) return false
  return TypeUtils.isString(selector) || TypeUtils.has(selector, ['type', 'selector'])
}
function isStaleElementError({error} = {error: ''}) {
  if (!error) {
    return false
  }
  return error.includes('stale element reference') || error.includes('is stale')
}
function isEqualElements(_driver, element1, element2) {
  if (!element1 || !element2) return false
  const elementId1 = extractElementId(element1)
  const elementId2 = extractElementId(element2)
  return Boolean(elementId1 === elementId2)
}
//// #endregion

//// #region COMMANDS
async function executeScript(driver, script, ...args) {
  const result = await driver.execute(script, args)
  return result.value
}
async function mainContext(driver) {
  await driver.frame()
}
async function parentContext(driver) {
  await driver.frameParent()
}
async function childContext(driver, element) {
  if (isSelector(element)) {
    element = await driver.element('css selector', element)
  }
  await driver.frame(element)
}
async function findElement(driver, selector) {
  const result = await new Promise(resolve => {
    driver.element(...transformSelector(selector), result => {
      resolve(result)
    })
  })
  if (result.error) throw new Error(result.error)
  return result.value
}
async function findElements(driver, selector) {
  const elements = await driver.elements(...transformSelector(selector))
  return elements.value
}
async function getElementRect(driver, element) {
  const location = await driver.elementIdLocation(extractElementId(element))
  const size = await driver.elementIdSize(extractElementId(element))
  return {
    x: Math.round(location.value.x),
    y: Math.round(location.value.y),
    width: Math.round(size.value.width),
    height: Math.round(size.value.height),
  }
}
async function getWindowRect(driver) {
  const result = await driver.getWindowRect()
  return result && result.value ? result.value : result
}
async function setWindowRect(driver, rect = {}) {
  await driver.setWindowRect(rect)
}
function getOrientation(driver, opts = {}) {
  const capabilities = getCapabilities(driver, opts)
  const orientation = capabilities.orientation || capabilities.deviceOrientation
  return orientation ? orientation.toLowerCase() : 'portrait'
}
function getDriverInfo(driver, opts = {}) {
  const sessionId = driver.sessionId
  const capabilities = getCapabilities(driver, opts)
  const browserName = capabilities.browserName
  const deviceName = capabilities.device ? capabilities.device : capabilities.deviceName
  const platformName = capabilities.platformName || capabilities.platform
  const platformVersion = capabilities.osVersion
    ? capabilities.osVersion
    : capabilities.platformVersion
  const isMobile = ['android', 'ios'].includes(platformName && platformName.toLowerCase())
  const isNative = isMobile && !browserName
  return {
    deviceName,
    isMobile,
    isNative,
    platformName,
    platformVersion,
    sessionId,
  }
}
async function getTitle(driver) {
  const result = await driver.title()
  return result.value
}
async function getUrl(driver) {
  const result = await driver.url()
  return result.value
}
async function visit(driver, url) {
  return driver.url(url)
}
// TODO: ask forum about how to track error handling
async function takeScreenshot(driver) {
  return new Promise(resolve => {
    return driver.screenshot(false, result => resolve(Buffer.from(result.value, 'base64')))
  })
}
async function click(driver, element) {
  if (isSelector(element)) {
    const selector = element
    return await driver.click('css selector', selector)
  }
  await driver.elementIdClick(extractElementId(element))
}
async function type(driver, element, keys) {
  if (isSelector(element)) {
    const selector = element
    return await driver.setValue('css selector', selector, keys)
  }
  await driver.elementIdValue(extractElementId(element), keys)
}
async function waitUntilDisplayed(driver, selector, timeout) {
  await driver.waitForElementVisible('css selector', selector, timeout)
}
async function scrollIntoView(driver, element) {
  // NOTE: moveTo will scroll the element into view, but it also moves the mouse
  // cursor to the element. This might have unintended side effects.
  // Will need to wait and see, since there's no simple alternative.
  await driver.moveTo(extractElementId(element))
}
async function hover(driver, element, {x, y} = {}) {
  if (isSelector(element)) {
    const selector = element
    return await driver.moveToElement('css selector', selector, x, y)
  }
  await driver.moveTo(extractElementId(element), x, y)
}
//
//// #endregion
//
exports.isDriver = isDriver
exports.isElement = isElement
exports.isSelector = isSelector
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
exports.transformElement = transformElement
// for tests
exports.build = () => {
  return [{}, () => {}]
}
exports.extractElementId = extractElementId
