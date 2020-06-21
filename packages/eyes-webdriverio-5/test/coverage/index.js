const supportedTests = require('./supported-tests')
const {makeSpecEmitter} = require('@applitools/sdk-coverage-tests')

module.exports = {
  name: 'eyes.webdriverio.javascript5',
  initialize: makeSpecEmitter,
  supportedTests,
}
