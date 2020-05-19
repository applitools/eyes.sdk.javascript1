'use strict'
const {getDriver, getEyes} = require('./util/TestSetup')
const {StitchMode, By, RectangleSize, BrowserType} = require('../../../index')
const appName = 'Eyes Selenium SDK - Classic API'
describe.skip(appName, () => {
  let browser, eyes

  afterEach(async () => {
    await eyes.abortIfNotClosed()
    await browser.deleteSession()
  })
  describe('CSS', () => {
    beforeEach(async () => {
      browser = await getDriver('CHROME')
      await browser.url('https://applitools.github.io/demo/TestPages/FramesTestPage/')
      ;({eyes} = await getEyes('classic', StitchMode.CSS))
    })

    it('TestCheckInnerFrame', async () => {
      eyes.hideScrollbars = false
      let driver = await eyes.open(
        browser,
        appName,
        'TestCheckInnerFrame',
        new RectangleSize(700, 460),
      )
      await driver.executeScript(scrollTop)
      await driver.switchTo().defaultContent()
      let element = await driver.findElement(By.name('frame1'))
      await driver.switchTo().frame(element)
      await eyes.checkFrame('frame1-1')
      await eyes.checkWindow('window after check frame')
      let innerFrameBody = await browser.$('body')
      await browser.execute(makeItRed, innerFrameBody)
      await eyes.checkWindow('window after change background color of inner frame')
      await eyes.close()
    })
  })

  describe('SCROLL', () => {
    beforeEach(async () => {
      browser = await getDriver('CHROME')
      await browser.url('https://applitools.github.io/demo/TestPages/FramesTestPage/')
      ;({eyes} = await getEyes('classic', StitchMode.SCROLL))
    })

    it('TestCheckInnerFrame_SCROLL', async () => {
      eyes.hideScrollbars = false
      let driver = await eyes.open(
        browser,
        appName,
        'TestCheckInnerFrame_Scroll',
        new RectangleSize(700, 460),
      )
      await driver.executeScript(scrollTop)
      await driver.switchTo().defaultContent()
      let element = await driver.findElement(By.name('frame1'))
      await driver.switchTo().frame(element)
      await eyes.checkFrame('frame1-1')
      await eyes.checkWindow('window after check frame')
      let innerFrameBody = await browser.$('body')
      await browser.execute(makeItRed, innerFrameBody)
      await eyes.checkWindow('window after change background color of inner frame')
      await eyes.close()
    })
  })

  describe('VG', () => {
    beforeEach(async () => {
      browser = await getDriver('CHROME')
      await browser.url('https://applitools.github.io/demo/TestPages/FramesTestPage/')
      ;({eyes} = await getEyes('VG'))
      let conf = eyes.getConfiguration()
      conf.addBrowser(700, 460, BrowserType.CHROME)
      eyes.setConfiguration(conf)
    })

    it('TestCheckInnerFrame_VG', async () => {
      eyes.hideScrollbars = false
      let driver = await eyes.open(browser, appName, 'TestCheckInnerFrame_VG')
      await driver.executeScript(scrollTop)
      await driver.switchTo().defaultContent()
      let element = await driver.findElement(By.name('frame1'))
      await driver.switchTo().frame(element)
      await eyes.checkFrame('frame1-1')
      await eyes.checkWindow('window after check frame')
      let innerFrameBody = await browser.$('body')
      await browser.execute(makeItRed, innerFrameBody)
      await eyes.checkWindow('window after change background color of inner frame')
      await eyes.close()
    })
  })
})

function scrollTop() {
  // eslint-disable-next-line
  document.documentElement.scrollTop = 350
}
function makeItRed() {
  arguments[0].style.background = 'red'
}
