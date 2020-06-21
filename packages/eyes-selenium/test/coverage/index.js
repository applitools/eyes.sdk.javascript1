const supportedTests = require('./supported-tests')
const {makeSpecEmitter} = require('@applitools/sdk-coverage-tests')

module.exports = {
  name: process.env.APPLITOOLS_SELENIUM_MAJOR_VERSION === '3' ? 'eyes-selenium-3' : 'eyes-selenium',
  initialize: makeSpecEmitter,
  supportedTests,
}
