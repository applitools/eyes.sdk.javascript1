#!/usr/bin/env node

const yargs = require('yargs')
const generate = require('./generate')
const report = require('./report')

const cliName = 'SAT - SDK Agnostic Test-framework'

const cli = yargs
  .usage(cliName)
  .command({
    command: 'generate [config-path]',
    description: 'create test files for a given SDK configuration',
    builder: yargs =>
      yargs.options({
        configPath: {
          description: 'path to the sdk configuration .js file',
          type: 'string',
          default: './test/coverage/index.js',
        },
        testsPath: {
          alias: 't',
          description: 'path to the tests file (local or remote)',
          type: 'string',
        },
        outPath: {
          alias: 'o',
          description: 'path to save generated files',
          type: 'string',
        },
        metaPath: {
          description: 'path to save metadata file',
          type: 'string',
        },
        emitSkipped: {
          description: 'whether to create tests that are marked as skipped',
          type: 'boolean',
          default: true,
        },
        ignoreSkip: {
          description: 'ignore skip flag',
          type: 'boolean',
        },
        name: {
          alias: 'n',
          description: 'the sdk name',
          type: 'string',
        },
        ext: {
          alias: 'e',
          description: 'extension for generated files (e.g. ".spec.js")',
          type: 'string',
        },
      }),
    handler: generate,
  })
  .command({
    command: 'report [config-path]',
    description: 'send a report to QA dashboard',
    builder: yargs =>
      yargs.options({
        configPath: {
          description: 'path to the sdk configuration .js file',
          type: 'string',
          default: './test/coverage/index.js',
        },
        name: {
          alias: 'n',
          description: 'the sdk name',
          type: 'string',
        },
        metaPath: {
          description: 'path to the json metadata file generated with tests',
          type: 'string',
        },
        resultsPath: {
          description: 'path to the junit xml file',
          type: 'string',
        },
        reportId: {
          alias: 'id',
          describe: 'id of the report which will be displayed at the dashboard',
        },
        sandbox: {
          description: `don't send a result report to the sandbox QA dashboard`,
        },
      }),
    handler: report,
  })
  .demandCommand(1, 'You need to specify a command before moving on')

cli.argv
