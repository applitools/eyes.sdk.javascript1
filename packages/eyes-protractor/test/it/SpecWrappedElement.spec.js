const assert = require('assert')
const {WebElement} = require('protractor')
const driverSpecs = require('../../src/SpecWrappedDriver')
const specs = require('../../src/SpecWrappedElement')

describe('SpecWrappedElement', () => {
  let driver

  before(async () => {
    driver = await driverSpecs.build({
      capabilities: {
        browserName: 'chrome',
        'goog:chromeOptions': {
          args: ['headless'],
        },
      },
      logLevel: 'error',
      serverUrl: 'http://localhost:4444/wd/hub',
    })
    await driver.get('https://applitools.github.io/demo/TestPages/FramesTestPage/')
  })

  after(async () => {
    await driverSpecs.cleanup(driver)
  })

  it('isCompatible(element)', async () => {
    const element = await driver.findElement(driver.by.css('div'))
    const result = specs.isCompatible(element)
    assert.deepStrictEqual(result, true)
  })

  it('isCompatible(wrong)', async () => {
    const result = specs.isCompatible({isElement: true})
    assert.deepStrictEqual(result, false)
  })

  it('isSelector(string)', async () => {
    const result = specs.isSelector('div')
    assert.deepStrictEqual(result, true)
  })

  it('isSelector(by)', async () => {
    const result = specs.isSelector(driver.by.css('div'))
    assert.deepStrictEqual(result, true)
  })

  it('isSelector(byNg)', async () => {
    const result = specs.isSelector(driver.by.model('model'))
    assert.deepStrictEqual(result, true)
  })

  it('isSelector(byHash)', async () => {
    const result = specs.isSelector({css: 'div'})
    assert.deepStrictEqual(result, true)
  })

  it('isSelector(wrong)', async () => {
    const result = specs.isSelector({isSelector: true})
    assert.deepStrictEqual(result, false)
  })

  it('toSupportedSelector(eyesSelector)', async () => {
    const xpathEyesSelector = {type: 'xpath', selector: '/html[1]/body[1]/div[1]'}
    const xpathResult = specs.toSupportedSelector(xpathEyesSelector)
    assert.deepStrictEqual(xpathResult, {xpath: xpathEyesSelector.selector})

    const cssEyesSelector = {type: 'css', selector: 'html > body > div'}
    const cssResult = specs.toSupportedSelector(cssEyesSelector)
    assert.deepStrictEqual(cssResult, {css: cssEyesSelector.selector})

    const wrongEyesSelector = {type: 'wrong type', selector: 'wrong selector'}
    const wrongResult = specs.toSupportedSelector(wrongEyesSelector)
    assert.deepStrictEqual(wrongResult, wrongEyesSelector)
  })

  it('toEyesSelector(selector)', async () => {
    const xpathSelector = driver.by.xpath('/html[1]/body[1]/div[1]')
    const xpathResult = specs.toEyesSelector(xpathSelector)
    assert.deepStrictEqual(xpathResult, {type: 'xpath', selector: '/html[1]/body[1]/div[1]'})

    const cssSelector = driver.by.css('html > body > div')
    const cssResult = specs.toEyesSelector(cssSelector)
    assert.deepStrictEqual(cssResult, {type: 'css', selector: 'html > body > div'})

    const byHashSelector = {name: 'block-name'}
    const nameResult = specs.toEyesSelector(byHashSelector)
    assert.deepStrictEqual(nameResult, {type: 'css', selector: '*[name="block-name"]'})

    const linkTextSelector = driver.by.linkText('click me!')
    const linkTextResult = specs.toEyesSelector(linkTextSelector)
    assert.deepStrictEqual(linkTextResult, {selector: linkTextSelector})

    const wrongSelector = {isWrong: true}
    const wrongResult = specs.toEyesSelector(wrongSelector)
    assert.deepStrictEqual(wrongResult, {selector: wrongSelector})
  })

  it('extractId(element)', async () => {
    const elementId = 'elementId'
    const element = new WebElement(driver, elementId)
    const result = await specs.extractId(element)
    assert.deepStrictEqual(result, elementId)
  })

  it('isStaleElementReferenceResult(err)', async () => {
    const element = await driver.findElement(driver.by.css('div'))
    await driver.navigate().refresh()
    try {
      await driver.executeScript('return null', element)
    } catch (err) {
      assert.strictEqual(specs.isStaleElementReferenceResult(err), true)
    }
  })
})
