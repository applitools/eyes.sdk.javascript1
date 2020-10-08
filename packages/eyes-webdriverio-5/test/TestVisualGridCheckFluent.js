'use strict'

const chromedriver = require('chromedriver')
const {remote} = require('webdriverio')
const {By, Eyes, Target, VisualGridRunner, BrowserType, Configuration} = require('../index')
const Common = require('./Common')

let browser, /** @type {Eyes} */ eyes
describe('VisualGridCheckFluent', function() {
  this.timeout(5 * 60 * 1000)

  before(async function() {
    await chromedriver.start(undefined, true)

    const chrome = Common.CHROME
    browser = await remote({...chrome, port: 9515, path: '/', logLevel: 'error'})

    await browser.url('http://applitools.github.io/demo/TestPages/FramesTestPage/')
  })

  beforeEach(async function() {
    eyes = new Eyes(new VisualGridRunner(3))
    // eyes.setLogHandler(new ConsoleLogHandler(false));
    // eyes.setProxy('http://localhost:8000');
    const configuration = new Configuration()
    configuration.setAppName(this.test.parent.title)
    configuration.setTestName(this.currentTest.title)
    configuration.addBrowser(1200, 800, BrowserType.CHROME)
    configuration.addBrowser(1200, 800, BrowserType.FIREFOX)
    configuration.setApiKey(process.env.APPLITOOLS_API_KEY)
    eyes.setConfiguration(configuration)
    browser = await eyes.open(browser)
  })

  afterEach(async function() {
    return eyes.abortIfNotClosed()
  })

  after(async () => {
    await browser.deleteSession()
    chromedriver.stop()
  })

  it('TestCheckWindow', async function() {
    await eyes.check('Window', Target.window())
    return eyes.close()
  })

  it('TestCheckRegionFully', async function() {
    await eyes.check('Region Fully', Target.region(By.id('overflowing-div-image')).fully())
    return eyes.close()
  })
})
