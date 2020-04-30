'use strict'
const {By} = require('selenium-webdriver')
const {getDriver, getEyes, getBatch} = require('./util/TestSetup')
const {Target, StitchMode} = require('../../../index')
const appName = 'Eyes Selenium SDK - ACME'
const batch = getBatch()

describe.skip(appName, async () => {
  let driver, eyes
  afterEach(async () => {
    await driver.quit()
    await eyes.abortIfNotClosed()
  })
  describe('CSS', async () => {
    beforeEach(async () => {
      driver = await getDriver('CHROME')
      ;({eyes} = await getEyes('classic', StitchMode.CSS))
      eyes.setBatch(batch)
    })
    it('TestAcmeLogin', TestAcmeLogin('TestAcmeLogin'))
  })

  describe('SCROLL', async () => {
    beforeEach(async () => {
      driver = await getDriver('CHROME')
      ;({eyes} = await getEyes('classic', StitchMode.SCROLL))
      eyes.setBatch(batch)
    })
    it('TestAcmeLogin', TestAcmeLogin('TestAcmeLogin_Scroll'))
  })

  describe('VG', async () => {
    beforeEach(async () => {
      driver = await getDriver('CHROME')
      ;({eyes} = await getEyes('VG'))
      eyes.setBatch(batch)
    })
    it('TestAcmeLogin', TestAcmeLogin('TestAcmeLogin_VG'))
  })

  function TestAcmeLogin(testName) {
    return async function() {
      await eyes.open(driver, appName, testName, {width: 1024, height: 768})
      await driver.get('https://afternoon-savannah-68940.herokuapp.com/#')
      let username = await driver.findElement(By.id('username'))
      await username.sendKeys('adamC')
      let password = await driver.findElement(By.id('password'))
      await password.sendKeys('MySecret123?')
      await eyes.check('', Target.region(username))
      await eyes.check('', Target.region(password))
      await eyes.close()
    }
  }
})
