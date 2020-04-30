'use strict'
const {By, until} = require('selenium-webdriver')
const {getDriver, getEyes, getBatch} = require('./util/TestSetup')
const {StitchMode} = require('../../../index')
const appName = 'Eyes Selenium SDK - Duplicates'
const batch = getBatch()

describe(appName, async () => {
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
    it('TestDuplicatedIFrames', TestDuplicatedIFrames('TestDuplicatedIFrames'))
  })

  describe('SCROLL', async () => {
    beforeEach(async () => {
      driver = await getDriver('CHROME')
      ;({eyes} = await getEyes('classic', StitchMode.SCROLL))
      eyes.setBatch(batch)
    })
    it('TestDuplicatedIFrames', TestDuplicatedIFrames('TestDuplicatedIFrames_Scroll'))
  })

  describe.skip('VG', async () => {
    beforeEach(async () => {
      driver = await getDriver('CHROME')
      ;({eyes} = await getEyes('VG'))
      eyes.setBatch(batch)
    })
    it('TestDuplicatedIFrames', TestDuplicatedIFrames('TestDuplicatedIFrames_VG'))
  })

  function TestDuplicatedIFrames(testName) {
    return async function() {
      await eyes.open(driver, appName, testName, {width: 700, height: 460})
      await driver.get(
        'https://applitools.github.io/demo/TestPages/VisualGridTestPage/duplicates.html',
      )
      await driver.switchTo().frame(2)
      let by = By.css('#p2')
      await driver.wait(until.elementLocated(by), 20000)
      let el = await driver.findElement(by)
      await driver.wait(until.elementIsVisible(el), 20000)
      await driver.switchTo().defaultContent()
      await eyes.checkWindow('Duplicated Iframes')
      await eyes.close()
    }
  }
})
