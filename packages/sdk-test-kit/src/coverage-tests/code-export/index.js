const {makeCoverageTests: doMakeCoverageTests} = require('../tests')
const {getNameFromObject} = require('../common-util')

function convertExecutionModeToSuffix(executionMode) {
  if (executionMode.useStrictName) return ''
  switch (getNameFromObject(executionMode)) {
    case 'isVisualGrid':
      return '_VG'
    case 'isScrollStitching':
      return '_Scroll'
    default:
      return ''
  }
}

function makeEmitTests(initializeSdkImplementation, makeCoverageTests = doMakeCoverageTests) {
  let output = []
  function emitTests(supportedTests, {branchName = 'master', host} = {}) {
    supportedTests.forEach(supportedTest => {
      const sdkImplementation = initializeSdkImplementation()
      const baselineTestName = `${supportedTest.name}${convertExecutionModeToSuffix(
        supportedTest.executionMode,
      )}`
      // hooks
      if (sdkImplementation._setup) {
        sdkImplementation._setup({
          baselineTestName,
          branchName,
          host,
        })
      }
      if (sdkImplementation._cleanup) sdkImplementation._cleanup()
      // test
      makeCoverageTests(sdkImplementation)[supportedTest.name]()
      // store
      output.push({[baselineTestName]: sdkImplementation.out})
    })
    return output
  }
  return {emitTests}
}

module.exports = {
  makeEmitTests,
}
