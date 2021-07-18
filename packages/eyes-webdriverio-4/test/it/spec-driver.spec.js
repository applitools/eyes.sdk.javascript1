const assert = require('assert')
const spec = require('../../dist/spec-driver')
const {By} = require('../../dist/legacy')

describe('spec driver', async () => {
  let browser, destroyBrowser
  const url = 'https://applitools.github.io/demo/TestPages/FramesTestPage/'

  describe('headless desktop', async () => {
    before(async () => {
      ;[browser, destroyBrowser] = await spec.build({browser: 'chrome'})
      await browser.url(url)
    })

    after(async () => {
      await destroyBrowser()
    })

    it('isDriver(driver)', async () => {
      await isDriver({expected: true})
    })
    it('isDriver(wrong)', async () => {
      await isDriver({input: {}, expected: false})
    })
    it('isElement(element)', async () => {
      await isElement({input: () => browser.element('div').then(({value}) => value), expected: true})
    })
    it('isElement(response-element)', async () => {
      await isElement({input: () => browser.element('div'), expected: true})
    })
    it('isElement(wrong)', async () => {
      await isElement({input: () => ({}), expected: false})
    })
    it('isSelector(string)', async () => {
      await isSelector({input: 'div', expected: true})
    })
    it('isSelector(by)', async () => {
      await isSelector({input: By.xpath('//div'), expected: true})
    })
    it('isSelector(wrong)', async () => {
      await isSelector({input: {}, expected: false})
    })
    it('transformElement(element)', async () => {
      await transformElement({input: () => browser.element('div').then(({value}) => value)})
    })
    it('transformElement(response-element)', async () => {
      await transformElement({input: () => browser.element('div')})
    })
    it('isEqualElements(element, element)', async () => {
      await isEqualElements({
        input: () => browser.element('div').then(({value}) => ({element1: value, element2: value})),
        expected: true,
      })
    })
    it('isEqualElements(element1, element2)', async () => {
      await isEqualElements({
        input: async () => ({
          element1: await browser.element('div').then(({value}) => value),
          element2: await browser.element('h1').then(({value}) => value),
        }),
        expected: false,
      })
    })
    it('extractSelector(element)', async () => {
      await extractSelector({
        input: () => browser.element('div').then(({value}) => value),
        expected: undefined,
      })
    })
    it('extractSelector(response-element)', async () => {
      await extractSelector({input: () => browser.element('div'), expected: 'div'})
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
    it('findElement(non-existent)', async () => {
      await findElement({input: 'non-existent', expected: null})
    })
    it('findElements(non-existent)', async () => {
      await findElements({input: 'non-existent', expected: []})
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
    it('getDriverInfo()', async () => {
      await getDriverInfo({
        expected: {
          browserName: 'chrome',
          isMobile: false,
          isNative: false,
        },
      })
    })
    it.only('getCookies()', async () => {
      await getCookies({
        all: true,
        cookies: [
          {
            domain: 'applitools.github.io',
            expiry: -1,
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

  describe('onscreen desktop (@webdriver)', async () => {
    before(async () => {
      ;[browser, destroyBrowser] = await spec.build({browser: 'chrome', headless: false})
    })

    after(async () => {
      await destroyBrowser()
    })

    it('getWindowSize()', async () => {
      await getWindowSize()
    })
    it('setWindowSize({width, height})', async () => {
      await setWindowSize({input: {width: 510, height: 511}, expected: {width: 510, height: 511}})
    })
  })

  describe('legacy browser (@webdriver)', async () => {
    before(async () => {
      ;[browser, destroyBrowser] = await spec.build({browser: 'ie-11'})
    })

    after(async () => {
      await destroyBrowser()
    })

    it('getWindowSize()', async () => {
      getWindowSize()
    })
    it('setWindowSize({width, height})', async () => {
      await setWindowSize({
        input: {width: 510, height: 511},
        expected: {width: 510, height: 511},
      })
    })
    it('getDriverInfo()', async () => {
      await getDriverInfo({
        expected: {
          browserName: 'internet explorer',
          browserVersion: '11.285',
          isMobile: false,
          isNative: false,
          platformName: 'Windows 10',
        },
      })
    })
  })

  describe('mobile browser (@mobile)', async () => {
    before(async () => {
      ;[browser, destroyBrowser] = await spec.build({browser: 'chrome', device: 'Pixel 3a XL'})
    })

    after(async () => {
      await destroyBrowser()
    })

    it('getWindowSize()', async () => {
      getWindowSize()
    })
    it('getOrientation()', async () => {
      await getOrientation({expected: 'portrait'})
    })
    it('getDriverInfo()', async () => {
      await getDriverInfo({
        expected: {
          browserName: 'chrome',
          deviceName: 'Google Pixel 3a XL GoogleAPI Emulator',
          isMobile: true,
          isNative: false,
          platformName: 'Android',
          platformVersion: '10.0',
        },
      })
    })
  })

  describe('native app (@mobile @native)', async () => {
    before(async () => {
      ;[browser, destroyBrowser] = await spec.build({
        app: 'http://saucelabs.com/example_files/ContactManager.apk',
        device: 'Android Emulator',
        orientation: 'landscape',
      })
    })

    after(async () => {
      await destroyBrowser()
    })

    it('getWindowSize()', async () => {
      await getWindowSize()
    })
    it('getOrientation()', async () => {
      await getOrientation({expected: 'landscape'})
    })
    it('getDriverInfo()', async () => {
      await getDriverInfo({
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
    const elementId = element.value
      ? element.value['element-6066-11e4-a52e-4f735466cecf'] || element.value.ELEMENT
      : element['element-6066-11e4-a52e-4f735466cecf'] || element.ELEMENT
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
    const args = [0, 'string', {key: 'value'}, [0, 1, 2, 3]]
    const {value: expected} = await browser.execute('return arguments[0]', args)
    const result = await spec.executeScript(browser, 'return arguments[0]', args)
    assert.deepStrictEqual(result, expected)
  }
  async function mainContext() {
    try {
      const {value: mainDocument} = await browser.element('html')
      await browser.frame(await browser.element('[name="frame1"]').then(({value}) => value))
      await browser.frame(await browser.element('[name="frame1-1"]').then(({value}) => value))
      const {value: frameDocument} = await browser.element('html')
      assert.ok(!(await spec.isEqualElements(browser, mainDocument, frameDocument)))
      await spec.mainContext(browser)
      const {value: resultDocument} = await browser.element('html')
      assert.ok(await spec.isEqualElements(browser, resultDocument, mainDocument))
    } finally {
      await browser.frame(null).catch(() => null)
    }
  }
  async function parentContext() {
    try {
      await browser.frame(await browser.element('[name="frame1"]').then(({value}) => value))
      const {value: parentDocument} = await browser.element('html')
      await browser.frame(await browser.element('[name="frame1-1"]').then(({value}) => value))
      const {value: frameDocument} = await browser.element('html')
      assert.ok(!(await spec.isEqualElements(browser, parentDocument, frameDocument)))
      await spec.parentContext(browser)
      const {value: resultDocument} = await browser.element('html')
      assert.ok(await spec.isEqualElements(browser, resultDocument, parentDocument))
    } finally {
      await browser.frame(null).catch(() => null)
    }
  }
  async function childContext() {
    try {
      const {value: element} = await browser.element('[name="frame1"]')
      await browser.frame(element)
      const {value: expectedDocument} = await browser.element('html')
      await browser.frame(null)
      await spec.childContext(browser, element)
      const {value: resultDocument} = await browser.element('html')
      assert.ok(await spec.isEqualElements(browser, resultDocument, expectedDocument))
    } finally {
      await browser.frame(null).catch(() => null)
    }
  }
  async function findElement({input, expected} = {}) {
    const result = expected !== undefined ? expected : await browser.element(input).then(({value}) => value)
    const element = await spec.findElement(browser, input)
    if (element !== result) {
      assert.ok(await spec.isEqualElements(browser, element, result))
    }
  }
  async function findElements({input, expected} = {}) {
    const result = expected !== undefined ? expected : await browser.elements(input).then(({value}) => value)
    const elements = await spec.findElements(browser, input)
    assert.strictEqual(elements.length, result.length)
    for (const [index, element] of elements.entries()) {
      assert.ok(await spec.isEqualElements(browser, element, result[index]))
    }
  }
  async function getWindowSize() {
    const size = await browser.windowHandleSize().then(({value}) => ({width: value.width, height: value.height}))
    const result = await spec.getWindowSize(browser)
    assert.deepStrictEqual(result, size)
  }
  async function setWindowSize({input, expected} = {}) {
    await spec.setWindowSize(browser, input)
    const {x, y} = await browser.windowHandlePosition().then(({value}) => value)
    const {width, height} = await browser.windowHandleSize().then(({value}) => value)
    const rect = {x, y, width, height}
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
  async function getDriverInfo({expected} = {}) {
    const info = await spec.getDriverInfo(browser)
    assert.deepStrictEqual(
      Object.keys(expected).reduce((obj, key) => ({...obj, [key]: info[key]}), {}),
      expected,
    )
  }
  async function getCookies(expected) {
    await browser.setCookie({name: 'hello', value: 'world', secure: true})
    assert.deepStrictEqual(await spec.getCookies(browser), expected)
  }
})
