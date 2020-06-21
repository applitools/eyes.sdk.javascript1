const {TypeUtils} = require('@applitools/eyes-sdk-core')
const {By, Builder, until} = require('selenium-webdriver')
const cmd = require('selenium-webdriver/lib/command')
const SeleniumFrame = require('../SeleniumFrame')
const SeleniumWrappedElement = require('../SeleniumWrappedElement')

module.exports = {
  isEqualFrames(leftFrame, rightFrame) {
    return SeleniumFrame.equals(leftFrame, rightFrame)
  },
  createFrameReference(reference) {
    return SeleniumFrame.fromReference(reference)
  },
  createElement(logger, driver, element, selector) {
    return new SeleniumWrappedElement(logger, driver, element, selector)
  },
  toSupportedSelector(selector) {
    return SeleniumWrappedElement.toSupportedSelector(selector)
  },
  toEyesSelector(selector) {
    return SeleniumWrappedElement.toEyesSelector(selector)
  },
  prepareDriver(driver) {
    cmd.Name.SWITCH_TO_PARENT_FRAME = 'switchToParentFrame'
    driver
      .getExecutor()
      .defineCommand(cmd.Name.SWITCH_TO_PARENT_FRAME, 'POST', '/session/:sessionId/frame/parent')
    return driver
  },
  executeScript(driver, script, ...args) {
    return driver.executeScript(script, ...args)
  },
  sleep(driver, ms) {
    return driver.sleep(ms)
  },
  switchToFrame(driver, reference) {
    return driver.switchTo().frame(reference)
  },
  switchToParentFrame(driver) {
    return driver.schedule(new cmd.Command(cmd.Name.SWITCH_TO_PARENT_FRAME))
  },
  async findElement(driver, selector) {
    try {
      if (TypeUtils.isString(selector)) {
        selector = By.css(selector)
      }
      return await driver.findElement(selector)
    } catch (err) {
      if (err.name === 'NoSuchElementError') return null
      else throw err
    }
  },
  async findElements(driver, selector) {
    if (TypeUtils.isString(selector)) {
      selector = By.css(selector)
    }
    return driver.findElements(selector)
  },
  async getWindowLocation(driver) {
    const {x, y} = await driver
      .manage()
      .window()
      .getPosition()
    return {x, y}
  },
  async setWindowLocation(driver, location) {
    await driver
      .manage()
      .window()
      .setPosition(location.x, location.y)
  },
  async getWindowSize(driver) {
    try {
      const {width, height} = await driver
        .manage()
        .window()
        .getSize()
      return {width, height}
    } catch (err) {
      // workaround for Appium
      return driver.execute(
        new cmd.Command(cmd.Name.GET_WINDOW_SIZE).setParameter('windowHandle', 'current'),
      )
    }
  },
  async setWindowSize(driver, size) {
    await driver
      .manage()
      .window()
      .setSize(size.width, size.height)
  },
  async getOrientation(driver) {
    const capabilities = await driver.getCapabilities()
    const orientation = capabilities.get('orientation') || capabilities.get('deviceOrientation')
    return orientation.toLowerCase()
  },
  async isMobile(driver) {
    const capabilities = await driver.getCapabilities()
    const platformName = capabilities.get('platformName')
    return platformName ? ['android', 'ios'].includes(platformName.toLowerCase()) : false
  },
  async isAndroid(driver) {
    const capabilities = await driver.getCapabilities()
    const platformName = capabilities.get('platformName')
    return platformName ? platformName.toLowerCase() === 'android' : false
  },
  async isIOS(driver) {
    const capabilities = await driver.getCapabilities()
    const platformName = capabilities.get('platformName')
    return platformName ? platformName.toLowerCase() === 'ios' : false
  },
  async isNative(driver) {
    const capabilities = await driver.getCapabilities()
    const platformName = capabilities.get('platformName')
    const browserName = capabilities.get('browserName')
    return platformName
      ? ['android', 'ios'].includes(platformName.toLowerCase()) && !browserName
      : false
  },
  async getPlatformVersion(driver) {
    const capabilities = await driver.getCapabilities()
    return capabilities.get('platformVersion')
  },
  async getBrowserName(driver) {
    const capabilities = await driver.getCapabilities()
    return capabilities.get('browserName')
  },
  async getBrowserVersion(driver) {
    const capabilities = await driver.getCapabilities()
    return capabilities.get('browserVersion')
  },
  async getSessionId(driver) {
    const session = await driver.getSession()
    return session.getId()
  },
  async takeScreenshot(driver) {
    return driver.takeScreenshot()
  },
  async getTitle(driver) {
    return driver.getTitle()
  },
  async getUrl(driver) {
    return driver.getCurrentUrl()
  },
  async visit(driver, url) {
    return driver.get(url)
  },

  /********* for testing purposes */
  async build({capabilities, serverUrl = process.env.CVG_TESTS_REMOTE}) {
    if (capabilities['sauce:options']) {
      capabilities.username = capabilities['sauce:options'].username
      capabilities.accesskey = capabilities['sauce:options'].accesskey
    }
    return new Builder()
      .withCapabilities(capabilities)
      .usingServer(serverUrl)
      .build()
  },

  async cleanup(driver) {
    return driver.quit()
  },

  async click(driver, el) {
    if (TypeUtils.isString(el)) {
      el = await this.findElement(driver, el)
    }
    return el.click()
  },

  async type(_driver, el, keys) {
    return el.sendKeys(keys)
  },

  async waitUntilDisplayed(driver, selector, timeout) {
    const el = await this.findElement(driver, selector)
    return driver.wait(until.elementIsVisible(el), timeout)
  },

  async getElementRect(_driver, element) {
    const location = await element.getLocation()
    const size = await element.getSize()
    return {...size, ...location}
  },
}
