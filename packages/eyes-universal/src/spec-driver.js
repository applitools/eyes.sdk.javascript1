const {TypeUtils} = require('@applitools/eyes-sdk-core')

function makeSpecDriver(ws) {
  // #region UTILITY
  function isDriver(driver) {
    return true
  }
  function isElement(element) {
    return Boolean(element && element['applitools-ref-id'])
  }
  function isSelector(selector) {
    return TypeUtils.isString(selector) || TypeUtils.has(selector, ['type', 'selector'])
  }
  function extractSelector(element) {
    return element.selector
  }
  function isStaleElementError(error) {
    // error
  }
  // #endregion

  // #region COMMANDS
  async function isEqualElements(context, element1, element2) {
    return ws.request('Driver.isEqualElements', {context, element1, element2})
  }
  async function executeScript(context, script, ...args) {
    return ws.request('Driver.executeScript', {context, script: script.toString(), args})
  }
  async function mainContext(context) {
    return ws.request('Driver.mainContext', {context})
  }
  async function parentContext(context) {
    return ws.request('Driver.parentContext', {context})
  }
  async function childContext(context, element) {
    return ws.request('Driver.childContext', {context, element})
  }
  async function findElement(context, selector) {
    return ws.request('Driver.findElement', {context, selector})
  }
  async function findElements(context, selector) {
    return ws.request('Driver.findElements', {context, selector})
  }
  async function getWindowRect(driver) {
    return ws.request('Driver.getWindowRect', {driver})
  }
  async function setWindowRect(driver, rect) {
    return ws.request('Driver.setWindowRect', {driver, rect})
  }
  async function getViewportSize(driver) {
    return ws.request('Driver.getViewportSize', {driver})
  }
  async function setViewportSize(driver, size) {
    return ws.request('Driver.setViewportSize', {driver, size})
  }
  async function getOrientation(driver) {
    return ws.request('Driver.getOrientation', {driver})
  }
  async function getTitle(driver) {
    return ws.request('Driver.getTitle', {driver})
  }
  async function getUrl(driver) {
    return ws.request('Driver.getUrl', {driver})
  }
  async function getDriverInfo(driver) {
    return ws.request('Driver.getDriverInfo', {driver})
  }
  async function takeScreenshot(driver) {
    const buffer = await ws.request('Driver.takeScreenshot', {driver})
    return Buffer.from(buffer.data)
  }
  // #endregion

  return {
    isDriver,
    isElement,
    isSelector,
    extractSelector,
    isStaleElementError,
    isEqualElements,
    executeScript,
    mainContext,
    parentContext,
    childContext,
    findElement,
    findElements,
    getWindowRect,
    setWindowRect,
    getViewportSize,
    setViewportSize,
    getOrientation,
    getTitle,
    getUrl,
    getDriverInfo,
    takeScreenshot,
  }
}

module.exports = makeSpecDriver
