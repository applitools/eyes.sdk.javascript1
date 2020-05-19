const By = require('../By')

function LegacyAPIDriver(WDIODriver) {
  return class EyesWebDriver extends WDIODriver {
    async executeScript(script, ...varArgs) {
      return this._executor.executeScript(script, ...varArgs)
    }
    async executeAsyncScript(script, ...varArgs) {
      return this._executor.executeAsyncScript(script, ...varArgs)
    }
    async findElement(locator) {
      return this._finder.findElement(locator)
    }
    async findElements(locator) {
      return this._finder.findElements(locator)
    }
    async findElementById(id) {
      return this.findElement(By.id(id))
    }
    async findElementsById(id) {
      return this.findElements(By.id(id))
    }
    async findElementByName(name) {
      return this.findElement(By.name(name))
    }
    async findElementsByName(name) {
      return this.findElements(By.name(name))
    }
    async findElementByCssSelector(cssSelector) {
      return this.findElement(By.cssSelector(cssSelector))
    }
    async findElementsByCssSelector(cssSelector) {
      return this.findElements(By.cssSelector(cssSelector))
    }
    async findElementByClassName(_className) {
      throw new TypeError('findElementByClassName method is not implemented!')
    }
    async findElementsByClassName(_className) {
      throw new TypeError('findElementsByClassName method is not implemented!')
    }
    async findElementByLinkText(_linkText) {
      throw new TypeError('findElementByLinkText method is not implemented!')
    }
    async findElementsByLinkText(_linkText) {
      throw new TypeError('findElementsByLinkText method is not implemented!')
    }
    async findElementByPartialLinkText(_partialLinkText) {
      throw new TypeError('findElementByPartialLinkText method is not implemented!')
    }
    async findElementsByPartialLinkText(_partialLinkText) {
      throw new TypeError('findElementsByPartialLinkText method is not implemented!')
    }
    async findElementByTagName(tagName) {
      return this.findElement(By.tagName(tagName))
    }
    async findElementsByTagName(tagName) {
      return this.findElements(By.tagName(tagName))
    }
    async findElementByXPath(xpath) {
      return this.findElement(By.xPath(xpath))
    }
    async findElementsByXPath(xpath) {
      return this.findElements(By.xPath(xpath))
    }
    getFrameChain() {
      return this._context._frameChain
    }
    switchTo() {
      return {
        defaultContent: () => this.frame(),
        frame: arg => this.frame(arg),
        parentFrame: () => this.frameParent(),
      }
    }
    async sleep(ms) {
      return this._driver.pause(ms)
    }
    async takeScreenshot() {
      return this._driver.controller.takeScreenshot()
    }
    async getCapabilities() {
      return this._driver.desiredCapabilities
    }
    async getCurrentUrl() {
      return this._driver.getUrl()
    }
    async getBrowserName() {
      const capabilities = await this.getCapabilities()
      return capabilities.browserName
    }
  }
}

module.exports = LegacyAPIDriver
