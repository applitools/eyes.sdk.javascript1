const {TypeUtils} = require('@applitools/eyes-sdk-core')
const {By} = require('selenium-webdriver')

/**
 * @typedef {import('./SpecWrappedDriver').Driver} Driver
 * @typedef {import('selenium-webdriver').By|import('selenium-webdriver').ByHash|string} Selector
 * @typedef {import('selenium-webdriver').WebElement} Element
 *
 * @typedef {import('@applitools/eyes-sdk-core').SpecElement<Driver, Element, Selector>} SeleniumSpecElement
 */

function isCompatible(element) {
  const ctorName = element && element.constructor && element.constructor.name
  return ctorName === 'WebElement'
}
function isSelector(selector) {
  if (!selector) return false
  return (
    selector instanceof By ||
    TypeUtils.has(selector, ['using', 'value']) ||
    Object.keys(selector).some(key => key in By) ||
    TypeUtils.isString(selector)
  )
}
function toSupportedSelector(selector) {
  if (TypeUtils.has(selector, ['type', 'selector'])) {
    if (selector.type === 'css') return By.css(selector.selector)
    else if (selector.type === 'xpath') return By.xpath(selector.selector)
  }
  return selector
}
function toEyesSelector(selector) {
  if (TypeUtils.isString(selector)) {
    selector = By.css(selector)
  } else if (TypeUtils.has(selector, ['using', 'value'])) {
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
}
function extractId(element) {
  return element.getId()
}
function isStaleElementReferenceResult(result) {
  if (!result) return false
  const errOrResult = result.originalError || result
  return errOrResult instanceof Error && errOrResult.name === 'StaleElementReferenceError'
}

/** @type {SeleniumSpecElement} */
module.exports = {
  isCompatible,
  isSelector,
  toSupportedSelector,
  toEyesSelector,
  extractId,
  isStaleElementReferenceResult,
}
