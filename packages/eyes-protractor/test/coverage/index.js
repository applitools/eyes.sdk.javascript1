const supportedTests = require('./supported-tests')
const {makeSpecEmitter} = require('@applitools/sdk-coverage-tests')

module.exports = {
  name: 'eyes-protractor',
  initialize: makeSpecEmitter,
  supportedTests,
}
