#!/usr/bin/env node
const yargs = require('yargs')
const chalk = require('chalk')
const {createTests, processReport, doctor} = require('./cli/commands')

const cliName = 'SAT - SDK Agnostic Test-framework'
yargs
  .usage(cliName)
  .usage('\nUsage: coverage-tests run <options>')
  .command('doctor', 'health check an SDK implementation')
  .command('process-report', 'process & send XML result file to QA dashboard')
  .command('create-tests', 'create test files for a given SDK implementation')
  .option('path', {
    alias: 'p',
    describe: 'path to implementation file',
    default: 'test/coverage/index.js',
  })
  .option('all', {
    alias: 'a',
    describe: 'run all of the tests and ignore filtering',
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
  .option('sendReport', {
    alias: 's',
    describe: 'send a result report to the sandbox QA dashboard',
    default: 'sandbox',
  })
  .option('verbose', {
    alias: 'v',
    describe: 'log debug output',
  })
  .option('concurrency', {
    alias: 'c',
    describe: 'number of parallel executions to run at once',
    default: 15,
  })
  .option('reportId', {
    alias: 'id',
    describe: 'Id of the report which will be displayed at the dashboard',
  })
  .option('coverage-tests-local-path', {
    describe: 'path in file system of tests.js file, instead of fetching it remotely',
  })
  .demandCommand(1, 'You need to specify a command before moving on')
;(async () => {
  try {
    const args = yargs.argv
    console.log(cliName)
    if (args.verbose) process.env.COVERAGE_TESTS_DEBUG = true
    const command = args._[0]
    if (command === 'doctor' && args.path) {
      doctor(args)
    } else if (command === 'create-tests' && args.path) {
      if (!process.env.APPLITOOLS_API_KEY_SDK) {
        console.log('\n')
        console.log(chalk.yellow(`You're running without APPLITOOLS_API_KEY_SDK set!`))
        console.log(chalk.yellow(`To test with the correct baselines, be sure to set it.`))
        console.log('\n')
      }
      await createTests(args)
    } else if (command === 'process-report') {
      await processReport(args)
    } else {
      console.log('Nothing to run.')
      process.exit(1)
    }
  } catch (error) {
    console.log(error)
    console.log(chalk.red(error.message))
    process.exit(1)
  }
})()
