'use strict'
const {getDriver, getEyes} = require('./util/TestSetup')
const {Target, StitchMode} = require('../../../index')
describe('api methods', () => {
  let browser, eyes, runner
  afterEach(async function() {
    await browser.deleteSession()
    await eyes.abortIfNotClosed()
  })
  describe('classic', function() {
    beforeEach(async function() {
      browser = await getDriver('CHROME')
      ;({eyes, runner} = await getEyes('classic', StitchMode.CSS))
    })
    it('TestCloseAsync', testCloseAsync)
  })
  describe('visualGrid', function() {
    beforeEach(async function() {
      browser = await getDriver('CHROME')
      ;({eyes, runner} = await getEyes('VG'))
    })
    it('TestCloseAsync', testCloseAsync)
  })

  async function testCloseAsync() {
    await browser.url('https://applitools.com/helloworld')
    await eyes.open(browser, 'TestApiMethods', `TestCloseAsync_1`, {
      width: 800,
      height: 600,
    })
    await eyes.check('step 1', Target.window())
    await eyes.closeAsync()

    let button = await browser.$('button')
    await button.click()
    await eyes.open(browser, 'TestApiMethods', `TestCloseAsync_2`, {
      width: 800,
      height: 600,
    })
    await eyes.check('step 2', Target.window())
    await eyes.closeAsync()

    await runner.getAllTestResults()
  }
})
