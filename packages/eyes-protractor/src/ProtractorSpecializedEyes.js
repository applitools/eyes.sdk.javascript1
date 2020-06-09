const {EyesFactory, EyesClassic, EyesVisualGrid} = require('@applitools/eyes-sdk-core')
const VisualGridClient = require('@applitools/visual-grid-client')
const WrappedDriver = require('./ProtractorWrappedDriver')
const WrappedElement = require('./ProtractorWrappedElement')
const CheckSettings = require('./ProtractorCheckSettings')

const {version} = require('../package.json')

const ProtractorEyesClassic = EyesClassic.specialize({
  agentId: `eyes-protractor/${version}`,
  WrappedDriver,
  WrappedElement,
  CheckSettings,
})
const ProtractorEyesVisualGrid = EyesVisualGrid.specialize({
  agentId: `eyes-protractor.visualgrid/${version}`,
  WrappedDriver,
  WrappedElement,
  CheckSettings,
  VisualGridClient,
})
const ProtractorEyesFactory = EyesFactory.specialize({
  EyesClassic: ProtractorEyesClassic,
  EyesVisualGrid: ProtractorEyesVisualGrid,
})

module.exports = {
  ProtractorEyesClassic,
  ProtractorEyesVisualGrid,
  ProtractorEyesFactory,
}
