const {TypeUtils} = require('@applitools/eyes-sdk-core')
const {WebElement, By} = require('selenium-webdriver')

/**
 * @typedef {import('selenium-webdriver').ByHash} ByHash
 * @typedef {import('selenium-webdriver').By} By
 */

/**
 * Supported selector type
 * @typedef {By|ByHash} SupportedSelector
 */

/**
 * Compatible element type
 * @typedef {UnwrappedElement} SupportedElement
 */

/**
 * Unwrapped element supported by framework
 * @typedef {WebElement} UnwrappedElement
 */

module.exports = {
  isCompatible(element) {
    return element instanceof WebElement
  },
  isSelector(selector) {
    if (!selector) return false
    return (
      selector instanceof By ||
      TypeUtils.has(selector, ['using', 'value']) ||
      Object.keys(selector).some(key => key in By)
    )
  },
  toSupportedSelector(selector) {
    if (TypeUtils.has(selector, ['type', 'selector'])) {
      if (selector.type === 'css') return By.css(selector.selector)
      else if (selector.type === 'xpath') return By.xpath(selector.selector)
    }
    return selector
  },
  toEyesSelector(selector) {
    if (TypeUtils.has(selector, ['using', 'value'])) {
      selector = new By(selector.using, selector.value)
    } else if (TypeUtils.isPlainObject(selector)) {
      const using = Object.keys(selector).find(using => TypeUtils.has(By, using))
      if (using) selector = By[using](selector[using])
    }

    if (selector instanceof By) {
      const {using, value} = selector
      if (using === 'css selector') return {type: 'css', selector: value}
      else if (using === 'xpath') return {type: 'xpath', selector: value}
    }

    return {selector}
  },
  extractId(element) {
    return element.getId()
  },
  isStaleElementReferenceResult(result) {
    if (!result) return false
    return result instanceof Error && result.name === 'StaleElementReferenceError'
  },
}
