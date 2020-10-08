const {EyesSDK} = require('../../index')
const VisualGridClient = require('@applitools/visual-grid-client')
const spec = require('./FakeSpecDriver')

module.exports = EyesSDK({
  name: 'eyes.fake',
  version: '0.2.0',
  spec,
  VisualGridClient,
})
