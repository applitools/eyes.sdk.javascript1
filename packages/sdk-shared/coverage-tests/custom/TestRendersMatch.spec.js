'use strict'
const assert = require('assert')
const path = require('path')
const cwd = process.cwd()
const {batch} = require('../../src/test-setup')
const spec = require(path.resolve(cwd, 'src/spec-driver'))
const {Configuration, Eyes, VisualGridRunner, RectangleSize, Target} = require(cwd)

const appName = 'TestRendersMatch'
let viewportList = [
  new RectangleSize(800, 600),
  new RectangleSize(700, 500),
  new RectangleSize(1200, 800),
  new RectangleSize(1600, 1200),
]

describe(appName, async () => {
  it('TestSuccess', async () => {
    const runner = new VisualGridRunner(10)

    const [driver, destroyDriver] = await spec.build({browser: 'chrome'})
    await spec.visit(driver, 'https://applitools.com/helloworld')
    let eyes
    try {
      for (const viewport of viewportList) {
        eyes = await initEyes(undefined, driver, viewport, 'TestSuccess')
        await eyes.check('check', Target.window().fully())
        await eyes.closeAsync()

        eyes = await initEyes(runner, driver, viewport, 'TestSuccess')
        await eyes.check('check', Target.window().fully())
        await eyes.closeAsync()
      }
      const results = await runner.getAllTestResults()
      assert.deepStrictEqual(results.getAllResults().length, 4)
    } finally {
      await destroyDriver()
      await eyes.abortIfNotClosed()
    }
  })

  it.skip('TestFailure', async () => {
    const runner = new VisualGridRunner(10)

    const [driver, destroyDriver] = await spec.build({browser: 'chrome'})
    await spec.visit(driver, 'https://applitools.com/helloworld')
    let eyes
    try {
      let resultsTotal = 0
      for (const viewport of viewportList) {
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
      await destroyDriver()
      await eyes.abortIfNotClosed()
    }
  })
})

async function initEyes(runner, driver, viewport, name) {
  const eyes = new Eyes(runner)
  const conf = new Configuration()
  conf.setBatch(batch)
  conf.setViewportSize(viewport)
  conf.setTestName(name)
  conf.setAppName(appName)
  eyes.setConfiguration(conf)
  eyes.setBranchName('master')
  if (process.env['APPLITOOLS_API_KEY_SDK']) {
    eyes.setApiKey(process.env['APPLITOOLS_API_KEY_SDK'])
  }
  await eyes.open(driver)
  return eyes
}
