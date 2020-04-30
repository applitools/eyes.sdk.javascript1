'use strict'
const {By} = require('selenium-webdriver')
const {getDriver, getEyes, batch} = require('./util/TestSetup')
const {Target, StitchMode} = require('../../../index')
const appName = 'Eyes Selenium SDK - Fluent API'
describe.skip(appName, () => {
  let webDriver, eyes

  const longIframes = [
    {
      clickableId: 'hidden_click',
      IframeSelector: '#modal3 iframe',
      title: 'TestCheckLongOutOfBoundsIFrameModal',
    },
    {
      clickableId: 'stretched',
      IframeSelector: '#modal2 iframe',
      title: 'TestCheckLongIFrameModal',
    },
  ]

  afterEach(async () => {
    await eyes.abortIfNotClosed()
    await webDriver.quit()
  })
  describe(`Test`, () => {
    beforeEach(async () => {
      webDriver = await getDriver('CHROME')
      await webDriver.get('https://applitools.github.io/demo/TestPages/FramesTestPage/')
      eyes = await getEyes(StitchMode.CSS)
      eyes.setBatch(batch)
    })

    it('TestCheckScrollableModal', async () => {
      let driver = await eyes.open(webDriver, appName, `TestCheckScrollableModal`, {
        width: 700,
        height: 460,
      })
      driver.findElement(By.id('centered')).click()
      let scrollRootSelector = By.id('modal-content')
      await eyes.setScrollRootElement(scrollRootSelector)
      await eyes.check('TestCheckScrollableModal', Target.region(By.id('modal-content')).fully())
      await eyes.close()
    })

    // produces TypeError: Cannot read property 'getId' of undefined || which is thrown by the EyesWebDriver in switchTo().frame() method
    longIframes.forEach(settings => {
      it(`${settings.title}`, async () => {
        let driver = await eyes.open(webDriver, appName, `${settings.title}`, {
          width: 700,
          height: 460,
        })
        await driver.findElement(By.id(settings.clickableId)).click()
        let frame = await driver.findElement(By.css(settings.IframeSelector))
        await driver.switchTo().frame(frame)
        let element = await driver.findElement(By.css('html'))
        let rect = await element.getRect()
        await performChecksOnLongRegion(rect)
        await eyes.close()
      })
    })
  })

  describe(`Test_SCROLL`, () => {
    beforeEach(async () => {
      webDriver = await getDriver('CHROME')
      await webDriver.get('https://applitools.github.io/demo/TestPages/FramesTestPage/')
      eyes = await getEyes(StitchMode.Scroll)
      eyes.setBatch(batch)
    })

    it('TestCheckScrollableModal', async () => {
      let driver = await eyes.open(webDriver, appName, `TestCheckScrollableModal_SCROLL`, {
        width: 700,
        height: 460,
      })
      driver.findElement(By.id('centered')).click()
      let scrollRootSelector = By.id('modal1')
      await eyes.setScrollRootElement(scrollRootSelector)
      await eyes.check('TestCheckScrollableModal', Target.region(By.id('modal-content')).fully())
      await eyes.close()
    })

    // produces TypeError: Cannot read property 'getId' of undefined || which is thrown by the EyesWebDriver in switchTo().frame() method
    longIframes.forEach(settings => {
      it(`${settings.title}`, async () => {
        let driver = await eyes.open(webDriver, appName, `${settings.title}_SCROLL`, {
          width: 700,
          height: 460,
        })
        await driver.findElement(By.id(settings.clickableId)).click()
        let frame = await driver.findElement(By.css(settings.IframeSelector))
        await driver.switchTo().frame(frame)
        let element = await driver.findElement(By.css('html'))
        let rect = await element.getRect()
        await performChecksOnLongRegion(rect)
        await eyes.close()
      })
    })
  })

  async function performChecksOnLongRegion(rect) {
    for (let currentY = rect.y, c = 1; currentY < rect.y + rect.height; currentY += 5000, c++) {
      let region
      if (rect.height > currentY + 5000) {
        region = {left: rect.x, top: currentY, width: rect.width, height: 5000}
      } else {
        region = {left: rect.x, top: currentY, width: rect.width, height: rect.height - currentY}
      }
      await eyes.check('Check Long Out of bounds Iframe Modal', Target.region(region))
    }
  }
})
