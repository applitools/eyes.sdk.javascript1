'use strict'
const assert = require('assert')
const {getDriver, getEyes, getBatch} = require('./util/TestSetup')
const {Target, StitchMode, ClassicRunner, VisualGridRunner, Eyes} = require('../../../index')
const appName = 'Applitools Eyes SDK'
const batch = getBatch()
describe(appName, () => {
  let browser, eyes

  afterEach(async () => {
    await eyes.abortIfNotClosed()
    await browser.deleteSession()
  })
  describe('Classic', () => {
    let runner
    beforeEach(async () => {
      browser = await getDriver('CHROME')
      ;({eyes, runner} = await getEyes('classic', StitchMode.CSS))
      eyes.setBatch(batch)
    })

    it('TestDoubleOpenCheckClose', async () => {
      await browser.url('https://applitools.github.io/demo/TestPages/VisualGridTestPage/')
      await eyes.open(browser, appName, 'TestDoubleOpenCheckClose', {
        width: 1200,
        height: 800,
      })
      await eyes.check(
        'Step 1',
        Target.window()
          .fully()
          .ignoreDisplacements(false),
      )
      await eyes.close(false)

      await eyes.open(browser, appName, 'TestDoubleOpenCheckClose', {
        width: 1200,
        height: 800,
      })
      await eyes.check(
        'Step 2',
        Target.window()
          .fully()
          .ignoreDisplacements(false),
      )
      await eyes.close(false)

      let allTestResults = await runner.getAllTestResults(false)
      assert.deepStrictEqual(allTestResults.getAllResults().length, 2)
    })

    it('TestDoubleOpenCheckCloseAsync', async () => {
      await browser.url('https://applitools.github.io/demo/TestPages/VisualGridTestPage/')
      await eyes.open(browser, appName, 'TestDoubleOpenCheckCloseAsync', {
        width: 1200,
        height: 800,
      })
      await eyes.check(
        'Step 1',
        Target.window()
          .fully()
          .ignoreDisplacements(false),
      )
      await eyes.closeAsync(false)
      await eyes.open(browser, appName, 'TestDoubleOpenCheckCloseAsync', {
        width: 1200,
        height: 800,
      })
      await eyes.check(
        'Step 2',
        Target.window()
          .fully()
          .ignoreDisplacements(false),
      )
      await eyes.closeAsync(false)

      let allTestResults = await runner.getAllTestResults(false)
      assert.deepStrictEqual(allTestResults.getAllResults().length, 2)
    })
  })

  describe('VG', () => {
    let runner
    beforeEach(async () => {
      browser = await getDriver('CHROME')
      ;({eyes, runner} = await getEyes('VG'))
      eyes.setBatch(batch)
    })

    it.skip('TestDoubleOpenCheckClose', async () => {
      await browser.url('https://applitools.github.io/demo/TestPages/VisualGridTestPage/')
      await eyes.open(browser, appName, 'TestDoubleOpenCheckClose_VG', {
        width: 1200,
        height: 800,
      })
      await eyes.check(
        'Step 1',
        Target.window()
          .fully()
          .ignoreDisplacements(false),
      )
      await eyes.close(false)

      await eyes.open(browser, appName, 'TestDoubleOpenCheckClose_VG', {
        width: 1200,
        height: 800,
      })
      await eyes.check(
        'Step 2',
        Target.window()
          .fully()
          .ignoreDisplacements(false),
      )
      await eyes.close(false)

      let allTestResults = await runner.getAllTestResults(true)
      assert.deepStrictEqual(allTestResults.getAllResults().length, 2)
    })

    it('TestDoubleCheckDontGetAllResults', async () => {
      await browser.url('https://applitools.com/helloworld')
      await eyes.open(browser, appName, 'TestDoubleCheckDontGetAllResults_VG', {
        width: 1200,
        height: 800,
      })
      await eyes.check('Step 1', Target.window())
      await eyes.check('Step 2', Target.window())
      await eyes.close(false)
    })
  })
})

