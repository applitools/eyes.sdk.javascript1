const path = require('path')
const {readFileSync} = require('fs')
const {
  filterTests,
  needsChromeDriver,
  numberOfTestVariations,
  numberOfUniqueTests,
} = require('../cli-util')
const {startChromeDriver, stopChromeDriver} = require('../../../browser')
const {makeEmitTests, createTestFiles} = require('../../code-export')
const {createReport} = require('../../report')
const {sendReport} = require('../../send-report')
const {runCLI} = require('jest')
const {exec: pexec, _spawn} = require('promisify-child-process')
const {logDebug} = require('../../log')

async function doRunTests(args, sdkImplementation) {
  console.log(`Running coverage tests for ${sdkImplementation.name}...`)

  if (needsChromeDriver(args, sdkImplementation))
    await startChromeDriver(sdkImplementation.options.chromeDriverOptions)

  const supportedTests = filterTests({tests: sdkImplementation.supportedTests, args})
  const emittedTests = makeEmitTests(sdkImplementation.initialize).emitTests(supportedTests, {
    host: args.remote,
  })
  createTestFiles(emittedTests, sdkImplementation.testFrameworkTemplate)
  console.log(
    `\nCreated ${numberOfTestVariations(supportedTests)} test files for ${numberOfUniqueTests(
      supportedTests,
    )} unique tests.`,
  )
  if (sdkImplementation.execute) {
    console.log(`\nRunning them now with ${sdkImplementation.execute.command}:\n`)
    logDebug(sdkImplementation)
    await pexec(sdkImplementation.execute.command + ' ' + sdkImplementation.execute.args.join(' '))
  } else {
    console.log(`\nRunning them now with jest:\n`)
    process.env.JEST_JUNIT_OUTPUT_NAME = 'coverage-test-report.xml'
    await runCLI(
      {
        reporters: ['default', 'jest-junit'],
        testEnvironment: 'node',
        rootDir: path.resolve(path.join(process.cwd())),
        roots: ['<rootDir>/test/coverage/generic'], //, '<rootDir>/test/coverage/custom'],
        testTimeout: 180000,
      },
      [path.resolve(path.join(process.cwd()))], // also rootDir ¯\_(ツ)_/¯
    )
  }

  if (needsChromeDriver(args, sdkImplementation)) stopChromeDriver()
  console.log('Tests complete!')
}

async function processReport({sdkName, args}) {
  const results = readFileSync(path.resolve(process.cwd(), 'coverage-test-report.xml'), {
    encoding: 'utf-8',
  })
  const isSandbox = args.sendReport === 'sandbox' ? true : false
  process.stdout.write(`\nSending report to QA dashboard ${isSandbox ? '(sandbox)' : ''}... `)
  const report = createReport({sdkName, xmlResult: results, sandbox: isSandbox})
  logDebug(report)
  const result = await sendReport(report)
  process.stdout.write(result.isSuccessful ? 'Done!\n' : 'Failed!\n')
}

async function run(args) {
  const sdkImplementation = require(path.join(path.resolve('.'), args.path))
  await doRunTests(args, sdkImplementation)
  await processReport({sdkName: sdkImplementation.name, args})
}

module.exports = {
  run,
}
