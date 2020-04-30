'use strict'
const {By} = require('selenium-webdriver')
const {getDriver, getEyes, getBatch} = require('./util/TestSetup')
const {StitchMode} = require('../../../index')
const appName = 'Eyes Selenium SDK - Classic API'
const batch = getBatch()
describe.skip(appName, () => {
  let webDriver, eyes

  afterEach(async () => {
    await eyes.abortIfNotClosed()
    await webDriver.quit()
  })
  describe('CSS', () => {
    beforeEach(async () => {
      webDriver = await getDriver('CHROME')
      await webDriver.get('https://applitools.github.io/demo/TestPages/FramesTestPage/')
      ;({eyes} = await getEyes('classic', StitchMode.CSS))
      eyes.setBatch(batch)
    })

    it('TestCheckInnerFrame', async () => {
      eyes.hideScrollbars = false
      let driver = await eyes.open(webDriver, appName, 'TestCheckInnerFrame')
      await driver.executeScript(scrollTop)
      await driver.switchTo().defaultContent()
      await driver.switchTo().frame(driver.findElement(By.name('frame1')))
      await eyes.checkFrame('frame1-1')
      await eyes.checkWindow('window after check frame')
      let innerFrameBody = driver.findElement(By.css('body'))
      await driver.executeScript(makeItRed, innerFrameBody)
      await eyes.checkWindow('window after change background color of inner frame')
      await eyes.close()
    })
  })

  describe('SCROLL', () => {
    beforeEach(async () => {
      webDriver = await getDriver('CHROME')
      await webDriver.get('https://applitools.github.io/demo/TestPages/FramesTestPage/')
      ;({eyes} = await getEyes('classic', StitchMode.SCROLL))
      eyes.setBatch(batch)
    })

    it('TestCheckInnerFrame_SCROLL', async () => {
      eyes.hideScrollbars = false
      let driver = await eyes.open(webDriver, appName, 'TestCheckInnerFrame_SCROLL')
      await driver.executeScript(scrollTop)
      await driver.switchTo().defaultContent()
      await driver.switchTo().frame(driver.findElement(By.name('frame1')))
      await eyes.checkFrame('frame1-1')
      await eyes.checkWindow('window after check frame')
      let innerFrameBody = driver.findElement(By.css('body'))
      await driver.executeScript(makeItRed, innerFrameBody)
      await eyes.checkWindow('window after change background color of inner frame')
      await eyes.close()
    })
  })

  describe('VG', () => {
    beforeEach(async () => {
      webDriver = await getDriver('CHROME')
      await webDriver.get('https://applitools.github.io/demo/TestPages/FramesTestPage/')
      ;({eyes} = await getEyes('VG'))
      eyes.setBatch(batch)
    })

    it('TestCheckInnerFrame_VG', async () => {
      eyes.hideScrollbars = false
      let driver = await eyes.open(webDriver, appName, 'TestCheckInnerFrame_VG', {
        width: 700,
        height: 460,
      })
      await driver.executeScript(scrollTop)
      await driver.switchTo().defaultContent()
      await driver.switchTo().frame(driver.findElement(By.name('frame1')))
      await eyes.checkFrame('frame1-1')
      await eyes.checkWindow('window after check frame')
      let innerFrameBody = driver.findElement(By.css('body'))
      await driver.executeScript(makeItRed, innerFrameBody)
      await eyes.checkWindow('window after change background color of inner frame')
      await eyes.close()
    })
  })
})

function scrollTop() {
  document.documentElement.scrollTop = 350
}
function makeItRed() {
  arguments[0].style.background = 'red'
}
