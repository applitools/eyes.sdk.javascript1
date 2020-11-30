const makeTemplate = require('./mocha-template')
const makeEmitter = require('./spec-emitter')
const overrideTests = require('./override-tests')

module.exports = {
  outPath: './test/generic',
  ext: '.spec.js',
  initializeSdk: makeEmitter,
  testFrameworkTemplate: makeTemplate,
  overrideTests,
  testsPath: '/Users/ep/Documents/applitools/sdk.coverage.tests/coverage-tests.js',
}
