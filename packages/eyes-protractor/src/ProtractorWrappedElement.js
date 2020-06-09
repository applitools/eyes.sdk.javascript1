const {EyesWrappedElement} = require('@applitools/eyes-sdk-core')
const SpecWrappedElement = require('./SpecWrappedElement')

const ProtractorWrappedElement = EyesWrappedElement.specialize(SpecWrappedElement)

module.exports = ProtractorWrappedElement
