const {DriverCheckSettings} = require('../../index')
const FakeWrappedElement = require('./FakeWrappedElement')
const FakeFrame = require('./FakeFrame')

module.exports = DriverCheckSettings.specialize({
  isSelector(selector) {
    return FakeWrappedElement.isSelector(selector)
  },
  isCompatibleElement(element) {
    return FakeWrappedElement.isCompatible(element)
  },
  createElementFromSelector(selector) {
    return FakeWrappedElement.fromSelector(selector)
  },
  createElementFromElement(element) {
    return FakeWrappedElement.fromElement(element)
  },
  isFrameReference(reference) {
    return FakeFrame.isReference(reference)
  },
  createFrameReference(reference) {
    return FakeFrame.fromReference(reference)
  },
})
