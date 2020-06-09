const {EyesWrappedElement} = require('@applitools/eyes-sdk-core')
const SpecWrappedElement = require('./SpecWrappedElement')
const LegacyWrappedElement = require('./LegacyWrappedElement')

const WDIOWrappedElement = EyesWrappedElement.specialize(SpecWrappedElement)

module.exports = LegacyWrappedElement(WDIOWrappedElement)
