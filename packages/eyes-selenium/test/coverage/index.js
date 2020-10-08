const {
  makeEmitter,
  makeTemplate,
  supportedTests,
} = require('@applitools/sdk-shared/coverage-tests/generic')

module.exports = {
  name: process.env.APPLITOOLS_SELENIUM_MAJOR_VERSION === '3' ? 'eyes-selenium-3' : 'eyes-selenium',
  out: './test/coverage/generic',
  ext: '.spec.js',
  initialize: makeEmitter,
  testFrameworkTemplate: makeTemplate,
  supportedTests,
  testsUrl: 'https://raw.githubusercontent.com/applitools/sdk.coverage.tests/env-and-meta/tests.js',
}
