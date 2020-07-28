const assert = require('assert')
const chromedriver = require('chromedriver')
const {remote} = require('webdriverio')
const specs = require('../../src/SpecWrappedDriver')

describe('SpecWrappedDriver', async () => {
  before(async () => {
    await chromedriver.start([], true)
  })

  after(async () => {
    chromedriver.stop()
  })

  describe('headless desktop', async () => {
    let driver
    const url = 'https://applitools.github.io/demo/TestPages/FramesTestPage/'

    before(async () => {
      driver = remote({
        desiredCapabilities: {
          browserName: 'chrome',
          chromeOptions: {
            args: ['disable-infobars', 'headless'],
          },
        },
        logLevel: 'error',
        port: 9515,
        path: '/',
      })
      await driver.init()
      await driver.url(url)
    })

    after(async () => {
      await driver.end()
    })

    it('executeScript(strings, ...args)', async () => {
      const args = [0, 'string', {key: 'value'}, [0, 1, 2, 3]]
      const {value: expected} = await driver.execute('return arguments', ...args)
      const result = await specs.executeScript(driver, 'return arguments', ...args)
      assert.deepStrictEqual(result, expected)
    })
    it('sleep(number)', async () => {
      const sleep = 1000
      const startAt = Date.now()
      await specs.sleep(driver, sleep)
      const duration = Date.now() - startAt
      assert.ok(duration >= sleep && duration <= sleep + 10)
    })
    it('switchToFrame(element)', async () => {
      const {value: element} = await driver.$('[name="frame1"]')
      await driver.frame(element)
      const {value: expected} = await driver.execute('return document')
      await driver.frame(null)
      await specs.switchToFrame(driver, element)
      const {value: result} = await driver.execute('return document')
      await driver.frame(null)
      assert.deepStrictEqual(result, expected)
    })
    it('switchToFrame(null)', async () => {
      const {value: top} = await driver.execute('return document')
      const {value: element} = await driver.$('[name="frame1"]')
      await driver.frame(element)
      const {value: frame} = await driver.execute('return document')
      assert.notDeepStrictEqual(frame, top)
      await specs.switchToFrame(driver, null)
      const {value: result} = await driver.execute('return document')
      assert.deepStrictEqual(result, top)
    })
    it('findElement(string)', async () => {
      const {value: expected} = await driver.element('#overflowing-div')
      const result = await specs.findElement(driver, '#overflowing-div')
      assert.deepStrictEqual(result, expected)
    })
    it('findElements(string)', async () => {
      const {value: expected} = await driver.elements('div')
      const result = await specs.findElements(driver, 'div')
      assert.deepStrictEqual(result, expected)
    })
    it('findElement(non-existent)', async () => {
      const result = await specs.findElement(driver, 'non-existent')
      assert.deepStrictEqual(result, null)
    })
    it('findElements(non-existent)', async () => {
      const result = await specs.findElements(driver, 'non-existent')
      assert.deepStrictEqual(result, [])
    })
    it('getWindowLocation()', async () => {
      const {value: expected} = await driver.windowHandlePosition()
      const {x, y} = expected
      const result = await specs.getWindowLocation(driver)
      assert.deepStrictEqual(result, {x, y})
    })
    it('getWindowSize()', async () => {
      const {value: expected} = await driver.windowHandleSize()
      const {width, height} = expected
      const result = await specs.getWindowSize(driver)
      assert.deepStrictEqual(result, {width, height})
    })
    it('setWindowSize({width, height})', async () => {
      const location = {width: 300, height: 310}
      await specs.setWindowSize(driver, location)
      const {value: actual} = await driver.windowHandleSize()
      const {width, height} = actual
      assert.deepStrictEqual({width, height}, location)
    })
    it('getSessionId()', async () => {
      const expected = driver.requestHandler.sessionID
      const result = await specs.getSessionId(driver)
      assert.deepStrictEqual(result, expected)
    })
    it('getTitle()', async () => {
      const expected = await driver.getTitle()
      const result = await specs.getTitle(driver)
      assert.deepStrictEqual(result, expected)
    })
    it('getUrl()', async () => {
      const result = await specs.getUrl(driver)
      assert.deepStrictEqual(result, url)
    })
    it('visit()', async () => {
      const blank = 'about:blank'
      await specs.visit(driver, blank)
      const actual = await driver.getUrl()
      assert.deepStrictEqual(actual, blank)
      await driver.url(driver, url)
    })
    it('isMobile()', async () => {
      const result = await specs.isMobile(driver)
      assert.deepStrictEqual(result, false)
    })
  })

  describe('onscreen desktop', async () => {
    let driver

    before(async () => {
      driver = remote({
        desiredCapabilities: {
          browserName: 'chrome',
          chromeOptions: {
            args: ['disable-infobars'],
          },
        },
        logLevel: 'error',
        port: 9515,
        path: '/',
      })
      await driver.init()
    })

    after(async () => {
      await driver.end()
    })

    it('setWindowLocation({x, y})', async () => {
      await driver.windowHandleSize({width: 300, height: 300})
      const location = {x: 100, y: 110}
      await specs.setWindowLocation(driver, location)
      const {value: actual} = await driver.windowHandlePosition()
      const {x, y} = actual
      assert.deepStrictEqual({x, y}, location)
    })
  })

  describe('mobile browser', async () => {
    let driver

    before(async () => {
      driver = remote({
        port: '80',
        path: '/wd/hub',
        host: 'ondemand.saucelabs.com',
        desiredCapabilities: {
          browserName: 'Chrome',
          platformName: 'Android',
          platformVersion: '10.0',
          deviceName: 'Google Pixel 3a XL GoogleAPI Emulator',
          deviceOrientation: 'portrait',
          username: process.env.SAUCE_USERNAME,
          accesskey: process.env.SAUCE_ACCESS_KEY,
        },
      })
      await driver.init()
    })

    after(async () => {
      await driver.end()
    })

    it('isMobile()', async () => {
      const result = await specs.isMobile(driver)
      assert.strictEqual(result, true)
    })

    it('isAndroid()', async () => {
      const result = await specs.isAndroid(driver)
      assert.strictEqual(result, true)
    })

    it('isIOS()', async () => {
      const result = await specs.isIOS(driver)
      assert.strictEqual(result, false)
    })

    it('isNative()', async () => {
      const result = await specs.isNative(driver)
      assert.strictEqual(result, false)
    })

    it('getOrientation()', async () => {
      const result = await specs.getOrientation(driver)
      assert.strictEqual(result, 'portrait')
    })

    it('getPlatformVersion()', async () => {
      const result = await specs.getPlatformVersion(driver)
      assert.strictEqual(result, '10.0')
    })
  })

  describe('native app', async () => {
    let driver

    before(async () => {
      driver = remote({
        port: '80',
        path: '/wd/hub',
        host: 'ondemand.saucelabs.com',
        desiredCapabilities: {
          browserName: '',
          name: 'Android Demo',
          platformName: 'Android',
          platformVersion: '7.0',
          appiumVersion: '1.17.1',
          deviceName: 'Samsung Galaxy S8 FHD GoogleAPI Emulator',
          app: 'https://applitools.bintray.com/Examples/eyes-android-hello-world.apk',
          deviceOrientation: 'landscape',
          automationName: 'uiautomator2',
          username: process.env.SAUCE_USERNAME,
          accesskey: process.env.SAUCE_ACCESS_KEY,
        },
      })
      await driver.init()
    })

    after(async () => {
      await driver.end()
    })

    it('isMobile()', async () => {
      const result = await specs.isMobile(driver)
      assert.strictEqual(result, true)
    })

    it('isAndroid()', async () => {
      const result = await specs.isAndroid(driver)
      assert.strictEqual(result, true)
    })

    it('isIOS()', async () => {
      const result = await specs.isIOS(driver)
      assert.strictEqual(result, false)
    })

    it('isNative()', async () => {
      const result = await specs.isNative(driver)
      assert.strictEqual(result, true)
    })

    it('getOrientation()', async () => {
      const result = await specs.getOrientation(driver)
      assert.strictEqual(result, 'landscape')
    })

    it('getPlatformVersion()', async () => {
      const result = await specs.getPlatformVersion(driver)
      assert.strictEqual(result, '7.0')
    })

    it('getNativeElementLocation()', async () => {
      const el = await specs.findElement(driver, 'android.widget.Button')
      const result = await specs.getNativeElementLocation(driver, el)
      assert.deepStrictEqual(result, {x: 904, y: 781})
    })

    it('getNativeElementSize()', async () => {
      const el = await specs.findElement(driver, 'android.widget.Button')
      const result = await specs.getNativeElementSize(driver, el)
      assert.deepStrictEqual(result, {height: 144, width: 269})
    })
  })
})
