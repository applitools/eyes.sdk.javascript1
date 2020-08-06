const {EyesSDK} = require('@applitools/eyes-sdk-core')
const VisualGridClient = require('@applitools/visual-grid-client')
const spec = require('./SpecDriver')
const {version} = require('../package.json')

module.exports = EyesSDK({
  name: 'eyes.selenium',
  version: `${version}--${process.env.APPLITOOLS_SELENIUM_MAJOR_VERSION}`,
  spec,
  VisualGridClient,
})
