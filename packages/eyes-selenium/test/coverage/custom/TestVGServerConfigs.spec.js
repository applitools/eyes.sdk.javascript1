'use strict'
const {getDriver, getEyes, getBatch} = require('./util/TestSetup')
const {
  Configuration,
  BrowserType,
  AccessibilityLevel,
  AccessibilityGuidelinesVersion,
  DeviceName,
  MatchLevel,
} = require('../../../index')
const {assertDefaultMatchSettings, assertImageMatchSettings} = require('./util/ApiAssertions')
const util = require('util')
const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)
const expect = chai.expect
const batch = getBatch()

describe('TestVGServerConfigs', () => {
  let webDriver, eyes, runner

  beforeEach(async () => {
    webDriver = await getDriver('CHROME')
    ;({eyes, runner} = await getEyes('VG'))
  })

  afterEach(async () => {
    await webDriver.quit()
  })

  it(`TestVGDoubleCloseNoCheck`, async () => {
    let conf = new Configuration()
    conf.setBatch(batch)
    conf.setAppName('app')
    conf.setTestName('test')
    eyes.setConfiguration(conf)

    await eyes.open(webDriver)
    await eyes.close()
    await expect(eyes.close()).to.be.rejectedWith(Error, 'IllegalState: Eyes not open')
  })

  it.skip('TestVGChangeConfigAfterOpen', async () => {
    let conf = new Configuration()
    conf.setBatch(batch)
    conf.setAppName('app')
    conf.setTestName('js test')

    conf.addBrowser(800, 600, BrowserType.CHROME)
    conf.addBrowser(1200, 800, BrowserType.CHROME)
    conf.addDeviceEmulation(DeviceName.Galaxy_S5)
    conf.addDeviceEmulation(DeviceName.Galaxy_S3)
    conf.addDeviceEmulation(DeviceName.iPhone_4)
    conf.addDeviceEmulation(DeviceName.iPhone_5SE)
    conf.addDeviceEmulation(DeviceName.iPad)

    conf
      .setAccessibilityValidation({
        level: AccessibilityLevel.AA,
        version: AccessibilityGuidelinesVersion.WCAG_2_0,
      })
      .setIgnoreDisplacements(false)
    eyes.setConfiguration(conf)

    await eyes.open(webDriver)

    conf
      .setAccessibilityValidation({
        level: AccessibilityLevel.AAA,
        version: AccessibilityGuidelinesVersion.WCAG_2_1,
      })
      .setIgnoreDisplacements(true)
    eyes.setConfiguration(conf)

    await eyes.checkWindow()

    conf
      .setAccessibilityValidation({
        level: AccessibilityLevel.AA,
        version: AccessibilityGuidelinesVersion.WCAG_2_0,
      })
      .setMatchLevel(MatchLevel.Layout)
    eyes.setConfiguration(conf)

    await eyes.checkWindow()
    await eyes.close(false)

    let summary = await runner.getAllTestResults(false)
    let results = await summary.getAllResults()
    expect(results.length).to.be.equal(7)
    for (let container of results) {
      let result = container.getTestResults()
      await assertDefaultMatchSettings(result, {
        accessibilitySettings: {
          level: AccessibilityLevel.AA,
          version: AccessibilityGuidelinesVersion.WCAG_2_0,
        },
        ignoreDisplacements: false,
        matchLevel: MatchLevel.Strict,
      })
      await assertImageMatchSettings(result, {
        accessibilitySettings: {
          level: AccessibilityLevel.AAA,
          version: AccessibilityGuidelinesVersion.WCAG_2_1,
        },
        ignoreDisplacements: true,
        matchLevel: MatchLevel.Strict,
      })
      await assertImageMatchSettings(
        result,
        {
          accessibilityLevel: {
            level: AccessibilityLevel.AA,
            version: AccessibilityGuidelinesVersion.WCAG_2_0,
          },
          ignoreDisplacements: true,
          matchLevel: MatchLevel.Layout2,
        },
        1,
      )
    }
  })
})

describe('Miscellaneous VG tests', () => {
  let driver
  before(async () => {
    driver = await getDriver('CHROME')
  })

  // This needs to be implemented in all other SDK's as well
  it('TestWarningForEDGE', async () => {
    const origConsoleLog = console.log
    const logOutput = []
    console.log = (...args) => logOutput.push(util.format(...args))
    const yellowStart = '\u001b[33m'
    const yellowEnd = '\u001b[39m'
    const edgeWarningText = `The 'edge' option that is being used in your browsers' configuration will soon be deprecated. Please change it to either 'edgelegacy' for the legacy version or to 'edgechromium' for the new Chromium-based version. Please note, when using the built-in BrowserType enum, then the values are BrowserType.EDGE_LEGACY and BrowserType.EDGE_CHROMIUM, respectively.`
    const edgeWarning = `${yellowStart}${edgeWarningText}${yellowEnd}`

    try {
      const {eyes} = getEyes('VG')
      const configuration = eyes.getConfiguration()
      configuration.addBrowser(1000, 900, BrowserType.EDGE)
      configuration.addBrowser(1000, 900, BrowserType.FIREFOX)
      eyes.setConfiguration(configuration)
      await eyes.open(driver, 'some app', 'some test', {width: 800, height: 600})
      expect(logOutput).to.eql([edgeWarning])
    } finally {
      console.log = origConsoleLog
    }
  })
})
