'use strict'

const {ArgumentGuard, TypeUtils} = require('@applitools/eyes-sdk-core')
const command = require('../services/selenium/Command')
const {By} = require('../By')

const WEB_ELEMENT_IDENTIFIER = 'element-6066-11e4-a52e-4f735466cecf'

/**
 * Wrapper for Webdriverio element
 */

class WebElement {
  /**
   * @param {WebDriver} driver
   * @param {Object} element - WebElement JSON object
   * @param {By|Object} locator
   */
  constructor(driver, element, locator) {
    ArgumentGuard.notNull(locator, 'locator')

    this._driver = driver
    this._element = element
    this._locator = locator
  }

  /**
   * @param {WebDriver} driver
   * @param {By} locator
   * @param {int} [retry]
   * @return {Promise.<WebElement>}
   */
  static async findElement(driver, locator, retry = 0) {
    try {
      const element = await driver.remoteWebDriver.findElement(locator.using, locator.value)
      return new WebElement(driver, element, locator)
    } catch (e) {
      if (retry > 3) {
        throw e
      } else {
        return WebElement.findElement(driver, locator, retry++)
      }
    }
  }

  /**
   * @todo
   */
  findElements(_locator) {}

  /**
   * @returns {Promise.<{x, y}>}
   */
  async getLocation() {
    try {
      return await this._driver.remoteWebDriver.getElementRect(this.elementId)
    } catch (e) {
      try {
        return this._driver.remoteWebDriver.getElementLocation(this.elementId)
      } catch (ignored) {
        throw e
      }
    }
  }

  /**
   * @returns {Promise.<width, height>}
   */
  async getSize() {
    try {
      return await this._driver.remoteWebDriver.getElementRect(this.elementId)
    } catch (e) {
      try {
        return this._driver.remoteWebDriver.getElementSize(this.element.ELEMENT)
      } catch (ignored) {
        throw e
      }
    }
  }

  /**
   * @returns {Promise.<x, y, width, height>}
   */
  async getRect() {
    // todo need to replace elementIdSize and elementIdLocation to elementIdRect
    const rect = await this._driver.remoteWebDriver.elementIdRect(this.elementId)
    return rect
  }

  /**
   * @returns {Promise}
   */
  click() {
    return this._driver.remoteWebDriver.elementClick(this.elementId)
  }

  /**
   *
   */
  takeScreenshot(opt_scroll) {
    // todo
    return this._driver.screenshot(opt_scroll)

    // return this.requestHandler.create(`/session/:sessionId/element/${id}/screenshot`);
  }

  /**
   * @param {object} object
   * @return {boolean}
   */
  static isLocator(object) {
    return object instanceof By || TypeUtils.has(object, ['using', 'value'])
  }

  static equals(a, b) {
    if (a == undefined || b == undefined) {
      return false
    }

    if (!(a instanceof this) || !(b instanceof this)) {
      return false
    }

    if (a === b) {
      return true
    }

    const elementA = a.getWebElement().elementId
    const elementB = b.getWebElement().elementId
    if (a === b) {
      return true
    }

    let cmd = new command.Command(command.Name.ELEMENT_EQUALS)
    cmd.setParameter('id', elementA)
    cmd.setParameter('other', elementB)

    return a._driver
      .executeCommand(cmd)
      .then(r => {
        const {value} = r
        return value
      })
      .catch(e => {
        throw e
      })
  }

  /**
   * @param keysToSend
   * @returns {Promise}
   */
  sendKeys(keysToSend) {
    const that = this
    return that._driver.remoteWebDriver.elementIdClick(this.elementId).then(() => {
      return that._driver.remoteWebDriver.keys(keysToSend)
    })
  }

  /**
   * @returns {Promise.<{offsetLeft, offsetTop}>}
   */
  async getElementOffset() {
    const offsetLeft = await this._driver.remoteWebDriver.elementIdAttribute(
      this.elementId,
      'offsetLeft',
    )
    const offsetTop = await this._driver.remoteWebDriver.elementIdAttribute(
      this.elementId,
      'offsetTop',
    )
    return {offsetLeft: parseInt(offsetLeft.value), offsetTop: parseInt(offsetTop.value)}
  }

  /**
   * @returns {Promise.<{scrollLeft, scrollTop}>}
   */
  async getElementScroll() {
    const that = this
    const scrollLeft = await that._driver.remoteWebDriver.elementIdAttribute(
      this.elementId,
      'scrollLeft',
    )
    const scrollTop = await that._driver.remoteWebDriver.elementIdAttribute(
      this.elementId,
      'scrollTop',
    )
    return {scrollLeft: parseInt(scrollLeft), scrollTop: parseInt(scrollTop.value)}
  }

  /**
   * @returns {EyesWebDriver}
   */
  getDriver() {
    return this._driver
  }

  /**
   * @return {Object|*}
   */
  get element() {
    return this._element
  }

  get jsonElement() {
    return {[WEB_ELEMENT_IDENTIFIER]: this.elementId, ELEMENT: this.elementId}
  }

  /**
   * @return {string}
   */
  get elementId() {
    return this._element.elementId || this._element.ELEMENT
  }

  get locator() {
    return this._locator
  }

  toString() {
    return this._element ? JSON.stringify(this._element) : JSON.stringify(this.locator)
  }
}

module.exports = WebElement
