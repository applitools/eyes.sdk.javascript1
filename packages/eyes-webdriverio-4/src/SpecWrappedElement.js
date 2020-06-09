const {TypeUtils} = require('@applitools/eyes-sdk-core')
const LegacySelector = require('./LegacySelector')

/**
 * Supported selector type
 * @typedef {string|LegacySelector} SupportedSelector
 */

/**
 * Compatible element type
 * @typedef {UnwrappedElement|ResponseElement} SupportedElement
 */

/**
 * Unwrapped element supported by framework
 * @typedef {Object} UnwrappedElement
 * @property {string} ELEMENT - legacy element id
 * @property {string} element-6066-11e4-a52e-4f735466cecf - element id
 */

/**
 * Response element the object returned from find element operation
 * @typedef {Object} ResponseElement
 * @property {UnwrappedElement} value
 * @property {string} [selector]
 */

const LEGACY_ELEMENT_ID = 'ELEMENT'
const ELEMENT_ID = 'element-6066-11e4-a52e-4f735466cecf'

module.exports = {
  isCompatible(element) {
    if (!element) return false
    return element.value
      ? Boolean(element.value[ELEMENT_ID] || element.value[LEGACY_ELEMENT_ID])
      : Boolean(element[ELEMENT_ID] || element[LEGACY_ELEMENT_ID])
  },
  isSelector(selector) {
    return TypeUtils.isString(selector) || selector instanceof LegacySelector
  },
  extractId(element) {
    return element[ELEMENT_ID] || element[LEGACY_ELEMENT_ID]
  },
  toSupportedSelector(selector) {
    if (TypeUtils.has(selector, ['type', 'selector'])) {
      if (selector.type === 'css') return `css selector:${selector.selector}`
      else if (selector.type === 'xpath') return `xpath:${selector.selector}`
    }
    return selector
  },
  toEyesSelector(selector) {
    if (selector instanceof LegacySelector) {
      const {using, value} = selector
      if (using === 'css selector') return {type: 'css', selector: value}
      else if (using === 'xpath') return {type: 'xpath', selector: value}
    } else if (TypeUtils.isString(selector)) {
      const match = selector.match(/(css selector|xpath):(.+)/)
      if (match) {
        const [_, using, value] = match
        if (using === 'css selector') return {type: 'css', selector: value}
        else if (using === 'xpath') return {type: 'xpath', selector: value}
      }
    }
    return {selector}
  },
  extractElement(element) {
    const unwrapped = element.value ? element.value : element
    return {
      [ELEMENT_ID]: this.extractId(unwrapped),
      [LEGACY_ELEMENT_ID]: this.extractId(unwrapped),
    }
  },
  extractSelector(element) {
    return element.selector
  },
  isStaleElementReferenceResult(result, wrapper) {
    if (!result) return false
    return result instanceof Error
      ? result.seleniumStack && result.seleniumStack.type === 'StaleElementReference'
      : result.value && result.selector && result.selector === wrapper.selector
  },
}
