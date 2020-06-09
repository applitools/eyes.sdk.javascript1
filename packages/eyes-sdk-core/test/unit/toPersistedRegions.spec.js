'use strict'

const assert = require('assert')
const {
  Region,
  Logger,
  TargetRegionByElement,
  IgnoreRegionByRectangle,
  IgnoreRegionByElement,
  IgnoreRegionBySelector,
  FloatingRegionByRectangle,
  FloatingRegionByElement,
  FloatingRegionBySelector,
  AccessibilityRegionByRectangle,
  AccessibilityRegionByElement,
  AccessibilityRegionBySelector,
  AccessibilityRegionType,
} = require('../../index')
const EyesJsSnippets = require('../../lib/EyesJsSnippets')
const MockDriver = require('../utils/MockDriver')
const FakeWrappedDriver = require('../utils/FakeWrappedDriver')

describe('toPersistedRegions()', () => {
  let driver, element

  before(async () => {
    const mock = new MockDriver()
    mock.mockScript(EyesJsSnippets.GET_ELEMENT_XPATH, element => element.xpath)
    mock.mockElement('custom selector', {
      xpath: '/calculated[1]/xpath[1]/some[1]',
    })
    driver = new FakeWrappedDriver(new Logger(false), mock)
    element = await driver.finder.findElement('custom selector')
  })

  it('IgnoreRegionByRectangle', async () => {
    const region = new IgnoreRegionByRectangle(
      new Region({left: 15, top: 16, width: 17, height: 18}),
    )
    const [{left, top, width, height}] = await region.toPersistedRegions(driver)
    assert.deepStrictEqual({left, top, width, height}, {left: 15, top: 16, width: 17, height: 18})
  })

  it('AccessibilityRegionByRectangle', async () => {
    const region = new AccessibilityRegionByRectangle(
      new Region({left: 15, top: 16, width: 17, height: 18}),
      AccessibilityRegionType.RegularText,
    )
    const [{left, top, width, height, accessibilityType}] = await region.toPersistedRegions(driver)
    assert.deepStrictEqual(
      {left, top, width, height, accessibilityType},
      {
        left: 15,
        top: 16,
        width: 17,
        height: 18,
        accessibilityType: AccessibilityRegionType.RegularText,
      },
    )
  })

  it('FloatingRegionByRectangle', async () => {
    const region = new FloatingRegionByRectangle(
      new Region({left: 15, top: 16, width: 17, height: 18}),
      1,
      2,
      3,
      4,
    )
    const [
      {left, top, width, height, maxUpOffset, maxDownOffset, maxLeftOffset, maxRightOffset},
    ] = await region.toPersistedRegions(driver)
    assert.deepStrictEqual(
      {left, top, width, height, maxUpOffset, maxDownOffset, maxLeftOffset, maxRightOffset},
      {
        left: 15,
        top: 16,
        width: 17,
        height: 18,
        maxUpOffset: 1,
        maxDownOffset: 2,
        maxLeftOffset: 3,
        maxRightOffset: 4,
      },
    )
  })

  it('TargetRegionByElement', async () => {
    const region = new TargetRegionByElement(element)
    const persistedRegion = await region.toPersistedRegions(driver)
    assert.deepStrictEqual(persistedRegion, [{type: 'xpath', selector: element.unwrapped.xpath}])
  })

  it('IgnoreRegionByElement', async () => {
    const region = new IgnoreRegionByElement(element)
    const persistedRegion = await region.toPersistedRegions(driver)
    assert.deepStrictEqual(persistedRegion, [{type: 'xpath', selector: element.unwrapped.xpath}])
  })

  it('FloatingRegionByElement', async () => {
    const region = new FloatingRegionByElement(element, 1, 2, 3, 4)
    const persistedRegion = await region.toPersistedRegions(driver)
    assert.deepStrictEqual(persistedRegion, [
      {
        type: 'xpath',
        selector: element.unwrapped.xpath,
        maxDownOffset: 2,
        maxLeftOffset: 3,
        maxRightOffset: 4,
        maxUpOffset: 1,
      },
    ])
  })

  it('AccessibilityRegionByElement', async () => {
    const region = new AccessibilityRegionByElement(element, AccessibilityRegionType.RegularText)
    const persistedRegion = await region.toPersistedRegions(driver)
    assert.deepStrictEqual(persistedRegion, [
      {
        type: 'xpath',
        selector: element.unwrapped.xpath,
        accessibilityType: AccessibilityRegionType.RegularText,
      },
    ])
  })

  it('IgnoreRegionBySelector', async () => {
    let region = new IgnoreRegionBySelector('css:.some')
    let persistedRegion = await region.toPersistedRegions(driver)
    assert.deepStrictEqual(persistedRegion, [{type: 'css', selector: '.some'}])

    region = new IgnoreRegionBySelector('xpath://some')
    persistedRegion = await region.toPersistedRegions(driver)
    assert.deepStrictEqual(persistedRegion, [{type: 'xpath', selector: '//some'}])

    region = new IgnoreRegionBySelector('custom selector')
    persistedRegion = await region.toPersistedRegions(driver)
    assert.deepStrictEqual(persistedRegion, [{type: 'xpath', selector: element.unwrapped.xpath}])
  })

  it('FloatingRegionBySelector', async () => {
    let region = new FloatingRegionBySelector('css:.some', 1, 2, 3, 4)
    let persistedRegion = await region.toPersistedRegions(driver)
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

    region = new FloatingRegionBySelector('xpath://some', 1, 2, 3, 4)
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

    region = new FloatingRegionBySelector('custom selector', 1, 2, 3, 4)
    persistedRegion = await region.toPersistedRegions(driver)
    assert.deepStrictEqual(persistedRegion, [
      {
        type: 'xpath',
        selector: element.unwrapped.xpath,
        maxDownOffset: 2,
        maxLeftOffset: 3,
        maxRightOffset: 4,
        maxUpOffset: 1,
      },
    ])
  })

  it('AccessibilityRegionBySelector', async () => {
    let region = new AccessibilityRegionBySelector('css:.some', AccessibilityRegionType.RegularText)
    let persistedRegion = await region.toPersistedRegions(driver)
    assert.deepStrictEqual(persistedRegion, [
      {
        type: 'css',
        selector: '.some',
        accessibilityType: AccessibilityRegionType.RegularText,
      },
    ])

    region = new AccessibilityRegionBySelector('xpath://some', AccessibilityRegionType.RegularText)
    persistedRegion = await region.toPersistedRegions(driver)
    assert.deepStrictEqual(persistedRegion, [
      {
        type: 'xpath',
        selector: '//some',
        accessibilityType: AccessibilityRegionType.RegularText,
      },
    ])

    region = new AccessibilityRegionBySelector(
      'custom selector',
      AccessibilityRegionType.RegularText,
    )
    persistedRegion = await region.toPersistedRegions(driver)
    assert.deepStrictEqual(persistedRegion, [
      {
        type: 'xpath',
        selector: element.unwrapped.xpath,
        accessibilityType: AccessibilityRegionType.RegularText,
      },
    ])
  })
})
