const WDIOFrame = require('./WDIOFrame')
const WDIOWrappedElement = require('./WDIOWrappedElement')
const LegacySelector = require('./LegacySelector')
const {remote} = require('webdriverio')
const {URL} = require('url')

module.exports = {
  isEqualFrames(leftFrame, rightFrame) {
    return WDIOFrame.equals(leftFrame, rightFrame)
  },
  createElement(logger, driver, element, selector) {
    return new WDIOWrappedElement(logger, driver, element, selector)
  },
  createFrameReference(reference) {
    return WDIOFrame.fromReference(reference)
  },
  toSupportedSelector(selector) {
    return WDIOWrappedElement.toSupportedSelector(selector)
  },
  toEyesSelector(selector) {
    return WDIOWrappedElement.toEyesSelector(selector)
  },
  async executeScript(driver, script, ...args) {
    return driver.execute(script, ...args)
  },
  sleep(driver, ms) {
    return driver.pause(ms)
  },
  switchToFrame(driver, reference) {
    return driver.switchToFrame(reference)
  },
  switchToParentFrame(driver) {
    return driver.switchToParentFrame()
  },
  async findElement(driver, selector) {
    const element = await driver.$(
      selector instanceof LegacySelector ? selector.toString() : selector,
    )
    return !element.error ? element : null
  },
  async findElements(driver, selector) {
    const elements = await driver.$$(
      selector instanceof LegacySelector ? selector.toString() : selector,
    )
    return Array.from(elements)
  },
  async getWindowLocation(driver) {
    const rect = await driver.getWindowRect()
    return {x: rect.x, y: rect.y}
  },
  async setWindowLocation(driver, location) {
    return driver.setWindowRect(location.x, location.y, null, null)
  },
  async getWindowSize(driver) {
    const rect = driver.hasOwnProperty('getWindowRect')
      ? await driver.getWindowRect()
      : await driver.getWindowSize()
    return {width: rect.width, height: rect.height}
  },
  async setWindowSize(driver, {x, y, width, height} = {}) {
    return driver.hasOwnProperty('setWindowRect')
      ? driver.setWindowRect(x, y, width, height)
      : driver.setWindowSize(width, height)
  },
  async getOrientation(driver) {
    const orientation = await driver.getOrientation()
    return orientation.toLowerCase()
  },
  async isMobile(driver) {
    return driver.isMobile
  },
  async isAndroid(driver) {
    return driver.isAndroid
  },
  async isIOS(driver) {
    return driver.isIOS
  },
  async isNative(driver) {
    return driver.isMobile && !driver.capabilities.browserName
  },
  async getPlatformVersion(driver) {
    return driver.capabilities.platformVersion
  },
  async getBrowserName(driver) {
    return driver.capabilities.browserName
  },
  async getBrowserVersion(driver) {
    return driver.capabilities.browserVersion
  },
  async getSessionId(driver) {
    return driver.sessionId
  },
  async takeScreenshot(driver) {
    return driver.takeScreenshot()
  },
  async getTitle(driver) {
    return driver.getTitle()
  },
  async getUrl(driver) {
    return driver.getUrl()
  },
  async visit(driver, url) {
    return driver.url(url)
  },

  /********* for testing purposes */

  async build({capabilities, serverUrl = process.env.CVG_TESTS_REMOTE}) {
    const {hostname, port, pathname, protocol} = serverUrl ? new URL(serverUrl) : {}
    let fixedPort = port
    if (protocol === 'http:' && !port) {
      fixedPort = 80
    }
    if (protocol === 'https:' && !port) {
      fixedPort = 443
    }
    const options = {
      logLevel: 'silent',
      capabilities: capabilities,
      path: pathname,
      port: fixedPort ? Number(fixedPort) : undefined,
      hostname,
      protocol: protocol.replace(/:$/, ''),
    }
    return remote(options)
  },

  async cleanup(driver) {
    return driver.deleteSession()
  },

  async click(_driver, el) {
    return el.click()
  },

  async waitUntilDisplayed(driver, selector, timeout) {
    const el = await this.findElement(driver, selector)
    return el.waitForDisplayed({timeout})
  },

  async getElementRect(driver, el) {
    return driver.getElementRect(el.elementId)
  },
}
