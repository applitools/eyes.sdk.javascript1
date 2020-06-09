const {EyesWrappedElement} = require('@applitools/eyes-sdk-core')
const SpecWrappedElement =
  process.env.SELENIUM_MAJOR_VERSION === '3'
    ? require('./selenium3/SpecWrappedElement')
    : require('./selenium4/SpecWrappedElement')

const SeleniumWrappedElement = EyesWrappedElement.specialize(SpecWrappedElement)

module.exports = SeleniumWrappedElement
