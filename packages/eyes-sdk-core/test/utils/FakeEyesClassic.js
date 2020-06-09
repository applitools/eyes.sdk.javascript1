const {EyesClassic} = require('../../index')
const WrappedDriver = require('./FakeWrappedDriver')
const WrappedElement = require('./FakeWrappedElement')
const CheckSettings = require('./FakeCheckSettings')

module.exports = EyesClassic.specialize({
  agentId: `eyes.fake.javascript/0.1.0`,
  WrappedDriver,
  WrappedElement,
  CheckSettings,
})
