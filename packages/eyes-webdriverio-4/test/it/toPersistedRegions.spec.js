'use strict'

const chromedriver = require('chromedriver')
const {remote} = require('webdriverio')
const assert = require('assert')
const {
  AccessibilityRegionType,
  TargetRegionBySelector,
  TargetRegionByElement,
  IgnoreRegionBySelector,
  IgnoreRegionByElement,
  FloatingRegionBySelector,
  FloatingRegionByElement,
  AccessibilityRegionByElement,
  AccessibilityRegionBySelector,
} = require('@applitools/eyes-sdk-core')
const WDIODriver = require('../../src/wrappers/WDIODriver')
const {By, Logger} = require('../../index')

describe('toPersistedRegions()', function() {
  let browser, driver, logger
  before(async () => {
    await chromedriver.start([], true)
    browser = remote({
      desiredCapabilities: {
        browserName: 'chrome',
        chromeOptions: {
          args: ['disable-infobars', 'headless'],
        },
      },
      port: 9515,
      path: '/',
      logLevel: 'error',
    })
    const url = 'https://applitools.com/helloworld'
    await browser.init()
    await browser.url(url)
    logger = new Logger(false)
    driver = new WDIODriver(logger, browser)
  })

  after(async () => {
    await driver.end()
    await chromedriver.stop()
  })

  it('TargetRegionByElement', async () => {
    const {value: element} = await browser.$('button')
    const region = new TargetRegionByElement(element)
    const persistedRegion = await region.toPersistedRegions(driver)
    assert.deepStrictEqual(persistedRegion, [
      {
        type: 'xpath',
        selector: 'HTML[1]/BODY[1]/DIV[1]/DIV[3]/BUTTON[1]',
      },
    ])
  })

  it('IgnoreRegionByElement', async () => {
    const {value: element} = await browser.$('button')
    const region = new IgnoreRegionByElement(element)
    const persistedRegion = await region.toPersistedRegions(driver)
    assert.deepStrictEqual(persistedRegion, [
      {
        type: 'xpath',
        selector: 'HTML[1]/BODY[1]/DIV[1]/DIV[3]/BUTTON[1]',
      },
    ])
  })

  it('FloatingRegionByElement', async () => {
    const {value: element} = await browser.$('button')
    const region = new FloatingRegionByElement(element, 1, 2, 3, 4)
    const persistedRegion = await region.toPersistedRegions(driver)
    assert.deepStrictEqual(persistedRegion, [
      {
        type: 'xpath',
        selector: 'HTML[1]/BODY[1]/DIV[1]/DIV[3]/BUTTON[1]',
        maxDownOffset: 2,
        maxLeftOffset: 3,
        maxRightOffset: 4,
        maxUpOffset: 1,
      },
    ])
  })

  it('AccessibilityRegionByElement', async () => {
    const {value: element} = await browser.$('button')
    const region = new AccessibilityRegionByElement(element, AccessibilityRegionType.RegularText)
    const persistedRegion = await region.toPersistedRegions(driver)
    assert.deepStrictEqual(persistedRegion, [
      {
        type: 'xpath',
        selector: 'HTML[1]/BODY[1]/DIV[1]/DIV[3]/BUTTON[1]',
        accessibilityType: AccessibilityRegionType.RegularText,
      },
    ])
  })

  it('TargetRegionBySelector', async () => {
    let region = new TargetRegionBySelector(By.css('some'))
    let persistedRegion = await region.toPersistedRegions(driver)
    assert.deepStrictEqual(persistedRegion, [{type: 'css', selector: 'some'}])

    region = new TargetRegionBySelector(By.id('some'))
    persistedRegion = await region.toPersistedRegions(driver)
    assert.deepStrictEqual(persistedRegion, [{type: 'css', selector: '*[id="some"]'}])

    region = new TargetRegionBySelector(By.className('some'))
    persistedRegion = await region.toPersistedRegions(driver)
    assert.deepStrictEqual(persistedRegion, [{type: 'css', selector: '.some'}])

    region = new TargetRegionBySelector(By.name('some'))
    persistedRegion = await region.toPersistedRegions(driver)
    assert.deepStrictEqual(persistedRegion, [{type: 'css', selector: '*[name="some"]'}])

    region = new TargetRegionBySelector(By.xpath('//some'))
    persistedRegion = await region.toPersistedRegions(driver)
    assert.deepStrictEqual(persistedRegion, [{type: 'xpath', selector: '//some'}])

    region = new TargetRegionBySelector('button')
    persistedRegion = await region.toPersistedRegions(driver)
    assert.deepStrictEqual(persistedRegion, [
      {type: 'xpath', selector: 'HTML[1]/BODY[1]/DIV[1]/DIV[3]/BUTTON[1]'},
    ])
  })

  it('IgnoreRegionBySelector', async () => {
    let region = new IgnoreRegionBySelector(By.css('some'))
    let persistedRegion = await region.toPersistedRegions(driver)
    assert.deepStrictEqual(persistedRegion, [{type: 'css', selector: 'some'}])

    region = new IgnoreRegionBySelector(By.id('some'))
    persistedRegion = await region.toPersistedRegions(driver)
    assert.deepStrictEqual(persistedRegion, [{type: 'css', selector: '*[id="some"]'}])

    region = new IgnoreRegionBySelector(By.className('some'))
    persistedRegion = await region.toPersistedRegions(driver)
    assert.deepStrictEqual(persistedRegion, [{type: 'css', selector: '.some'}])

    region = new IgnoreRegionBySelector(By.name('some'))
    persistedRegion = await region.toPersistedRegions(driver)
    assert.deepStrictEqual(persistedRegion, [{type: 'css', selector: '*[name="some"]'}])

    region = new IgnoreRegionBySelector(By.xpath('//some'))
    persistedRegion = await region.toPersistedRegions(driver)
    assert.deepStrictEqual(persistedRegion, [{type: 'xpath', selector: '//some'}])

    region = new IgnoreRegionBySelector('button')
    persistedRegion = await region.toPersistedRegions(driver)
    assert.deepStrictEqual(persistedRegion, [
      {type: 'xpath', selector: 'HTML[1]/BODY[1]/DIV[1]/DIV[3]/BUTTON[1]'},
    ])
  })

  it('FloatingRegionBySelector', async () => {
    let region = new FloatingRegionBySelector(By.css('some'), 1, 2, 3, 4)
    let persistedRegion = await region.toPersistedRegions(driver)
    assert.deepStrictEqual(persistedRegion, [
      {
        type: 'css',
        selector: 'some',
        maxDownOffset: 2,
        maxLeftOffset: 3,
        maxRightOffset: 4,
        maxUpOffset: 1,
      },
    ])

    region = new FloatingRegionBySelector(By.id('some'), 1, 2, 3, 4)
    persistedRegion = await region.toPersistedRegions(driver)
    assert.deepStrictEqual(persistedRegion, [
      {
        type: 'css',
        selector: '*[id="some"]',
        maxDownOffset: 2,
        maxLeftOffset: 3,
        maxRightOffset: 4,
        maxUpOffset: 1,
      },
    ])

    region = new FloatingRegionBySelector(By.className('some'), 1, 2, 3, 4)
    persistedRegion = await region.toPersistedRegions(driver)
    assert.deepStrictEqual(persistedRegion, [
      {
        type: 'css',
        selector: '.some',
        maxDownOffset: 2,
        maxLeftOffset: 3,
        maxRightOffset: 4,
        maxUpOffset: 1,
      },
    ])

    region = new FloatingRegionBySelector(By.name('some'), 1, 2, 3, 4)
    persistedRegion = await region.toPersistedRegions(driver)
    assert.deepStrictEqual(persistedRegion, [
      {
        type: 'css',
        selector: '*[name="some"]',
        maxDownOffset: 2,
        maxLeftOffset: 3,
        maxRightOffset: 4,
        maxUpOffset: 1,
      },
    ])

    region = new FloatingRegionBySelector(By.xpath('//some'), 1, 2, 3, 4)
    persistedRegion = await region.toPersistedRegions(driver)
    assert.deepStrictEqual(persistedRegion, [
      {
        type: 'xpath',
        selector: '//some',
        maxDownOffset: 2,
        maxLeftOffset: 3,
        maxRightOffset: 4,
        maxUpOffset: 1,
      },
    ])

    region = new FloatingRegionBySelector('button', 1, 2, 3, 4)
    persistedRegion = await region.toPersistedRegions(driver)
    assert.deepStrictEqual(persistedRegion, [
      {
        type: 'xpath',
        selector: 'HTML[1]/BODY[1]/DIV[1]/DIV[3]/BUTTON[1]',
        maxDownOffset: 2,
        maxLeftOffset: 3,
        maxRightOffset: 4,
        maxUpOffset: 1,
      },
    ])
  })

  it('AccessibilityRegionBySelector', async () => {
    let region = new AccessibilityRegionBySelector(
      By.css('some'),
      AccessibilityRegionType.RegularText,
    )
    let persistedRegion = await region.toPersistedRegions(driver)
    assert.deepStrictEqual(persistedRegion, [
      {
        type: 'css',
        selector: 'some',
        accessibilityType: AccessibilityRegionType.RegularText,
      },
    ])

    region = new AccessibilityRegionBySelector(By.id('some'), AccessibilityRegionType.RegularText)
    persistedRegion = await region.toPersistedRegions(driver)
    assert.deepStrictEqual(persistedRegion, [
      {
        type: 'css',
        selector: '*[id="some"]',
        accessibilityType: AccessibilityRegionType.RegularText,
      },
    ])

    region = new AccessibilityRegionBySelector(
      By.className('some'),
      AccessibilityRegionType.RegularText,
    )
    persistedRegion = await region.toPersistedRegions(driver)
    assert.deepStrictEqual(persistedRegion, [
      {
        type: 'css',
        selector: '.some',
        accessibilityType: AccessibilityRegionType.RegularText,
      },
    ])

    region = new AccessibilityRegionBySelector(By.name('some'), AccessibilityRegionType.RegularText)
    persistedRegion = await region.toPersistedRegions(driver)
    assert.deepStrictEqual(persistedRegion, [
      {
        type: 'css',
        selector: '*[name="some"]',
        accessibilityType: AccessibilityRegionType.RegularText,
      },
    ])

    region = new AccessibilityRegionBySelector(
      By.xpath('//some'),
      AccessibilityRegionType.RegularText,
    )
    persistedRegion = await region.toPersistedRegions(driver)
    assert.deepStrictEqual(persistedRegion, [
      {
        type: 'xpath',
        selector: '//some',
        accessibilityType: AccessibilityRegionType.RegularText,
      },
    ])

    region = new AccessibilityRegionBySelector('button', AccessibilityRegionType.RegularText)
    persistedRegion = await region.toPersistedRegions(driver)
    assert.deepStrictEqual(persistedRegion, [
      {
        type: 'xpath',
        selector: 'HTML[1]/BODY[1]/DIV[1]/DIV[3]/BUTTON[1]',
        accessibilityType: AccessibilityRegionType.RegularText,
      },
    ])
  })
})
