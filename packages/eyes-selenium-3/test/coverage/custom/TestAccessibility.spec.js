'use strict'

const assert = require('assert')
const {Eyes, Target, ConsoleLogHandler} = require('../../../index')
const {By} = require('selenium-webdriver')
const {batch, getDriver} = require('./util/TestSetup')
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
    await driver.get('https://applitools.github.io/demo/TestPages/FramesTestPage/')
    const accessibilitySettings = {
      level: 'AA',
      guidelinesVersion: 'WCAG_2_0',
    }

    const eyes = new Eyes()
    if (process.env.APPLITOOLS_SHOW_LOGS) {
      eyes.setLogHandler(new ConsoleLogHandler(true))
    }
    eyes.setAccessibilityValidation(accessibilitySettings)
    eyes.setBatch(batch)

    const wrappedDriver = await eyes.open(driver, 'SessionStartInfo', `TestAccessibility`, {
      width: 700,
      height: 460,
    })

    const el = wrappedDriver.findElement(By.css('#overflowing-div'))

    const checkSettings = Target.window().accessibility(
      {left: 10, top: 20, width: 30, height: 40, regionType: 'LargeText'},
      {element: By.css('.ignore'), regionType: 'IgnoreContrast'},
      {element: el, regionType: 'BoldText'},
    )

    await eyes.check('', checkSettings)
    const testResults = await eyes.close(false)

    const sessionAccessibilityStatus = testResults.accessibilityStatus
    assert.ok(sessionAccessibilityStatus)
    assert.ok(sessionAccessibilityStatus.status)
    assert.strictEqual(sessionAccessibilityStatus.version, accessibilitySettings.guidelinesVersion)
    assert.strictEqual(sessionAccessibilityStatus.level, accessibilitySettings.level)

    const sessionResults = await getApiData(testResults)
    const [actualAppOutput] = sessionResults.actualAppOutput

    const expectedAccessibilityRegions = [
      {type: 'LargeText', isDisabled: false, left: 10, top: 20, width: 30, height: 40},
      {type: 'IgnoreContrast', isDisabled: false, left: 10, top: 284, width: 800, height: 500},
      {type: 'BoldText', isDisabled: false, left: 8, top: 80, width: 304, height: 184},
    ]
    const expectedAccessibilitySettings = {
      level: 'AA',
      version: 'WCAG_2_0',
    }

    assert.deepStrictEqual(
      actualAppOutput.imageMatchSettings.accessibilitySettings,
      expectedAccessibilitySettings,
    )

    assert.deepStrictEqual(
      actualAppOutput.imageMatchSettings.accessibility,
      expectedAccessibilityRegions,
    )

    // reset value
    eyes.setAccessibilityValidation()

    await eyes.open(driver, 'SessionStartInfo', `TestAccessibility_No_Accessibility`)
    await eyes.check('', Target.window())
    const testResultsWithoutAccessibility = await eyes.close(false)

    assert.deepStrictEqual(testResultsWithoutAccessibility.accessibilityStatus, undefined)

    const {startInfo: startInfoWithoutAccessibility} = await getApiData(
      testResultsWithoutAccessibility,
    )

    assert.strictEqual(
      startInfoWithoutAccessibility.defaultMatchSettings.accessibilitySettings,
      undefined,
    )
  })
})
