const assert = require('assert')
const spec = require('../../src/spec-driver')
const {LegacySelector, withLegacyDriverAPI} = require('../../src/legacy-api')

describe('legacy api', () => {
  let browser, destroyBrowser, driver
  before(async () => {
    ;[browser, destroyBrowser] = await spec.build({browser: 'chrome'})
    driver = withLegacyDriverAPI(browser)
    await driver.url('https://applitools.github.io/demo/TestPages/FramesTestPage/')
  })

  after(async () => {
    await destroyBrowser()
  })

  it('remoteWebDriver', async () => {
    assert.strictEqual(driver.remoteWebDriver, browser)
  })

  it('findElement(legacy-selector)', async () => {
    const element = await driver.findElement(LegacySelector.id('overflowing-div'))
    assert.ok(element)
    assert.ok(element.getDriver)
    assert.ok(spec.isElement(element))
  })

  it('executeScript(script, ...args)', async () => {
    const args = [{a: 0}, [1, 2, 3], 0, 'str', true]
    const result = await driver.executeScript('return arguments', ...args)
    assert.deepStrictEqual(result, args)
  })

  it('switchTo()', async () => {
    const mainDoc = await driver.executeScript('return document.documentElement')
    await driver.switchTo().frame(1)
    const frameDoc = await driver.executeScript('return document.documentElement')
    assert.notDeepStrictEqual(frameDoc, mainDoc)
    await driver.switchTo().defaultContent()
    const defaultDoc = await driver.executeScript('return document.documentElement')
    assert.deepStrictEqual(defaultDoc, mainDoc)
  })

  it('getCurrentUrl()', async () => {
    assert.strictEqual(
      await driver.getCurrentUrl(),
      'https://applitools.github.io/demo/TestPages/FramesTestPage/',
    )
  })

  it('getBrowserName()', async () => {
    assert.strictEqual(await driver.getBrowserName(), 'chrome')
  })

  it('element.getDriver()', async () => {
    const element = await driver.findElement(LegacySelector.css('div'))
    assert.strictEqual(element.getDriver(), driver)
  })

  it('element.executeScript(script)', async () => {
    const element = await driver.findElement(LegacySelector.id('overflowing-div-image'))
    const tagName = await element.executeScript('return arguments[0].id')
    assert.strictEqual(tagName, 'overflowing-div-image')
  })

  it('element.findElement(legacy-selector)', async () => {
    const element = await driver.findElement(LegacySelector.id('overflowing-div-image'))
    const childElement = await element.findElement(LegacySelector.css('img'))
    assert.ok(childElement)
    assert.ok(childElement.getDriver)
    assert.ok(spec.isElement(childElement))
  })
  it('element.click()', async () => {
    const element = await driver.findElement(LegacySelector.css('input'))
    const isBlurred = await element.executeScript('return arguments[0] !== document.activeElement')
    assert.ok(isBlurred)
    await element.click()
    const isFocused = await element.executeScript('return arguments[0] === document.activeElement')
    assert.ok(isFocused)
  })
  it('element.sendKeys(string)', async () => {
    const element = await driver.findElement(LegacySelector.css('input'))
    await element.sendKeys('Hello World!')
    const [isFocused, value] = await element.executeScript(
      'return [arguments[0] === document.activeElement, arguments[0].value]',
    )
    assert.ok(isFocused)
    assert.strictEqual(value, 'Hello World!')
  })
})
