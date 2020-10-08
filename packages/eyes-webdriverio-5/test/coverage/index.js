const {
  makeEmitter,
  makeTemplate,
  supportedTests,
} = require('@applitools/sdk-shared/coverage-tests/generic')

module.exports = {
  name: 'eyes.webdriverio.javascript5',
  out: './test/coverage/generic',
  ext: '.spec.js',
  initialize: makeEmitter,
  testFrameworkTemplate: makeTemplate,
  supportedTests,
  testsUrl: 'https://raw.githubusercontent.com/applitools/sdk.coverage.tests/env-and-meta/tests.js',
}
