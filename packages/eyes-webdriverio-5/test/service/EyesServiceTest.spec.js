/* eslint-disable no-undef */
'use strict'

const assert = require('assert')
const {By, Target} = require('../..')

describe('EyesServiceTest', () => {
  beforeEach(() => {
    browser.url('http://applitools.github.io/demo/TestPages/FramesTestPage/')
    browser.eyesClearProperties()
  })

  it('an empty test without check', () => {
    assert.strictEqual(browser.eyesGetIsOpen(), false)
  })

  it('checkWindow', () => {
    assert.strictEqual(browser.eyesGetIsOpen(), false)
    browser.eyesCheckWindow('main')
    assert.strictEqual(browser.eyesGetIsOpen(), true)
  })

  it('checkWindow - no title', () => {
    assert.strictEqual(browser.eyesGetConfiguration().getProperties().length, 0)
    browser.eyesAddProperty('testProp', 'foobar')
    assert.strictEqual(browser.eyesGetConfiguration().getProperties().length, 1)

    browser.eyesCheckWindow()
  })

  it('checkRegion and checkFrame', () => {
    browser.eyesCheck('region', Target.region(By.id('overflowing-div')))

    browser.eyesCheck('frame', Target.frame('frame1'))
  })

  afterEach(() => {
    /** @type {TestResults} */
    const testResults = browser.eyesGetTestResults()
    if (testResults) {
      if (testResults.isPassed()) {
        console.log(`${testResults.getName()} is passed.`)
      } else {
        console.log(
          `Test is not passed: ${testResults.getMismatches()} out of ${testResults.getSteps()} failed.`,
        )
        console.log(`Step details URL: ${testResults.getAppUrls().getSession()}`)
      }
    }
  })
})
