'use strict'
const {Eyes, Target, VisualGridRunner, Configuration, DeviceName} = require('../../../index')
const {getDriver, getBatch} = require('./util/TestSetup')
const batch = getBatch()

describe('TestRenderings', async () => {
  let browser, eyes, runner

  beforeEach(async () => {
    browser = await getDriver('CHROME')
    runner = new VisualGridRunner(30)
    eyes = new Eyes(runner)
    eyes.setBranchName('master')
  })
  afterEach(async () => {
    await browser.deleteSession()
    await eyes.abortIfNotClosed()
  })

  it('TestMobileOnly', async () => {
    let conf = new Configuration()
    conf.setTestName('Mobile Render Test')
    conf.setAppName('Visual Grid Render Test')
    conf.setBatch(batch)
    conf.addDeviceEmulation(DeviceName.Galaxy_S5)
    eyes.setConfiguration(conf)
    await eyes.open(browser)
    await browser.url('https://applitools.github.io/demo/TestPages/DynamicResolution/mobile.html')
    await eyes.check('Test Mobile Only', Target.window().fully())
    await eyes.close()
    await runner.getAllTestResults()
  })
})
