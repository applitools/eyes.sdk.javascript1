'use strict'

const assert = require('assert')
const {Driver, CheckSettings} = require('../../utils/FakeSDK')
const MockDriver = require('../../utils/MockDriver')
const {Logger, Configuration} = require('../../../index')
const {
  toCheckWindowConfiguration,
  resolveAllRegionElements,
} = require('../../../lib/fluent/CheckSettingsUtils')

describe('CheckSettingsUtils', () => {
  it('toCheckWindowConfiguration handles regions', async () => {
    const mockDriver = new MockDriver()
    mockDriver.mockElements([
      {selector: 'element0', rect: {x: 1, y: 2, width: 500, height: 501}},
      {selector: 'element1', rect: {x: 10, y: 11, width: 101, height: 102}},
      {selector: 'element1', rect: {x: 12, y: 13, width: 103, height: 104}},
      {selector: 'element2', rect: {x: 20, y: 21, width: 201, height: 202}},
      {selector: 'element3', rect: {x: 30, y: 31, width: 301, height: 302}},
      {selector: 'element4', rect: {x: 40, y: 41, width: 401, height: 402}},
      {selector: 'element4', rect: {x: 42, y: 43, width: 403, height: 404}},
    ])
    const driver = new Driver(new Logger(process.env.APPLITOOLS_SHOW_LOGS), mockDriver)
    const checkSettings = new CheckSettings()

    checkSettings.ignoreRegion(await driver.element('element0'))
    checkSettings.ignoreRegion('element1')
    checkSettings.ignoreRegion({left: 1, top: 2, width: 3, height: 5})

    checkSettings.floatingRegion(await driver.element('element2'), 1, 2, 3, 4)
    checkSettings.floatingRegion('element3', 5, 6, 7, 8)
    checkSettings.floatingRegion({left: 1, top: 2, width: 3, height: 5}, 9, 10, 11, 12)

    checkSettings.accessibility('element4', 'bla')

    const elementsById = await resolveAllRegionElements({checkSettings, context: driver})
    const ids = Object.keys(elementsById)

    const checkWindowConfiguration = toCheckWindowConfiguration({
      checkSettings,
      configuration: new Configuration(),
    })

    assert.deepStrictEqual(checkWindowConfiguration.ignore, [
      {selector: `[data-applitools-marker~="${ids[0]}"]`, type: 'css'},
      {selector: `[data-applitools-marker~="${ids[1]}"]`, type: 'css'},
      {selector: `[data-applitools-marker~="${ids[2]}"]`, type: 'css'},
      {left: 1, top: 2, width: 3, height: 5},
    ])
    assert.deepStrictEqual(checkWindowConfiguration.floating, [
      {
        selector: `[data-applitools-marker~="${ids[3]}"]`,
        type: 'css',
        maxUpOffset: 1,
        maxDownOffset: 2,
        maxLeftOffset: 3,
        maxRightOffset: 4,
      },
      {
        selector: `[data-applitools-marker~="${ids[4]}"]`,
        type: 'css',
        maxUpOffset: 5,
        maxDownOffset: 6,
        maxLeftOffset: 7,
        maxRightOffset: 8,
      },
      {
        left: 1,
        top: 2,
        width: 3,
        height: 5,
        maxUpOffset: 9,
        maxDownOffset: 10,
        maxLeftOffset: 11,
        maxRightOffset: 12,
      },
    ])
    assert.deepStrictEqual(checkWindowConfiguration.accessibility, [
      {accessibilityType: 'bla', selector: `[data-applitools-marker~="${ids[5]}"]`, type: 'css'},
      {accessibilityType: 'bla', selector: `[data-applitools-marker~="${ids[6]}"]`, type: 'css'},
    ])
  })

  it('toCheckWindowConfiguration handles window target', async () => {
    const windowCheckSettings = CheckSettings.window()

    const windowCheckWindowConfiguration = toCheckWindowConfiguration({
      checkSettings: windowCheckSettings,
      configuration: new Configuration(),
    })

    assert.strictEqual(windowCheckWindowConfiguration.target, 'window')
  })

  it('toCheckWindowConfiguration handles region target with selector', async () => {
    const mockDriver = new MockDriver()
    mockDriver.mockElements([
      {selector: 'some selector', rect: {x: 1, y: 2, width: 500, height: 501}},
    ])
    const driver = new Driver(new Logger(process.env.APPLITOOLS_SHOW_LOGS), mockDriver)

    const regionCheckSettings = CheckSettings.region('some selector')
    await resolveAllRegionElements({checkSettings: regionCheckSettings, context: driver})

    const regionCheckWindowConfiguration = toCheckWindowConfiguration({
      checkSettings: regionCheckSettings,
      configuration: new Configuration(),
    })

    assert.strictEqual(regionCheckWindowConfiguration.target, 'region')
  })

  it('toCheckWindowConfiguration handles region target with element', async () => {
    const mockDriver = new MockDriver()
    mockDriver.mockElements([
      {selector: 'some selector', rect: {x: 1, y: 2, width: 500, height: 501}},
    ])
    const driver = new Driver(new Logger(process.env.APPLITOOLS_SHOW_LOGS), mockDriver)

    const regionCheckSettings = CheckSettings.region(await driver.element('some selector'))
    await resolveAllRegionElements({checkSettings: regionCheckSettings, context: driver})

    const regionCheckWindowConfiguration = toCheckWindowConfiguration({
      checkSettings: regionCheckSettings,
      configuration: new Configuration(),
    })

    assert.strictEqual(regionCheckWindowConfiguration.target, 'region')
  })

  it('toCheckWindowConfiguration handles region target with coordinates', async () => {
    const regionCheckSettings = CheckSettings.region({left: 1, top: 2, width: 500, height: 501})

    const regionCheckWindowConfiguration = toCheckWindowConfiguration({
      checkSettings: regionCheckSettings,
      configuration: new Configuration(),
    })

    assert.strictEqual(regionCheckWindowConfiguration.target, 'region')
  })

  it('toCheckWindowConfiguration handles fully false with no default', async () => {
    const checkSettings = new CheckSettings()

    const checkWindowConfiguration = toCheckWindowConfiguration({
      checkSettings: checkSettings,
      configuration: new Configuration(),
    })

    assert.strictEqual(checkWindowConfiguration.fully, false)
  })

  it('toCheckWindowConfiguration handles fully true with no default', async () => {
    const checkSettings = new CheckSettings().fully()

    const checkWindowConfiguration = toCheckWindowConfiguration({
      checkSettings: checkSettings,
      configuration: new Configuration(),
    })

    assert.strictEqual(checkWindowConfiguration.fully, true)
  })

  it('toCheckWindowConfiguration handles fully false with default', async () => {
    const checkSettings = new CheckSettings()

    const checkWindowConfiguration = toCheckWindowConfiguration({
      checkSettings: checkSettings,
      configuration: new Configuration({forceFullPageScreenshot: true}),
    })

    assert.strictEqual(checkWindowConfiguration.fully, true)
  })

  it('toCheckWindowConfiguration handles fully true with default', async () => {
    const checkSettings = new CheckSettings().fully()

    const checkWindowConfiguration = toCheckWindowConfiguration({
      checkSettings: checkSettings,
      configuration: new Configuration({forceFullPageScreenshot: false}),
    })

    assert.strictEqual(checkWindowConfiguration.fully, true)
  })

  it('toCheckWindowConfiguration handles tag', async () => {
    const checkSettings = new CheckSettings().withName('some tag')

    const checkWindowConfiguration = toCheckWindowConfiguration({
      checkSettings: checkSettings,
      configuration: new Configuration(),
    })

    assert.strictEqual(checkWindowConfiguration.tag, 'some tag')
  })

  it('toCheckWindowConfiguration handles scriptHooks', async () => {
    const checkSettings = new CheckSettings().beforeRenderScreenshotHook('some hook')

    const checkWindowConfiguration = toCheckWindowConfiguration({
      checkSettings: checkSettings,
      configuration: new Configuration(),
    })

    assert.deepStrictEqual(checkWindowConfiguration.scriptHooks, {
      beforeCaptureScreenshot: 'some hook',
    })
  })

  it('toCheckWindowConfiguration handles sendDom', async () => {
    const checkSettings = new CheckSettings().sendDom(true)

    const checkWindowConfiguration = toCheckWindowConfiguration({
      checkSettings: checkSettings,
      configuration: new Configuration(),
    })

    assert.strictEqual(checkWindowConfiguration.sendDom, true)
  })

  it('toCheckWindowConfiguration handles matchLevel with no default', async () => {
    const checkSettings = new CheckSettings().matchLevel('some match level')

    const checkWindowConfiguration = toCheckWindowConfiguration({
      checkSettings: checkSettings,
      configuration: new Configuration(),
    })

    assert.strictEqual(checkWindowConfiguration.matchLevel, 'some match level')
  })

  it('toCheckWindowConfiguration handles matchLevel with default', async () => {
    const checkSettings = new CheckSettings()

    const checkWindowConfiguration = toCheckWindowConfiguration({
      checkSettings: checkSettings,
      configuration: new Configuration({
        defaultMatchSettings: {matchLevel: 'Layout'},
      }),
    })

    assert.strictEqual(checkWindowConfiguration.matchLevel, 'Layout')
  })

  it('toCheckWindowConfiguration handles matchLevel with default overriden', async () => {
    const checkSettings = new CheckSettings().matchLevel('some match level')

    const checkWindowConfiguration = toCheckWindowConfiguration({
      checkSettings: checkSettings,
      configuration: new Configuration({
        defaultMatchSettings: {matchLevel: 'Layout'},
      }),
    })

    assert.strictEqual(checkWindowConfiguration.matchLevel, 'some match level')
  })

  it('toCheckWindowConfiguration handles visualGridOptions with no default', async () => {
    const checkSettings = new CheckSettings().visualGridOption('polyfillAdoptedStyleSheets', true)

    const checkWindowConfiguration = toCheckWindowConfiguration({
      checkSettings: checkSettings,
      configuration: new Configuration(),
    })

    assert.deepStrictEqual(checkWindowConfiguration.visualGridOptions, {
      polyfillAdoptedStyleSheets: true,
    })
  })

  it('toCheckWindowConfiguration handles visualGridOptions with default', async () => {
    const checkSettings = new CheckSettings()

    const checkWindowConfiguration = toCheckWindowConfiguration({
      checkSettings: checkSettings,
      configuration: new Configuration({visualGridOptions: {polyfillAdoptedStyleSheets: true}}),
    })

    assert.deepStrictEqual(checkWindowConfiguration.visualGridOptions, {
      polyfillAdoptedStyleSheets: true,
    })
  })

  it('toCheckWindowConfiguration handles visualGridOptions with default overriden', async () => {
    const checkSettings = new CheckSettings().visualGridOption('polyfillAdoptedStyleSheets', true)

    const checkWindowConfiguration = toCheckWindowConfiguration({
      checkSettings: checkSettings,
      configuration: new Configuration({visualGridOptions: {polyfillAdoptedStyleSheets: false}}),
    })

    assert.deepStrictEqual(checkWindowConfiguration.visualGridOptions, {
      polyfillAdoptedStyleSheets: true,
    })
  })

  it('toCheckWindowConfiguration handles visualGridOptions with plural API', async () => {
    const checkSettings = new CheckSettings().visualGridOptions({polyfillAdoptedStyleSheets: true})

    const checkWindowConfiguration = toCheckWindowConfiguration({
      checkSettings: checkSettings,
      configuration: new Configuration(),
    })

    assert.deepStrictEqual(checkWindowConfiguration.visualGridOptions, {
      polyfillAdoptedStyleSheets: true,
    })
  })
})
