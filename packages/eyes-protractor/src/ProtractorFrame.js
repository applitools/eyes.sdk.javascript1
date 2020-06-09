const {Frame} = require('@applitools/eyes-sdk-core')
const ProtractorWrappedElement = require('./ProtractorWrappedElement')

module.exports = Frame.specialize({
  isSelector(selector) {
    return ProtractorWrappedElement.isSelector(selector)
  },
  isCompatibleElement(element) {
    return ProtractorWrappedElement.isCompatible(element)
  },
  isEqualElements(leftElement, rightElement) {
    return ProtractorWrappedElement.equals(leftElement, rightElement)
  },
  createElement(logger, driver, element, selector) {
    return new ProtractorWrappedElement(logger, driver, element, selector)
  },
})
