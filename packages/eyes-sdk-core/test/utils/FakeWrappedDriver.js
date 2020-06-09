const {EyesWrappedDriver} = require('../../index')
const FakeWrappedElement = require('./FakeWrappedElement')
const FakeFrame = require('./FakeFrame')

module.exports = EyesWrappedDriver.specialize(
  {
    toEyesSelector(selector) {
      return FakeWrappedElement.toEyesSelector(selector)
    },
    toSupportedSelector(selector) {
      return FakeWrappedElement.toSupportedSelector(selector)
    },
    executeScript(driver, script, ...args) {
      return driver.executeScript(script, args)
    },
    findElement(driver, selector) {
      return driver.findElement(selector)
    },
    findElements(driver, selector) {
      return driver.findElements(selector)
    },
    switchToFrame(driver, reference) {
      return driver.switchToFrame(reference)
    },
    switchToParentFrame(driver) {
      return driver.switchToParentFrame()
    },
    isEqualFrames(leftFrame, rightFrame) {
      return FakeFrame.equals(leftFrame, rightFrame)
    },
    createFrameReference(reference) {
      return FakeFrame.fromReference(reference)
    },
    createElement(logger, driver, element, selector) {
      return new FakeWrappedElement(logger, driver, element, selector)
    },
    takeScreenshot(driver) {
      return driver.takeScreenshot()
    },
    isNative(_driver) {
      return false
    },
    isMobile(_driver) {
      return false
    },
    getSessionId() {
      return 'session-id'
    },
    async getWindowSize(driver) {
      const {width, height} = await driver.getWindowRect()
      return {width, height}
    },
    async setWindowSize(driver, size) {
      await driver.setWindowRect(size)
    },
    async getWindowLocation(driver) {
      const {x, y} = await driver.getWindowRect()
      return {x, y}
    },
    async setWindowLocation(driver, location) {
      await driver.setWindowRect(location)
    },
    async getUrl(driver) {
      return driver.getUrl()
    },
    async visit(driver, url) {
      await driver.visit(url)
    },
  },
  {
    /** @override */
    async switchToFrame(proxies, reference) {
      return proxies.switchToFrame(reference)
    },
    /** @override */
    async switchToParentFrame(proxies) {
      return proxies.switchToParentFrame()
    },
    /** @override */
    async url(proxies, url) {
      return proxies.visit(url)
    },
  },
)
