'use strict'
const path = require('path')
const {getEyes, Browsers} = require('../util/TestSetup')
const cwd = process.cwd()
const spec = require(path.resolve(cwd, 'src/SpecWrappedDriver'))
const {Target, Region} = require(cwd)

const appName = 'Eyes Selenium SDK - Fluent API'
describe(appName, () => {
  let webDriver, eyes

  afterEach(async () => {
    await eyes.abortIfNotClosed()
    await spec.cleanup(webDriver)
  })

  describe.skip(`Test`, () => {
    beforeEach(async () => {
      webDriver = await spec.build({capabilities: Browsers.chrome()})
      await spec.visit(webDriver, 'https://applitools.github.io/demo/TestPages/FramesTestPage/')
      eyes = await getEyes({isCssStitching: true})
    })

    it('TestCheckRegionInFrame2_Fluent', async () => {
      await eyes.open(webDriver, appName, `TestCheckRegionInFrame2_Fluent`, {
        width: 700,
        height: 460,
      })
      await eyes.check(
        'Fluent - Inner frame div 1',
        Target.frame('frame1')
          .region('#inner-frame-div')
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
          .region('img')
          .fully(),
      )
      await eyes.close()
    })

    it('TestCheckScrollableModal', async () => {
      let driver = await eyes.open(webDriver, appName, `TestCheckScrollableModal`, {
        width: 700,
        height: 460,
      })
      const el = await spec.findElement(driver, '#centered')
      await spec.click(driver, el)
      await eyes.check(
        'TestCheckScrollableModal',
        Target.region('#modal-content')
          .fully()
          .scrollRootElement('#modal1'),
      )
      await eyes.close()
    })

    it.skip(`TestCheckLongIFrameModal`, async () => {
      let driver = await eyes.open(webDriver, appName, `TestCheckLongIFrameModal`, {
        width: 700,
        height: 460,
      })
      const el = await spec.findElement(driver, '#stretched')
      await spec.click(driver, el)
      let frame = await spec.findElement(driver, '#modal2 iframe')
      await spec.switchToFrame(driver, frame)
      let element = await spec.findElement(driver, 'html')
      let rect = await getElementRect(element)
      await performChecksOnLongRegion(rect, eyes)
      await eyes.close()
    })

    it.skip(`TestCheckLongOutOfBoundsIFrameModal`, async () => {
      let driver = await eyes.open(webDriver, appName, `TestCheckLongOutOfBoundsIFrameModal`, {
        width: 700,
        height: 460,
      })
      const el = await spec.findElement(driver, '#hidden_click')
      await spec.click(driver, el)
      let frame = await spec.findElement(driver, '#modal3 iframe')
      await spec.switchToFrame(driver, frame)
      let element = await spec.findElement(driver, 'html')
      let rect = await getElementRect(element)
      await performChecksOnLongRegion(rect, eyes)
      await eyes.close()
    })
  })

  describe(`Test_SCROLL`, () => {
    beforeEach(async () => {
      webDriver = await spec.build({capabilities: Browsers.chrome()})
      await spec.visit(webDriver, 'https://applitools.github.io/demo/TestPages/FramesTestPage/')
      eyes = await getEyes()
    })

    it('TestCheckRegionInFrame2_Fluent', async () => {
      await eyes.open(webDriver, appName, `TestCheckRegionInFrame2_Fluent_SCROLL`, {
        width: 700,
        height: 460,
      })
      await eyes.check(
        'Fluent - Inner frame div 1',
        Target.frame('frame1')
          .region('#inner-frame-div')
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
          .region('img')
          .fully(),
      )
      await eyes.close()
    })

    it('TestCheckScrollableModal', async () => {
      let driver = await eyes.open(webDriver, appName, `TestCheckScrollableModal_Scroll`, {
        width: 700,
        height: 460,
      })
      const el = await spec.findElement(driver, '#centered')
      await spec.click(driver, el)
      await eyes.check(
        'TestCheckScrollableModal',
        Target.region('#modal-content')
          .fully()
          .scrollRootElement('#modal1'),
      )
      await eyes.close()
    })

    it.skip(`TestCheckLongIFrameModal`, async () => {
      let driver = await eyes.open(webDriver, appName, `TestCheckLongIFrameModal_Scroll`, {
        width: 700,
        height: 460,
      })
      const el = await spec.findElement(driver, '#stretched')
      await spec.click(driver, el)
      let frame = await spec.findElement(driver, '#modal2 iframe')
      await spec.switchToFrame(driver, frame)
      let element = await spec.findElement(driver, 'html')
      let rect = await getElementRect(element)
      await performChecksOnLongRegion(rect, eyes)
      await eyes.close()
    })

    it.skip(`TestCheckLongOutOfBoundsIFrameModal`, async () => {
      let driver = await eyes.open(
        webDriver,
        appName,
        `TestCheckLongOutOfBoundsIFrameModal_Scroll`,
        {
          width: 700,
          height: 460,
        },
      )
      const el = await spec.findElement(driver, '#hidden_click')
      await spec.click(driver, el)
      let frame = await spec.findElement(driver, '#modal3 iframe')
      await spec.switchToFrame(driver, frame)
      let element = await spec.findElement(driver, 'html')
      let rect = await getElementRect(element)
      await performChecksOnLongRegion(rect, eyes)
      await eyes.close()
    })
  })

  describe(`Test_VG`, () => {
    beforeEach(async () => {
      webDriver = await spec.build({capabilities: Browsers.chrome()})
      await spec.visit(webDriver, 'https://applitools.github.io/demo/TestPages/FramesTestPage/')
      eyes = await getEyes({isVisualGrid: true})
    })

    it('TestCheckScrollableModal', async () => {
      let driver = await eyes.open(webDriver, appName, `TestCheckScrollableModal_VG`, {
        width: 700,
        height: 460,
      })
      const el = await spec.findElement(driver, '#centered')
      await spec.click(driver, el)
      await eyes.check(
        'TestCheckScrollableModal',
        Target.region('#modal-content')
          .fully()
          .scrollRootElement('#modal-content'),
      )
      await eyes.close()
    })

    it(`TestCheckLongIFrameModal`, async () => {
      let driver = await eyes.open(webDriver, appName, `TestCheckLongIFrameModal_VG`, {
        width: 700,
        height: 460,
      })
      const el = await spec.findElement(driver, '#stretched')
      await spec.click(driver, el)
      let frame = await spec.findElement(driver, '#modal2 iframe')
      await spec.switchToFrame(driver, frame)
      let element = await spec.findElement(driver, 'html')
      let rect = await getElementRect(element)
      await performChecksOnLongRegion(rect, eyes)
      await eyes.close()
    })

    it(`TestCheckLongOutOfBoundsIFrameModal`, async () => {
      let driver = await eyes.open(webDriver, appName, `TestCheckLongOutOfBoundsIFrameModal_VG`, {
        width: 700,
        height: 460,
      })
      const el = await spec.findElement(driver, '#hidden_click')
      await spec.click(driver, el)
      let frame = await spec.findElement(driver, '#modal3 iframe')
      await spec.switchToFrame(driver, frame)
      let element = await spec.findElement(driver, 'html')
      let rect = await getElementRect(element)
      await performChecksOnLongRegion(rect, eyes)
      await eyes.close()
    })
  })

  async function getElementRect(el) {
    try {
      return spec.getElementRect(webDriver, el)
    } catch (err) {
      const size = await el.getSize()
      const location = await el.getLocation()
      return {...size, ...location}
    }
  }
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
