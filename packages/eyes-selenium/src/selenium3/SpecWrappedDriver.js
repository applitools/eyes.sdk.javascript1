const SeleniumFrame = require('../SeleniumFrame')
const SeleniumWrappedElement = require('../SeleniumWrappedElement')
const cmd = require('selenium-webdriver/lib/command')

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
      return await driver.findElement(selector)
    } catch (err) {
      if (err.name === 'NoSuchElementError') return null
      else throw err
    }
  },
  async findElements(driver, selector) {
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
}
