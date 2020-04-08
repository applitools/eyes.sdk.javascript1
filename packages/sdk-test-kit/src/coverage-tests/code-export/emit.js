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
      for (const hook in sdkImplementation.hooks) {
        if (hook === 'beforeEach') {
          sdkImplementation.hooks[hook]({
            baselineTestName,
            branchName,
            host,
          })
        } else {
          sdkImplementation.hooks[hook]()
        }
      }
      // test
      makeCoverageTests(sdkImplementation)[supportedTest.name]()
      // store
      output.push({name: baselineTestName, ...sdkImplementation.out})
    })
    return output
  }
  return {emitTests}
}

function makeEmitTracker() {
  return {
    hooks: {
      deps: [],
      beforeEach: [],
      afterEach: [],
    },
    commands: [],
  }
}

module.exports = {
  makeEmitTracker,
  makeEmitTests,
}
