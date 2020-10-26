'use strict'
const cwd = process.cwd()
const path = require('path')
const {getEyes, batch} = require('../../src/test-setup')
const spec = require(path.resolve(cwd, 'src/spec-driver'))
const {
  ScreenOrientation,
  IosDeviceName,
  IosVersion,
  BrowserType,
  AccessibilityLevel,
  AccessibilityGuidelinesVersion,
  DeviceName,
  MatchLevel,
} = require(cwd)
const {assertDefaultMatchSettings, assertImageMatchSettings} = require('../util/ApiAssertions')
const util = require('util')
const chai = require('chai')
const chalk = require('chalk')
const chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)
const expect = chai.expect

describe('TestVGServerConfigs', () => {
  let webDriver, destroyDriver, eyes, runner

  beforeEach(async () => {
    ;[webDriver, destroyDriver] = await spec.build({browser: 'chrome'})
    eyes = await getEyes({vg: true})
    runner = eyes.getRunner()
  })

  afterEach(async () => {
    await destroyDriver()
  })

  it(`TestVGDoubleCloseNoCheck`, async () => {
    const conf = eyes.getConfiguration()
    conf.setBatch(batch)
    conf.setAppName('app')
    conf.setTestName('test')
    eyes.setConfiguration(conf)

    await eyes.open(webDriver)
    await eyes.close()
    await expect(eyes.close()).to.be.rejectedWith(Error, 'IllegalState: Eyes not open')
  })

  it(`TestMobileWeb_VG`, async () => {
    const conf = eyes.getConfiguration()
    conf.addBrowsers(
      {
        iosDeviceInfo: {
          deviceName: IosDeviceName.iPhone_XR,
          screenOrientation: ScreenOrientation.LANDSCAPE,
        },
      },
      {
        iosDeviceInfo: {
          deviceName: IosDeviceName.iPhone_XR,
          iosVersion: IosVersion.LATEST,
        },
      },
      {
        iosDeviceInfo: {
          deviceName: IosDeviceName.iPhone_XR,
          iosVersion: IosVersion.LATEST_ONE_VERSION_BACK,
        },
      },
    )
    eyes.setConfiguration(conf)

    await spec.visit(webDriver, 'http://applitools.github.io/demo')
    await eyes.open(webDriver, 'Eyes SDK', 'UFG Mobile Web Happy Flow', {width: 800, height: 600})
    await eyes.check({isFully: true})
    await eyes.close()
  })

  it(`TestChromeEmulation_VG`, async () => {
    const conf = eyes.getConfiguration()
    conf.addBrowser({
      deviceName: DeviceName.Nexus_10,
      screenOrientation: ScreenOrientation.LANDSCAPE,
    })
    eyes.setConfiguration(conf)

    await spec.visit(webDriver, 'http://applitools.github.io/demo')
    await eyes.open(webDriver, 'Eyes SDK', 'TestChromeEmulationVG')
    await eyes.checkWindow()
    await eyes.close()
  })

  it(`TestChromeEmulationNestedAPI_VG`, async () => {
    const conf = eyes.getConfiguration()
    conf.addBrowser({
      chromeEmulationInfo: {
        deviceName: DeviceName.Nexus_10,
        screenOrientation: ScreenOrientation.LANDSCAPE,
      },
    })
    eyes.setConfiguration(conf)

    await spec.visit(webDriver, 'http://applitools.github.io/demo')
    await eyes.open(webDriver, 'Eyes SDK', 'TestChromeEmulationVG')
    await eyes.checkWindow()
    await eyes.close()
  })

  it(`TestDesktopBrowser_VG`, async () => {
    const conf = eyes.getConfiguration()
    conf.addBrowser({
      name: BrowserType.EDGE_CHROMIUM_TWO_VERSIONS_BACK,
      width: 1024,
      height: 768,
    })
    eyes.setConfiguration(conf)

    await spec.visit(webDriver, 'http://applitools.github.io/demo')
    await eyes.open(webDriver, 'Eyes SDK', 'TestDesktopBrowserVG')
    await eyes.checkWindow()
    await eyes.close()
  })

  it.skip('TestVGChangeConfigAfterOpen', async () => {
    const conf = eyes.getConfiguration()
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
        guidelinesVersion: AccessibilityGuidelinesVersion.WCAG_2_0,
      })
      .setIgnoreDisplacements(false)
    eyes.setConfiguration(conf)

    await eyes.open(webDriver)

    conf
      .setAccessibilityValidation({
        level: AccessibilityLevel.AAA,
        guidelinesVersion: AccessibilityGuidelinesVersion.WCAG_2_1,
      })
      .setIgnoreDisplacements(true)
    eyes.setConfiguration(conf)

    await eyes.checkWindow()

    conf
      .setAccessibilityValidation({
        level: AccessibilityLevel.AA,
        guidelinesVersion: AccessibilityGuidelinesVersion.WCAG_2_0,
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
  let driver, destroyDriver
  before(async () => {
    ;[driver, destroyDriver] = await spec.build({browser: 'chrome'})
  })
  after(async () => {
    await destroyDriver()
  })

  it('TestWarningForEDGE', async () => {
    const origConsoleLog = console.log
    const logOutput = []
    console.log = (...args) => logOutput.push(util.format(...args))
    const edgeWarningText = `The 'edge' option that is being used in your browsers' configuration will soon be deprecated. Please change it to either 'edgelegacy' for the legacy version or to 'edgechromium' for the new Chromium-based version. Please note, when using the built-in BrowserType enum, then the values are BrowserType.EDGE_LEGACY and BrowserType.EDGE_CHROMIUM, respectively.`
    const edgeWarning = chalk.yellow(edgeWarningText)

    try {
      const eyes = getEyes({vg: true})
      const configuration = eyes.getConfiguration()
      configuration.addBrowser(1000, 900, BrowserType.EDGE)
      configuration.addBrowser(1000, 900, BrowserType.FIREFOX)
      eyes.setConfiguration(configuration)
      await eyes.open(driver, 'some app', 'some test', {width: 800, height: 600})
      expect(logOutput).to.eql([edgeWarning])
    } finally {
      console.log = origConsoleLog
      console.log(logOutput)
    }
  })
})
