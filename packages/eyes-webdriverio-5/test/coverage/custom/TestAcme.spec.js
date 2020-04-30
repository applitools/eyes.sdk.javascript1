'use strict'
const {getDriver, getEyes} = require('./util/TestSetup')
const {Target, StitchMode, By} = require('../../../index')
const appName = 'Eyes Selenium SDK - ACME'

describe(appName, async () => {
  let browser, eyes
  afterEach(async () => {
    await browser.deleteSession()
    await eyes.abortIfNotClosed()
  })
  describe('CSS', async () => {
    beforeEach(async () => {
      browser = await getDriver('CHROME')
      ;({eyes} = await getEyes('classic', StitchMode.CSS))
    })
    it('TestAcmeLogin', TestAcmeLogin('TestAcmeLogin'))
  })

  describe('SCROLL', async () => {
    beforeEach(async () => {
      browser = await getDriver('CHROME')
      ;({eyes} = await getEyes('classic', StitchMode.SCROLL))
    })
    it('TestAcmeLogin', TestAcmeLogin('TestAcmeLogin_Scroll'))
  })

  describe('VG', async () => {
    beforeEach(async () => {
      browser = await getDriver('CHROME')
      ;({eyes} = await getEyes('VG'))
    })
    it('TestAcmeLogin', TestAcmeLogin('TestAcmeLogin_VG'))
  })

  function TestAcmeLogin(testName) {
    return async function() {
      await eyes.open(browser, appName, testName, {width: 1024, height: 768})
      await browser.url('https://afternoon-savannah-68940.herokuapp.com/#')
      let username = await browser.$('#username')
      await username.addValue('adamC')
      let password = await browser.$('#password')
      await password.addValue('MySecret123?')
      await eyes.check('', Target.region(By.id('username')))
      await username.click()
      await eyes.check('', Target.region(By.id('password')))
      await eyes.close()
    }
  }
})
