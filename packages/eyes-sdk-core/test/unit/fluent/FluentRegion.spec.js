'use strict'

const assert = require('assert')
const {Region, Logger, FluentRegion, CoordinatesType, Location} = require('../../../index')
const MockDriver = require('../../utils/MockDriver')
const {Driver} = require('../../utils/FakeSDK')

describe('FluentRegion', () => {
  let driver,
    element,
    screenshot,
    rect1 = {x: 1, y: 2, width: 3, height: 4},
    rect2 = {x: 5, y: 6, width: 7, height: 8}

  before(async () => {
    const mock = new MockDriver()
    mock.mockElement('custom selector', {rect: rect1})
    mock.mockElement('custom selector', {rect: rect2})
    driver = new Driver(new Logger(false), mock)
    element = await driver.element('custom selector')
    screenshot = {
      convertLocation: (loc, from, to) => {
        assert.strictEqual(from, CoordinatesType.CONTEXT_RELATIVE)
        assert.strictEqual(to, CoordinatesType.SCREENSHOT_AS_IS)
        return new Location({x: loc.getX() + 1, y: loc.getY() + 1})
      },
    }
  })

  it('getRegion for coordinates', async () => {
    const region = new Region({left: 15, top: 16, width: 17, height: 18})
    const fluentRegion = new FluentRegion({region})
    assert.deepStrictEqual(await fluentRegion.getRegion(), [
      {
        left: region.getLeft(),
        top: region.getTop(),
        width: region.getWidth(),
        height: region.getHeight(),
      },
    ])
  })

  it('getRegion for coordinates with options', async () => {
    const region = new Region({left: 15, top: 16, width: 17, height: 18})
    const fluentRegion = new FluentRegion({region, options: {key: 'a'}})
    assert.deepStrictEqual(await fluentRegion.getRegion(), [
      {
        left: region.getLeft(),
        top: region.getTop(),
        width: region.getWidth(),
        height: region.getHeight(),
        key: 'a',
      },
    ])
  })

  it('getRegion for selector', async () => {
    const fluentRegion = new FluentRegion({selector: 'custom selector'})
    assert.deepStrictEqual(await fluentRegion.getRegion(driver, screenshot), [
      {left: rect1.x + 1, top: rect1.y + 1, width: rect1.width, height: rect1.height},
      {left: rect2.x + 1, top: rect2.y + 1, width: rect2.width, height: rect2.height},
    ])
  })

  it('getRegion for element', async () => {
    const fluentRegion = new FluentRegion({element: await driver.element('custom selector')})
    assert.deepStrictEqual(await fluentRegion.getRegion(driver, screenshot), [
      {left: rect1.x + 1, top: rect1.y + 1, width: rect1.width, height: rect1.height},
    ])
  })

  it('getRegion for selector with options', async () => {
    const fluentRegion = new FluentRegion({selector: 'custom selector', options: {key: 'a'}})
    assert.deepStrictEqual(await fluentRegion.getRegion(driver, screenshot), [
      {left: rect1.x + 1, top: rect1.y + 1, width: rect1.width, height: rect1.height, key: 'a'},
      {left: rect2.x + 1, top: rect2.y + 1, width: rect2.width, height: rect2.height, key: 'a'},
    ])
  })

  it('region', async () => {
    const region = new Region({left: 15, top: 16, width: 17, height: 18})
    const fluentRegion = new FluentRegion({region})
    const elementsById = await fluentRegion.resolveElements()
    assert.deepStrictEqual(elementsById, {})
    const persistedRegions = fluentRegion.toPersistedRegions()
    assert.deepStrictEqual(persistedRegions, [
      {
        left: region.getLeft(),
        top: region.getTop(),
        width: region.getWidth(),
        height: region.getHeight(),
      },
    ])
  })

  it('element', async () => {
    const fluentRegion = new FluentRegion({element})
    const elementsById = await fluentRegion.resolveElements(driver)
    assert.deepStrictEqual(Object.values(elementsById), [element])
    const persistedRegions = fluentRegion.toPersistedRegions()
    assert.deepStrictEqual(persistedRegions, [
      {type: 'css', selector: `[data-applitools-marker~="${Object.keys(elementsById)[0]}"]`},
    ])
  })

  it('selector', async () => {
    const fluentRegion = new FluentRegion({selector: 'custom selector'})
    const elementsById = await fluentRegion.resolveElements(driver)
    assert.deepStrictEqual(Object.values(elementsById), await driver.elements('custom selector'))
    const persistedRegions = fluentRegion.toPersistedRegions()
    const ids = Object.keys(elementsById)
    assert.deepStrictEqual(persistedRegions, [
      {type: 'css', selector: `[data-applitools-marker~="${ids[0]}"]`},
      {type: 'css', selector: `[data-applitools-marker~="${ids[1]}"]`},
    ])
  })

  it('options', async () => {
    const region = new Region({left: 15, top: 16, width: 17, height: 18})
    const fluentRegionRegion = new FluentRegion({region, options: {key: 'a'}})
    await fluentRegionRegion.resolveElements()
    const persistedRegionsRegion = await fluentRegionRegion.toPersistedRegions()
    assert.deepStrictEqual(persistedRegionsRegion, [
      {
        left: region.getLeft(),
        top: region.getTop(),
        width: region.getWidth(),
        height: region.getHeight(),
        key: 'a',
      },
    ])

    const fluentRegionElement = new FluentRegion({element, options: {key: 'b'}})
    const elementsByIdElement = await fluentRegionElement.resolveElements(driver)
    assert.deepStrictEqual(Object.values(elementsByIdElement), [element])
    const persistedRegionsElement = fluentRegionElement.toPersistedRegions()
    assert.deepStrictEqual(persistedRegionsElement, [
      {
        type: 'css',
        selector: `[data-applitools-marker~="${Object.keys(elementsByIdElement)[0]}"]`,
        key: 'b',
      },
    ])

    const fluentRegionSelector = new FluentRegion({
      selector: 'custom selector',
      options: {key: 'c'},
    })
    const elementsByIdSelector = await fluentRegionSelector.resolveElements(driver)
    const persistedRegionsSelector = fluentRegionSelector.toPersistedRegions()
    const idsSelector = Object.keys(elementsByIdSelector)
    assert.deepStrictEqual(persistedRegionsSelector, [
      {type: 'css', selector: `[data-applitools-marker~="${idsSelector[0]}"]`, key: 'c'},
      {type: 'css', selector: `[data-applitools-marker~="${idsSelector[1]}"]`, key: 'c'},
    ])
  })
})
