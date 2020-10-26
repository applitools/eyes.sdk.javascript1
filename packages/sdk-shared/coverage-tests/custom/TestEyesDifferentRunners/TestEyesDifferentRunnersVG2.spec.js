'use strict'
const cwd = process.cwd()
const path = require('path')
const {getEyes} = require('../../../src/test-setup')
const spec = require(path.resolve(cwd, 'src/spec-driver'))
const {MatchLevel} = require(cwd)
const {testSetup, getCheckSettings, validateVG2} = require('./EyesDifferentRunners')

describe('TestEyesDifferentRunners VG2', () => {
  afterEach(async function() {
    await this.destroyDriver()
    await this.eyes.abortIfNotClosed()
  })

  beforeEach(async function() {
    ;[this.webDriver, this.destroyDriver] = await spec.build({browser: 'chrome'})
    this.eyes = await getEyes({vg: true})
    this.eyes.setSaveNewTests(false)
    await this.eyes.open(this.webDriver, 'Top Sites', `Top Sites - ${this.currentTest.title}`, {
      width: 800,
      height: 600,
    })
  })

  let testCase = testSetup(getCheckSettings, validateVG2)
  let cases = [['https://amazon.com', MatchLevel.Layout]]
  cases.forEach(testData => {
    it('TestEyesDifferentRunners', testCase(...testData))
  })
})
