const {TypeUtils} = require('@applitools/eyes-sdk-core')
const WDIOFrame = require('./WDIOFrame')
const WDIOWrappedElement = require('./WDIOWrappedElement')
const {remote} = require('webdriverio')
const {URL} = require('url')

module.exports = {
  isEqualFrames(leftFrame, rightFrame) {
    return WDIOFrame.equals(leftFrame, rightFrame)
  },
  createFrameReference(reference) {
    return WDIOFrame.fromReference(reference)
  },
  createElement(logger, driver, element, selector) {
    return new WDIOWrappedElement(logger, driver, element, selector)
  },
  toSupportedSelector(selector) {
    return WDIOWrappedElement.toSupportedSelector(selector)
  },
  toEyesSelector(selector) {
    return WDIOWrappedElement.toEyesSelector(selector)
  },
  async executeScript(driver, script, ...args) {
    const resp = await driver.execute(script, ...args)
    return resp.value
  },
  sleep(driver, ms) {
    return driver.pause(ms)
  },
  switchToFrame(driver, reference) {
    return driver.frame(reference)
  },
  switchToParentFrame(driver) {
    return driver.frameParent()
  },
  async findElement(driver, selector) {
    const resp = await driver.element(selector.toString())
    return resp.value
  },
  async findElements(driver, selector) {
    const resp = await driver.elements(selector.toString())
    return resp.value
  },
  async getWindowLocation(driver) {
    const {value} = await driver.windowHandlePosition()
    return value
  },
  async setWindowLocation(driver, location) {
    await driver.windowHandlePosition(location)
  },
  async getWindowSize(driver) {
    const {value} = await driver.windowHandleSize()
    return value
  },
  async setWindowSize(driver, size) {
    await driver.windowHandleSize(size)
  },
  async getOrientation(driver) {
    return driver.getOrientation()
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
    return driver.isMobile && !driver.desiredCapabilities.browserName
  },
  async getPlatformVersion(driver) {
    return driver.desiredCapabilities.platformVersion
  },
  async getBrowserName(driver) {
    return driver.desiredCapabilities.browserName
  },
  async getBrowserVersion(driver) {
    return driver.desiredCapabilities.browserVersion
  },
  async getSessionId(driver) {
    return driver.requestHandler.sessionID || driver.sessionId
  },
  async takeScreenshot(driver) {
    return driver.saveScreenshot()
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

    // WORKAROUND we couldn't return Promise-like object from the async function
    return new Proxy(browser, {
      get(target, key, receiver) {
        if (key === 'then') return undefined
        return Reflect.get(target, key, receiver)
      },
    })
  },

  async cleanup(driver) {
    return driver.end()
  },

  async click(driver, el) {
    if (TypeUtils.isString(el)) {
      el = await this.findElement(driver, el)
    }
    return driver.elementIdClick(el.ELEMENT)
  },

  async type(driver, element, keys) {
    return driver.elementIdValue(element.ELEMENT, keys)
  },

  async waitUntilDisplayed(driver, selector, timeout) {
    return driver.waitForVisible(selector, timeout)
  },

  async getElementRect(driver, el) {
    const resp = await driver.elementIdRect(el.ELEMENT)
    return resp.value
  },
}
