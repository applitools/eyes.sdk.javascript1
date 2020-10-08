const {TypeUtils} = require('../../index')

module.exports = {
  isDriver(driver) {
    return driver.constructor.name === 'MockDriver'
  },
  isElement(element) {
    return TypeUtils.has(element, 'id')
  },
  isSelector(selector) {
    return (
      TypeUtils.isString(selector) ||
      TypeUtils.has(selector, ['using', 'value']) ||
      TypeUtils.has(selector, ['type', 'selector'])
    )
  },
  isEqualElements(_driver, element1, element2) {
    return element1.id === element2.id
  },
  executeScript(driver, script, ...args) {
    return driver.executeScript(script, args)
  },
  findElement(driver, selector) {
    return driver.findElement(selector.selector || selector)
  },
  findElements(driver, selector) {
    return driver.findElements(selector)
  },
  mainContext(driver) {
    return driver.switchToFrame(null)
  },
  parentContext(driver) {
    return driver.switchToParentFrame()
  },
  childContext(driver, reference) {
    return driver.switchToFrame(reference)
  },
  takeScreenshot(driver) {
    return driver.takeScreenshot()
  },
  getDriverInfo(driver) {
    return driver.info
  },
  async getWindowRect(driver) {
    const rect = await driver.getWindowRect()
    return rect
  },
  async setWindowRect(driver, rect) {
    await driver.setWindowRect(rect)
  },
  async getUrl(driver) {
    if (this._isNative) return null
    return driver.getUrl()
  },
  async getTitle(driver) {
    if (this._isNative) return null
    return driver.getTitle()
  },
  async visit(driver, url) {
    await driver.visit(url)
  },
}
