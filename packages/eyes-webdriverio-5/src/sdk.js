const {EyesSDK} = require('@applitools/eyes-sdk-core')
const VisualGridClient = require('@applitools/visual-grid-client')
const spec = require('./spec-driver')
const {version} = require('../package.json')

module.exports = EyesSDK({
  name: 'eyes.webdriverio',
  version,
  spec,
  VisualGridClient,
})
