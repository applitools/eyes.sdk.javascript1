'use strict'
const {TypeUtils} = require('@applitools/eyes-sdk-core')

class LegacySelector {
  /**
   * @param {string} value - selector itself
   * @param {string} using - selector type
   */
  constructor(value, using = 'css selector') {
    this._value = value
    this._using = using
  }
  /**
   * @return {string} selector
   */
  get value() {
    return this._value
  }
  /**
   * @return {string} selector type
   */
  get using() {
    return this._using
  }
  /**
   * Create css selector
   * @param {string} cssSelector - selector string
   * @return {LegacySelector} selector instance
   */
  static css(cssSelector) {
    return new LegacySelector(cssSelector)
  }
  /**
   * @alias css
   */
  static cssSelector(cssSelector) {
    return LegacySelector.css(cssSelector)
  }
  /**
   * Create css selector by id
   * @param {string} id - element id
   * @return {LegacySelector} selector instance
   */
  static id(id) {
    return new LegacySelector(`*[id="${id}"]`)
  }
  /**
   * Create css selector by class
   * @param {string} className - element class
   * @return {LegacySelector} selector instance
   */
  static className(className) {
    return new LegacySelector(`.${className}`)
  }
  /**
   * Create css selector by attribute an its value
   * @param {string} attributeName - attribute name
   * @param {string} value - attribute value
   * @return {LegacySelector} selector instance
   */
  static attributeValue(attributeName, value) {
    return new LegacySelector(`*[${attributeName}="${value}"]`)
  }
  /**
   * Create css selector by name attribute
   * @param {string} name - name attribute value
   * @return {LegacySelector} selector instance
   */
  static name(name) {
    return LegacySelector.attributeValue('name', name)
  }
  /**
   * Create css selector by tag name
   * @param {string} tagName - element tag name
   * @return {LegacySelector} selector instance
   */
  static tagName(tagName) {
    return new LegacySelector(tagName)
  }
  /**
   * Create xpath selector
   * @param {string} xpath - xpath string
   * @return {LegacySelector} selector instance
   */
  static xpath(xpath) {
    return new LegacySelector(xpath, 'xpath')
  }
  /**
   * @alias xpath
   */
  static xPath(xpath) {
    return LegacySelector.xpath(xpath)
  }
  /**
   * @override
   */
  toString() {
    return `${this.using}:${this.value}`
  }
}

function withLegacyDriverAPI(browser) {
  const api = {
    get remoteWebDriver() {
      return browser
    },
    async executeScript(script, ...args) {
      if (TypeUtils.isFunction(script) || args.length > 1 || !TypeUtils.isArray(args[0])) {
        return browser.execute(script, ...args)
      } else {
        return browser.executeScript(script, args[0])
      }
    },
    async executeAsyncScript(script, ...args) {
      if (TypeUtils.isFunction(script) || args.length > 1 || !TypeUtils.isArray(args[0])) {
        return browser.executeAsync(script, ...args)
      } else {
        return browser.executeAsyncScript(script, args[0])
      }
    },
    async findElement(usingOrLocator, value) {
      if (usingOrLocator instanceof LegacySelector) {
        const element = await browser.$(usingOrLocator.toString())
        return !element.error ? withLegacyElementAPI(element, this) : null
      } else {
        return browser.findElement(usingOrLocator, value)
      }
    },
    async findElements(usingOrLocator, value) {
      if (usingOrLocator instanceof LegacySelector) {
        const elements = await browser.$$(usingOrLocator.toString())
        return Array.from(elements, element => withLegacyElementAPI(element, this))
      } else {
        return browser.findElements(usingOrLocator, value)
      }
    },
    async findElementById(id) {
      return this.findElement(LegacySelector.id(id))
    },
    async findElementsById(id) {
      return this.findElements(LegacySelector.id(id))
    },
    async findElementByName(name) {
      return this.findElement(LegacySelector.name(name))
    },
    async findElementsByName(name) {
      return this.findElements(LegacySelector.name(name))
    },
    async findElementByCssSelector(cssSelector) {
      return this.findElement(LegacySelector.cssSelector(cssSelector))
    },
    async findElementsByCssSelector(cssSelector) {
      return this.findElements(LegacySelector.cssSelector(cssSelector))
    },
    async findElementByClassName(_className) {
      throw new TypeError('findElementByClassName method is not implemented!')
    },
    async findElementsByClassName(_className) {
      throw new TypeError('findElementsByClassName method is not implemented!')
    },
    async findElementByLinkText(_linkText) {
      throw new TypeError('findElementByLinkText method is not implemented!')
    },
    async findElementsByLinkText(_linkText) {
      throw new TypeError('findElementsByLinkText method is not implemented!')
    },
    async findElementByPartialLinkText(_partialLinkText) {
      throw new TypeError('findElementByPartialLinkText method is not implemented!')
    },
    async findElementsByPartialLinkText(_partialLinkText) {
      throw new TypeError('findElementsByPartialLinkText method is not implemented!')
    },
    async findElementByTagName(tagName) {
      return this.findElement(LegacySelector.tagName(tagName))
    },
    async findElementsByTagName(tagName) {
      return this.findElements(LegacySelector.tagName(tagName))
    },
    async findElementByXPath(xpath) {
      return this.findElement(LegacySelector.xPath(xpath))
    },
    async findElementsByXPath(xpath) {
      return this.findElements(LegacySelector.xPath(xpath))
    },
    switchTo() {
      return {
        defaultContent: () => browser.switchToFrame(null),
        frame: arg => browser.switchToFrame(arg),
        parentFrame: () => browser.switchToParentFrame(),
      }
    },
    async end() {
      return browser.deleteSession()
    },
    async close() {
      return browser.deleteSession()
    },
    async sleep(ms) {
      return browser.pause(ms)
    },
    async getCapabilities() {
      return browser.capabilities
    },
    async getCurrentUrl() {
      return browser.getUrl()
    },
    async getBrowserName() {
      return browser.capabilities.browserName
    },
  }
  return new Proxy(browser, {
    get(target, key, receiver) {
      if (Object.hasOwnProperty.call(api, key)) {
        return Reflect.get(api, key, receiver)
      }
      return Reflect.get(target, key)
    },
  })
}

function withLegacyElementAPI(element, driver) {
  const api = {
    get element() {
      return element
    },
    get locator() {
      return this.selector
    },
    getDriver() {
      return driver
    },
    getId() {
      return this.elementId
    },
    async executeScript(script) {
      return driver.execute(script, this)
    },
    async findElement(locator) {
      const extendedParentElement = await this.$(this)
      const element = await extendedParentElement.$(
        locator instanceof LegacySelector ? locator.toString() : locator,
      )
      return !element.error ? withLegacyElementAPI(element, driver) : null
    },
    async findElements(locator) {
      const elements = await this.$$(
        locator instanceof LegacySelector ? locator.toString() : locator,
      )
      return Array.from(elements, element => withLegacyElementAPI(element, driver))
    },
    async sendKeys(keysToSend) {
      await driver.elementClick(this.elementId)
      return driver.keys(keysToSend)
    },
    async click() {
      return driver.elementClick(this.elementId)
    },
  }
  return new Proxy(element, {
    get(target, key, receiver) {
      if (Object.hasOwnProperty.call(api, key)) {
        return Reflect.get(api, key, receiver)
      }
      return Reflect.get(target, key)
    },
  })
}

exports.LegacySelector = LegacySelector
exports.withLegacyDriverAPI = withLegacyDriverAPI
exports.withLegacyElementAPI = withLegacyElementAPI
