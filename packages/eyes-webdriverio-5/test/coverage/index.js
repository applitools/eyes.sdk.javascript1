const {makeEmitter, makeTemplate, supportedTests} = require('@applitools/sdk-coverage-tests/js')

module.exports = {
  name: 'eyes.webdriverio.javascript5',
  out: './test/coverage/generic',
  ext: '.spec.js',
  initialize: makeEmitter,
  testFrameworkTemplate: makeTemplate,
  supportedTests,
}
