const {EyesFactory, EyesClassic, EyesVisualGrid} = require('@applitools/eyes-sdk-core')
const VisualGridClient = require('@applitools/visual-grid-client')
const WrappedDriver = require('./SeleniumWrappedDriver')
const WrappedElement = require('./SeleniumWrappedElement')
const CheckSettings = require('./SeleniumCheckSettings')

const {version} = require('../package.json')

const SeleniumEyesClassic = EyesClassic.specialize({
  agentId: `eyes.selenium.javascript/${version}`,
  WrappedDriver,
  WrappedElement,
  CheckSettings,
})
const SeleniumEyesVisualGrid = EyesVisualGrid.specialize({
  agentId: `eyes.selenium.visualgrid.javascript/${version}`,
  WrappedDriver,
  WrappedElement,
  CheckSettings,
  VisualGridClient,
})
const SeleniumEyesFactory = EyesFactory.specialize({
  EyesClassic: SeleniumEyesClassic,
  EyesVisualGrid: SeleniumEyesVisualGrid,
})

module.exports = {
  SeleniumEyesClassic,
  SeleniumEyesVisualGrid,
  SeleniumEyesFactory,
}
