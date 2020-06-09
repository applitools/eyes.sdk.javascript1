function LegacyAPIElement(EyesWrappedElement) {
  return class EyesWebElement extends EyesWrappedElement {
    get element() {
      return this.unwrapped
    }
    get locator() {
      return this.selector
    }
    getDriver() {
      return this._driver
    }
    getId() {
      return this.elementId
    }
    async getComputedStyle(propStyle) {
      return this.getCssProperty(propStyle)
    }
    async getComputedStyleInteger(propStyle) {
      const value = await this.getCssProperty(propStyle)
      return Math.round(Number.parseFloat(value))
    }
    async getScrollLeft() {
      const value = await this.getProperty('scrollLeft')
      return Math.ceil(Number.parseFloat(value))
    }
    async getScrollTop() {
      const value = await this.getProperty('scrollTop')
      return Math.ceil(Number.parseFloat(value))
    }
    async getScrollWidth() {
      const value = await this.getProperty('scrollWidth')
      return Math.ceil(Number.parseFloat(value))
    }
    async getScrollHeight() {
      const value = await this.getProperty('scrollHeight')
      return Math.ceil(Number.parseFloat(value))
    }
    async getClientWidth() {
      const value = await this.getProperty('clientWidth')
      return Math.ceil(Number.parseFloat(value))
    }
    async getClientHeight() {
      const value = await this.getProperty('clientHeight')
      return Math.ceil(Number.parseFloat(value))
    }
    getBorderLeftWidth() {
      return this.getComputedStyleInteger('border-left-width')
    }
    getBorderRightWidth() {
      return this.getComputedStyleInteger('border-right-width')
    }
    getBorderTopWidth() {
      return this.getComputedStyleInteger('border-top-width')
    }
    getBorderBottomWidth() {
      return this.getComputedStyleInteger('border-bottom-width')
    }
    async executeScript(script) {
      return this._driver.executor.executeScript(script, this)
    }
    async findElement(locator) {
      const {value} = await this._driver.unwrapped.elementIdElement(
        await this.elementId,
        locator.toString(),
      )
      return value
        ? this._driver.specs.createElement(this._logger, this._driver, value, locator)
        : null
    }
    async findElements(locator) {
      const {value} = await this._driver.unwrapped.elementIdElements(
        await this.elementId,
        locator.toString(),
      )
      return value && value.length > 0
        ? value.map(element =>
            this._driver.specs.createElement(this._logger, this._driver, element, locator),
          )
        : []
    }
    async sendKeys(keysToSend) {
      await this._driver.elementIdClick(this.elementId)
      return this._driver.keys(keysToSend)
    }
    async click() {
      return this._driver.elementIdClick(this.elementId)
    }
  }
}

module.exports = LegacyAPIElement
