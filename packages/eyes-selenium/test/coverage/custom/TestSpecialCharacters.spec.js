'use strict'
const {getDriver, getEyes, getBatch} = require('./util/TestSetup')
const {Target, Configuration, BrowserType} = require('../../../index')
const appName = 'Eyes Selenium SDK - Special Characters Test'
const batch = getBatch()
describe(appName, () => {
  let webDriver, eyes, runner
  beforeEach(async () => {
    webDriver = await getDriver('CHROME')
    ;({eyes, runner} = await getEyes('VG'))
  })
  afterEach(async () => {
    await eyes.abortIfNotClosed()
    await webDriver.quit()
  })

  it.skip('TestRenderSpecialCharacters', async () => {
    let conf = new Configuration()
    conf.setTestName('Special Characters')
    conf.setAppName(appName)
    conf.addBrowser(800, 600, BrowserType.CHROME)
    conf.setBatch(batch)
    eyes.setConfiguration(conf)
    if (process.env['APPLITOOLS_API_KEY_SDK']) {
      conf.setApiKey(process.env['APPLITOOLS_API_KEY_SDK'])
    }
    await eyes.open(webDriver)
    await webDriver.get('https://applitools.github.io/demo/TestPages/SpecialCharacters/index.html')
    await eyes.check('Test Special Characters', Target.window().fully())
    await eyes.close()
    await runner.getAllTestResults()
  })
})
