const assert = require('assert')

const supportedCommands = [
  'abort',
  'checkFrame',
  'checkRegion',
  'checkWindow',
  'close',
  'open',
  'scrollDown',
  'switchToFrame',
  'getAllTestResults',
  'type',
  'visit',
]

function makeCustomCoverageTests({
  checkFrame,
  checkRegion,
  checkWindow,
  close,
  open,
  getAllTestResults,
  visit,
} = {}) {
  const viewportSize = '700x460'

  return {
    TestGetAllResults_ThrowException: async () => {
      await visit('https://applitools.github.io/demo/TestPages/RandomizePage?randomize')
      await open({appName: 'Eyes Selenium SDK - Runners', viewportSize})
      await checkWindow()
      await close(false)
      try {
        await getAllTestResults(true)
      } catch (err) {
        return assert.strictEqual(err.constructor.name, 'DiffsFoundError')
      }
      assert.fail()
    },
    TestGetAllResults_IgnoreException: async () => {
      await visit('https://applitools.github.io/demo/TestPages/RandomizePage?randomize')
      await open({appName: 'Eyes Selenium SDK - Runners', viewportSize})
      await checkWindow()
      await close(false)
      try {
        await getAllTestResults(false)
      } catch (err) {
        assert.fail()
      }
    },
    TestGetAllResults_AwaitCloseTransaction: async () => {
      await visit('https://applitools.github.io/demo/TestPages/RandomizePage')
      await open({appName: 'Eyes Selenium SDK - Runners', viewportSize})
      await checkWindow()
      close(false)
      const results = await getAllTestResults(false)
      assert.strictEqual(results.length, 1)
    },
  }
}

module.exports = {
  supportedCommands,
  makeCustomCoverageTests,
}
