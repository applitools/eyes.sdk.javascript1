'use strict'
const cwd = process.cwd()
const path = require('path')
const {getEyes} = require('../../../src/test-setup')
const spec = require(path.resolve(cwd, 'src/spec-driver'))
const {MatchLevel} = require(cwd)
const {testSetup, getCheckSettings} = require('./EyesDifferentRunners')

describe('TestEyesDifferentRunners VG2', () => {
  afterEach(async function() {
    await this.destroyDriver()
    await this.eyes.abortIfNotClosed()
  })

  beforeEach(async function() {
    ;[this.webDriver, this.destroyDriver] = await spec.build({browser: 'chrome'})
    this.eyes = await getEyes({isVisualGrid: true})
    this.eyes.setSaveNewTests(false)
    await this.eyes.open(this.webDriver, 'Top Sites', `Top Sites - ${this.currentTest.title}`, {
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
