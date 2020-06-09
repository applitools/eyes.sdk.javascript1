const assert = require('assert')
const {By, Builder} = require('selenium-webdriver')
const specs = require('../../../src/selenium4/SpecWrappedDriver')
const {getDriver, Browsers} = require('../../coverage/custom/util/TestSetup')

describe('SpecWrappedDriver Selenium4', () => {
  before(function() {
    if (process.env.SELENIUM_MAJOR_VERSION !== '4') {
      this.skip()
    }
  })

  describe('headless desktop', async () => {
    let driver
    const url = 'https://applitools.github.io/demo/TestPages/FramesTestPage/'

    before(async () => {
      driver = await getDriver('CHROME')
      await driver.get(url)
    })

    after(async () => {
      await driver.quit()
    })

    it('executeScript(strings, ...args)', async () => {
      const args = [0, 'string', {key: 'value'}, [0, 1, 2, 3]]
      const expected = await driver.executeScript('return arguments', ...args)
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
      const element = await driver.findElement(By.name('frame1'))
      await driver.switchTo().frame(element)
      const expected = await driver.executeScript('return document')
      await driver.switchTo().frame(null)
      await specs.switchToFrame(driver, element)
      const result = await driver.executeScript('return document')
      await driver.switchTo().frame(null)
      assert.deepStrictEqual(result, expected)
    })

    it('switchToFrame(null)', async () => {
      const top = await driver.executeScript('return document')
      const element = await driver.findElement(By.name('frame1'))
      await driver.switchTo().frame(element)
      const frame = await driver.executeScript('return document')
      assert.notStrictEqual(await frame.getId(), await top.getId())
      await specs.switchToFrame(driver, null)
      const result = await driver.executeScript('return document')
      assert.strictEqual(await result.getId(), await top.getId())
    })

    it('findElement(by)', async () => {
      const expected = await driver.findElement(By.css('#overflowing-div'))
      const result = await specs.findElement(driver, By.css('#overflowing-div'))
      assert.strictEqual(await result.getId(), await expected.getId())
    })

    it('findElements(by)', async () => {
      const expected = await driver.findElements(By.css('div'))
      const result = await specs.findElements(driver, By.css('div'))
      await Promise.all(
        expected.map(async (element, index) => {
          assert.strictEqual(await element.getId(), await result[index].getId())
        }),
      )
    })

    it('findElement(byHash)', async () => {
      const expected = await driver.findElement({id: 'overflowing-div'})
      const result = await specs.findElement(driver, {id: 'overflowing-div'})
      assert.strictEqual(await result.getId(), await expected.getId())
    })

    it('findElements(byHash)', async () => {
      const expected = await driver.findElements({tagName: 'div'})
      const result = await specs.findElements(driver, {tagName: 'div'})
      await Promise.all(
        expected.map(async (element, index) => {
          assert.strictEqual(await element.getId(), await result[index].getId())
        }),
      )
    })

    it('findElement(non-existent)', async () => {
      const result = await specs.findElement(driver, By.css('non-existent'))
      assert.strictEqual(result, null)
    })

    it('findElements(non-existent)', async () => {
      const result = await specs.findElements(driver, By.css('non-existent'))
      assert.deepStrictEqual(result, [])
    })

    it('getWindowLocation()', async () => {
      const {x, y} = await driver
        .manage()
        .window()
        .getRect()
      const result = await specs.getWindowLocation(driver)
      assert.deepStrictEqual(result, {x, y})
    })

    it('getWindowSize()', async () => {
      const {width, height} = await driver
        .manage()
        .window()
        .getRect()
      const result = await specs.getWindowSize(driver)
      assert.deepStrictEqual(result, {width, height})
    })

    it('setWindowSize({width, height})', async () => {
      const location = {width: 300, height: 310}
      await specs.setWindowSize(driver, location)
      const {width, height} = await driver
        .manage()
        .window()
        .getRect()
      assert.deepStrictEqual({width, height}, location)
    })

    it('getSessionId()', async () => {
      const session = await driver.getSession()
      const expected = session.getId()
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
      const actual = await driver.getCurrentUrl()
      assert.deepStrictEqual(actual, blank)
      await driver.get(url)
    })

    it('isMobile()', async () => {
      const result = await specs.isMobile(driver)
      assert.deepStrictEqual(result, false)
    })
  })

  describe('onscreen desktop', async () => {
    let driver

    before(async () => {
      driver = await getDriver(Browsers.chrome({headless: false}))
    })

    after(async () => {
      await driver.quit()
    })

    it('setWindowLocation({x, y})', async () => {
      await driver
        .manage()
        .window()
        .setRect({width: 300, height: 300})
      const location = {x: 100, y: 110}
      await specs.setWindowLocation(driver, location)
      const {x, y} = await driver
        .manage()
        .window()
        .getRect()
      assert.deepStrictEqual({x, y}, location)
    })
  })

  describe('mobile browser', async () => {
    let driver

    before(async () => {
      driver = await new Builder()
        .withCapabilities({
          username: process.env.SAUCE_USERNAME,
          accessKey: process.env.SAUCE_ACCESS_KEY,
          deviceName: 'Google Pixel 3a XL GoogleAPI Emulator',
          platformName: 'Android',
          platformVersion: '10.0',
          deviceOrientation: 'landscape',
          appiumVersion: '1.8.0',
          browserName: 'Chrome',
          browserVersion: 'latest',
        })
        .usingServer('https://ondemand.saucelabs.com/wd/hub')
        .build()
    })

    after(async () => {
      await driver.quit()
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
      assert.strictEqual(result, 'landscape')
    })

    it('getPlatformVersion()', async () => {
      const result = await specs.getPlatformVersion(driver)
      assert.strictEqual(result, '10')
    })
  })

  describe('native app', async () => {
    let driver

    before(async () => {
      driver = await new Builder()
        .withCapabilities({
          username: process.env.SAUCE_USERNAME,
          accessKey: process.env.SAUCE_ACCESS_KEY,
          browserName: '',
          name: 'AndroidNativeAppTest1',
          platformName: 'Android',
          deviceName: 'Android Emulator',
          platformVersion: '6.0',
          app: 'http://saucelabs.com/example_files/ContactManager.apk',
          clearSystemFiles: true,
          noReset: true,
        })
        .usingServer('https://ondemand.saucelabs.com/wd/hub')
        .build()
    })

    after(async () => {
      await driver.quit()
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
      assert.strictEqual(result, 'portrait')
    })

    it('getPlatformVersion()', async () => {
      const result = await specs.getPlatformVersion(driver)
      assert.strictEqual(result, '6.0')
    })
  })
})
