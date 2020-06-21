const supportedTests = require('./supported-tests')
const {makeSpecEmitter} = require('@applitools/sdk-coverage-tests')

module.exports = {
  name: 'eyes.webdriverio.javascript4',
  initialize: makeSpecEmitter,
  supportedTests,
}
