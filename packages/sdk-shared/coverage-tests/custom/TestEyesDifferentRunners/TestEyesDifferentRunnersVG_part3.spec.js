'use strict'
const cwd = process.cwd()
const path = require('path')
const {getEyes} = require('../../../src/test-setup')
const spec = require(path.resolve(cwd, 'src/SpecDriver'))
const {BrowserType, MatchLevel} = require(cwd)
const {testSetup, getCheckSettings, validateVG} = require('./EyesDifferentRunners')

describe('TestEyesDifferentRunners VG', () => {
  afterEach(async function() {
    await spec.cleanup(this.webDriver)
    await this.eyes.abortIfNotClosed()
  })

  beforeEach(async function() {
    this.webDriver = await spec.build({browser: 'chrome'})
    this.eyes = await getEyes({isVisualGrid: true})
    let conf = this.eyes.getConfiguration()
    conf.setTestName(`Top Sites - ${this.currentTest.title}`)
    conf.setAppName(`Top Sites`)
    conf.addBrowser(800, 600, BrowserType.CHROME)
    conf.addBrowser(700, 500, BrowserType.FIREFOX)
    conf.addBrowser(1200, 800, BrowserType.IE_10)
    conf.addBrowser(1200, 800, BrowserType.IE_11)
    this.eyes.setConfiguration(conf)
    this.eyes.setSaveNewTests(false)
    await this.eyes.open(this.webDriver)
  })

  let testCase = testSetup(getCheckSettings, validateVG)
  let cases = [
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
