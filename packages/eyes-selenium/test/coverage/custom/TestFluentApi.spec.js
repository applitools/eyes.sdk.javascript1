'use strict'
const {By} = require('selenium-webdriver')
const {getDriver, getEyes} = require('./util/TestSetup')
const {Target, Region, StitchMode} = require('../../../index')
const appName = 'Eyes Selenium SDK - Fluent API'
describe(appName, () => {
  let webDriver, eyes

  afterEach(async () => {
    await eyes.abortIfNotClosed()
    await webDriver.quit()
  })

  describe.skip(`Test`, () => {
    beforeEach(async () => {
      webDriver = await getDriver('CHROME')
      await webDriver.get('https://applitools.github.io/demo/TestPages/FramesTestPage/')
      ;({eyes} = await getEyes('classic', StitchMode.CSS))
    })

    it('TestCheckRegionInFrame2_Fluent', async () => {
      await eyes.open(webDriver, appName, `TestCheckRegionInFrame2_Fluent`, {
        width: 700,
        height: 460,
      })
      await eyes.check(
        'Fluent - Inner frame div 1',
        Target.frame('frame1')
          .region(By.id('inner-frame-div'))
          .fully()
          .ignoreRegions(new Region(50, 50, 100, 100)),
      )
      await eyes.close()
    })

    it('TestCheckRegionInFrameInFrame_Fluent', async () => {
      await eyes.open(webDriver, appName, `TestCheckRegionInFrameInFrame_Fluent`, {
        width: 700,
        height: 460,
      })
      await eyes.check(
        'Fluent - Region in Frame in Frame',
        Target.frame('frame1')
          .frame('frame1-1')
          .region(By.css('img'))
          .fully(),
      )
      await eyes.close()
    })

    it('TestCheckScrollableModal', async () => {
      let driver = await eyes.open(webDriver, appName, `TestCheckScrollableModal`, {
        width: 700,
        height: 460,
      })
      driver.findElement(By.id('centered')).click()
      let scrollRootSelector = By.id('modal1')
      await eyes.check(
        'TestCheckScrollableModal',
        Target.region(By.id('modal-content'))
          .fully()
          .scrollRootElement(scrollRootSelector),
      )
      await eyes.close()
    })

    it(`TestCheckLongIFrameModal`, async () => {
      let driver = await eyes.open(webDriver, appName, `TestCheckLongIFrameModal`, {
        width: 700,
        height: 460,
      })
      await driver.findElement(By.id('stretched')).click()
      let frame = await driver.findElement(By.css('#modal2 iframe'))
      await driver.switchTo().frame(frame)
      let element = await driver.findElement(By.css('html'))
      let rect = await element.getRect()
      await performChecksOnLongRegion(rect, eyes)
      await eyes.close()
    })

    it(`TestCheckLongOutOfBoundsIFrameModal`, async () => {
      let driver = await eyes.open(webDriver, appName, `TestCheckLongOutOfBoundsIFrameModal`, {
        width: 700,
        height: 460,
      })
      await driver.findElement(By.id('hidden_click')).click()
      let frame = await driver.findElement(By.css('#modal3 iframe'))
      await driver.switchTo().frame(frame)
      let element = await driver.findElement(By.css('html'))
      let rect = await element.getRect()
      await performChecksOnLongRegion(rect, eyes)
      await eyes.close()
    })
  })

  describe.skip(`Test_SCROLL`, () => {
    beforeEach(async () => {
      webDriver = await getDriver('CHROME')
      await webDriver.get('https://applitools.github.io/demo/TestPages/FramesTestPage/')
      ;({eyes} = await getEyes('classic', StitchMode.SCROLL))
    })

    it('TestCheckRegionInFrame2_Fluent', async () => {
      await eyes.open(webDriver, appName, `TestCheckRegionInFrame2_Fluent_SCROLL`, {
        width: 700,
        height: 460,
      })
      await eyes.check(
        'Fluent - Inner frame div 1',
        Target.frame('frame1')
          .region(By.id('inner-frame-div'))
          .fully()
          .ignoreRegions(new Region(50, 50, 100, 100)),
      )
      await eyes.close()
    })

    it('TestCheckRegionInFrameInFrame_Fluent', async () => {
      await eyes.open(webDriver, appName, `TestCheckRegionInFrameInFrame_Fluent_SCROLL`, {
        width: 700,
        height: 460,
      })
      await eyes.check(
        'Fluent - Region in Frame in Frame',
        Target.frame('frame1')
          .frame('frame1-1')
          .region(By.css('img'))
          .fully(),
      )
      await eyes.close()
    })

    it('TestCheckScrollableModal', async () => {
      let driver = await eyes.open(webDriver, appName, `TestCheckScrollableModal_Scroll`, {
        width: 700,
        height: 460,
      })
      driver.findElement(By.id('centered')).click()
      let scrollRootSelector = By.id('modal1')
      await eyes.check(
        'TestCheckScrollableModal',
        Target.region(By.id('modal-content'))
          .fully()
          .scrollRootElement(scrollRootSelector),
      )
      await eyes.close()
    })

    it(`TestCheckLongIFrameModal`, async () => {
      let driver = await eyes.open(webDriver, appName, `TestCheckLongIFrameModal_Scroll`, {
        width: 700,
        height: 460,
      })
      await driver.findElement(By.id('stretched')).click()
      let frame = await driver.findElement(By.css('#modal2 iframe'))
      await driver.switchTo().frame(frame)
      let element = await driver.findElement(By.css('html'))
      let rect = await element.getRect()
      await performChecksOnLongRegion(rect, eyes)
      await eyes.close()
    })

    it(`TestCheckLongOutOfBoundsIFrameModal`, async () => {
      let driver = await eyes.open(
        webDriver,
        appName,
        `TestCheckLongOutOfBoundsIFrameModal_Scroll`,
        {
          width: 700,
          height: 460,
        },
      )
      await driver.findElement(By.id('hidden_click')).click()
      let frame = await driver.findElement(By.css('#modal3 iframe'))
      await driver.switchTo().frame(frame)
      let element = await driver.findElement(By.css('html'))
      let rect = await element.getRect()
      await performChecksOnLongRegion(rect, eyes)
      await eyes.close()
    })
  })

  describe(`Test_VG`, () => {
    beforeEach(async () => {
      webDriver = await getDriver('CHROME')
      await webDriver.get('https://applitools.github.io/demo/TestPages/FramesTestPage/')
      ;({eyes} = await getEyes('VG'))
    })

    it.skip('TestCheckScrollableModal', async () => {
      let driver = await eyes.open(webDriver, appName, `TestCheckScrollableModal_VG`, {
        width: 700,
        height: 460,
      })
      driver.findElement(By.id('centered')).click()
      let scrollRootSelector = By.id('modal-content')
      await eyes.check(
        'TestCheckScrollableModal',
        Target.region(By.id('modal-content'))
          .fully()
          .scrollRootElement(scrollRootSelector),
      )
      await eyes.close()
    })

    it(`TestCheckLongIFrameModal`, async () => {
      let driver = await eyes.open(webDriver, appName, `TestCheckLongIFrameModal_VG`, {
        width: 700,
        height: 460,
      })
      await driver.findElement(By.id('stretched')).click()
      let frame = await driver.findElement(By.css('#modal2 iframe'))
      await driver.switchTo().frame(frame)
      let element = await driver.findElement(By.css('html'))
      let rect = await element.getRect()
      await performChecksOnLongRegion(rect, eyes)
      await eyes.close()
    })

    it(`TestCheckLongOutOfBoundsIFrameModal`, async () => {
      let driver = await eyes.open(webDriver, appName, `TestCheckLongOutOfBoundsIFrameModal_VG`, {
        width: 700,
        height: 460,
      })
      await driver.findElement(By.id('hidden_click')).click()
      let frame = await driver.findElement(By.css('#modal3 iframe'))
      await driver.switchTo().frame(frame)
      let element = await driver.findElement(By.css('html'))
      let rect = await element.getRect()
      await performChecksOnLongRegion(rect, eyes)
      await eyes.close()
    })
  })
})

async function performChecksOnLongRegion(rect, eyes) {
  for (let currentY = rect.y, c = 1; currentY < rect.y + rect.height; currentY += 5000, c++) {
    let region
    if (rect.height > currentY + 5000) {
      region = new Region(rect.x, currentY, rect.width, 5000)
    } else {
      region = new Region(rect.x, currentY, rect.width, rect.height - currentY)
    }
    await eyes.check('Check Long Out of bounds Iframe Modal', Target.region(region))
  }
}
