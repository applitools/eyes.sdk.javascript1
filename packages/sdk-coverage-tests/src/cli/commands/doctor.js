const {findUnsupportedTests, findUnimplementedCommands} = require('../cli-util')

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

module.exports = {
  doctor: doHealthCheck,
}
