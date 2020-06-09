'use strict'
const {getDriver, getEyes} = require('./util/TestSetup')
const BrowserType = {},
  AccessibilityLevel = {},
  DeviceName = {},
  Configuration = () => {} // Unimplemented part of the API for the Selenium 3 SDK
const {MatchLevel} = require('../../../index')
const assertDefaultMatchSettings = () => {}
const assertImageMatchSettings = () => {}
const {expect} = require('chai')

describe.skip('TestVGServerConfigs', () => {
  // There is no VG runner in the current SDK
  let webDriver, eyes

  beforeEach(async () => {
    webDriver = await getDriver('CHROME')
    eyes = await getEyes('VG')
  })

  afterEach(async () => {
    await webDriver.quit()
  })

  it(`TestVGDoubleCloseNoCheck`, async () => {
    let conf = eyes.getConfiguration()
    conf.setAppName('app')
    conf.setTestName('test')
    eyes.setConfiguration(conf)

    await eyes.open(webDriver)
    await eyes.close()
    await expect(eyes.close()).to.be.rejectedWith(Error, 'IllegalState: Eyes not open')
  })

  it('TestVGChangeConfigAfterOpen', async () => {
    let conf = eyes.getConfiguration()
    conf.setAppName('app')
    conf.setTestName('js test')

    conf.addBrowser(800, 600, BrowserType.CHROME)
    conf.addBrowser(1200, 800, BrowserType.CHROME)
    conf.addDeviceEmulation(DeviceName.Galaxy_S5)
    conf.addDeviceEmulation(DeviceName.Galaxy_S3)
    conf.addDeviceEmulation(DeviceName.iPhone_4)
    conf.addDeviceEmulation(DeviceName.iPhone_5SE)
    conf.addDeviceEmulation(DeviceName.iPad)

    conf.setAccessibilityValidation(AccessibilityLevel.None).setIgnoreDisplacements(false)
    eyes.setConfiguration(conf)

    await eyes.open(webDriver)

    conf.setAccessibilityValidation(AccessibilityLevel.AAA).setIgnoreDisplacements(true)
    eyes.setConfiguration(conf)

    await eyes.checkWindow()

    conf.setAccessibilityValidation(AccessibilityLevel.AA).setMatchLevel(MatchLevel.Layout)
    eyes.setConfiguration(conf)

    await eyes.checkWindow()
    await eyes.close(false)

    let summary = await runner.getAllTestResults(false)
    let results = await summary.getAllResults()
    expect(results.length).to.be.equal(7)
    for (let container of results) {
      let result = container.getTestResults()
      await assertDefaultMatchSettings(result, {
        accessibilityLevel: AccessibilityLevel.None,
        ignoreDisplacements: false,
        matchLevel: MatchLevel.Strict,
      })
      await assertImageMatchSettings(result, {
        accessibilityLevel: AccessibilityLevel.AAA,
        ignoreDisplacements: true,
        matchLevel: MatchLevel.Strict,
      })
      await assertImageMatchSettings(
        result,
        {
          accessibilityLevel: AccessibilityLevel.AA,
          ignoreDisplacements: true,
          matchLevel: MatchLevel.Layout2,
        },
        1,
      )
    }
  })
})
