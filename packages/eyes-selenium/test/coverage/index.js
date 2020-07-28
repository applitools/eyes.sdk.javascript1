const {makeEmitter, makeTemplate, supportedTests} = require('@applitools/sdk-coverage-tests/js')

module.exports = {
  name: process.env.APPLITOOLS_SELENIUM_MAJOR_VERSION === '3' ? 'eyes-selenium-3' : 'eyes-selenium',
  out: './test/coverage/generic',
  ext: '.spec.js',
  initialize: makeEmitter,
  testFrameworkTemplate: makeTemplate,
  supportedTests,
}