describe(appName, () => {
  let browser
  beforeEach(async () => {
    browser = await getDriver('CHROME')
  })
  afterEach(async () => {
    await browser.deleteSession()
  })
  it('TestDoubleOpenCheckCloseAsyncWithDifferentInstances', async () => {
    await browser.url('https://applitools.github.io/demo/TestPages/VisualGridTestPage/')
    let runner = new ClassicRunner()

    let eyes1 = await makeCheck(
      runner,
      batch,
      browser,
      appName,
      'TestDoubleOpenCheckCloseAsyncWithDifferentInstances',
      'Step 1',
    )
    await eyes1.closeAsync(false)

    let eyes2 = await makeCheck(
      runner,
      batch,
      browser,
      appName,
      'TestDoubleOpenCheckCloseAsyncWithDifferentInstances',
      'Step 1',
    )
    await eyes2.closeAsync(false)

    let allTestResults = await runner.getAllTestResults(false)
    assert.deepStrictEqual(allTestResults.getAllResults().length, 2)
  })

  it('TestDoubleOpenCheckCloseWithDifferentInstances', async () => {
    await browser.url('https://applitools.github.io/demo/TestPages/VisualGridTestPage/')
    let runner = new ClassicRunner()

    let eyes1 = await makeCheck(
      runner,
      batch,
      browser,
      appName,
      'TestDoubleOpenCheckCloseWithDifferentInstances',
      'Step 1',
    )
    await eyes1.close(false)

    let eyes2 = await makeCheck(
      runner,
      batch,
      browser,
      appName,
      'TestDoubleOpenCheckCloseWithDifferentInstances',
      'Step 1',
    )
    await eyes2.close(false)

    let allTestResults = await runner.getAllTestResults(false)
    assert.deepStrictEqual(allTestResults.getAllResults().length, 2)
  })

  it('TestDoubleOpenCheckCloseWithDifferentInstances_VG', async () => {
    await browser.url('https://applitools.github.io/demo/TestPages/VisualGridTestPage/')
    let runner = new VisualGridRunner()

    let eyes1 = await makeCheck(
      runner,
      batch,
      browser,
      appName,
      'TestDoubleOpenCheckCloseWithDifferentInstances_VG',
      'Step 1',
    )
    await eyes1.close(false)

    let eyes2 = await makeCheck(
      runner,
      batch,
      browser,
      appName,
      'TestDoubleOpenCheckCloseWithDifferentInstances_VG',
      'Step 1',
    )
    await eyes2.close(false)

    let allTestResults = await runner.getAllTestResults(false)
    assert.deepStrictEqual(allTestResults.getAllResults().length, 2)
  })

  it('TestDoubleOpenCheckCloseAsyncWithDifferentInstances_VG', async () => {
    await browser.url('https://applitools.github.io/demo/TestPages/VisualGridTestPage/')
    let runner = new VisualGridRunner()

    let eyes1 = await makeCheck(
      runner,
      batch,
      browser,
      appName,
      'TestDoubleOpenCheckCloseAsyncWithDifferentInstances_VG',
      'Step 1',
    )
    await eyes1.closeAsync(false)

    let eyes2 = await makeCheck(
      runner,
      batch,
      browser,
      appName,
      'TestDoubleOpenCheckCloseAsyncWithDifferentInstances_VG',
      'Step 1',
    )
    await eyes2.closeAsync(false)

    let allTestResults = await runner.getAllTestResults(false)
    assert.deepStrictEqual(allTestResults.getAllResults().length, 2)
  })
})

async function makeCheck(runner, batch, driver, appName, testName, checkName) {
  let eyes = new Eyes(runner)
  eyes.setBatch(batch)
  eyes.setHostOS('Linux')
  await eyes.open(driver, appName, testName, {width: 1200, height: 800})
  await eyes.check(
    checkName,
    Target.window()
      .fully()
      .ignoreDisplacements(false),
  )
  return eyes
}
