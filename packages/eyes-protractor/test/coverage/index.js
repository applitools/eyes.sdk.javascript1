const {makeEmitter, makeTemplate, supportedTests} = require('@applitools/sdk-coverage-tests/js')

module.exports = {
  name: 'eyes-protractor',
  out: './test/coverage/generic',
  ext: '.spec.js',
  initialize: makeEmitter,
  testFrameworkTemplate: makeTemplate,
  supportedTests,
}
