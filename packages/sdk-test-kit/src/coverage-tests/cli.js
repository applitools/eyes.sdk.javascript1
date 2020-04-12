#!/usr/bin/env node
const yargs = require('yargs')
const path = require('path')
const {sendReport} = require('./send-report')
const {exec} = require('child_process')
const {version} = require('../../package.json')
const chromedriver = require('chromedriver')
const {
  findUnsupportedTests,
  findUnimplementedCommands,
  filterTests,
  numberOfUniqueTests,
  numberOfTestVariations,
} = require('./cli-util')
const os = require('os')
const chalk = require('chalk')
const {makeEmitTests, createTestFiles} = require('./code-export')
const {runCLI} = require('jest')
//const {exec} = require('child_process')
//const {promisify} = require('util')
//const pexec = promisify(exec)

yargs
  .usage(`Coverage Tests DSL (v${version})`)
  .usage('a.k.a. Da Schwartz Lang - accept no substitutes')
  .usage('\nUsage: coverage-tests run <options>')
  .command('run', 'run coverage tests for a given SDK')
  .command('doctor', 'health check an implementation')
  .command('nuke', 'kill all ghost browser processes (POSIX only)')
  .option('path', {
    alias: 'p',
    describe: 'path to implementation file',
    default: 'test/coverage/index.js',
  })
  .option('filterName', {
    alias: 'fn',
    describe: 'filter which tests are run by name',
  })
  .option('filterMode', {
    alias: 'fm',
    describe: 'filter which tests are run by execution mode',
  })
  .option('filterIndexes', {
    alias: 'fi',
    describe: 'filter which tests are run by providing a comma-separated list of indexes',
  })
  .option('remote', {
    alias: 'r',
    describe: 'url of where to run the tests',
  })
  .option('concurrency', {
    alias: 'c',
    describe: 'number of parallel sessions to run at one time',
  })
  .option('sendReport', {
    alias: 's',
    describe: 'send a result report to the sandbox QA dashboard',
    default: 'sandbox',
  })
  .option('verbose', {
    alias: 'v',
    describe: 'enable verbose output (e.g., show stack traces from errors)',
  })
  .demandCommand(1, 'You need to specify a command before moving on')

async function run(args) {
  console.log(`Coverage Tests DSL (v${version})`)
  console.log('a.k.a. Da Schwartz Lang - accept no substitutes\n')
  if (!process.env.APPLITOOLS_API_KEY_SDK) {
    console.log(chalk.yellow(`You're running without APPLITOOLS_API_KEY_SDK set!`))
    console.log(chalk.yellow(`To test with the correct baselines, be sure to set it.`))
  }
  const command = args._[0]
  if (command === 'nuke') {
    doKaboom()
    doExitCode(0)
  } else if (command === 'doctor' && args.path) {
    const sdkImplementation = require(path.join(path.resolve('.'), args.path))
    doHealthCheck(sdkImplementation)
  } else if (command === 'run' && args.path) {
    const sdkImplementation = require(path.join(path.resolve('.'), args.path))
    doRunTests(args, sdkImplementation)
    //} else if (command === 'run' && args.path) {
    //  const sdkImplementation = require(path.join(path.resolve('.'), args.path))
    //  const report = await doRunTests(args, sdkImplementation)
    //  const sendReportResponse = await doSendReport(args, report)
    //  doDisplayResults({args, report, sendReportResponse, tests: sdkImplementation.supportedTests})
    //  doExitCode(report.errors)
  } else {
    console.log('Nothing to run.')
    doExitCode(1)
  }
}

run(yargs.argv)

function needsChromeDriver(args, sdkImplementation) {
  return !args.remote && sdkImplementation.options && sdkImplementation.options.needsChromeDriver
}

function doExitCode(errors) {
  const exitCode = Object.keys(errors).length ? 1 : 0
  console.log(`Exited with code ${exitCode}`)
  process.exit(exitCode)
}

function doHealthCheck(sdkImplementation) {
  console.log('Performing health check...\n')
  const unsupportedTests = findUnsupportedTests(sdkImplementation)
  const unimplementedCommands = findUnimplementedCommands(sdkImplementation)
  if (unsupportedTests.length) {
    console.log('Unsupported tests found:')
    unsupportedTests.forEach(test => console.log(`- ${test}`))
    console.log('')
  }

  if (unimplementedCommands.length) {
    console.log('Unimplemented commands found:')
    unimplementedCommands.forEach(command => console.log(`- ${command}`))
    console.log('')
  }

  if (!unsupportedTests.length && !unimplementedCommands.length) console.log('Looks good to me.')
}

function doKaboom() {
  if (/win[32|64]/.test(os.platform())) return
  process.stdout.write('\nCleaning up rogue processes... ')
  exec(`ps ax | grep Chrome | grep headless | awk '{print $1}' | xargs kill -9`)
  exec(`ps ax | grep chromedriver | awk '{print $1}' | xargs kill -9`)
  console.log('Done!')
}

async function doRunTests(args, sdkImplementation) {
  console.log(`Running coverage tests for ${sdkImplementation.name} (v2!)...\n`)

  if (needsChromeDriver(args, sdkImplementation))
    await startChromeDriver(sdkImplementation.options.chromeDriverOptions)

  const supportedTests = filterTests({tests: sdkImplementation.supportedTests, args})
  console.log(
    `Creating ${numberOfTestVariations(supportedTests)} test files for ${numberOfUniqueTests(
      supportedTests,
    )} unique tests.`,
  )
  const start = new Date()
  const emittedTests = makeEmitTests(sdkImplementation.initialize).emitTests(supportedTests, {
    host: args.remote,
  })
  createTestFiles(emittedTests)
  const end = new Date()
  console.log(`\nTest files created ${end - start}ms.`)

  // run
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

  if (needsChromeDriver(args, sdkImplementation)) stopChromeDriver()
  //doKaboom()
}

async function doSendReport(args, report) {
  if (args.sendReport) {
    process.stdout.write('\nSending report to QA dashboard... ')
    const isSandbox = args.sendReport !== 'sandbox' ? false : true
    const _report = report.toSendReportSchema()
    _report.sandbox = isSandbox
    const result = await sendReport(_report)
    process.stdout.write(result.isSuccessful ? 'Done!\n' : 'Failed!\n')
    return result
  }
}

async function startChromeDriver(options = []) {
  const returnPromise = true
  return await chromedriver.start(options, returnPromise).catch(console.error)
}

async function stopChromeDriver() {
  chromedriver.stop()
}
