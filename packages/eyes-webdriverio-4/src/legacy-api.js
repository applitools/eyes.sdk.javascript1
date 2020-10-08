'use strict'

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
      const {value} = await browser.execute(script, ...args)
      return value
    },
    async executeAsyncScript(script, ...args) {
      const {value} = await browser.executeAsync(script, ...args)
      return value
    },
    async findElement(selector) {
      if (selector instanceof LegacySelector) {
        const element = await browser.element(selector.toString())
        return element ? withLegacyElementAPI(element, this) : null
      }
    },
    async findElements(selector) {
      if (selector instanceof LegacySelector) {
        const {value} = await browser.elements(selector.toString())
        return value ? value.map(element => withLegacyElementAPI(element, this)) : []
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
        defaultContent: () => browser.frame(null),
        frame: arg => browser.frame(arg),
        parentFrame: () => browser.frameParent(),
      }
    },
    async takeScreenshot() {
      return browser.saveScreenshot()
    },
    async close() {
      return browser.end()
    },
    async sleep(ms) {
      return browser.pause(ms)
    },
    async getCapabilities() {
      return browser.desiredCapabilities
    },
    async getCurrentUrl() {
      return browser.getUrl()
    },
    async getBrowserName() {
      return browser.desiredCapabilities.browserName
    },
    async click(selector) {
      return browser.click(selector instanceof LegacySelector ? selector.toString() : selector)
    },
  }
  return new Proxy(browser, {
    get(target, key, receiver) {
      if (key === 'then') return
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
      return element.value || element
    },
    get locator() {
      return element.selector
    },
    getDriver() {
      return driver
    },
    getId() {
      return element.value ? element.value.ELEMENT : element.ELEMENT
    },
    async executeScript(script) {
      const {value} = await driver.execute(script, this.element)
      return value
    },
    async findElement(selector) {
      const {value} = await driver.elementIdElement(this.getId(), selector.toString())
      return value ? withLegacyElementAPI(value, driver) : null
    },
    async findElements(selector) {
      const {value} = await driver.elementIdElement(this.getId(), selector.toString())
      return value ? value.map(element => withLegacyElementAPI(element, driver)) : []
    },
    async sendKeys(keysToSend) {
      return driver.elementIdValue(this.getId(), keysToSend)
    },
    async click() {
      return driver.elementIdClick(this.getId())
    },
  }
  return new Proxy(element, {
    get(target, key, receiver) {
      if (key in api) {
        return Reflect.get(api, key, receiver)
      }
      return Reflect.get(target, key)
    },
  })
}

exports.LegacySelector = LegacySelector
exports.withLegacyDriverAPI = withLegacyDriverAPI
exports.withLegacyElementAPI = withLegacyElementAPI
