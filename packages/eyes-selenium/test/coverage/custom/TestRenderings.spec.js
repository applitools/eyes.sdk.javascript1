'use strict'
const {Eyes, Target, VisualGridRunner, Configuration, DeviceName} = require('../../../index')
const {getDriver, getBatch} = require('./util/TestSetup')
const batch = getBatch()

describe('TestRenderings', async () => {
  let webDriver, eyes, runner

  beforeEach(async () => {
    webDriver = await getDriver('CHROME')
    runner = new VisualGridRunner(30)
    eyes = new Eyes(runner)
    eyes.setBranchName('master')
  })
  afterEach(async () => {
    await webDriver.quit()
    await eyes.abortIfNotClosed()
  })

  it('TestMobileOnly', async () => {
    let conf = new Configuration()
    conf.setTestName('Mobile Render Test')
    conf.setAppName('Visual Grid Render Test')
    conf.setBatch(batch)
    conf.addDeviceEmulation(DeviceName.Galaxy_S5)
    eyes.setConfiguration(conf)
    await eyes.open(webDriver)
    await webDriver.get('https://applitools.github.io/demo/TestPages/DynamicResolution/mobile.html')
    await eyes.check('Test Mobile Only', Target.window().fully())
    await eyes.close()
    await runner.getAllTestResults()
  })
})
