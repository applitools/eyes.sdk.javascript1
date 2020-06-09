const assert = require('assert')
const chromedriver = require('chromedriver')
const {remote} = require('webdriverio')
const specs = require('../../src/SpecWrappedElement')
const {By} = require('../../index')

describe('SpecWrappedDriver', async () => {
  let driver

  before(async () => {
    await chromedriver.start([], true)
    driver = await remote({
      capabilities: {
        browserName: 'chrome',
        'goog:chromeOptions': {
          args: ['disable-infobars', 'headless'],
        },
      },
      logLevel: 'error',
      port: 9515,
      path: '/',
    })
    await driver.url('https://applitools.github.io/demo/TestPages/FramesTestPage/')
  })

  after(async () => {
    await driver.deleteSession()
    chromedriver.stop()
  })

  it('isCompatible(element)', async () => {
    const element = await driver.findElement('css selector', 'div')
    const result = specs.isCompatible(element)
    assert.deepStrictEqual(result, true)
  })

  it('isCompatible(extendedElement)', async () => {
    const element = await driver.$('div')
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

  it('isSelector(function)', async () => {
    const result = specs.isSelector(function() {
      return this.document.querySelector('div')
    })
    assert.deepStrictEqual(result, true)
  })

  it('isSelector(by)', async () => {
    const result = specs.isSelector(By.css('div'))
    assert.deepStrictEqual(result, true)
  })

  it('isSelector(wrong)', async () => {
    const result = specs.isSelector({isSelector: true})
    assert.deepStrictEqual(result, false)
  })

  it('toSupportedSelector(eyesSelector)', async () => {
    const xpathEyesSelector = {type: 'xpath', selector: '/html[1]/body[1]/div[1]'}
    const xpathResult = specs.toSupportedSelector(xpathEyesSelector)
    assert.deepStrictEqual(xpathResult, `xpath:${xpathEyesSelector.selector}`)

    const cssEyesSelector = {type: 'css', selector: 'html > body > div'}
    const cssResult = specs.toSupportedSelector(cssEyesSelector)
    assert.deepStrictEqual(cssResult, `css selector:${cssEyesSelector.selector}`)

    const wrongEyesSelector = {type: 'wrong type', selector: 'wrong selector'}
    const wrongResult = specs.toSupportedSelector(wrongEyesSelector)
    assert.deepStrictEqual(wrongResult, wrongEyesSelector)
  })

  it('toEyesSelector(selector)', async () => {
    const xpathSelector = 'xpath:/html[1]/body[1]/div[1]'
    const xpathResult = specs.toEyesSelector(xpathSelector)
    assert.deepStrictEqual(xpathResult, {type: 'xpath', selector: '/html[1]/body[1]/div[1]'})

    const cssSelector = 'css selector:html > body > div'
    const cssResult = specs.toEyesSelector(cssSelector)
    assert.deepStrictEqual(cssResult, {type: 'css', selector: 'html > body > div'})

    const tagSelector = '<tag />'
    const tagResult = specs.toEyesSelector(tagSelector)
    assert.deepStrictEqual(tagResult, {selector: tagSelector})

    const wrongSelector = {isWrong: true}
    const wrongResult = specs.toEyesSelector(wrongSelector)
    assert.deepStrictEqual(wrongResult, {selector: wrongSelector})
  })

  it('extractId(element)', async () => {
    const elementId = 'elementId'
    const element = {'element-6066-11e4-a52e-4f735466cecf': elementId}
    const result = specs.extractId(element)
    assert.deepStrictEqual(result, elementId)
  })

  it('extractId(legacyElement)', async () => {
    const elementId = 'elementId'
    const element = {ELEMENT: elementId}
    const result = specs.extractId(element)
    assert.deepStrictEqual(result, elementId)
  })

  it('extractElement(element)', async () => {
    const element = await driver.findElement('css selector', 'div')
    const elementId = element.ELEMENT || element['element-6066-11e4-a52e-4f735466cecf']
    const result = specs.extractElement(element)
    assert.deepStrictEqual(result, {
      ELEMENT: elementId,
      'element-6066-11e4-a52e-4f735466cecf': elementId,
    })
  })

  it('extractElement(extendedElement)', async () => {
    const element = await driver.$('div')
    const elementId = element.elementId
    const result = specs.extractElement(element)
    assert.deepStrictEqual(result, {
      ELEMENT: elementId,
      'element-6066-11e4-a52e-4f735466cecf': elementId,
    })
  })

  it('extractSelector(element)', async () => {
    const selector = 'div'
    const element = await driver.findElement('css selector', selector)
    const result = specs.extractSelector(element)
    assert.deepStrictEqual(result, undefined)
  })

  it('extractSelector(extendedElement)', async () => {
    const selector = 'div'
    const element = await driver.$(selector)
    const result = specs.extractSelector(element)
    assert.deepStrictEqual(result, selector)
  })

  it('isStaleElementReferenceResult(err)', async () => {
    const element = await driver.$('div')
    await driver.refresh()
    try {
      await driver.execute('return null', element)
    } catch (err) {
      assert.strictEqual(specs.isStaleElementReferenceResult(err), true)
    }
  })
})
