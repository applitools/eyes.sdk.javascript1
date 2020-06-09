'use strict'

require('chromedriver')
const {expect} = require('chai')
const {By} = require('selenium-webdriver')
const {getDriver} = require('../coverage/custom/util/TestSetup')
const {
  Eyes,
  VisualGridRunner,
  Target,
  Configuration,
  BrowserType,
  ConsoleLogHandler,
  Region,
} = require('../../index')

let /** @type {WebDriver} */ driver, /** @type {Eyes} */ eyes
describe('VisualGridCheckFluent', () => {
  before(async () => {
    driver = await getDriver('CHROME')
    eyes = new Eyes(new VisualGridRunner())
    eyes.setLogHandler(new ConsoleLogHandler(false))
    await driver.get('http://applitools.github.io/demo/TestPages/FramesTestPage/')
  })

  beforeEach(async function() {
    const configuration = new Configuration()
    configuration.setAppName(this.test.parent.title)
    configuration.setTestName(this.currentTest.title)
    configuration.addBrowser(1200, 800, BrowserType.CHROME)
    configuration.addBrowser(1200, 800, BrowserType.FIREFOX)
    eyes.setConfiguration(configuration)

    driver = await eyes.open(driver)
  })

  it('TestCheckWindow', async () => {
    await eyes.check('Window', Target.window())
    return eyes.close()
  })

  it('TestCheckWindowFully', async () => {
    await eyes.check('Full Window', Target.window().fully())
    return eyes.close()
  })

  it('TestCheckRegion', async () => {
    await eyes.check(
      'Region by selector',
      Target.region(By.id('overflowing-div')).ignoreRegions(new Region(50, 50, 100, 100)),
    )
    return eyes.close()
  })

  it('TestCheckRegionFully', async () => {
    await eyes.check('Region Fully', Target.region(By.id('overflowing-div-image')).fully())
    return eyes.close()
  })

  // TODO: review why these are commented out
  // it('TestCheckFrame', async function () {
  //   await eyes.check('Frame', Target.frame('frame1'));
  //   return eyes.close();
  // });

  // it('TestCheckFrameFully', async function () {
  //   await eyes.check('Full Frame', Target.frame('frame1').fully());
  //   return eyes.close();
  // });

  // it('TestCheckRegionInFrame', async function () {
  //   await eyes.check('Region in Frame', Target.frame('frame1').region(By.id('inner-frame-div')).fully());
  //   return eyes.close();
  // });

  afterEach(async () => eyes.abort())

  after(() => driver.quit())
})

describe('Multi version browsers in Visual Grid', () => {
  before(async () => {
    driver = await getDriver('CHROME')
  })

  beforeEach(async function() {
    eyes = new Eyes(new VisualGridRunner())
    eyes.setLogHandler(new ConsoleLogHandler(false))
    const configuration = eyes.getConfiguration()
    configuration.setAppName(this.test.parent.title)
    configuration.setTestName(this.currentTest.title)
    configuration.setProxy(process.env.APPLITOOLS_PROXY)
    eyes.setConfiguration(configuration)
  })

  it('chrome, firefox, safari', async () => {
    const configuration = eyes.getConfiguration()
    const browsers = [
      {width: 640, height: 480, name: BrowserType.CHROME_TWO_VERSIONS_BACK},
      {width: 640, height: 480, name: BrowserType.FIREFOX_TWO_VERSIONS_BACK},
      {width: 640, height: 480, name: BrowserType.SAFARI_TWO_VERSIONS_BACK},
      {width: 640, height: 480, name: BrowserType.EDGE_CHROMIUM_ONE_VERSION_BACK},
    ]
    configuration.addBrowsers.apply(configuration, browsers)
    eyes.setConfiguration(configuration)
    await driver.get('http://applitools.github.io/demo/TestPages/FramesTestPage/')
    driver = await eyes.open(driver)
    await eyes.check('Window', Target.window())
    await eyes.closeAsync()
    const results = await eyes.getRunner().getAllTestResults()
    expect(results._passed).to.equal(browsers.length)
  })
})
