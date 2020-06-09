const {DriverCheckSettings} = require('@applitools/eyes-sdk-core')
const SeleniumWrappedElement = require('./SeleniumWrappedElement')
const SeleniumFrame = require('./SeleniumFrame')

module.exports = DriverCheckSettings.specialize({
  isSelector(selector) {
    return SeleniumWrappedElement.isSelector(selector)
  },
  isCompatibleElement(element) {
    return SeleniumWrappedElement.isCompatible(element)
  },
  createElementFromSelector(selector) {
    return SeleniumWrappedElement.fromSelector(selector)
  },
  createElementFromElement(element) {
    return SeleniumWrappedElement.fromElement(element)
  },
  isFrameReference(reference) {
    return SeleniumFrame.isReference(reference)
  },
  createFrameReference(reference) {
    return SeleniumFrame.fromReference(reference)
  },
})
