const assert = require('assert')
const spec = require('../../dist/spec-driver')
const {By} = require('../../dist/legacy')

describe('spec driver', async () => {
  let browser, destroyBrowser
  const url = 'https://applitools.github.io/demo/TestPages/FramesTestPage/'

  describe('headless desktop (@webdriver)', async () => {
    before(function () {
      if (process.env.APPLITOOLS_WEBDRIVERIO_PROTOCOL === 'cdp') this.skip()
    })

    before(async () => {
      ;[browser, destroyBrowser] = await spec.build({browser: 'chrome'})
      await browser.url(url)
    })

    after(async () => {
      if (destroyBrowser) await destroyBrowser()
      destroyBrowser = null
    })

    it('isDriver(driver)', async () => {
      await isDriver({expected: true})
    })
    it('isDriver(wrong)', async () => {
      await isDriver({input: {}, expected: false})
    })
    it('isElement(element)', async () => {
      await isElement({input: () => browser.findElement('css selector', 'div'), expected: true})
    })
    it('isElement(extended-element)', async () => {
      await isElement({input: () => browser.$('div'), expected: true})
    })
    it('isElement(wrong)', async () => {
      await isElement({input: () => ({}), expected: false})
    })
    it('isSelector(string)', async () => {
      await isSelector({input: 'div', expected: true})
    })
    it('isSelector(function)', async () => {
      await isSelector({input: () => void 0, expected: true})
    })
    it('isSelector(by)', async () => {
      await isSelector({input: By.xpath('//div'), expected: true})
    })
    it('isSelector(wrong)', async () => {
      await isSelector({input: {}, expected: false})
    })
    it('transformElement(element)', async () => {
      await transformElement({input: () => browser.findElement('css selector', 'div')})
    })
    it('transformElement(extended-element)', async () => {
      await transformElement({input: () => browser.$('div')})
    })
    it('isEqualElements(element, element)', async () => {
      await isEqualElements({
        input: () => browser.$('div').then(element => ({element1: element, element2: element})),
        expected: true,
      })
    })
    it('isEqualElements(element1, element2)', async () => {
      isEqualElements({
        input: async () => ({element1: await browser.$('div'), element2: await browser.$('h1')}),
        expected: false,
      })
    })
    it('extractSelector(element)', async () => {
      await extractSelector({input: () => browser.findElement('css selector', 'div'), expected: undefined})
    })
    it('extractSelector(extended-element)', async () => {
      await extractSelector({input: () => browser.$('div'), expected: 'div'})
    })
    it('executeScript(strings, args)', async () => {
      await executeScript()
    })
    it('findElement(string)', async () => {
      await findElement({input: '#overflowing-div'})
    })
    it('findElements(string)', async () => {
      await findElements({input: 'div'})
    })
    it('findElement(function)', async () => {
      await findElement({
        input: function () {
          return this.document.getElementById('overflowing-div')
        },
      })
    })
    it('findElements(function)', async () => {
      await findElements({
        input: function () {
          return this.document.querySelectorAll('div')
        },
      })
    })
    it('findElement(non-existent)', async () => {
      await findElement({input: 'non-existent', expected: null})
    })
    it('findElements(non-existent)', async () => {
      findElements({input: 'non-existent', expected: []})
    })
    it('mainContext()', async () => {
      await mainContext()
    })
    it('parentContext()', async () => {
      await parentContext()
    })
    it('childContext(element)', async () => {
      await childContext()
    })
    it('getTitle()', async () => {
      await getTitle()
    })
    it('getUrl()', async () => {
      await getUrl()
    })
    it('visit()', async () => {
      await visit()
    })
    it('getDeviceInfo()', async () => {
      await getDeviceInfo({
        expected: {
          browserName: 'chrome',
          isMobile: false,
          isNative: false,
          platformName: 'linux',
        },
      })
    })
    it('getCookies()', async () => {
      await getCookies()
    })
  })

  describe('onscreen desktop (@webdriver)', async () => {
    before(function () {
      if (process.env.APPLITOOLS_WEBDRIVERIO_PROTOCOL === 'cdp') this.skip()
    })

    before(async () => {
      ;[browser, destroyBrowser] = await spec.build({browser: 'chrome', headless: false})
    })

    after(async () => {
      if (destroyBrowser) await destroyBrowser()
      destroyBrowser = null
    })

    it('getWindowSize()', async () => {
      await getWindowSize()
    })
    it('setWindowSize({width, height})', async () => {
      await setWindowSize({
        input: {width: 551, height: 552},
        expected: {width: 551, height: 552},
      })
    })
  })

  describe('legacy browser (@webdriver)', async () => {
    before(function () {
      if (process.env.APPLITOOLS_WEBDRIVERIO_PROTOCOL === 'cdp') this.skip()
    })

    before(async () => {
      ;[browser, destroyBrowser] = await spec.build({browser: 'ie-11', legacy: true})
    })

    after(async () => {
      if (destroyBrowser) await destroyBrowser()
      destroyBrowser = null
    })

    it('getWindowSize()', async () => {
      await getWindowSize({legacy: true})
    })
    it('setWindowSize({width, height})', async () => {
      await setWindowSize({
        legacy: true,
        input: {width: 551, height: 552},
        expected: {width: 551, height: 552},
      })
    })
    it('getDeviceInfo()', async () => {
      await getDeviceInfo({
        expected: {
          browserName: 'internet explorer',
          browserVersion: '11',
          isMobile: false,
          isNative: false,
          platformName: 'WINDOWS',
        },
      })
    })
    it('getCookies()', async () => {
      await spec.visit(browser, url)
      await getCookies(true, {
        all: false,
        cookies: [
          {
            domain: undefined,
            expiry: undefined,
            sameSite: undefined,
            httpOnly: false,
            path: '/',
            secure: true,
            name: 'hello',
            value: 'world',
          },
        ],
      })
    })
  })

  describe('mobile browser (@mobile)', async () => {
    before(function () {
      if (process.env.APPLITOOLS_WEBDRIVERIO_PROTOCOL === 'cdp') this.skip()
    })

    before(async () => {
      ;[browser, destroyBrowser] = await spec.build({browser: 'chrome', device: 'Pixel 3a XL'})
    })

    after(async () => {
      if (destroyBrowser) await destroyBrowser()
      destroyBrowser = null
    })

    it('getWindowSize()', async () => {
      await getWindowSize()
    })
    it('getOrientation()', async () => {
      await getOrientation({expected: 'portrait'})
    })
    it('getDeviceInfo()', async () => {
      await getDeviceInfo({
        expected: {
          browserName: 'chrome',
          deviceName: 'Google Pixel 3a XL GoogleAPI Emulator',
          isMobile: true,
          isNative: false,
          platformName: 'Android',
          platformVersion: '10',
        },
      })
    })
    it('getCookies()', async () => {
      await spec.visit(browser, url)
      await getCookies(true, {
        all: false,
        cookies: [
          {
            domain: 'applitools.github.io',
            expiry: undefined,
            sameSite: undefined,
            httpOnly: false,
            path: '/',
            secure: true,
            name: 'hello',
            value: 'world',
          },
        ],
      })
    })
  })

  describe('native app (@mobile @native)', async () => {
    before(function () {
      if (process.env.APPLITOOLS_WEBDRIVERIO_PROTOCOL === 'cdp') this.skip()
    })

    before(async () => {
      ;[browser, destroyBrowser] = await spec.build({
        app: 'http://saucelabs.com/example_files/ContactManager.apk',
        device: 'Android Emulator',
        orientation: 'landscape',
      })
    })

    after(async () => {
      if (destroyBrowser) await destroyBrowser()
      destroyBrowser = null
    })

    it('getWindowSize()', async () => {
      await getWindowSize()
    })
    it('getOrientation()', async () => {
      await getOrientation({expected: 'landscape'})
    })
    it('getDeviceInfo()', async () => {
      await getDeviceInfo({
        expected: {
          deviceName: 'Android Emulator',
          isMobile: true,
          isNative: true,
          platformName: 'Android',
          platformVersion: '6.0',
        },
      })
    })
  })

  describe('headless desktop (@puppeteer)', async () => {
    before(function () {
      if (Number(process.env.APPLITOOLS_WEBDRIVERIO_MAJOR_VERSION) < 7) this.skip()
    })

    before(async () => {
      ;[browser, destroyBrowser] = await spec.build({browser: 'chrome', protocol: 'cdp'})
      await browser.url(url)
    })

    after(async () => {
      if (destroyBrowser) await destroyBrowser()
      destroyBrowser = null
    })

    it('isDriver(driver)', async () => {
      await isDriver({expected: true})
    })
    it('isDriver(wrong)', async () => {
      await isDriver({input: {}, expected: false})
    })
    it('isElement(element)', async () => {
      await isElement({input: () => browser.findElement('css selector', 'div'), expected: true})
    })
    it('isElement(extended-element)', async () => {
      await isElement({input: () => browser.$('div'), expected: true})
    })
    it('isElement(wrong)', async () => {
      await isElement({input: () => ({}), expected: false})
    })
    it('isSelector(string)', async () => {
      await isSelector({input: 'div', expected: true})
    })
    it('isSelector(function)', async () => {
      await isSelector({input: () => void 0, expected: true})
    })
    it('isSelector(by)', async () => {
      await isSelector({input: By.xpath('//div'), expected: true})
    })
    it('isSelector(wrong)', async () => {
      await isSelector({input: {}, expected: false})
    })
    it('transformElement(element)', async () => {
      await transformElement({input: () => browser.findElement('css selector', 'div')})
    })
    it('transformElement(extended-element)', async () => {
      await transformElement({input: () => browser.$('div')})
    })
    it('extractSelector(element)', async () => {
      await extractSelector({
        input: () => browser.findElement('css selector', 'div'),
        expected: undefined,
      })
    })
    it('extractSelector(extended-element)', async () => {
      await extractSelector({input: () => browser.$('div'), expected: 'div'})
    })
    it('executeScript(strings, args)', async () => {
      await executeScript()
    })
    it('mainContext()', async () => {
      await mainContext()
    })
    it('parentContext()', async () => {
      await parentContext()
    })
    it('childContext(element)', async () => {
      await childContext()
    })
    it('findElement(string)', async () => {
      await findElement({input: '#overflowing-div'})
    })
    it('findElements(string)', async () => {
      await findElements({input: 'div'})
    })
    it('findElement(function)', async () => {
      await findElement({
        input: function () {
          return this.document.getElementById('overflowing-div')
        },
      })
    })
    it('findElements(function)', async () => {
      await findElements({
        input: function () {
          return this.document.querySelectorAll('div')
        },
      })
    })
    it('findElement(non-existent)', async () => {
      await findElement({input: 'non-existent', expected: null})
    })
    it('findElements(non-existent)', async () => {
      await findElements({input: 'non-existent', expected: []})
    })
    it('getTitle()', async () => {
      await getTitle()
    })
    it('getUrl()', async () => {
      await getUrl()
    })
    it('visit()', async () => {
      await visit()
    })
    it('getWindowSize()', async () => {
      await getWindowSize()
    })
    it('setWindowSize({width, height})', async () => {
      await setWindowSize({
        input: {width: 551, height: 552},
        expected: {width: 551, height: 552},
      })
    })
    it('getDeviceInfo()', async () => {
      await getDeviceInfo({
        expected: {
          browserName: 'Chrome Headless',
          isMobile: false,
          isNative: false,
        },
      })
    })
    it('getCookies()', async () => {
      await getCookies()
    })
  })

  async function isDriver({input, expected}) {
    const isDriver = await spec.isDriver(input || browser)
    assert.strictEqual(isDriver, expected)
  }
  async function isElement({input, expected}) {
    const element = await input()
    const isElement = await spec.isElement(element)
    assert.strictEqual(isElement, expected)
  }
  async function isSelector({input, expected}) {
    const isSelector = await spec.isSelector(input)
    assert.strictEqual(isSelector, expected)
  }
  async function isEqualElements({input, expected}) {
    const {element1, element2} = await input()
    const result = await spec.isEqualElements(browser, element1, element2)
    assert.deepStrictEqual(result, expected)
  }
  async function transformElement({input}) {
    const element = await input()
    const elementId = element.elementId || element['element-6066-11e4-a52e-4f735466cecf'] || element.ELEMENT
    const result = spec.transformElement(element)
    assert.deepStrictEqual(result, {
      ELEMENT: elementId,
      'element-6066-11e4-a52e-4f735466cecf': elementId,
    })
  }
  async function extractSelector({input, expected}) {
    const selector = spec.extractSelector(await input())
    assert.deepStrictEqual(selector, expected)
  }
  async function executeScript() {
    const element = await browser.$('html')
    const args = [0, 'string', {key: 'value'}, [0, 1, 2, 3]]
    const [resultElement, ...resultArgs] = await spec.executeScript(browser, 'return arguments[0]', [element, ...args])
    assert.deepStrictEqual(resultArgs, args)
    assert.ok(await browser.execute((element1, element2) => element1 === element2, resultElement, element))
  }
  async function mainContext() {
    try {
      const mainDocument = await browser.$('html')
      await browser.switchToFrame(await browser.findElement('css selector', '[name="frame1"]'))
      await browser.switchToFrame(await browser.findElement('css selector', '[name="frame1-1"]'))
      const frameDocument = await browser.$('html')
      assert.ok(!(await spec.isEqualElements(browser, mainDocument, frameDocument)))
      await spec.mainContext(browser)
      const resultDocument = await browser.$('html')
      assert.ok(await spec.isEqualElements(browser, resultDocument, mainDocument))
    } finally {
      await browser.switchToFrame(null).catch(() => null)
    }
  }
  async function parentContext() {
    try {
      await browser.switchToFrame(await browser.findElement('css selector', '[name="frame1"]'))
      const parentDocument = await browser.$('html')
      await browser.switchToFrame(await browser.findElement('css selector', '[name="frame1-1"]'))
      const frameDocument = await browser.$('html')
      assert.ok(!(await spec.isEqualElements(browser, parentDocument, frameDocument)))
      await spec.parentContext(browser)
      const resultDocument = await browser.$('html')
      assert.ok(await spec.isEqualElements(browser, resultDocument, parentDocument))
    } finally {
      await browser.switchToFrame(null).catch(() => null)
    }
  }
  async function childContext() {
    try {
      const element = await browser.findElement('css selector', '[name="frame1"]')
      await browser.switchToFrame(element)
      const expectedDocument = await browser.$('html')
      await browser.switchToFrame(null)
      await spec.childContext(browser, element)
      const resultDocument = await browser.$('html')
      assert.ok(await spec.isEqualElements(browser, resultDocument, expectedDocument))
    } finally {
      await browser.switchToFrame(null).catch(() => null)
    }
  }
  async function findElement({input, expected} = {}) {
    const result = expected !== undefined ? expected : await browser.$(input)
    const element = await spec.findElement(browser, input)
    if (element !== result) {
      assert.ok(await spec.isEqualElements(browser, element, result))
    }
  }
  async function findElements({input, expected} = {}) {
    const result = expected !== undefined ? expected : await browser.$$(input)
    const elements = await spec.findElements(browser, input)
    assert.strictEqual(elements.length, result.length)
    for (const [index, element] of elements.entries()) {
      assert.ok(await spec.isEqualElements(browser, element, result[index]))
    }
  }
  async function getWindowSize({legacy = false} = {}) {
    let size
    if (legacy) {
      size = await browser.getWindowSize()
    } else {
      const {width, height} = await browser.getWindowSize()
      size = {width, height}
    }
    const result = await spec.getWindowSize(browser)
    assert.deepStrictEqual(result, size)
  }
  async function setWindowSize({legacy = false, input, expected} = {}) {
    await spec.setWindowSize(browser, input)
    let rect
    if (legacy) {
      const {x, y} = await browser.getWindowPosition()
      const {width, height} = await browser.getWindowSize()
      rect = {x, y, width, height}
    } else {
      rect = await browser.getWindowRect()
    }
    assert.deepStrictEqual(rect, {x: 0, y: 0, ...expected})
  }
  async function getOrientation({expected} = {}) {
    const result = await spec.getOrientation(browser)
    assert.strictEqual(result, expected)
  }
  async function getTitle() {
    const expected = await browser.getTitle()
    const result = await spec.getTitle(browser)
    assert.deepStrictEqual(result, expected)
  }
  async function getUrl() {
    const result = await spec.getUrl(browser)
    assert.deepStrictEqual(result, url)
  }
  async function visit() {
    const blank = 'about:blank'
    await spec.visit(browser, blank)
    const actual = await browser.getUrl()
    assert.deepStrictEqual(actual, blank)
    await browser.url(url)
  }
  async function getDeviceInfo({expected} = {}) {
    const info = await spec.getDriverInfo(browser)
    assert.deepStrictEqual(
      Object.keys(expected).reduce((obj, key) => ({...obj, [key]: info[key]}), {}),
      expected,
    )
  }
  async function getCookies(legacy = false, expected) {
    if (!legacy) {
      const cdpCommand = [
        'Network.setCookie',
        {
          domain: 'what',
          expiry: -1,
          httpOnly: false,
          name: 'hello',
          path: '/',
          sameSite: undefined,
          secure: false,
          value: 'goodbye',
          name: 'hello',
          value: 'world',
        },
      ]
      if (browser.isDevTools) {
        const puppeteer = await browser.getPuppeteer()
        const [page] = await puppeteer.pages()
        await page._client.send(...cdpCommand)
      } else {
        await browser.sendCommand(...cdpCommand)
      }

      assert.deepStrictEqual(await spec.getCookies(browser), {
        all: true,
        cookies: [
          {
            domain: 'what',
            expiry: -1,
            httpOnly: false,
            name: 'hello',
            path: '/',
            sameSite: undefined,
            secure: false,
            value: 'goodbye',
            name: 'hello',
            value: 'world',
          },
        ],
      })
    } else {
      await browser.addCookie({name: 'hello', value: 'world', secure: true})
      assert.deepStrictEqual(await spec.getCookies(browser), expected)
    }
  }
})
