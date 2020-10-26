const chalk = require('chalk')

function getCallSite(elevation = 1) {
  const originalPrepareStackTrace = Error.prepareStackTrace
  Error.prepareStackTrace = (_, stack) => stack
  const err = new Error()
  Error.captureStackTrace(err, global)
  const callSite = err.stack[elevation]
  Error.prepareStackTrace = originalPrepareStackTrace
  return callSite
}

function useFramework() {
  const context = {
    testsConfig: null,
    tests: {},
  }

  return {
    context,
    api: {
      test: addTest,
      config: setConfig,
    },
  }

  function addTest(name, test) {
    const source = {line: getCallSite(2).getLineNumber()}
    if (context.tests.hasOwnProperty(name)) {
      const test = context.tests[name]
      const message = chalk.yellow(
        `WARNING: test with name "${name}" on line ${source.line} overrides the test with same name on line ${test.source.line}`,
      )
      console.log(message)
    }
    test.source = source
    context.tests[name] = test
  }

  function setConfig(config) {
    if (context.testsConfig) {
      const message = chalk.yellow(`WARNING: tests configuration object was reset`)
      console.log(message)
    }
    context.testsConfig = config
  }
}

exports.useFramework = useFramework
