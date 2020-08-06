const assert = require('assert')
const spec = require('../../src/SpecDriver')
const {By} = require('../../index')

describe('SpecDriver', async () => {
  let browser
  const url = 'https://applitools.github.io/demo/TestPages/FramesTestPage/'

  describe('headless desktop', async () => {
    before(async () => {
      browser = await spec.build({browser: 'chrome'})
      await browser.url(url)
    })

    after(async () => {
      await spec.cleanup(browser)
    })

    it('isDriver(driver)', isDriver({expected: true}))
    it('isDriver(wrong)', isDriver({input: {}, expected: false}))
    it(
      'isElement(element)',
      isElement({input: () => browser.element('div').then(({value}) => value), expected: true}),
    )
    it(
      'isElement(response-element)',
      isElement({input: () => browser.element('div'), expected: true}),
    )
    it('isElement(wrong)', isElement({input: () => ({}), expected: false}))
    it('isSelector(string)', isSelector({input: 'div', expected: true}))
    it('isSelector(by)', isSelector({input: By.xpath('//div'), expected: true}))
    it('isSelector(wrong)', isSelector({input: {}, expected: false}))
    it(
      'transformElement(element)',
      transformElement({input: () => browser.element('div').then(({value}) => value)}),
    )
    it(
      'transformElement(response-element)',
      transformElement({input: () => browser.element('div')}),
    )
    it(
      'isEqualElements(element, element)',
      isEqualElements({
        input: () => browser.element('div').then(({value}) => ({element1: value, element2: value})),
        expected: true,
      }),
    )
    it(
      'isEqualElements(element1, element2)',
      isEqualElements({
        input: async () => ({
          element1: await browser.element('div').then(({value}) => value),
          element2: await browser.element('h1').then(({value}) => value),
        }),
        expected: false,
      }),
    )
    it(
      'extractSelector(element)',
      extractSelector({
        input: () => browser.element('div').then(({value}) => value),
        expected: undefined,
      }),
    )
    it(
      'extractSelector(response-element)',
      extractSelector({input: () => browser.element('div'), expected: 'div'}),
    )
    it('toEyesSelector(selector)', toEyesSelector())
    it('executeScript(strings, ...args)', executeScript())
    it('findElement(string)', findElement({input: '#overflowing-div'}))
    it('findElements(string)', findElements({input: 'div'}))
    it('findElement(non-existent)', findElement({input: 'non-existent', expected: null}))
    it('findElements(non-existent)', findElements({input: 'non-existent', expected: []}))
    it('mainContext()', mainContext())
    it('parentContext()', parentContext())
    it('childContext(element)', childContext())
    it('getSessionId()', getSessionId())
    it('getTitle()', getTitle())
    it('getUrl()', getUrl())
    it('visit()', visit())
    it('isMobile()', isMobile({expected: false}))
    it('getPlatformName()', getPlatformName({expected: undefined}))
  })

  describe('onscreen desktop (@webdriver)', async () => {
    before(async () => {
      browser = await spec.build({browser: 'chrome', headless: false})
    })

    after(async () => {
      await spec.cleanup(browser)
    })

    it('getWindowRect()', getWindowRect())
    it(
      'setWindowRect({x, y, width, height})',
      setWindowRect({
        input: {x: 0, y: 0, width: 510, height: 511},
        expected: {x: 0, y: 0, width: 510, height: 511},
      }),
    )
    it(
      'setWindowRect({x, y})',
      setWindowRect({
        input: {x: 11, y: 12},
        expected: {x: 11, y: 12, width: 510, height: 511},
      }),
    )
    it(
      'setWindowRect({width, height})',
      setWindowRect({
        input: {width: 551, height: 552},
        expected: {x: 11, y: 12, width: 551, height: 552},
      }),
    )
  })

  describe('legacy browser (@webdriver)', async () => {
    before(async () => {
      browser = await spec.build({browser: 'ie-11'})
    })

    after(async () => {
      await spec.cleanup(browser)
    })

    it('getWindowRect()', getWindowRect())
    it(
      'setWindowRect({x, y, width, height})',
      setWindowRect({
        input: {x: 0, y: 0, width: 510, height: 511},
        expected: {x: 0, y: 0, width: 510, height: 511},
      }),
    )
    it(
      'setWindowRect({x, y})',
      setWindowRect({
        input: {x: 11, y: 12},
        expected: {x: 11, y: 12, width: 510, height: 511},
      }),
    )
    it(
      'setWindowRect({width, height})',
      setWindowRect({
        input: {width: 551, height: 552},
        expected: {x: 11, y: 12, width: 551, height: 552},
      }),
    )
    it('getPlatformName()', getPlatformName({expected: 'Windows 10'}))
  })

  describe('mobile browser (@mobile)', async () => {
    before(async () => {
      browser = await spec.build({browser: 'chrome', device: 'Pixel 3a XL'})
    })

    after(async () => {
      await spec.cleanup(browser)
    })

    it('isMobile()', isMobile({expected: true}))
    it('getPlatformName()', getPlatformName({expected: 'Android'}))
    it('isNative()', isNative({expected: false}))
    it('getOrientation()', getOrientation({expected: 'portrait'}))
    it('getPlatformVersion()', getPlatformVersion({expected: '10.0'}))
  })

  describe('native app (@mobile @native)', async () => {
    before(async () => {
      browser = await spec.build({
        app: 'http://saucelabs.com/example_files/ContactManager.apk',
        device: 'Android Emulator',
      })
    })

    after(async () => {
      await spec.cleanup(browser)
    })

    it('isMobile()', isMobile({expected: true}))
    it('isNative()', isNative({expected: true}))
    it('getPlatformName()', getPlatformName({expected: 'Android'}))
    it('getPlatformVersion()', getPlatformVersion({expected: '6.0'}))
    it('getOrientation()', getOrientation({expected: 'landscape'}))
  })

  function isDriver({input, expected}) {
    return async () => {
      const isDriver = await spec.isDriver(input || browser)
      assert.strictEqual(isDriver, expected)
    }
  }
  function isElement({input, expected}) {
    return async () => {
      const element = await input()
      const isElement = await spec.isElement(element)
      assert.strictEqual(isElement, expected)
    }
  }
  function isSelector({input, expected}) {
    return async () => {
      const isSelector = await spec.isSelector(input)
      assert.strictEqual(isSelector, expected)
    }
  }
  function isEqualElements({input, expected}) {
    return async () => {
      const {element1, element2} = await input()
      const result = await spec.isEqualElements(browser, element1, element2)
      assert.deepStrictEqual(result, expected)
    }
  }
  function transformElement({input}) {
    return async () => {
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
  }
  function extractSelector({input, expected}) {
    return async () => {
      const selector = spec.extractSelector(await input())
      assert.deepStrictEqual(selector, expected)
    }
  }
  function toEyesSelector() {
    return async () => {
      const xpathSelector = 'xpath:/html[1]/body[1]/div[1]'
      const xpathResult = spec.toEyesSelector(xpathSelector)
      assert.deepStrictEqual(xpathResult, {type: 'xpath', selector: '/html[1]/body[1]/div[1]'})

      const cssSelector = 'css selector:html > body > div'
      const cssResult = spec.toEyesSelector(cssSelector)
      assert.deepStrictEqual(cssResult, {type: 'css', selector: 'html > body > div'})

      const tagSelector = '<tag />'
      const tagResult = spec.toEyesSelector(tagSelector)
      assert.deepStrictEqual(tagResult, {selector: tagSelector})

      const wrongSelector = {isWrong: true}
      const wrongResult = spec.toEyesSelector(wrongSelector)
      assert.deepStrictEqual(wrongResult, {selector: wrongSelector})
    }
  }
  function executeScript() {
    return async () => {
      const args = [0, 'string', {key: 'value'}, [0, 1, 2, 3]]
      const {value: expected} = await browser.execute('return arguments', ...args)
      const result = await spec.executeScript(browser, 'return arguments', ...args)
      assert.deepStrictEqual(result, expected)
    }
  }
  function mainContext() {
    return async () => {
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
  }
  function parentContext() {
    return async () => {
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
  }
  function childContext() {
    return async () => {
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
  }
  function findElement({input, expected} = {}) {
    return async () => {
      const result =
        expected !== undefined ? expected : await browser.element(input).then(({value}) => value)
      const element = await spec.findElement(browser, input)
      if (element !== result) {
        assert.ok(await spec.isEqualElements(browser, element, result))
      }
    }
  }
  function findElements({input, expected} = {}) {
    return async () => {
      const result =
        expected !== undefined ? expected : await browser.elements(input).then(({value}) => value)
      const elements = await spec.findElements(browser, input)
      assert.strictEqual(elements.length, result.length)
      for (const [index, element] of elements.entries()) {
        assert.ok(await spec.isEqualElements(browser, element, result[index]))
      }
    }
  }
  function getWindowRect() {
    return async () => {
      const {x, y} = await browser.windowHandlePosition().then(({value}) => value)
      const {width, height} = await browser.windowHandleSize().then(({value}) => value)
      const rect = {x, y, width, height}
      const result = await spec.getWindowRect(browser)
      assert.deepStrictEqual(result, rect)
    }
  }
  function setWindowRect({input, expected} = {}) {
    return async () => {
      await spec.setWindowRect(browser, input)
      const {x, y} = await browser.windowHandlePosition().then(({value}) => value)
      const {width, height} = await browser.windowHandleSize().then(({value}) => value)
      const rect = {x, y, width, height}
      assert.deepStrictEqual(rect, expected)
    }
  }
  function getOrientation({expected} = {}) {
    return async () => {
      const result = await spec.getOrientation(browser)
      assert.strictEqual(result, expected)
    }
  }
  function getSessionId() {
    return async () => {
      const expected = browser.requestHandler.sessionID
      const result = await spec.getSessionId(browser)
      assert.deepStrictEqual(result, expected)
    }
  }
  function getTitle() {
    return async () => {
      const expected = await browser.getTitle()
      const result = await spec.getTitle(browser)
      assert.deepStrictEqual(result, expected)
    }
  }
  function getUrl() {
    return async () => {
      const result = await spec.getUrl(browser)
      assert.deepStrictEqual(result, url)
    }
  }
  function visit() {
    return async () => {
      const blank = 'about:blank'
      await spec.visit(browser, blank)
      const actual = await browser.getUrl()
      assert.deepStrictEqual(actual, blank)
      await browser.url(url)
    }
  }
  function isMobile({expected} = {}) {
    return async () => {
      const result = await spec.isMobile(browser)
      assert.deepStrictEqual(result, expected)
    }
  }
  function isNative({expected} = {}) {
    return async () => {
      const result = await spec.isNative(browser)
      assert.strictEqual(result, expected)
    }
  }
  function getPlatformName({expected} = {}) {
    return async () => {
      const result = await spec.getPlatformName(browser)
      assert.strictEqual(result, expected)
    }
  }
  function getPlatformVersion({expected} = {}) {
    return async () => {
      const result = await spec.getPlatformVersion(browser)
      assert.strictEqual(result, expected)
    }
  }
})
