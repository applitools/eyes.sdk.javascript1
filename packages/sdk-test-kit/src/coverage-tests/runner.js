const throat = require('throat')
const {getNameFromObject} = require('./common-util')
const {makeSendReport} = require('./send-report-util')

/**
 * Creates a coverage-test runner for a given SDK implementation.
 * params:
 * - sdkName: string of the SDK name
 * - intializeSdkImplementation: a function that initializes state and implements
 *     all coverage-test DSL functions for a given SDK. Returns all of the functions
 *     expected by makeCoverageTests (e.g., visit, open, check, and close) plus
 *     optional functions the runner can use for lifecycle management (e.g., cleanup)
 * returns: a runTests function
 */
function makeRunTests(sdkName, initializeSdkImplementation, makeTestSet) {
  const p = []
  const errors = []

  /**
   * Runs coverage-tests for a given SDK implementation.
   * params:
   * - supportedTests: an array of objects, each with keys of "name" and "executionMode"
   *    - name: name of a test (found in makeCoverageTests)
   *    - executionMode: e.g., {isVisualGrid: true} -- although an SDK can implement
   *        whatever it needs, just so long as it is what the initializeSdkImplementation
   *        function is using internally
   * - options: an object which can be used to alter the behavior of runTests
   *    - host: url to run tests on (e.g., a Selenium Grid)
   *    - concurrency: number of parallel executions at one time
   * returns: a report object
   */
  async function runTests(supportedTests, {branchName = 'master', concurrency = 15, host} = {}) {
    supportedTests.forEach((supportedTest, supportedTestIndex) => {
      const testName = supportedTest.name
      const executionMode = supportedTest.executionMode
      p.push(async () => {
        let sdkImplementation
        try {
          sdkImplementation = initializeSdkImplementation()
          const test = makeTestSet(sdkImplementation)[testName]
          if (sdkImplementation._setup)
            await sdkImplementation._setup({
              // for consistent naming in the Eyes dashboard to pick up the correct baselines
              baselineTestName: `${testName}${convertExecutionModeToSuffix(executionMode)}`,
              branchName,
              host,
              ...supportedTest,
            })
          await test()
          process.stdout.write('.') // TODO; find a better way to do this
        } catch (error) {
          process.stdout.write('F') // TODO; find a better way to do this
          errors.push({
            name: error.name,
            message: error.message,
            stackTrace: error.stack,
            testIndex: supportedTestIndex,
            testName,
            executionMode,
          })
        } finally {
          if (sdkImplementation._cleanup) await sdkImplementation._cleanup()
        }
      })
    })
    process.on('unhandledRejection', (error, _promise) => {
      errors.push({
        name: error.name,
        message: error.message,
        isUnhandledException: true,
      })
    })
    const start = new Date()
    try {
      await Promise.all(p.map(throat(concurrency, testRun => testRun())))
    } catch (error) {
      debugger
    }
    const end = new Date()

    return makeReport({sdkName, testsRan: supportedTests, errors, start, end})
  }

  return {runTests}
}

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

function makeReport({sdkName, testsRan, errors, start, end}) {
  const numberOfTests = new Set(testsRan.map(test => test.name)).size
  const numberOfTestsFailed = new Set(errors.map(error => error.testName)).size
  const numberOfTestsPassed = numberOfTests - numberOfTestsFailed
  const numberOfExecutions = testsRan.length
  const numberOfExecutionsFailed = errors.length
  const numberOfExecutionsPassed = numberOfExecutions - numberOfExecutionsFailed
  const report = {
    stats: {
      duration: end - start,
      numberOfTests,
      numberOfTestsPassed,
      numberOfTestsFailed,
      numberOfExecutions,
      numberOfExecutionsPassed,
      numberOfExecutionsFailed,
    },
    errors,
    toSendReportSchema: makeSendReport.bind(undefined, {sdkName, testsRan, errors}),
  }
  return {report}
}

module.exports = {
  makeRunTests,
  convertExecutionModeToSuffix,
}
