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

module.exports = LegacySelector
