const {DriverCheckSettings} = require('@applitools/eyes-sdk-core')
const WDIOWrappedElement = require('./WDIOWrappedElement')
const WDIOFrame = require('./WDIOFrame')

module.exports = DriverCheckSettings.specialize({
  isSelector(selector) {
    return WDIOWrappedElement.isSelector(selector)
  },
  isCompatibleElement(element) {
    return WDIOWrappedElement.isCompatible(element)
  },
  createElementFromSelector(selector) {
    return WDIOWrappedElement.fromSelector(selector)
  },
  createElementFromElement(element) {
    return WDIOWrappedElement.fromElement(element)
  },
  isFrameReference(reference) {
    return WDIOFrame.isReference(reference)
  },
  createFrameReference(reference) {
    return WDIOFrame.fromReference(reference)
  },
})
