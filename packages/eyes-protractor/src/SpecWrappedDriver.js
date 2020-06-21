const {TypeUtils} = require('@applitools/eyes-sdk-core')
const ProtractorFrame = require('./ProtractorFrame')
const ProtractorWrappedElement = require('./ProtractorWrappedElement')
const {Builder, Runner, Command, CommandName, until} = require('protractor')

module.exports = {
  isEqualFrames(leftFrame, rightFrame) {
    return ProtractorFrame.equals(leftFrame, rightFrame)
  },
  createFrameReference(reference) {
    return ProtractorFrame.fromReference(reference)
  },
  createElement(logger, driver, element, selector) {
    return new ProtractorWrappedElement(logger, driver, element, selector)
  },
  toSupportedSelector(selector) {
    return ProtractorWrappedElement.toSupportedSelector(selector)
  },
  toEyesSelector(selector) {
    return ProtractorWrappedElement.toEyesSelector(selector)
  },
  prepareDriver(driver) {
    CommandName.SWITCH_TO_PARENT_FRAME = 'switchToParentFrame'
    driver
      .getExecutor()
      .defineCommand(CommandName.SWITCH_TO_PARENT_FRAME, 'POST', '/session/:sessionId/frame/parent')
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
    return driver.schedule(new Command(CommandName.SWITCH_TO_PARENT_FRAME))
  },
  async findElement(driver, selector) {
    try {
      if (TypeUtils.isString(selector)) selector = {css: selector}
      const element = await driver.element(selector)
      return await element.getWebElement()
    } catch (err) {
      if (err.name === 'NoSuchElementError') return null
      else throw err
    }
  },
  async findElements(driver, selector) {
    return driver.element.all(selector)
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
    const {width, height} = await driver
      .manage()
      .window()
      .getSize()
    return {width, height}
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

  /* -------- FOR TESTING PURPOSES -------- */

  async build({capabilities, serverUrl = process.env.CVG_TESTS_REMOTE, logLevel = 'error'}) {
    if (capabilities['sauce:options']) {
      capabilities.username = process.env.SAUCE_USERNAME
      capabilities.accessKey = process.env.SAUCE_ACCESS_KEY
    }
    const seleniumWebDriver = await new Builder()
      .withCapabilities(capabilities)
      .usingServer(serverUrl)
      .build()
    const runner = new Runner({
      seleniumWebDriver,
      logLevel: logLevel.toUpperCase(),
      allScriptsTimeout: 60000,
      getPageTimeout: 10000,
    })
    const driver = await runner.createBrowser().ready
    driver.by = driver.constructor.By
    driver.waitForAngularEnabled(false)
    return driver
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
  async type(_driver, element, keys) {
    return element.sendKeys(keys)
  },
  async waitUntilDisplayed(driver, selector, timeout) {
    const element = await this.findElement(driver, selector)
    return driver.wait(until.elementIsVisible(element), timeout)
  },
  async getElementRect(_driver, element) {
    const location = await element.getLocation()
    const size = await element.getSize()
    return {...size, ...location}
  },
}
