const {EyesElementFinder, TypeUtils} = require('@applitools/eyes-sdk-core')
const WDIOElement = require('./WDIOElement')
const By = require('../By')

class WDIOElementFinder extends EyesElementFinder {
  constructor(logger, driver) {
    super()
    this._logger = logger
    this._driver = driver
  }

  static isLocator(object) {
    return (
      TypeUtils.isString(object) ||
      TypeUtils.has(object, ['using', 'value']) ||
      object instanceof By
    )
  }

  async findElement(locator, parentElement) {
    const selector = locator.value || locator
    const {value: element} = parentElement
      ? await this._driver.elementIdElement(WDIOElement.elementId(parentElement), selector)
      : await this._driver.element(selector)
    // TODO Do we need throw if not found?
    // if (element === null && result.type === 'NoSuchElement' && result.state === 'failure') {
    //   throw new Error(result.message)
    // }
    return element ? new WDIOElement(this._logger, this._driver, element, selector) : null
  }

  async findElements(locator, parentElement) {
    const selector = locator.value || locator
    const {value: elements} = parentElement
      ? await this._driver.elementIdElements(WDIOElement.elementId(parentElement), selector)
      : await this._driver.elements(selector)
    return elements.map(element => new WDIOElement(this._logger, this._driver, element, selector))
  }
}

module.exports = WDIOElementFinder
