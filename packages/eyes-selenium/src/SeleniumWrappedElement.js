const {EyesWrappedElement} = require('@applitools/eyes-sdk-core')
const SpecWrappedElement = require('./SpecWrappedElement')

const SeleniumWrappedElement = EyesWrappedElement.specialize(SpecWrappedElement)

module.exports = SeleniumWrappedElement
