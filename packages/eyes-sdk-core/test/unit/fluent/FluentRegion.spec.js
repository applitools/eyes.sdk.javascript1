'use strict'

const assert = require('assert')
const {Region, Logger, FluentRegion} = require('../../../index')
const MockDriver = require('../../utils/MockDriver')
const {Driver} = require('../../utils/FakeSDK')

describe('FluentRegion', () => {
  let driver, element

  before(async () => {
    const mock = new MockDriver()
    mock.mockElement('custom selector', {
      xpath: '/calculated[1]/xpath[1]/some[1]',
    })
    driver = new Driver(new Logger(false), mock)
    element = await driver.element('custom selector')
  })

  it('region', async () => {
    const region = new Region({left: 15, top: 16, width: 17, height: 18})
    const fluentRegion = new FluentRegion({region})
    const persistedRegions = await fluentRegion.toPersistedRegions(driver)
    assert.deepStrictEqual(persistedRegions, [region.toJSON()])
  })

  it('element', async () => {
    const fluentRegion = new FluentRegion({element})
    const persistedRegions = await fluentRegion.toPersistedRegions(driver)
    assert.deepStrictEqual(persistedRegions, [{type: 'xpath', selector: element.unwrapped.xpath}])
  })

  it('selector', async () => {
    const fluentRegionCss = new FluentRegion({selector: 'css:.some'})
    const persistedRegionsCss = await fluentRegionCss.toPersistedRegions(driver)
    assert.deepStrictEqual(persistedRegionsCss, [{type: 'css', selector: '.some'}])

    const fluentRegionXpath = new FluentRegion({selector: 'xpath://some'})
    const persistedRegionsXpath = await fluentRegionXpath.toPersistedRegions(driver)
    assert.deepStrictEqual(persistedRegionsXpath, [{type: 'xpath', selector: '//some'}])

    const fluentRegionCustom = new FluentRegion({selector: 'custom selector'})
    const persistedRegionsCustom = await fluentRegionCustom.toPersistedRegions(driver)
    assert.deepStrictEqual(persistedRegionsCustom, [
      {type: 'xpath', selector: element.unwrapped.xpath},
    ])
  })

  it('options', async () => {
    const region = new Region({left: 15, top: 16, width: 17, height: 18})
    const fluentRegionRegion = new FluentRegion({region, options: {key: 'a'}})
    const persistedRegionsRegion = await fluentRegionRegion.toPersistedRegions(driver)
    assert.deepStrictEqual(persistedRegionsRegion, [{...region.toJSON(), key: 'a'}])

    const fluentRegionElement = new FluentRegion({element, options: {key: 'b'}})
    const persistedRegionsElement = await fluentRegionElement.toPersistedRegions(driver)
    assert.deepStrictEqual(persistedRegionsElement, [
      {type: 'xpath', selector: element.unwrapped.xpath, key: 'b'},
    ])

    const fluentRegionSelector = new FluentRegion({selector: 'css:.some', options: {key: 'c'}})
    const persistedRegionsSelector = await fluentRegionSelector.toPersistedRegions(driver)
    assert.deepStrictEqual(persistedRegionsSelector, [{type: 'css', selector: '.some', key: 'c'}])
  })
})
