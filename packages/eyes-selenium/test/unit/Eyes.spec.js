'use strict'

require('chromedriver')
const assert = require('assert')
const {Logger} = require('@applitools/eyes-sdk-core')
const {Builder, Capabilities} = require('selenium-webdriver')
const {Options: ChromeOptions} = require('selenium-webdriver/chrome')

const {startFakeEyesServer} = require('@applitools/sdk-fake-eyes-server')

const logger = new Logger(process.env.APPLITOOLS_SHOW_LOGS)

const {
  Eyes,
  VisualGridRunner,
  EyesSelenium,
  EyesVisualGrid,
  Configuration,
  StitchMode,
  RectangleSize,
  ProxySettings,
  BatchInfo,
  PropertyData,
  Target,
} = require('../../index')

describe('Eyes', function() {
  it('should create EyesSelenium by default', async function() {
    const eyes = new Eyes()
    assert.ok(!eyes.isVisualGrid())
    assert.ok(eyes instanceof EyesSelenium)
  })

  it('should create EyesVisualGrid with VisualGridRunner', async function() {
    const eyes = new Eyes(new VisualGridRunner())
    assert.ok(eyes.isVisualGrid())
    assert.ok(eyes instanceof EyesVisualGrid)
  })

  it('should create an EyesSelenium instance through fromBrowserInfo', () => {
    const eyes = Eyes.fromBrowserInfo()
    assert.ok(eyes instanceof EyesSelenium)
  })

  it('should create an EyesVisualGrid instance through fromBrowserInfo', () => {
    const eyes = Eyes.fromBrowserInfo(undefined, undefined, {
      browser: [{name: 'iPhone 4', width: 400, height: 600}],
    })
    assert.ok(eyes instanceof EyesVisualGrid)
  })

  it('set configuration from object', async function() {
    const eyes = new Eyes(new VisualGridRunner())
    const date = new Date()
    eyes.setConfiguration({
      apiKey: 'sameApiKey',
      forceFullPageScreenshot: true,
      stitchMode: 'Scroll',
      browsersInfo: [
        {
          width: 800,
          height: 600,
          name: 'firefox',
        },
        {
          deviceName: 'iPhone 4',
          screenOrientation: 'portrait',
        },
      ],
      viewportSize: {
        width: 450,
        height: 500,
      },
      proxy: 'http://localhost:8888',
      batch: {
        id: 'randomId',
        name: 'Batch name',
        startedAt: date,
      },
      properties: [
        {
          name: 'prop',
          value: 'value',
        },
      ],
      baselineEnvName: 'baselineEnvName',
      sendDom: false,
    })

    assert.ok(eyes.getConfiguration() instanceof Configuration)
    assert.strictEqual(eyes.getApiKey(), 'sameApiKey')
    assert.strictEqual(eyes.getForceFullPageScreenshot(), true)
    assert.strictEqual(eyes.getStitchMode(), StitchMode.SCROLL)
    assert.strictEqual(eyes.getConfiguration().getBrowsersInfo().length, 2)
    assert.deepStrictEqual(eyes.getConfiguration().getBrowsersInfo()[0], {
      width: 800,
      height: 600,
      name: 'firefox',
    })
    assert.deepStrictEqual(eyes.getConfiguration().getBrowsersInfo()[1], {
      deviceName: 'iPhone 4',
      screenOrientation: 'portrait',
    })
    assert.deepStrictEqual(eyes.getConfiguration().getViewportSize(), new RectangleSize(450, 500))
    assert.deepStrictEqual(eyes.getProxy(), new ProxySettings('http://localhost:8888'))
    assert.deepStrictEqual(eyes.getBatch(), new BatchInfo('Batch name', date, 'randomId'))
    assert.strictEqual(eyes.getConfiguration().getProperties().length, 1)
    assert.deepStrictEqual(
      eyes.getConfiguration().getProperties()[0],
      new PropertyData('prop', 'value'),
    )
    assert.strictEqual(eyes.getBaselineEnvName(), 'baselineEnvName')
    assert.strictEqual(eyes.getSendDom(), false)
  })

  describe('should work wait before viewport screenshot after setWaitBeforeScreenshots', function() {
    let server, driver, eyes
    let checkTimestamp, networkTimestamp, duration
    const thrownScreenshotDone = Symbol()
    before(async () => {
      server = await startFakeEyesServer({logger})
      driver = await new Builder()
        .withCapabilities(Capabilities.chrome())
        .setChromeOptions(new ChromeOptions().addArguments('disable-infobars').headless())
        .build()
      eyes = new Proxy(new Eyes(), {
        get(target, key, receiver) {
          if (key === 'checkWindowBase') {
            checkTimestamp = Date.now()
          } else if (key === '_ensureRunningSession') {
            networkTimestamp = Date.now()
          } else if (key === 'getScreenshot') {
            const screenshotTimestamp = Date.now()
            duration =
              screenshotTimestamp - checkTimestamp - (screenshotTimestamp - networkTimestamp)
            throw thrownScreenshotDone
          }
          return Reflect.get(target, key, receiver)
        },
      })
      eyes.setServerUrl(`http://localhost:${server.port}`)
      eyes.setApiKey('fakeApiKey')
      await eyes.open(driver, this.parent.title, this.title)
    })

    afterEach(() => {
      eyes.setWaitBeforeScreenshots(undefined)
    })

    it('should wait default amount of time', async () => {
      const delay = eyes.getWaitBeforeScreenshots()
      try {
        await eyes.check('wait', Target.window())
      } catch (caught) {
        if (caught === thrownScreenshotDone) {
          assert(duration >= delay && duration <= delay + 10)
        } else {
          assert.fail()
        }
      }
    })

    it('should wait specified amount of time', async () => {
      const delay = 500
      try {
        eyes.setWaitBeforeScreenshots(delay)
        await eyes.check('wait', Target.window())
      } catch (caught) {
        if (caught === thrownScreenshotDone) {
          assert(duration >= delay && duration <= delay + 10)
        } else {
          assert.fail()
        }
      }
    })

    it('should wait default amount of time set null', async () => {
      const delay = eyes.getWaitBeforeScreenshots()
      try {
        eyes.setWaitBeforeScreenshots(null)
        await eyes.check('wait', Target.window())
      } catch (caught) {
        if (caught === thrownScreenshotDone) {
          assert(duration >= delay && duration <= delay + 10)
        } else {
          assert.fail()
        }
      }
    })

    after(async () => {
      await eyes.close()
      await eyes.abort()
      await driver.quit()
      await server.close()
    })
  })
})
