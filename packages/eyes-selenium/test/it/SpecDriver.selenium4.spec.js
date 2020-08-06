const assert = require('assert')
const spec = require('../../src/SpecDriver')
const {By} = require('selenium-webdriver')

before(function() {
  if (process.env.APPLITOOLS_SELENIUM_MAJOR_VERSION !== '4') {
    this.skip()
  }
})

describe('SpecDriver @selenium4', async () => {
  let driver
  const url = 'https://applitools.github.io/demo/TestPages/FramesTestPage/'

  describe('headless desktop', async () => {
    before(async () => {
      driver = await spec.build({browser: 'chrome'})
      await driver.get(url)
    })

    after(async () => {
      await spec.cleanup(driver)
    })

    it('isDriver(driver)', isDriver({expected: true}))
    it('isDriver(wrong)', isDriver({input: {}, expected: false}))
    it(
      'isElement(element)',
      isElement({input: () => driver.findElement(By.css('div')), expected: true}),
    )
    it('isElement(wrong)', isElement({input: () => ({}), expected: false}))
    it('isSelector(string)', isSelector({input: 'div', expected: true}))
    it('isSelector(by)', isSelector({input: By.xpath('//div'), expected: true}))
    it('isSelector(wrong)', isSelector({input: {}, expected: false}))
    it(
      'isEqualElements(element, element)',
      isEqualElements({
        input: () =>
          driver
            .findElement(By.css('div'))
            .then(element => ({element1: element, element2: element})),
        expected: true,
      }),
    )
    it(
      'isEqualElements(element1, element2)',
      isEqualElements({
        input: async () => ({
          element1: await driver.findElement(By.css('div')),
          element2: await driver.findElement(By.css('h1')),
        }),
        expected: false,
      }),
    )
    it('toEyesSelector(selector)', toEyesSelector())
    it('executeScript(strings, ...args)', executeScript())
    it('findElement(string)', findElement({input: By.id('overflowing-div')}))
    it('findElements(string)', findElements({input: By.css('div')}))
    it('findElement(non-existent)', findElement({input: By.css('non-existent'), expected: null}))
    it('findElements(non-existent)', findElements({input: By.css('non-existent'), expected: []}))
    it('mainContext()', mainContext())
    it('parentContext()', parentContext())
    it('childContext(element)', childContext())
    it('getSessionId()', getSessionId())
    it('getTitle()', getTitle())
    it('getUrl()', getUrl())
    it('visit()', visit())
    it('isMobile()', isMobile({expected: false}))
    it('getPlatformName()', getPlatformName({expected: 'linux'}))
  })

  describe('onscreen desktop (@webdriver)', async () => {
    before(async () => {
      driver = await spec.build({browser: 'chrome', headless: false})
    })

    after(async () => {
      await spec.cleanup(driver)
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

  describe('legacy driver (@webdriver)', async () => {
    before(async () => {
      driver = await spec.build({browser: 'ie-11'})
    })

    after(async () => {
      await spec.cleanup(driver)
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
    it('getPlatformName()', getPlatformName({expected: 'WINDOWS'}))
  })

  describe('mobile driver (@mobile)', async () => {
    before(async () => {
      driver = await spec.build({browser: 'chrome', device: 'Pixel 3a XL'})
    })

    after(async () => {
      await spec.cleanup(driver)
    })

    it('isMobile()', isMobile({expected: true}))
    it('getPlatformName()', getPlatformName({expected: 'Android'}))
    it('isNative()', isNative({expected: false}))
    it('getOrientation()', getOrientation({expected: 'portrait'}))
    it('getPlatformVersion()', getPlatformVersion({expected: '10'}))
  })

  function isDriver({input, expected}) {
    return async () => {
      const isDriver = await spec.isDriver(input || driver)
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
      const result = await spec.isEqualElements(driver, element1, element2)
      assert.deepStrictEqual(result, expected)
    }
  }
  function toEyesSelector() {
    return async () => {
      const xpathSelector = By.xpath('/html[1]/body[1]/div[1]')
      const xpathResult = spec.toEyesSelector(xpathSelector)
      assert.deepStrictEqual(xpathResult, {selector: xpathSelector})

      const cssSelector = By.css('html > body > div')
      const cssResult = spec.toEyesSelector(cssSelector)
      assert.deepStrictEqual(cssResult, {selector: cssSelector})

      const tagSelector = By.linkText('text')
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
      const expected = await driver.executeScript('return arguments', ...args)
      const result = await spec.executeScript(driver, 'return arguments', ...args)
      assert.deepStrictEqual(result, expected)
    }
  }
  function mainContext() {
    return async () => {
      try {
        const mainDocument = await driver.findElement(By.css('html'))
        await driver.switchTo().frame(await driver.findElement(By.css('[name="frame1"]')))
        await driver.switchTo().frame(await driver.findElement(By.css('[name="frame1-1"]')))
        const frameDocument = await driver.findElement(By.css('html'))
        assert.ok(!(await spec.isEqualElements(driver, mainDocument, frameDocument)))
        await spec.mainContext(driver)
        const resultDocument = await driver.findElement(By.css('html'))
        assert.ok(await spec.isEqualElements(driver, resultDocument, mainDocument))
      } finally {
        await driver
          .switchTo()
          .defaultContent()
          .catch(() => null)
      }
    }
  }
  function parentContext() {
    return async () => {
      try {
        await driver.switchTo().frame(await driver.findElement(By.css('[name="frame1"]')))
        const parentDocument = await driver.findElement(By.css('html'))
        await driver.switchTo().frame(await driver.findElement(By.css('[name="frame1-1"]')))
        const frameDocument = await driver.findElement(By.css('html'))
        assert.ok(!(await spec.isEqualElements(driver, parentDocument, frameDocument)))
        await spec.parentContext(driver)
        const resultDocument = await driver.findElement(By.css('html'))
        assert.ok(await spec.isEqualElements(driver, resultDocument, parentDocument))
      } finally {
        await driver
          .switchTo()
          .frame(null)
          .catch(() => null)
      }
    }
  }
  function childContext() {
    return async () => {
      try {
        const element = await driver.findElement(By.css('[name="frame1"]'))
        await driver.switchTo().frame(element)
        const expectedDocument = await driver.findElement(By.css('html'))
        await driver.switchTo().frame(null)
        await spec.childContext(driver, element)
        const resultDocument = await driver.findElement(By.css('html'))
        assert.ok(await spec.isEqualElements(driver, resultDocument, expectedDocument))
      } finally {
        await driver
          .switchTo()
          .frame(null)
          .catch(() => null)
      }
    }
  }
  function findElement({input, expected} = {}) {
    return async () => {
      const result = expected !== undefined ? expected : await driver.findElement(input)
      const element = await spec.findElement(driver, input)
      if (element !== result) {
        assert.ok(await spec.isEqualElements(driver, element, result))
      }
    }
  }
  function findElements({input, expected} = {}) {
    return async () => {
      const result = expected !== undefined ? expected : await driver.findElements(input)
      const elements = await spec.findElements(driver, input)
      assert.strictEqual(elements.length, result.length)
      for (const [index, element] of elements.entries()) {
        assert.ok(await spec.isEqualElements(driver, element, result[index]))
      }
    }
  }
  function getWindowRect() {
    return async () => {
      const rect = await driver
        .manage()
        .window()
        .getRect()
      const result = await spec.getWindowRect(driver)
      assert.deepStrictEqual(result, rect)
    }
  }
  function setWindowRect({input, expected} = {}) {
    return async () => {
      await spec.setWindowRect(driver, input)
      const rect = await driver
        .manage()
        .window()
        .getRect()
      assert.deepStrictEqual(rect, expected)
    }
  }
  function getOrientation({expected} = {}) {
    return async () => {
      const result = await spec.getOrientation(driver)
      assert.strictEqual(result, expected)
    }
  }
  function getSessionId() {
    return async () => {
      const session = await driver.getSession()
      const expected = await session.getId()
      const result = await spec.getSessionId(driver)
      assert.deepStrictEqual(result, expected)
    }
  }
  function getTitle() {
    return async () => {
      const expected = await driver.getTitle()
      const result = await spec.getTitle(driver)
      assert.deepStrictEqual(result, expected)
    }
  }
  function getUrl() {
    return async () => {
      const result = await spec.getUrl(driver)
      assert.deepStrictEqual(result, url)
    }
  }
  function visit() {
    return async () => {
      const blank = 'about:blank'
      await spec.visit(driver, blank)
      const actual = await driver.getCurrentUrl()
      assert.deepStrictEqual(actual, blank)
      await driver.get(url)
    }
  }
  function isMobile({expected} = {}) {
    return async () => {
      const result = await spec.isMobile(driver)
      assert.deepStrictEqual(result, expected)
    }
  }
  function isNative({expected} = {}) {
    return async () => {
      const result = await spec.isNative(driver)
      assert.strictEqual(result, expected)
    }
  }
  function getPlatformName({expected} = {}) {
    return async () => {
      const result = await spec.getPlatformName(driver)
      assert.strictEqual(result, expected)
    }
  }
  function getPlatformVersion({expected} = {}) {
    return async () => {
      const result = await spec.getPlatformVersion(driver)
      assert.strictEqual(result, expected)
    }
  }
})
