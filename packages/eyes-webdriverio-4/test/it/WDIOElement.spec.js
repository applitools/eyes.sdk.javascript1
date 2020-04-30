'use strict'
const chromedriver = require('chromedriver')
const {remote} = require('webdriverio')
const assert = require('assert')
const {Location, RectangleSize, Region} = require('@applitools/eyes-sdk-core')
const WDIODriver = require('../../src/wrappers/WDIODriver')
const WDIOElement = require('../../src/wrappers/WDIOElement')
const {Logger} = require('../../index')

describe('WDIOElement', function() {
  let logger, browser, driver

  before(async () => {
    await chromedriver.start([], true)
    logger = new Logger(false)
    browser = remote({
      desiredCapabilities: {
        browserName: 'chrome',
        chromeOptions: {
          args: ['disable-infobars', 'headless'],
        },
      },
      logLevel: 'error',
      port: 9515,
      path: '/',
    })
    await browser.init()
    await browser.url('https://applitools.github.io/demo/TestPages/FramesAndRegionsPage/')
  })

  beforeEach(async () => {
    driver = new WDIODriver(logger, browser)
  })

  after(async () => {
    await browser.end()
    chromedriver.stop()
  })

  it('static isCompatible(element)', async () => {
    const {value: element} = await browser.element('#frame_main')
    assert.ok(WDIOElement.isCompatible(element))
  })

  it('static isCompatible(elementResponse)', async () => {
    const elementResponse = await browser.element('#frame_main')
    assert.ok(WDIOElement.isCompatible(elementResponse))
  })

  it('static elementId(element)', async () => {
    const {value: element} = await browser.element('#frame_main')
    const elementId = element.ELEMENT || element['element-6066-11e4-a52e-4f735466cecf']
    assert.strictEqual(WDIOElement.elementId(element), elementId)
  })

  it('static elementId(elementWrapper)', async () => {
    const {value: element} = await browser.element('#frame_main')
    const elementId = element.ELEMENT || element['element-6066-11e4-a52e-4f735466cecf']
    const elementWrapper = new WDIOElement(logger, driver, element)
    assert.strictEqual(WDIOElement.elementId(elementWrapper), elementId)
  })

  it('constructor(element)', async () => {
    const {value: element} = await browser.element('#frame_main')
    const constructed = new WDIOElement(logger, driver, element)
    assert.strictEqual(constructed.elementId, WDIOElement.elementId(element))
  })

  it('constructor(elementResponse)', async () => {
    const selector = '#frame_main'
    const elementResponse = await browser.element(selector)
    const constructed = new WDIOElement(logger, driver, elementResponse)
    assert.strictEqual(constructed.elementId, WDIOElement.elementId(elementResponse.value))
    assert.strictEqual(constructed.selector, selector)
  })

  it('constructor(elementWrapper)', async () => {
    const elementWrapper = await driver.finder.findElement('#frame_main')
    const constructed = new WDIOElement(logger, driver, elementWrapper)
    assert.strictEqual(constructed, elementWrapper)
  })

  it('getLocation()', async () => {
    const elementWrapper = await driver.finder.findElement('#frame_main')
    const location = await elementWrapper.getLocation()
    const {left, top} = await driver.executor.executeScript(
      el => el.getBoundingClientRect(),
      elementWrapper,
    )
    assert.ok(location instanceof Location)
    assert.strictEqual(location.getX(), Math.ceil(left))
    assert.strictEqual(location.getY(), Math.ceil(top))
  })

  it('getSize()', async () => {
    const elementWrapper = await driver.finder.findElement('#frame_main')
    const size = await elementWrapper.getSize()
    const {width, height} = await driver.executor.executeScript(
      el => el.getBoundingClientRect(),
      elementWrapper,
    )
    assert.ok(size instanceof RectangleSize)
    assert.strictEqual(size.getWidth(), Math.ceil(width))
    assert.strictEqual(size.getHeight(), Math.ceil(height))
  })

  it('getRect()', async () => {
    const elementWrapper = await driver.finder.findElement('#frame_main')
    const rect = await elementWrapper.getRect()
    const {left, top, width, height} = await driver.executor.executeScript(
      el => el.getBoundingClientRect(),
      elementWrapper,
    )
    assert.ok(rect instanceof Region)
    assert.strictEqual(rect.getLeft(), Math.ceil(left))
    assert.strictEqual(rect.getTop(), Math.ceil(top))
    assert.strictEqual(rect.getWidth(), Math.ceil(width))
    assert.strictEqual(rect.getHeight(), Math.ceil(height))
  })

  it('getProperty(propertyName)', async () => {
    const id = 'frame_main'
    const elementWrapper = await driver.finder.findElement(`#${id}`)
    const propertyValue = await elementWrapper.getProperty('id')
    assert.strictEqual(propertyValue, id)
  })

  it('getProperty(...propertyNames)', async () => {
    const id = 'frame_main'
    const name = 'frame-main'
    const elementWrapper = await driver.finder.findElement(`#${id}[name="${name}"]`)
    const propertyValues = await elementWrapper.getProperty('id', 'name')
    assert.deepStrictEqual(propertyValues, [id, name])
  })

  it('getCssProperty(propertyName)', async () => {
    const propertyName = 'border-left-width'
    const elementWrapper = await driver.finder.findElement(`#frame_main`)
    const propertyValue = await elementWrapper.getCssProperty(propertyName)
    const expectedPropertyValue = await driver.executor.executeScript(
      (el, propertyName) => {
        //eslint-disable-next-line no-undef
        return window.getComputedStyle(el).getPropertyValue(propertyName)
      },
      elementWrapper,
      propertyName,
    )
    assert.strictEqual(propertyValue, expectedPropertyValue)
  })

  it('getCssProperty(...propertyNames)', async () => {
    const propertyNames = ['border-left-width', 'border-top-width']
    const elementWrapper = await driver.finder.findElement(`#frame_main`)
    const propertyValues = await elementWrapper.getCssProperty(...propertyNames)
    const expectedPropertyValues = await driver.executor.executeScript(
      (el, propertyNames) => {
        //eslint-disable-next-line no-undef
        const computedStyle = window.getComputedStyle(el)
        return propertyNames.map(propertyName => computedStyle.getPropertyValue(propertyName))
      },
      elementWrapper,
      propertyNames,
    )
    assert.deepStrictEqual(propertyValues, expectedPropertyValues)
  })
})
