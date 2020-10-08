'use strict'

const chromedriver = require('chromedriver')
const {remote} = require('webdriverio')
const assert = require('assert')
const {Eyes, Target, By, TestResults, VisualGridRunner} = require('../../../index')

const Common = require('../../Common')

describe('TestStateAfterOperation', () => {
  let browser, eyes

  before(async () => {
    await chromedriver.start([], true)
  })

  beforeEach(async () => {
    browser = await remote({
      port: 9515,
      path: '/',
      logLevel: 'error',
      ...Common.CHROME,
    })
  })

  afterEach(async () => {
    await browser.deleteSession()
    await eyes.abort()
  })

  after(async () => {
    chromedriver.stop()
  })

  it('TestCloseReturnsTestResults_Passed_ClassicRunner', async function() {
    eyes = new Eyes()
    await browser.url('https://applitools.github.io/demo/TestPages/RandomizePage/')

    await eyes.open(browser, this.test.parent.title, this.test.title)
    await eyes.check('check region', Target.region(By.id('random_wrapper')))

    const testResults = await eyes.close(false)

    assert.ok(testResults instanceof TestResults)
  })

  it('TestCloseReturnsTestResults_Failed_ClassicRunner', async function() {
    eyes = new Eyes()
    await browser.url('https://applitools.github.io/demo/TestPages/RandomizePage/?randomize')

    await eyes.open(browser, this.test.parent.title, this.test.title)
    await eyes.check('check region', Target.region(By.id('random_wrapper')))

    const testResults = await eyes.close(false)

    assert.ok(testResults instanceof TestResults)
  })

  it('TestCloseReturnsTestResults_Passed_VisualGridRunner', async function() {
    eyes = new Eyes(new VisualGridRunner(10))
    await browser.url('https://applitools.github.io/demo/TestPages/RandomizePage/')

    await eyes.open(browser, this.test.parent.title, this.test.title)
    await eyes.check('check region', Target.region(By.id('random_wrapper')))

    const testResults = await eyes.close(false)

    assert.ok(testResults instanceof TestResults)
  })

  it('TestCloseReturnsTestResults_Failed_VisualGridRunner', async function() {
    eyes = new Eyes(new VisualGridRunner(10))
    await browser.url('https://applitools.github.io/demo/TestPages/RandomizePage/?randomize')

    await eyes.open(browser, this.test.parent.title, this.test.title)
    await eyes.check('check region', Target.region(By.id('random_wrapper')))

    const testResults = await eyes.close(false)

    assert.ok(testResults instanceof TestResults)
  })
})
