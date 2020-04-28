const path = require('path')
const {filterTests, numberOfTestVariations, numberOfUniqueTests} = require('../cli-util')
const {makeEmitTests, createTestFiles} = require('../../code-export')

async function createTests(args) {
  const sdkImplementation = require(path.join(path.resolve('.'), args.path))
  console.log(`Creating coverage tests for ${sdkImplementation.name}...`)

  const supportedTests = filterTests({tests: sdkImplementation.supportedTests, args})
  const emittedTests = makeEmitTests(sdkImplementation.initialize).emitTests(supportedTests, {
    host: args.remote,
  })
  await createTestFiles(emittedTests, sdkImplementation.testFrameworkTemplate)
  console.log(
    `\nCreated ${numberOfTestVariations(supportedTests)} test files for ${numberOfUniqueTests(
      supportedTests,
    )} unique tests.`,
  )
}

module.exports = {createTests}
