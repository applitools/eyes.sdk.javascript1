'use strict'
const cwd = process.cwd()
const path = require('path')
const assert = require('assert')
const {Target, BrowserType} = require(process.cwd())
const {getApiData} = require('../../util/ApiAssertions')
const spec = require(path.resolve(cwd, 'src/spec-driver'))

function testSetup(getCheckSettings, validateResults) {
  return function(url, matchingLevel) {
    return async function() {
      await spec.visit(this.webDriver, url)
      this.eyes.setMatchLevel(matchingLevel)
      let checkSettings = getCheckSettings()
      await this.eyes.check(`Step 1 - ${url}`, checkSettings)
      await this.eyes.check(`Step 2 - ${url}`, checkSettings.fully())
      await this.eyes.close(false)
      await validateResults(this.eyes)
    }
  }
}

function getCheckSettings() {
  return Target.window()
}
function getCheckSettingsWithHook() {
  return getCheckSettings().beforeRenderScreenshotHook(
    'document.body.style="background-color: red"',
  )
}

async function validateVG(eyes) {
  let browserTypes = {}
  browserTypes[BrowserType.FIREFOX] = 'Firefox'
  browserTypes[BrowserType.CHROME] = 'Chrome'
  browserTypes[BrowserType.IE_10] = 'IE 10.0'
  browserTypes[BrowserType.IE_11] = 'IE 11.0'
  let browsers = eyes.getConfiguration().getBrowsersInfo()
  assert.deepStrictEqual(
    browsers.length,
    4,
    `There should be 4 set in the config but were found: ${browsers.length}`,
  )
  let container = await eyes.getRunner().getAllTestResults(false)
  let results = container.getAllResults()
  for (let result of results) {
    const testResults = result.getTestResults()
    if (!testResults) {
      assert.fail(result.getException())
    }
    const data = await getApiData(testResults)
    assert.deepStrictEqual(
      data.actualAppOutput.length,
      2,
      `There should be 2 images detected but was found: ${data.actualAppOutput.length}`,
    )
    let hostDisplaySize = result.getTestResults().getHostDisplaySize()
    let image1 = data.actualAppOutput[0].image
    assert.ok(image1.hasDom)
    assert.deepStrictEqual(hostDisplaySize.getWidth(), image1.size.width)
    assert.deepStrictEqual(hostDisplaySize.getHeight(), image1.size.height)

    let image2 = data.actualAppOutput[1].image
    assert.ok(image2.hasDom)
    let env = data.env

    let browserIndex = browsers.findIndex(
      item =>
        item.width === env.displaySize.width &&
        item.height === env.displaySize.height &&
        env.hostingAppInfo.includes(browserTypes[item.name]),
    )
    browsers.splice(browserIndex, 1)
  }
  assert.deepStrictEqual(browsers.length, 0)
}

module.exports = {
  testSetup: testSetup,
  getCheckSettings: getCheckSettings,
  getCheckSettingsWithHook: getCheckSettingsWithHook,
  validateVG: validateVG,
}
