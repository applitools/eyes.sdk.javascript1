'use strict'
const {getDriver, getEyes} = require('./util/TestSetup')
const {StitchMode} = require('../../../index')
const appName = 'Eyes Selenium SDK - Duplicates'

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
    it('TestDuplicatedIFrames', TestDuplicatedIFrames('TestDuplicatedIFrames'))
  })

  describe('SCROLL', async () => {
    beforeEach(async () => {
      browser = await getDriver('CHROME')
      ;({eyes} = await getEyes('classic', StitchMode.SCROLL))
    })
    it('TestDuplicatedIFrames', TestDuplicatedIFrames('TestDuplicatedIFrames_Scroll'))
  })

  describe('VG', async () => {
    beforeEach(async () => {
      browser = await getDriver('CHROME')
      ;({eyes} = await getEyes('VG'))
    })
    it('TestDuplicatedIFrames', TestDuplicatedIFrames('TestDuplicatedIFrames_VG'))
  })

  function TestDuplicatedIFrames(testName) {
    return async function() {
      await eyes.open(browser, appName, testName, {width: 700, height: 460})
      await browser.url(
        'https://applitools.github.io/demo/TestPages/VisualGridTestPage/duplicates.html',
      )
      await browser.switchToFrame(2)
      let el = await browser.$('#p2')
      await el.waitForDisplayed(20000)
      await browser.switchToFrame(null)
      await eyes.checkWindow('Duplicated Iframes')
      await eyes.close()
    }
  }
})
