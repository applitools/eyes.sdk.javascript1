const LegacySelector = require('./LegacySelector')

/**
 * @template T
 * @param {T} EyesWrappedDriver
 * @return {T}
 */
function LegacyAPIDriver(EyesWrappedDriver) {
  return class EyesWebDriver extends EyesWrappedDriver {
    async click(selector) {
      return this._driver.click(selector instanceof LegacySelector ? selector.toString() : selector)
    }
    async executeScript(script, ...varArgs) {
      return this._executor.executeScript(script, ...varArgs)
    }
    async executeAsyncScript(script, ...varArgs) {
      return this._driver.executeAsync(script, ...varArgs)
    }
    async findElement(locator) {
      return this._finder.findElement(locator)
    }
    async findElements(locator) {
      return this._finder.findElements(locator)
    }
    async findElementById(id) {
      return this.findElement(LegacySelector.id(id))
    }
    async findElementsById(id) {
      return this.findElements(LegacySelector.id(id))
    }
    async findElementByName(name) {
      return this.findElement(LegacySelector.name(name))
    }
    async findElementsByName(name) {
      return this.findElements(LegacySelector.name(name))
    }
    async findElementByCssSelector(cssSelector) {
      return this.findElement(LegacySelector.cssSelector(cssSelector))
    }
    async findElementsByCssSelector(cssSelector) {
      return this.findElements(LegacySelector.cssSelector(cssSelector))
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
      return this.findElement(LegacySelector.tagName(tagName))
    }
    async findElementsByTagName(tagName) {
      return this.findElements(LegacySelector.tagName(tagName))
    }
    async findElementByXPath(xpath) {
      return this.findElement(LegacySelector.xPath(xpath))
    }
    async findElementsByXPath(xpath) {
      return this.findElements(LegacySelector.xPath(xpath))
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
    async getBrowserVersion() {
      const capabilities = await this.getCapabilities()
      return capabilities.browserVersion
    }
  }
}

module.exports = LegacyAPIDriver
