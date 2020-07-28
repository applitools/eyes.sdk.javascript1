const {findUnsupportedTests, fetchCoverageTests} = require('../cli-util')

async function doHealthCheck(sdkImplementation) {
  console.log('Performing health check...\n')
  const coverageTests = await fetchCoverageTests()
  const unsupportedTests = findUnsupportedTests(sdkImplementation, coverageTests)
  if (unsupportedTests.length) {
    console.log('Unsupported tests found:')
    unsupportedTests.forEach(test => console.log(`- ${test}`))
    console.log('')
  }

  if (!unsupportedTests.length) console.log('Looks good to me.')
}

module.exports = {
  doctor: doHealthCheck,
}
