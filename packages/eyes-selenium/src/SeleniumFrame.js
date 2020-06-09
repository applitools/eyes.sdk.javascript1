const {Frame} = require('@applitools/eyes-sdk-core')
const SeleniumWrappedElement = require('./SeleniumWrappedElement')

module.exports = Frame.specialize({
  isSelector(selector) {
    return SeleniumWrappedElement.isSelector(selector)
  },
  isCompatibleElement(element) {
    return SeleniumWrappedElement.isCompatible(element)
  },
  isEqualElements(leftElement, rightElement) {
    return SeleniumWrappedElement.equals(leftElement, rightElement)
  },
  createElement(logger, driver, element, selector) {
    return new SeleniumWrappedElement(logger, driver, element, selector)
  },
})
