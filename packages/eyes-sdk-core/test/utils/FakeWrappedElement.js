const {TypeUtils, EyesWrappedElement} = require('../../index')

module.exports = EyesWrappedElement.specialize({
  isCompatible(element) {
    return TypeUtils.has(element, 'id')
  },
  isSelector(selector) {
    return TypeUtils.isString(selector) || TypeUtils.has(selector, ['using', 'value'])
  },
  toEyesSelector(selector) {
    if (TypeUtils.isString(selector)) {
      const match = selector.match(/(css|xpath):(.+)/)
      if (match) {
        const [_, type, selector] = match
        return {type, selector}
      }
    }
    return {selector}
  },
  toSupportedSelector(selector) {
    if (TypeUtils.has(selector, ['type', 'selector'])) {
      return selector.selector
    }
    return selector
  },
  extractId(element) {
    return element.id
  },
})
