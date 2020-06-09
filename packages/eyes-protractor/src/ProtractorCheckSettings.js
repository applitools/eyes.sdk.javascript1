const {DriverCheckSettings} = require('@applitools/eyes-sdk-core')
const ProtractorWrappedElement = require('./ProtractorWrappedElement')
const ProtractorFrame = require('./ProtractorFrame')

module.exports = DriverCheckSettings.specialize({
  isSelector(selector) {
    return ProtractorWrappedElement.isSelector(selector)
  },
  isCompatibleElement(element) {
    return ProtractorWrappedElement.isCompatible(element)
  },
  createElementFromSelector(selector) {
    return ProtractorWrappedElement.fromSelector(selector)
  },
  createElementFromElement(element) {
    return ProtractorWrappedElement.fromElement(element)
  },
  isFrameReference(reference) {
    return ProtractorFrame.isReference(reference)
  },
  createFrameReference(reference) {
    return ProtractorFrame.fromReference(reference)
  },
})
