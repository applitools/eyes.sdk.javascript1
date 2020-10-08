function withLegacyDriverAPI(driver) {
  const api = {
    get remoteWebDriver() {
      return driver
    },
    getRemoteWebDriver() {
      return driver
    },
    async findElementById(id) {
      return driver.findElement({id})
    },
    async findElementsById(id) {
      return driver.findElements({id})
    },
    async findElementByName(name) {
      return driver.findElement({name})
    },
    async findElementsByName(name) {
      return driver.findElements({name})
    },
    async findElementByCssSelector(css) {
      return driver.findElement({css})
    },
    async findElementsByCssSelector(css) {
      return driver.findElements({css})
    },
    async findElementByClassName(className) {
      throw driver.findElement({className})
    },
    async findElementsByClassName(className) {
      throw driver.findElements({className})
    },
    async findElementByLinkText(linkText) {
      throw driver.findElement({linkText})
    },
    async findElementsByLinkText(linkText) {
      throw driver.findElements({linkText})
    },
    async findElementByPartialLinkText(partialLinkText) {
      throw driver.findElement({partialLinkText})
    },
    async findElementsByPartialLinkText(partialLinkText) {
      throw driver.findElements({partialLinkText})
    },
    async findElementByTagName(tagName) {
      return driver.findElement({tagName})
    },
    async findElementsByTagName(tagName) {
      return driver.findElements({tagName})
    },
    async findElementByXPath(xpath) {
      return driver.findElement({xpath})
    },
    async findElementsByXPath(xpath) {
      return driver.findElements({xpath})
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
