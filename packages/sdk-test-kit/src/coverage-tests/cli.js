#!/usr/bin/env node
const yargs = require('yargs')
const chalk = require('chalk')
const {run, doctor, nuke} = require('./cli/commands')

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
  .option('sendReport', {
    alias: 's',
    describe: 'send a result report to the sandbox QA dashboard',
    default: 'sandbox',
  })
  .option('verbose', {
    alias: 'r',
    describe: 'log debug output',
  })
  .demandCommand(1, 'You need to specify a command before moving on')
;(async () => {
  try {
    const args = yargs.argv
    console.log(cliName)
    if (!process.env.APPLITOOLS_API_KEY_SDK) {
      console.log('\n')
      console.log(chalk.yellow(`You're running without APPLITOOLS_API_KEY_SDK set!`))
      console.log(chalk.yellow(`To test with the correct baselines, be sure to set it.`))
      console.log('\n')
    }
    if (args.verbose) process.env.DEBUG = true
    const command = args._[0]
    if (command === 'nuke') {
      nuke()
    } else if (command === 'doctor' && args.path) {
      doctor(args)
    } else if (command === 'run' && args.path) {
      nuke()
      await run(args)
    } else {
      console.log('Nothing to run.')
      process.exit(1)
    }
  } catch (error) {
    console.log(chalk.red(error.message))
    process.exit(1)
  }
})()
