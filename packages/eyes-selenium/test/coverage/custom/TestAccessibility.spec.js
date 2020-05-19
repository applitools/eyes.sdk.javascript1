'use strict'

const assert = require('assert')
const {
  Target,
  AccessibilityLevel,
  AccessibilityGuidelinesVersion,
  AccessibilityRegionType,
  AccessibilityRegionByElement,
  AccessibilityRegionBySelector,
} = require('../../../index')
const {By} = require('selenium-webdriver')
const {getEyes, getDriver, getBatch} = require('./util/TestSetup')
const {getApiData} = require('./util/ApiAssertions')

describe('TestAccessibility', () => {
  let driver
  beforeEach(async () => {
    driver = await getDriver('CHROME')
  })
  afterEach(async () => {
    await driver.quit()
  })

  it('TestAccessibility', async () => {
    await runTest()
  })

  it('TestAccessibility_VG', async () => {
    await runTest(true)
  })

  async function runTest(useVisualGrid) {
    await driver.get('https://applitools.github.io/demo/TestPages/FramesTestPage/')
    const el = await driver.findElement(By.css('#overflowing-div'))
    const accessibilitySettings = {
      level: AccessibilityLevel.AA,
      guidelinesVersion: AccessibilityGuidelinesVersion.WCAG_2_0,
    }

    const {eyes} = getEyes(useVisualGrid ? 'VG' : 'classic', null, {
      config: {
        matchTimeout: 0,
        defaultMatchSettings: {
          accessibilitySettings,
        },
        batch: getBatch(),
      },
    })

    await eyes.open(driver, 'SessionStartInfo', `TestAccessibility${useVisualGrid ? '_VG' : ''}`, {
      width: 700,
      height: 460,
    })
    const checkSettings = Target.window()
      .accessibilityRegion(
        {left: 10, top: 20, width: 30, height: 40},
        AccessibilityRegionType.LargeText,
      )
      .accessibilityRegion(
        new AccessibilityRegionBySelector(
          By.css('.ignore'),
          AccessibilityRegionType.IgnoreContrast,
        ),
      )
      .accessibilityRegion(new AccessibilityRegionByElement(el, AccessibilityRegionType.BoldText))

    await eyes.check('', checkSettings)
    const testResults = await eyes.close(false)

    const sessionAccessibilityStatus = testResults.getAccessibilityStatus()
    assert.ok(sessionAccessibilityStatus)
    assert.ok(sessionAccessibilityStatus.status)
    assert.strictEqual(sessionAccessibilityStatus.version, accessibilitySettings.guidelinesVersion)
    assert.strictEqual(sessionAccessibilityStatus.level, accessibilitySettings.level)

    const sessionResults = await getApiData(testResults)
    const {startInfo, actualAppOutput} = sessionResults

    const expectedAccessibilityRegions = [
      {type: 'LargeText', isDisabled: false, left: 10, top: 20, width: 30, height: 40},
      {type: 'IgnoreContrast', isDisabled: false, left: 10, top: 284, width: 800, height: 500},
        useVisualGrid ? null : {type: 'IgnoreContrast', isDisabled: false, left: 122, top: 928, width: 456, height: 306}, // eslint-disable-line prettier/prettier
        useVisualGrid ? null : {type: 'IgnoreContrast', isDisabled: false, left: 8, top: 1270, width: 690, height: 206}, // eslint-disable-line prettier/prettier
      {type: 'BoldText', isDisabled: false, left: 8, top: 80, width: 304, height: 184},
    ].filter(x => !!x)
    const expectedAccessibilitySettings = {
      level: 'AA',
      version: 'WCAG_2_0',
    }

    assert.deepStrictEqual(
      startInfo.defaultMatchSettings.accessibilitySettings,
      expectedAccessibilitySettings,
    )

    assert.deepStrictEqual(
      actualAppOutput[0].imageMatchSettings.accessibility,
      expectedAccessibilityRegions,
    )

    // reset value
    eyes.setConfiguration(eyes.getConfiguration().setAccessibilityValidation())

    await eyes.open(
      driver,
      'SessionStartInfo',
      `TestAccessibility_No_Accessibility${useVisualGrid ? '_VG' : ''}`,
    )
    await eyes.check('', Target.window())
    const testResultsWithoutAccessibility = await eyes.close(false)

    assert.deepStrictEqual(testResultsWithoutAccessibility.getAccessibilityStatus(), undefined)

    const {startInfo: startInfoWithoutAccessibility} = await getApiData(
      testResultsWithoutAccessibility,
    )

    assert.strictEqual(
      startInfoWithoutAccessibility.defaultMatchSettings.accessibilitySettings,
      undefined,
    )
  }
})
