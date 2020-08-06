const {By} = require('selenium-webdriver')

function withLegacyDriverAPI(driver) {
  const api = {
    get remoteWebDriver() {
      return driver
    },
    getRemoteWebDriver() {
      return driver
    },
    async findElementById(id) {
      return driver.findElement(By.id(id))
    },
    async findElementsById(id) {
      return driver.findElements(By.id(id))
    },
    async findElementByName(name) {
      return driver.findElement(By.name(name))
    },
    async findElementsByName(name) {
      return driver.findElements(By.name(name))
    },
    async findElementByCssSelector(cssSelector) {
      return driver.findElement(By.cssSelector(cssSelector))
    },
    async findElementsByCssSelector(cssSelector) {
      return driver.findElements(By.cssSelector(cssSelector))
    },
    async findElementByClassName(className) {
      throw driver.findElement(By.className(className))
    },
    async findElementsByClassName(className) {
      throw driver.findElements(By.className(className))
    },
    async findElementByLinkText(linkText) {
      throw driver.findElement(By.linkText(linkText))
    },
    async findElementsByLinkText(linkText) {
      throw driver.findElements(By.linkText(linkText))
    },
    async findElementByPartialLinkText(partialLinkText) {
      throw driver.findElement(By.partialLinkText(partialLinkText))
    },
    async findElementsByPartialLinkText(partialLinkText) {
      throw driver.findElements(By.partialLinkText(partialLinkText))
    },
    async findElementByTagName(tagName) {
      return driver.findElement(By.tagName(tagName))
    },
    async findElementsByTagName(tagName) {
      return driver.findElements(By.tagName(tagName))
    },
    async findElementByXPath(xpath) {
      return driver.findElement(By.xpath(xpath))
    },
    async findElementsByXPath(xpath) {
      return driver.findElements(By.xpath(xpath))
    },
    async getBrowserName() {
      const capabilities = await driver.getCapabilities()
      return capabilities.getBrowserName()
    },
    async getBrowserVersion() {
      const capabilities = await driver.getCapabilities()
      return capabilities.getBrowserVersion()
    },
  }
  return new Proxy(driver, {
    get(target, key, receiver) {
      if (Object.hasOwnProperty.call(api, key)) {
        return Reflect.get(api, key, receiver)
      }
      return Reflect.get(target, key)
    },
  })
}

exports.withLegacyDriverAPI = withLegacyDriverAPI
