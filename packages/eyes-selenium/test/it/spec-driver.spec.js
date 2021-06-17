const assert = require('assert')
const spec = require('../../dist/spec-driver')
const {By} = require('selenium-webdriver')

describe('spec driver', async () => {
  let driver, destroyDriver
  const url = 'https://applitools.github.io/demo/TestPages/FramesTestPage/'

  describe('headless desktop', async () => {
    before(async () => {
      ;[driver, destroyDriver] = await spec.build({browser: 'chrome'})
      driver = spec.transformDriver(driver)
      await driver.get(url)
    })

    after(async () => {
      await destroyDriver()
    })

    it('isDriver(driver)', async () => {
      await isDriver({expected: true})
    })
    it('isDriver(wrong)', async () => {
      await isDriver({input: {}, expected: false})
    })
    it('isElement(element)', async () => {
      await isElement({input: () => driver.findElement(By.css('div')), expected: true})
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
    it('isEqualElements(element, element)', async () => {
      await isEqualElements({
        input: () => driver.findElement(By.css('div')).then(element => ({element1: element, element2: element})),
        expected: true,
      })
    })
    it('isEqualElements(element1, element2)', async () => {
      await isEqualElements({
        input: async () => ({
          element1: await driver.findElement(By.css('div')),
          element2: await driver.findElement(By.css('h1')),
        }),
        expected: false,
      })
    })
    it('executeScript(strings, args)', async () => {
      await executeScript()
    })
    it('findElement(string)', async () => {
      await findElement({input: By.id('overflowing-div')})
    })
    it('findElements(string)', async () => {
      await findElements({input: By.css('div')})
    })
    it('findElement(non-existent)', async () => {
      await findElement({input: By.css('non-existent'), expected: null})
    })
    it('findElements(non-existent)', async () => {
      await findElements({input: By.css('non-existent'), expected: []})
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
          platformName: 'linux',
        },
      })
    })
  })

  describe('onscreen desktop (@webdriver)', async () => {
    before(async () => {
      ;[driver, destroyDriver] = await spec.build({browser: 'chrome', headless: false})
    })

    after(async () => {
      await destroyDriver()
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

  describe('legacy driver (@webdriver)', async () => {
    before(async () => {
      ;[driver, destroyDriver] = await spec.build({browser: 'ie-11', legacy: true})
    })

    after(async () => {
      await destroyDriver()
    })

    it('getWindowSize()', async () => {
      await getWindowSize({legacy: true})
    })
    it('setWindowSize({width, height})', async () => {
      await setWindowSize({
        input: {width: 551, height: 552},
        expected: {width: 551, height: 552},
      })
    })
    it('getDriverInfo()', async () => {
      await getDriverInfo({
        expected: {
          browserName: 'internet explorer',
          browserVersion: '11',
          isMobile: false,
          isNative: false,
          platformName: 'WINDOWS',
        },
      })
    })
  })

  describe('mobile driver (@mobile)', async () => {
    before(async () => {
      ;[driver, destroyDriver] = await spec.build({browser: 'chrome', device: 'Pixel 3a XL'})
    })

    after(async () => {
      await destroyDriver()
    })

    it('getWindowSize()', async () => {
      await getWindowSize()
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
          platformVersion: '10',
        },
      })
    })
  })

  async function isDriver({input, expected}) {
    const isDriver = await spec.isDriver(input || driver)
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
    const result = await spec.isEqualElements(driver, element1, element2)
    assert.deepStrictEqual(result, expected)
  }
  async function executeScript() {
    const args = [0, 'string', {key: 'value'}, [0, 1, 2, 3]]
    const expected = await driver.executeScript('return arguments[0]', args)
    const result = await spec.executeScript(driver, 'return arguments[0]', args)
    assert.deepStrictEqual(result, expected)
  }
  async function mainContext() {
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
  async function parentContext() {
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
  async function childContext() {
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
  async function findElement({input, expected} = {}) {
    const result = expected !== undefined ? expected : await driver.findElement(input)
    const element = await spec.findElement(driver, input)
    if (element !== result) {
      assert.ok(await spec.isEqualElements(driver, element, result))
    }
  }
  async function findElements({input, expected} = {}) {
    const result = expected !== undefined ? expected : await driver.findElements(input)
    const elements = await spec.findElements(driver, input)
    assert.strictEqual(elements.length, result.length)
    for (const [index, element] of elements.entries()) {
      assert.ok(await spec.isEqualElements(driver, element, result[index]))
    }
  }
  async function getWindowSize() {
    let size
    if (driver.manage().window().getRect) {
      const rect = await driver.manage().window().getRect()
      size = {width: rect.width, height: rect.height}
    } else {
      size = await driver.manage().window().getSize()
    }
    const result = await spec.getWindowSize(driver)
    assert.deepStrictEqual(result, size)
  }
  async function setWindowSize({input, expected} = {}) {
    await spec.setWindowSize(driver, input)
    let rect
    if (driver.manage().window().getRect) {
      rect = await driver.manage().window().getRect()
    } else {
      const {x, y} = await driver.manage().window().getPosition()
      const {width, height} = await driver.manage().window().getSize()
      rect = {x, y, width, height}
    }
    assert.deepStrictEqual(rect, {x: 0, y: 0, ...expected})
  }
  async function getOrientation({expected} = {}) {
    const result = await spec.getOrientation(driver)
    assert.strictEqual(result, expected)
  }
  async function getTitle() {
    const expected = await driver.getTitle()
    const result = await spec.getTitle(driver)
    assert.deepStrictEqual(result, expected)
  }
  async function getUrl() {
    const result = await spec.getUrl(driver)
    assert.deepStrictEqual(result, url)
  }
  async function visit() {
    const blank = 'about:blank'
    await spec.visit(driver, blank)
    const actual = await driver.getCurrentUrl()
    assert.deepStrictEqual(actual, blank)
    await driver.get(url)
  }
  async function getDriverInfo({expected} = {}) {
    const info = await spec.getDriverInfo(driver)
    assert.deepStrictEqual(
      Object.keys(expected).reduce((obj, key) => ({...obj, [key]: info[key]}), {}),
      expected,
    )
  }
})
