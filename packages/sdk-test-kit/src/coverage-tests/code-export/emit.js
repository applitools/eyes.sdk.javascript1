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
            ...supportedTest,
          })
        } else {
          sdkImplementation.hooks[hook]()
        }
      }
      // test
      try {
        const coverageTests = makeCoverageTests(sdkImplementation)
        coverageTests[supportedTest.name]()
      } catch (error) {
        debugger
      }
      // store
      output.push({name: baselineTestName, ...sdkImplementation.out})
    })
    return output
  }
  return {emitTests}
}

class EmitTracker {
  constructor() {
    this.hooks = {
      deps: [],
      vars: [],
      beforeEach: [],
      afterEach: [],
    }
    this.commands = []
  }

  storeCommand(value) {
    this.commands.push(value)
  }

  storeHook(name, value) {
    switch (name) {
      case 'deps':
      case 'vars':
      case 'beforeEach':
      case 'afterEach':
        return this.hooks[name].push(value)
      default:
        throw new Error(
          `Unsupported hook ${name}. Please specify one of either ${Object.keys(this.hooks).join(
            ', ',
          )}`,
        )
    }
  }

  out() {
    return {
      hooks: this.hooks,
      commands: this.commands,
    }
  }
}

function makeEmitTracker() {
  return new EmitTracker()
}

module.exports = {
  makeEmitTracker,
  makeEmitTests,
}
