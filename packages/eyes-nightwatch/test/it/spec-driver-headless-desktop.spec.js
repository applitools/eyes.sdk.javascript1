const assert = require('assert')
const spec = require('../../src/spec-driver')
const {EyesError} = require('@applitools/eyes-sdk-core')

describe('spec driver', () => {
  const url = 'https://applitools.github.io/demo/TestPages/FramesTestPage/'

  describe('headless desktop', async () => {
    before(async function(driver, done) {
      await driver.url(url)
      done()
    })
    after(function(driver, done) {
      return driver.end(function() {
        done()
      })
    })
    it('isDriver(driver)', function(driver) {
      return assert.ok(spec.isDriver(driver))
    })
    it('isDriver(wrong)', function(_driver) {
      return assert.ok(!spec.isDriver({}))
    })
    it('isElement(element)', async function(driver) {
      const element = await driver.element('css selector', 'div')
      assert.ok(spec.isElement(element))
    })
    it('isElement(wrong)', function(_driver) {
      spec.isElement({})
    })
    // NOTE: Nightwatch separates the strategy from the selector - so it's always 2 values
    // e.g., using 'css selector', with 'div'
    it('isSelector(string)', function(_driver) {
      assert.ok(spec.isSelector('div'))
    })
    it('isSelector(wrong)', function(_driver) {
      assert.ok(!spec.isSelector())
    })
    it('isEqualElements(element, element)', async function(driver) {
      const element = await driver.element('css selector', 'div')
      assert.ok(spec.isEqualElements(driver, element, element))
    })
    it('isEqualElements(element1, element2)', async function(driver) {
      const element1 = await driver.element('css selector', 'div')
      const element2 = await driver.element('css selector', 'h1')
      assert.ok(!spec.isEqualElements(driver, element1, element2))
    })
    it('executeScript(strings, ...args)', async function(driver) {
      const script = 'return arguments'
      const args = [0, 1, 2, 3]
      const result = await spec.executeScript(driver, script, args)
      assert.deepStrictEqual(result[0], args)
    })
    it('executeScript(function, ...args)', async function(driver) {
      const script = function() {
        return arguments
      }
      const args = [0, 1, 2, 3]
      const result = await spec.executeScript(driver, script, args)
      assert.deepStrictEqual(result[0], args)
    })
    it('executeScript(element) return', async function(driver) {
      const element = await driver.element('css selector', 'div')
      const script = function() {
        return arguments
      }
      const result = await spec.executeScript(driver, script, element)
      assert.deepStrictEqual(result[0].value, element.value)
    })
    it('executeScript(element) use', async function(driver) {
      const element = await driver.element('css selector', 'html')
      const script = "return getComputedStyle(arguments[0]).getPropertyValue('overflow')"
      assert.deepStrictEqual(await spec.executeScript(driver, script, element.value), 'visible')
    })
    it('executeScript(element) re-use', async function(driver) {
      const element = await driver.element('css selector', 'html')
      const recycledElement = await spec.executeScript(driver, 'return arguments[0]', element.value)
      const script = "return getComputedStyle(arguments[0]).getPropertyValue('overflow')"
      const result = await spec.executeScript(driver, script, recycledElement)
      assert.deepStrictEqual(result, 'visible')
    })
    it('executeScript(nested args)', async function(driver) {
      const args = [
        {
          type: 'css',
          selector: 'html',
        },
        ['transform', '-webkit-transform'],
      ]
      const result = await spec.executeScript(driver, 'return arguments', args)
      assert.deepStrictEqual(result[0], args)
    })
    it('findElement(selector)', async function(driver) {
      const element = await spec.findElement(driver, '#overflowing-div')
      assert.ok(spec.isElement(element))
    })
    it('findElement(non-existentent)', async function(driver) {
      try {
        const element = await spec.findElement(driver, 'blah')
        assert.ok(!spec.isElement(element))
      } catch (error) {
        assert.ok(!spec.isElement(error))
      }
    })
    it('findElements(selector)', async function(driver) {
      const elements = await spec.findElements(driver, 'div')
      assert.ok(Array.isArray(elements))
      assert.ok(elements.length > 0)
      assert.ok(spec.isElement(elements[0]))
    })
    it('findElements(non-existent)', async function(driver) {
      const elements = await spec.findElements(driver, 'blah')
      assert.ok(Array.isArray(elements))
      assert.ok(!elements.length)
    })
    it('findElement({selector, locateStrategy})', async function(driver) {
      const el = await spec.findElement(driver, {selector: '//body', locateStrategy: 'xpath'})
      assert.ok(spec.isElement(el))
    })
    it('mainContext()', async function(driver) {
      try {
        const mainDocument = await driver.element('css selector', 'html')
        await spec.childContext(driver, '[name="frame1"]')
        await spec.childContext(driver, '[name="frame1-1"]')
        const frameDocument = await driver.element('css selector', 'html')
        assert.ok(!(await spec.isEqualElements(driver, mainDocument, frameDocument)))
        await spec.mainContext(driver)
        const resultDocument = await driver.element('css selector', 'html')
        assert.ok(await spec.isEqualElements(driver, resultDocument, mainDocument))
      } finally {
        await driver.frame()
      }
    })
    it('parentContext()', async function(driver) {
      try {
        await spec.childContext(driver, '[name="frame1"]')
        const parentDocument = await driver.element('css selector', 'html')
        await spec.childContext(driver, '[name="frame1-1"]')
        const frameDocument = await driver.element('css selector', 'html')
        assert.ok(!(await spec.isEqualElements(driver, parentDocument, frameDocument)))
        await spec.parentContext(driver)
        const resultDocument = await driver.element('css selector', 'html')
        assert.ok(await spec.isEqualElements(driver, resultDocument, parentDocument))
      } finally {
        await driver.frame()
      }
    })
    it('childContext(element)', async function(driver) {
      try {
        const element = await driver.element('css selector', '[name="frame1"]')
        await driver.frame(element)
        const expectedDocument = await driver.element('css selector', 'html')
        await driver.frame()
        const frameElement = await driver.element('css selector', '[name="frame1"]')
        await spec.childContext(driver, frameElement)
        const resultDocument = await driver.element('css selector', 'html')
        assert.ok(await spec.isEqualElements(driver, resultDocument, expectedDocument))
      } finally {
        await driver.frame()
      }
    })
    it('getSessionId()', function(driver) {
      const sessionId = driver.sessionId
      assert.deepStrictEqual(spec.getDriverInfo(driver).sessionId, sessionId)
    })
    it('getTitle()', async function(driver) {
      const expected = 'Cross SDK test'
      assert.deepStrictEqual(await spec.getTitle(driver), expected)
    })
    it('getUrl()', async function(driver) {
      const result = await driver.url()
      const expected = result.value
      assert.deepStrictEqual(await spec.getUrl(driver), expected)
    })
    it('visit()', async function(driver) {
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
    it('isMobile()', async function(driver) {
      const {isMobile} = await spec.getDriverInfo(driver)
      assert.deepStrictEqual(isMobile, false)
    })
    it('takeScreenshot()', async function(driver) {
      const result = await spec.takeScreenshot(driver)
      assert.ok(Buffer.isBuffer(result))
    })
    it('isStaleElementError(err)', async function(driver) {
      const element = await driver.element('css selector', '#overflowing-div')
      const elementId = spec.extractElementId(element)
      await driver.refresh()
      const error = await new Promise(resolve => {
        driver.elementIdClick(elementId, (err, _result) => {
          resolve(err)
        })
      })
      assert.ok(spec.isStaleElementError(error))
    })
    it('isStaleElementError(eyesErr)', async function(driver) {
      const element = await driver.element('css selector', '#overflowing-div')
      const elementId = spec.extractElementId(element)
      await driver.refresh()
      const error = await new Promise(resolve => {
        driver.elementIdClick(elementId, (err, _result) => {
          resolve(new EyesError('bla', err))
        })
      })
      assert.ok(spec.isStaleElementError(error))
    })
    it('getElementRect()', async function(driver) {
      const element = await driver.element('css selector', '#overflowing-div')
      const rect = await spec.getElementRect(driver, element)
      const {browserName} = spec.getDriverInfo(driver)
      const expectedYPosition = browserName === 'firefox' ? 79 : 80

      assert.deepStrictEqual(rect, {
        height: 184,
        width: 304,
        x: 8,
        y: expectedYPosition,
      })
    })
    it.skip('click()')
    it.skip('type()')
    it.skip('scrollIntoView()')
    it.skip('hover()')
    it.skip('waitUntilIsDisplayed()')
  })
})
