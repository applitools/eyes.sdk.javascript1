'use strict'
const cwd = process.cwd()
const assert = require('assert')
const path = require('path')
const {getEyes, Browsers} = require('../util/TestSetup')
const spec = require(path.resolve(cwd, 'src/SpecWrappedDriver'))
const {Target} = require(cwd)

describe('TestCounts', () => {
  let driver, eyes, runner
  beforeEach(async () => {
    driver = await spec.build({capabilities: Browsers.chrome()})
    await spec.visit(driver, 'https://applitools.com/helloworld')
    eyes = await getEyes({isVisualGrid: true})
    runner = eyes.getRunner()
    await eyes.setSendDom(false)
  })

  it('Test_VGTestsCount_1', async () => {
    await eyes.open(driver, 'Test Count', 'Test_VGTestsCount_1')
    await eyes.check('Test', Target.window())
    await eyes.close()
    let results = await runner.getAllTestResults()
    assert.deepStrictEqual(1, results.getAllResults().length)
  })

  it('Test_VGTestsCount_2', async () => {
    let conf = eyes.getConfiguration()
    conf.addBrowser(900, 600)
    conf.addBrowser(1024, 768)
    eyes.setConfiguration(conf)
    await eyes.open(driver, 'Test Count', 'Test_VGTestsCount_2')
    await eyes.check('Test', Target.window())
    await eyes.close()
    let results = await runner.getAllTestResults()
    assert.deepStrictEqual(2, results.getAllResults().length)
  })

  it('Test_VGTestsCount_3', async () => {
    let conf = eyes.getConfiguration()
    conf.addBrowser(900, 600)
    conf.addBrowser(1024, 768)
    conf.setAppName('Test Count')
    conf.setTestName('Test_VGTestsCount_3')
    eyes.setConfiguration(conf)
    await eyes.open(driver)
    await eyes.check('Test', Target.window())
    await eyes.close()
    let results = await runner.getAllTestResults()
    assert.deepStrictEqual(2, results.getAllResults().length)
  })

  it('Test_VGTestsCount_4', async () => {
    let conf = eyes.getConfiguration()
    conf.setAppName('Test Count')
    conf.setTestName('Test_VGTestsCount_4')
    eyes.setConfiguration(conf)
    await eyes.open(driver)
    await eyes.check('Test', Target.window())
    await eyes.close()
    let results = await runner.getAllTestResults()
    assert.deepStrictEqual(1, results.getAllResults().length)
  })

  it('Test_VGTestsCount_5', async () => {
    let conf = eyes.getConfiguration()
    conf.addBrowser(900, 600)
    conf.addBrowser(1024, 768)
    eyes.setConfiguration(conf)
    await eyes.open(driver, 'Test Count', 'Test_VGTestsCount_5', {width: 640, height: 480})
    await eyes.check('Test', Target.window())
    await eyes.close()
    let results = await runner.getAllTestResults()
    assert.deepStrictEqual(2, results.getAllResults().length)
  })

  afterEach(async () => {
    await spec.cleanup(driver)
    await eyes.abortIfNotClosed()
  })
})
