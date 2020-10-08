'use strict'
const assert = require('assert')
const {
  Configuration,
  Target,
  ClassicRunner,
  VisualGridRunner,
  Eyes,
  BatchInfo,
  MatchLevel,
} = require('../../../index')
const {getDriver} = require('./util/TestSetup')
const {getApiData} = require('./util/ApiAssertions')
describe.skip('TestEyesConfiguration', async () => {
  let testCases = []
  testCase(false, 'Test sequence', 'Test Sequence Name Env Var')
  testCase(false, 'Test sequence', undefined)
  testCase(false, undefined, 'Test Sequence Name Env Var')
  testCase(false, undefined, undefined)
  testCase(true, 'Test sequence', 'Test Sequence Name Env Var')
  testCase(true, 'Test sequence', undefined)
  testCase(true, undefined, 'Test Sequence Name Env Var')
  testCase(true, undefined, undefined)

  testCases.forEach((data, index) => {
    it(`TestEyesConfiguration_${index}`, async () => {
      let runner = data.useVisualGrid ? new VisualGridRunner(10) : new ClassicRunner()
      let eyes = new Eyes(runner)
      let browser = await getDriver('CHROME')
      await browser.url('https://applitools.github.io/demo/TestPages/FramesTestPage/')
      let originalBatchSequence = process.env.APPLITOOLS_BATCH_SEQUENCE
      if (data.sequenceNameEnvVar !== undefined) {
        process.env.APPLITOOLS_BATCH_SEQUENCE = data.sequenceNameEnvVar
      }
      let batchInfo = new BatchInfo()
      let effectiveSequenceName = data.sequenceName ? data.sequenceName : data.sequenceNameEnvVar

      if (data.sequenceName !== undefined) {
        batchInfo.setSequenceName(data.sequenceName)
      }

      if (data.sequenceNameEnvVar !== undefined) {
        if (originalBatchSequence === undefined) {
          delete process.env.APPLITOOLS_BATCH_SEQUENCE
        } else {
          process.env.APPLITOOLS_BATCH_SEQUENCE = originalBatchSequence
        }
      }

      try {
        assert.deepStrictEqual(effectiveSequenceName, batchInfo.getSequenceName(), 'SequenceName')
        let conf = new Configuration()
        let testName = `Test - ${data.useVisualGrid ? 'Visual Grid' : 'Selenium'}`
        conf
          .setAppName('app')
          .setTestName(testName)
          .setHostApp('someHostApp')
          .setHostOS('someHostOS')
          .setEnvironmentName('env name')
          .setBatch(batchInfo)
        eyes.setConfiguration(conf)

        await eyes.open(browser)

        eyes.setMatchLevel(MatchLevel.Layout)
        await eyes.check('', Target.window())

        eyes.setMatchLevel(MatchLevel.Content)
        await eyes.check('', Target.window())
      } finally {
        await browser.deleteSession()
      }
      let results = await eyes.close(false)
      if (data.useVisualGrid) {
        results = results[0]
      }
      let sessionResults = await getApiData(results)
      assert.ok(sessionResults, 'SessionResults')

      assert.deepStrictEqual(sessionResults.env.os, 'someHostOS', 'OS')
      assert.deepStrictEqual(sessionResults.env.hostingApp, 'someHostApp', 'Hosting App')

      assert.deepStrictEqual(
        sessionResults.startInfo.batchInfo.sequenceName,
        batchInfo.sequenceName,
        'Sequence Name',
      )

      assert.ok(sessionResults.actualAppOutput, 'Actual App Output')
      assert.deepStrictEqual(sessionResults.actualAppOutput.length, 2, 'Actual App Output')
      assert.deepStrictEqual(
        sessionResults.actualAppOutput[0].imageMatchSettings.MatchLevel,
        MatchLevel.Layout2,
        'Actual App Output (Layout)',
      )
      assert.deepStrictEqual(
        sessionResults.actualAppOutput[1].imageMatchSettings.MatchLevel,
        MatchLevel.Content,
        'Actual App Output (Content)',
      )

      await eyes.abort()
    })
  })

  function testCase(useVisualGrid, sequenceName, sequenceNameEnvVar) {
    testCases.push({
      useVisualGrid: useVisualGrid,
      sequenceName: sequenceName,
      sequenceNameEnvVar: sequenceNameEnvVar,
    })
  }
})
