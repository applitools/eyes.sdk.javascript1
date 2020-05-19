'use strict'
const {
  Eyes,
  Target,
  VisualGridRunner,
  Configuration,
  BrowserType,
  MatchLevel,
} = require('../../../index')
const {getDriver, getBatch} = require('./util/TestSetup')
const {assertImages, getApiData} = require('./util/ApiAssertions')
const assert = require('assert')
const batch = getBatch()

describe('TestEyesDifferentRunners', () => {
  let webDriver, eyes

  beforeEach(async () => {
    webDriver = await getDriver('CHROME')
  })
  afterEach(async () => {
    await webDriver.quit()
    await eyes.abortIfNotClosed()
  })
  describe('Selenium', () => {
    beforeEach(async function() {
      eyes = new Eyes()
      eyes.setBatch(batch)
      eyes.setSaveNewTests(false)
      eyes.setSendDom(true)
      await eyes.open(webDriver, 'Top Sites', `Top Sites - ${this.currentTest.title}`, {
        width: 1024,
        height: 768,
      })
    })
    let testCase = testSetup(getCheckSettings, async eyes => {
      let results = await eyes.getRunner().getAllTestResults(false)
      await assertImages(results, [
        {/*hasDom: true,*/ size: {width: 1024, height: 768}},
        {
          /*hasDom: true,*/
        },
      ])
    })
    let cases = [
      ['https://instagram.com', MatchLevel.Strict],
      ['https://twitter.com', MatchLevel.Strict],
      ['https://wikipedia.org', MatchLevel.Strict],
      [
        'https://www.target.com/c/blankets-throws/-/N-d6wsb?lnk=ThrowsBlankets%E2%80%9C,tc',
        MatchLevel.Strict,
      ],
      ['https://youtube.com', MatchLevel.Layout],
    ]
    cases.forEach(testData => {
      it(testData[0], testCase(...testData))
    })
  })

  describe('Visual Grid', () => {
    beforeEach(async function() {
      let runner = new VisualGridRunner(40)
      eyes = new Eyes(runner)
      let conf = new Configuration()
      conf.setTestName(`Top Sites - ${this.currentTest.title}`)
      conf.setAppName(`Top Sites`)
      conf.setBatch(batch)
      conf.addBrowser(800, 600, BrowserType.CHROME)
      conf.addBrowser(700, 500, BrowserType.FIREFOX)
      conf.addBrowser(1200, 800, BrowserType.IE_10)
      conf.addBrowser(1200, 800, BrowserType.IE_11)
      eyes.setConfiguration(conf)
      eyes.setSaveNewTests(false)
      await eyes.open(webDriver)
    })

    describe('VG', () => {
      let testCase = testSetup(getCheckSettings, validateVG)
      let cases = [
        ['https://amazon.com', MatchLevel.Layout],
        ['https://applitools.com/docs/topics/overview.html', MatchLevel.Strict],
        ['https://applitools.com/features/frontend-development', MatchLevel.Strict],
        ['https://docs.microsoft.com/en-us/', MatchLevel.Strict],
        ['https://ebay.com', MatchLevel.Layout],
        ['https://facebook.com', MatchLevel.Strict],
        ['https://google.com', MatchLevel.Strict],
        ['https://instagram.com', MatchLevel.Strict],
        ['https://twitter.com', MatchLevel.Strict],
        ['https://wikipedia.org', MatchLevel.Strict],
        [
          'https://www.target.com/c/blankets-throws/-/N-d6wsb?lnk=ThrowsBlankets%E2%80%9C,tc',
          MatchLevel.Strict,
        ],
        // ['https://youtube.com', MatchLevel.Layout],
      ]
      cases.forEach(testData => {
        it(testData[0], testCase(...testData))
      })
    })

    describe('VG with hooks', () => {
      let testCase = testSetup(getCheckSettingsWithHook, validateVG)
      let cases = [
        ['https://instagram.com', MatchLevel.Strict],
        ['https://twitter.com', MatchLevel.Strict],
        ['https://wikipedia.org', MatchLevel.Strict],
        [
          'https://www.target.com/c/blankets-throws/-/N-d6wsb?lnk=ThrowsBlankets%E2%80%9C,tc',
          MatchLevel.Strict,
        ],
        // ['https://youtube.com', MatchLevel.Layout],
      ]

      cases.forEach(testData => {
        it(testData[0], testCase(...testData))
      })
    })
  })

  describe('VG2', () => {
    beforeEach(async function() {
      let runner = new VisualGridRunner(10)
      eyes = new Eyes(runner)
      eyes.setBatch(batch)
      eyes.setSaveNewTests(false)
      await eyes.open(webDriver, 'Top Sites', `Top Sites - ${this.currentTest.title}`, {
        width: 800,
        height: 600,
      })
    })

    let testCase = testSetup(getCheckSettings, async () =>
      console.log('Need merge of the runners updates to retrieve the test results for assertions'),
    )
    let cases = [['https://amazon.com', MatchLevel.Layout]]
    cases.forEach(testData => {
      it(testData[0], testCase(...testData))
    })
  })

  function testSetup(getCheckSettings, validateResults) {
    return function(url, matchingLevel) {
      return async function() {
        await webDriver.get(url)
        eyes.setMatchLevel(matchingLevel)
        let checkSettings = getCheckSettings()
        await eyes.check(`Step 1 - ${url}`, checkSettings)
        await eyes.check(`Step 2 - ${url}`, checkSettings.fully())
        await eyes.close(false)
        await validateResults(eyes)
      }
    }
  }
})

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
    let data = await getApiData(result.getTestResults())
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
