'use strict'
const cwd = process.cwd()
const path = require('path')
const {getEyes} = require('../../../src/test-setup')
const spec = require(path.resolve(cwd, 'src/spec-driver'))
const {BrowserType, MatchLevel} = require(cwd)
const {testSetup, getCheckSettingsWithHook, validateVG} = require('./EyesDifferentRunners')

describe('TestEyesDifferentRunners VG with hooks', () => {
  afterEach(async function() {
    await this.destroyDriver()
    await this.eyes.abortIfNotClosed()
  })

  beforeEach(async function() {
    ;[this.webDriver, this.destroyDriver] = await spec.build({browser: 'chrome'})
    this.eyes = await getEyes({vg: true})
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

  let testCase = testSetup(getCheckSettingsWithHook, validateVG)
  let cases = [
    ['https://instagram.com', MatchLevel.Strict],
    ['https://twitter.com', MatchLevel.Strict],
  ]

  cases.forEach(testData => {
    it('TestEyesDifferentRunners', testCase(...testData))
  })
})
