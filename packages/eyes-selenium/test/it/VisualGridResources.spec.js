'use strict'

require('chromedriver')
const {getDriver} = require('../coverage/custom/util/TestSetup')
const {
  Eyes,
  VisualGridRunner,
  Target,
  Configuration,
  BrowserType,
  RectangleSize,
  BatchInfo,
  Region,
  CorsIframeHandle,
  ConsoleLogHandler,
} = require('../../index')

let driver

describe('VisualGrid Resources', () => {
  before(async function() {
    driver = await getDriver('CHROME')
  })

  it('should ignore CORS frames', async () => {
    await driver.get('https://applitools.github.io/demo/TestPages/VisualGridTestPage')

    const batchInfo = new BatchInfo('EyesRenderingBatch')
    batchInfo.setSequenceName('alpha sequence')

    const eyes = new Eyes(new VisualGridRunner())
    eyes.setBatch(batchInfo)
    eyes.setCorsIframeHandle(CorsIframeHandle.BLANK)
    if (process.env.APPLITOOLS_SHOW_LOGS) {
      eyes.setLogHandler(new ConsoleLogHandler(true))
    }

    const configuration = new Configuration()
    configuration.setTestName('Open Concurrency with Batch 2')
    configuration.setAppName('RenderingGridIntegration')
    configuration.addBrowser(800, 600, BrowserType.CHROME)
    configuration.addBrowser(700, 500, BrowserType.CHROME)
    configuration.addBrowser(400, 300, BrowserType.CHROME)
    eyes.setConfiguration(configuration)

    await eyes.open(driver)

    await eyes.setViewportSize(new RectangleSize({width: 800, height: 600}))

    await eyes.check('window', Target.window().ignoreRegions(new Region(200, 200, 50, 100)))

    await eyes.check('region', Target.region(new Region(200, 200, 50, 100)))

    await eyes.check('selector', Target.region({css: '#scroll1'}))

    await eyes.close()
  })

  it('should handle a page with invalid resources', async function() {
    await driver.get('https://astappiev.github.io/test-html-pages/index-invalid-resource.html')

    const eyes = new Eyes(new VisualGridRunner())
    if (process.env.APPLITOOLS_SHOW_LOGS) {
      eyes.setLogHandler(new ConsoleLogHandler(true))
    }
    await eyes.open(driver, 'Applitools Eyes JavaScript SDK', this.test.title, {
      width: 800,
      height: 600,
    })

    await eyes.check('window', Target.window())

    await eyes.close()
  })

  after(async () => {
    if (driver) {
      await driver.quit()
    }
  })
})
