const assert = require('assert')
const spec = require('../../dist/spec-driver')

describe('spec driver', () => {
  const url = 'https://applitools.github.io/demo/TestPages/FramesTestPage/'

  describe('headless desktop', async () => {
    before(async function (driver, done) {
      await driver.url(url)
      done()
    })
    after(function (driver, done) {
      return driver.end(done)
    })
    it('isDriver(driver)', function (driver) {
      return assert.ok(spec.isDriver(driver))
    })
    it('isDriver(wrong)', function () {
      return assert.ok(!spec.isDriver({}))
    })
    it('isElement(elementResult)', async function (driver) {
      const element = await driver.element('css selector', 'div')
      assert.ok(spec.isElement(element))
    })
    it('isElement(element)', async function (driver) {
      const {value: element} = await driver.element('css selector', 'div')
      assert.ok(spec.isElement(element))
    })
    it('isElement(wrong)', function () {
      spec.isElement({})
    })
    // NOTE: Nightwatch separates the strategy from the selector - so it's always 2 values
    // e.g., using 'css selector', with 'div'
    it('isSelector(string)', function () {
      assert.ok(spec.isSelector('div'))
    })
    it('isSelector({type, selector})', function () {
      assert.ok(spec.isSelector({type: 'css', selector: 'div'}))
    })
    it('isSelector(wrong)', function () {
      assert.ok(!spec.isSelector())
    })
    it('isEqualElements(element, element)', async function (driver) {
      const {value: element} = await driver.element('css selector', 'div')
      assert.ok(await spec.isEqualElements(driver, element, element))
    })
    it('isEqualElements(element1, element2)', async function (driver) {
      const {value: element1} = await driver.element('css selector', 'div')
      const {value: element2} = await driver.element('css selector', 'h1')
      assert.ok(!(await spec.isEqualElements(driver, element1, element2)))
    })
    it('executeScript(strings, args)', async function (driver) {
      const script = 'return arguments[0]'
      const args = [0, 1, 2, 3]
      const result = await spec.executeScript(driver, script, args)
      assert.deepStrictEqual(result, args)
    })
    it('executeScript(function, args)', async function (driver) {
      const script = function () {
        return arguments[0]
      }
      const args = [0, 1, 2, 3]
      const result = await spec.executeScript(driver, script, args)
      assert.deepStrictEqual(result, args)
    })
    it('executeScript(element) return', async function (driver) {
      const element = await driver.element('css selector', 'div')
      const script = function () {
        return arguments[0]
      }
      const result = await spec.executeScript(driver, script, element)
      assert.deepStrictEqual(result.value, element.value)
    })
    it('executeScript(element) use', async function (driver) {
      const element = await driver.element('css selector', 'html')
      const script = "return getComputedStyle(arguments[0]).getPropertyValue('overflow')"
      assert.deepStrictEqual(await spec.executeScript(driver, script, element.value), 'visible')
    })
    it('executeScript(element) re-use', async function (driver) {
      const element = await driver.element('css selector', 'html')
      const recycledElement = await spec.executeScript(driver, 'return arguments[0]', element.value)
      const script = "return getComputedStyle(arguments[0]).getPropertyValue('overflow')"
      const result = await spec.executeScript(driver, script, recycledElement)
      assert.deepStrictEqual(result, 'visible')
    })
    it('executeScript(nested args)', async function (driver) {
      const args = [
        {
          type: 'css',
          selector: 'html',
        },
        ['transform', '-webkit-transform'],
      ]
      const result = await spec.executeScript(driver, 'return arguments[0]', args)
      assert.deepStrictEqual(result, args)
    })
    it('findElement(selector)', async function (driver) {
      const element = await spec.findElement(driver, '#overflowing-div')
      assert.ok(spec.isElement(element))
    })
    it('findElement(non-existentent)', async function (driver) {
      try {
        const element = await spec.findElement(driver, 'blah')
        assert.ok(!spec.isElement(element))
      } catch (error) {
        assert.ok(!spec.isElement(error))
      }
    })
    it('findElements(selector)', async function (driver) {
      const elements = await spec.findElements(driver, 'div')
      assert.ok(Array.isArray(elements))
      assert.ok(elements.length > 0)
      assert.ok(spec.isElement(elements[0]))
    })
    it('findElements(non-existent)', async function (driver) {
      const elements = await spec.findElements(driver, 'blah')
      assert.ok(Array.isArray(elements))
      assert.ok(!elements.length)
    })
    it('findElement({selector, locateStrategy})', async function (driver) {
      const el = await spec.findElement(driver, {selector: '//body', locateStrategy: 'xpath'})
      assert.ok(spec.isElement(el))
    })
    it('mainContext()', async function (driver) {
      try {
        const {value: mainDocument} = await driver.element('css selector', 'html')
        const {value: frameElement1} = await driver.element('css selector', '[name="frame1"')
        await driver.frame(frameElement1)
        const {value: frameElement2} = await driver.element('css selector', '[name="frame1-1"')
        await driver.frame(frameElement2)
        const {value: frameDocument} = await driver.element('css selector', 'html')
        assert.ok(!(await spec.isEqualElements(driver, mainDocument, frameDocument)))
        await spec.mainContext(driver)
        const {value: resultDocument} = await driver.element('css selector', 'html')
        assert.ok(await spec.isEqualElements(driver, resultDocument, mainDocument))
      } finally {
        await driver.frame()
      }
    })
    it('parentContext()', async function (driver) {
      try {
        const {value: frameElement1} = await driver.element('css selector', '[name="frame1"')
        await driver.frame(frameElement1)
        const {value: parentDocument} = await driver.element('css selector', 'html')
        const {value: frameElement2} = await driver.element('css selector', '[name="frame1-1"')
        await driver.frame(frameElement2)
        const {value: frameDocument} = await driver.element('css selector', 'html')
        assert.ok(!(await spec.isEqualElements(driver, parentDocument, frameDocument)))
        await spec.parentContext(driver)
        const {value: resultDocument} = await driver.element('css selector', 'html')
        assert.ok(await spec.isEqualElements(driver, resultDocument, parentDocument))
      } finally {
        await driver.frame()
      }
    })
    it('childContext(element)', async function (driver) {
      try {
        const {value: frameElement} = await driver.element('css selector', '[name="frame1"]')
        await driver.frame(frameElement)
        const {value: expectedDocument} = await driver.element('css selector', 'html')
        await driver.frame()
        await spec.childContext(driver, frameElement)
        const {value: resultDocument} = await driver.element('css selector', 'html')
        assert.ok(await spec.isEqualElements(driver, resultDocument, expectedDocument))
      } finally {
        await driver.frame()
      }
    })
    it('getTitle()', async function (driver) {
      const expected = 'Cross SDK test'
      assert.deepStrictEqual(await spec.getTitle(driver), expected)
    })
    it('getUrl()', async function (driver) {
      const result = await driver.url()
      const expected = result.value
      assert.deepStrictEqual(await spec.getUrl(driver), expected)
    })
    it('visit()', async function (driver) {
      try {
        const blank = 'about:blank'
        await spec.visit(driver, blank)
        const result = await driver.url()
        const actual = result.value
        assert.deepStrictEqual(actual, blank)
      } finally {
        await driver.url(url)
      }
    })
    it('takeScreenshot()', async function (driver) {
      const result = await spec.takeScreenshot(driver)
      assert.ok(typeof result === 'string')
    })
    it('isStaleElementError(err)', async function (driver) {
      const {value: element} = await driver.element('css selector', '#overflowing-div')
      const elementId = element.ELEMENT || element['element-6066-11e4-a52e-4f735466cecf']
      await driver.refresh()
      const error = await new Promise(resolve => {
        driver.elementIdClick(elementId, err => {
          resolve(err.value)
        })
      })
      assert.ok(spec.isStaleElementError(error))
    })
    it('getElementRect()', async function (driver) {
      const {value: element} = await driver.element('css selector', '#overflowing-div')
      const rect = await spec.getElementRect(driver, element)

      assert.deepStrictEqual(rect, {
        height: 184,
        width: 304,
        x: 8,
        y: 81,
      })
    })
    it('getDriverInfo()', async function (driver) {
      const info = await spec.getDriverInfo(driver)
      const expected = {
        browserName: driver.capabilities.browserName,
        isMobile: false,
        isNative: false,
      }
      assert.deepStrictEqual(
        Object.keys(expected).reduce((obj, key) => ({...obj, [key]: info[key]}), {}),
        expected,
      )
    })
    it.skip('click()')
    it.skip('type()')
    it.skip('scrollIntoView()')
    it.skip('hover()')
    it.skip('waitUntilIsDisplayed()')
  })
})
