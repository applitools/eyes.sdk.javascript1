'use strict'
const assert = require('assert')
const {getDriver, getBatch} = require('./util/TestSetup')
const {Configuration, Eyes, VisualGridRunner, RectangleSize, Target} = require('../../../index')
const appName = 'TestRendersMatch'
let viewportList = [
  new RectangleSize(800, 600),
  new RectangleSize(700, 500),
  new RectangleSize(1200, 800),
  new RectangleSize(1600, 1200),
]
describe(appName, async () => {
  it('TestSuccess', async () => {
    let runner = new VisualGridRunner(10)

    let driver = await getDriver('CHROME')
    await driver.get('https://applitools.com/helloworld')
    let eyes
    try {
      for (let viewport of viewportList) {
        eyes = await initEyes(undefined, driver, viewport, 'TestSuccess')
        await eyes.check('check', Target.window().fully())
        await eyes.closeAsync()

        eyes = await initEyes(runner, driver, viewport, 'TestSuccess')
        await eyes.check('check', Target.window().fully())
        await eyes.closeAsync()
      }
      let results = await runner.getAllTestResults()
      assert.deepStrictEqual(results.getAllResults().length, 4)
    } finally {
      await driver.quit()
      await eyes.abortIfNotClosed()
    }
  })

  it.skip('TestFailure', async () => {
    let runner = new VisualGridRunner(10)

    let driver = await getDriver('CHROME')
    await driver.get('https://applitools.com/helloworld')
    let eyes
    try {
      let resultsTotal = 0
      for (let viewport of viewportList) {
        eyes = await initEyes(undefined, driver, viewport, 'TestFailure')
        await eyes.check('check', Target.window().fully())
        await eyes.close()

        eyes = await initEyes(runner, driver, viewport, 'TestFailure')
        await eyes.check('check', Target.window().fully())
        await eyes.close()
        let results = await runner.getAllTestResults()
        resultsTotal += results.getAllResults().length
      }
      assert.deepStrictEqual(resultsTotal, 4)
    } finally {
      await driver.quit()
      await eyes.abortIfNotClosed()
    }
  })
})

async function initEyes(runner, driver, viewport, name) {
  let eyes = new Eyes(runner)
  let conf = new Configuration()
  conf.setBatch(getBatch())
  conf.setViewportSize(viewport)
  conf.setTestName(name)
  conf.setAppName(appName)
  eyes.setConfiguration(conf)
  eyes.setBranchName('master')
  await eyes.open(driver)
  return eyes
}
