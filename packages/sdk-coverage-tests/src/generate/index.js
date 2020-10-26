const path = require('path')
const chalk = require('chalk')
const {prepareTests} = require('./prepare')
const {emitTests} = require('./emit')
const {createTestFiles, createTestMetaData} = require('./save')

const DEFAULT_CONFIG = {
  testsPath:
    'https://raw.githubusercontent.com/applitools/sdk.coverage.tests/master/coverage-tests.js',
}

async function generate({configPath, ...options}) {
  try {
    const config = {
      ...DEFAULT_CONFIG,
      ...require(path.join(path.resolve('.'), configPath)),
      ...options,
    }
    console.log(`Creating coverage tests for ${config.name}...\n`)

    const {tests, testsConfig} = await prepareTests(config)

    const emittedTests = emitTests(tests, {...testsConfig, ...config})
    await createTestFiles(emittedTests, config)
    await createTestMetaData(emittedTests, config)
    console.log(
      `Created ${emittedTests.length} (${
        emittedTests.filter(t => !t.skip).length
      } enabled) test files for ${Object.keys(tests).length} unique tests.`,
    )
  } catch (err) {
    console.log(chalk.red(err.stack))
    process.exit(1)
  }
}

module.exports = generate
