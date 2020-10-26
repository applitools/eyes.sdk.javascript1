'use strict'
const cwd = process.cwd()
const path = require('path')
const {getEyes} = require('../../../src/test-setup')
const {assertImages} = require('../../util/ApiAssertions')
const spec = require(path.resolve(cwd, 'src/spec-driver'))
const {MatchLevel} = require(cwd)
const {testSetup, getCheckSettings} = require('./EyesDifferentRunners')

describe('TestEyesDifferentRunners Selenium', () => {
  beforeEach(async function() {
    ;[this.webDriver, this.destroyDriver] = await spec.build({browser: 'chrome'})
    this.eyes = await getEyes()
    this.eyes.setSaveNewTests(false)
    this.eyes.setSendDom(true)
    await this.eyes.open(this.webDriver, 'Top Sites', `Top Sites - ${this.currentTest.title}`, {
      width: 1024,
      height: 768,
    })
  })
  afterEach(async function() {
    await this.destroyDriver()
    await this.eyes.abortIfNotClosed()
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
  ]
  cases.forEach(testData => {
    it('TestEyesDifferentRunners', testCase(...testData))
  })
})
