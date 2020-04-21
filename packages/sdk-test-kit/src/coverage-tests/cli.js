#!/usr/bin/env node
const yargs = require('yargs')
const path = require('path')
const {sendReport} = require('./send-report')
const {exec} = require('child_process')
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
const {exec: pexec, _spawn} = require('promisify-child-process')
const {readFileSync} = require('fs')
const {createReport} = require('./report')

const cliName = 'SAT - SDK Agnostic Test-framework'
yargs
  .usage(cliName)
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
  console.log(cliName)
  if (!process.env.APPLITOOLS_API_KEY_SDK) {
    console.log('\n')
    console.log(chalk.yellow(`You're running without APPLITOOLS_API_KEY_SDK set!`))
    console.log(chalk.yellow(`To test with the correct baselines, be sure to set it.`))
    console.log('\n')
  }
  const command = args._[0]
  if (command === 'nuke') {
    doKaboom()
    doExitCode(0)
  } else if (command === 'doctor' && args.path) {
    const sdkImplementation = require(path.join(path.resolve('.'), args.path))
    doHealthCheck(sdkImplementation)
  } else if (command === 'run' && args.path) {
    try {
      const sdkImplementation = require(path.join(path.resolve('.'), args.path))
      await doRunTests(args, sdkImplementation)
    } catch (error) {
      console.log(chalk.red(error.message))
      return process.exit(1)
    }
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
    if (process.env.DEBUG) console.dir(sdkImplementation, {depth: null})
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

  console.log('Tests complete!')

  await processReport({sdkName: sdkImplementation.name, args})
  if (needsChromeDriver(args, sdkImplementation)) stopChromeDriver()
  doKaboom()
}

async function processReport({sdkName, args}) {
  const results = readFileSync(path.resolve(process.cwd(), 'coverage-test-report.xml'), {
    encoding: 'utf-8',
  })
  const isSandbox = args.sendReport === 'sandbox' ? true : false
  process.stdout.write(`\nSending report to QA dashboard ${isSandbox ? '(sandbox)' : ''}... `)
  const report = createReport({sdkName, xmlResult: results, sandbox: isSandbox})
  if (process.env.DEBUG) console.dir(report, {depth: null})
  const result = await sendReport(report)
  process.stdout.write(result.isSuccessful ? 'Done!\n' : 'Failed!\n')
}

async function startChromeDriver(options = []) {
  const returnPromise = true
  return await chromedriver.start(options, returnPromise).catch(console.error)
}

async function stopChromeDriver() {
  chromedriver.stop()
}
