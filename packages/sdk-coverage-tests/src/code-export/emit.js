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
  function emitTests(supportedTests, {host, all = false} = {}) {
    supportedTests.forEach(supportedTest => {
      const baselineTestName = `${supportedTest.name}${convertExecutionModeToSuffix(
        supportedTest.executionMode,
      )}`
      const branchName = supportedTest.baselineVersion
        ? `v${supportedTest.baselineVersion}`
        : 'master'
      const sdkImplementation = initializeSdkImplementation({
        baselineTestName,
        branchName,
        host,
        ...supportedTest,
      })
      // test
      const coverageTests = makeCoverageTests(sdkImplementation)
      const coverageTestFunc = coverageTests[supportedTest.name]
      if (!coverageTestFunc) {
        throw new Error('missing implementation for test ' + supportedTest.name)
      }
      coverageTests[supportedTest.name]()
      // store
      output.push({
        name: baselineTestName,
        disabled: !all && supportedTest.disabled,
        ...sdkImplementation.tracker,
      })
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

  storeCommand(command) {
    const id = this.commands.push(command)
    return {
      isRef: true,
      resolve: () => {
        const name = `var_${id}`
        this.commands[id - 1] = `const ${name} = ${command}`
        return name
      },
    }
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
