const {EyesVisualGrid} = require('../../index')
const WrappedDriver = require('./FakeWrappedDriver')
const WrappedElement = require('./FakeWrappedElement')
const CheckSettings = require('./FakeCheckSettings')
const VisualGridClient = require('@applitools/visual-grid-client')

module.exports = EyesVisualGrid.specialize({
  agentId: `eyes.fake.visualgrid.javascript/0.1.0`,
  WrappedDriver,
  WrappedElement,
  CheckSettings,
  VisualGridClient,
})
