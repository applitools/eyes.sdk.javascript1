const {initializeSdk, overrideTests} = require('@applitools/sdk-shared/coverage-tests/generic')
const testFrameworkTemplate = require('./nightwatch-template')

module.exports = {
  name: 'eyes-nightwatch',
  outPath: './test/generic',
  ext: '.spec.js',
  initializeSdk,
  testFrameworkTemplate,
  overrideTests,
}
