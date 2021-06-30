'use strict'

const assert = require('assert')
const axios = require('axios')
const {
  AccessibilityLevel,
  AccessibilityGuidelinesVersion,
  AccessibilityRegionType,
  VisualGridRunner,
  ClassicRunner,
  ConsoleLogHandler,
} = require('../../../index')
const {EyesFactory, CheckSettings} = require('../../utils/FakeSDK')

async function runTest(driver, useVisualGrid) {
  const accessibilitySettings = {
    level: AccessibilityLevel.AA,
    guidelinesVersion: AccessibilityGuidelinesVersion.WCAG_2_0,
  }

  const runner = useVisualGrid ? new VisualGridRunner(10) : new ClassicRunner()
  const eyes = new EyesFactory(runner)
  eyes.setConfiguration({
    matchTimeout: 0,
    defaultMatchSettings: {
      accessibilitySettings,
    },
  })
  if (process.env.APPLITOOLS_SHOW_LOGS) {
    eyes.setLogHandler(new ConsoleLogHandler(true))
  }

  await eyes.open(driver, 'SessionStartInfo', `TestAccessibility${useVisualGrid ? '_VG' : ''}`, {
    width: 700,
    height: 460,
  })

  const checkSettings = CheckSettings.window()
    .accessibilityRegion(
      {left: 10, top: 20, width: 30, height: 40},
      AccessibilityRegionType.LargeText,
    )
    .accessibilityRegion('element2', AccessibilityRegionType.IgnoreContrast)

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
    {type: 'IgnoreContrast', isDisabled: false, left: 20, top: 21, width: 201, height: 202},
    {type: 'IgnoreContrast', isDisabled: false, left: 30, top: 31, width: 301, height: 302},
  ]
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
  await eyes.check('', CheckSettings.window())
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

async function getApiData(testResults, apiKey = process.env.APPLITOOLS_API_KEY) {
  const url = `${testResults
    .getApiUrls()
    .getSession()}?format=json&AccessToken=${testResults.getSecretToken()}&apiKey=${apiKey}`

  let response = await axios.get(url)
  return response.data
}

module.exports = {
  runTest,
}
