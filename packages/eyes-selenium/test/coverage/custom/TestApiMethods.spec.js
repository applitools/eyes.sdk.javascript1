'use strict'
const {By} = require('selenium-webdriver')
const {getDriver, getEyes, getBatch} = require('./util/TestSetup')
const {Target, StitchMode} = require('../../../index')
const batch = getBatch()
describe('api methods', () => {
  let webDriver, eyes, runner
  afterEach(async function() {
    await webDriver.quit()
    await eyes.abortIfNotClosed()
  })
  describe('classic', function() {
    beforeEach(async function() {
      webDriver = await getDriver('CHROME')
      ;({eyes, runner} = await getEyes('classic', StitchMode.CSS))
      eyes.setBatch(batch)
    })
    it('TestCloseAsync', testCloseAsync)
  })
  describe('visualGrid', function() {
    beforeEach(async function() {
      webDriver = await getDriver('CHROME')
      ;({eyes, runner} = await getEyes('VG'))
      eyes.setBatch(batch)
    })
    it('TestCloseAsync', testCloseAsync)
  })

  async function testCloseAsync() {
    await webDriver.get('https://applitools.com/helloworld')
    await eyes.open(webDriver, 'TestApiMethods', `TestCloseAsync_1`, {
      width: 800,
      height: 600,
    })
    await eyes.check('step 1', Target.window())
    await eyes.closeAsync()

    await webDriver.findElement(By.css('button')).click()
    await eyes.open(webDriver, 'TestApiMethods', `TestCloseAsync_2`, {
      width: 800,
      height: 600,
    })
    await eyes.check('step 2', Target.window())
    await eyes.closeAsync()

    await runner.getAllTestResults()
  }
})
