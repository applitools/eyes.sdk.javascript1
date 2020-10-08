'use strict'

const assert = require('assert')
const {CheckSettings} = require('../../utils/FakeSDK')
const TypeUtils = require('../../../lib/utils/TypeUtils')
const vm = require('vm')
const fs = require('fs')
const path = require('path')

describe('CheckSettings', () => {
  it('from(object)', () => {
    const object = {
      name: 'name',
      region: 'selector',
      frames: ['frame', {frame: 'other-frame', scrollRootElement: 'frame-scroll-root-selector'}],
      scrollRootElement: {id: Symbol('elementId')},
      ignoreRegions: ['ignore-region-selector'],
      contentRegions: [{id: Symbol('elementId')}],
      strictRegions: [{left: 0, top: 1, width: 100, height: 101}],
      layoutRegions: ['layout-region-selector'],
      floatingRegions: [
        {
          region: 'floating-region-selector',
          maxUpOffset: 0,
          maxDownOffset: 1,
          maxLeftOffset: 2,
          maxRightOffset: 3,
        },
      ],
      accessibilityRegions: ['accessibility-region-selector'],
      isFully: true,
      visualGridOptions: {polyfillAdoptedStyleSheets: true},
      layoutBreakpoints: true,
      disableBrowserFetching: true,
    }
    const checkSettings = CheckSettings.from(object)

    const checkSettings2 = CheckSettings.region(object.region)
      .withName(object.name)
      .scrollRootElement(object.scrollRootElement)
      .frame(object.frames[0])
      .frame(object.frames[1].frame)
      .scrollRootElement(object.frames[1].scrollRootElement)
      .ignoreRegions(...object.ignoreRegions)
      .contentRegions(...object.contentRegions)
      .strictRegions(...object.strictRegions)
      .layoutRegions(...object.layoutRegions)
      .accessibilityRegion(object.accessibilityRegions[0])
      .floatingRegion(
        object.floatingRegions[0].region,
        object.floatingRegions[0].maxUpOffset,
        object.floatingRegions[0].maxDownOffset,
        object.floatingRegions[0].maxLeftOffset,
        object.floatingRegions[0].maxRightOffset,
      )
      .fully(object.isFully)
      .visualGridOption('polyfillAdoptedStyleSheets', true)
      .layoutBreakpoints()
      .disableBrowserFetching()

    assert.deepStrictEqual(checkSettings, checkSettings2)
  })

  it('layoutBreakpoints', async () => {
    const checkSettings = new CheckSettings()
    checkSettings.layoutBreakpoints()
    assert.deepStrictEqual(checkSettings.getLayoutBreakpoints(), true)
    checkSettings.layoutBreakpoints(false)
    assert.deepStrictEqual(checkSettings.getLayoutBreakpoints(), false)
    checkSettings.layoutBreakpoints([25, 50, 100, 200])
    assert.deepStrictEqual(checkSettings.getLayoutBreakpoints(), [200, 100, 50, 25])
    checkSettings.layoutBreakpoints([100, 200, 200, 100, 50, 25])
    assert.deepStrictEqual(checkSettings.getLayoutBreakpoints(), [200, 100, 50, 25])
    checkSettings.layoutBreakpoints([])
    assert.deepStrictEqual(checkSettings.getLayoutBreakpoints(), false)

    const checkSettingsDefault = new CheckSettings()
    assert.deepStrictEqual(
      TypeUtils.getOrDefault(checkSettingsDefault.getLayoutBreakpoints(), true),
      true,
    )
  })

  // TODO this test makes more sense to run inside docker
  it('resilient to duplicate copies of the SDK', async () => {
    const context = {
      require: modulePath =>
        require(modulePath.startsWith('.')
          ? path.resolve(__dirname, '../../utils/', modulePath)
          : modulePath),
      module: {exports: {}},
    }
    const code = fs.readFileSync(path.resolve(__dirname, '../../utils/FakeSDK.js'))
    vm.runInNewContext(code, context)

    const CheckSettings2 = context.module.exports.CheckSettings

    assert.notStrictEqual(CheckSettings, CheckSettings2)

    new CheckSettings(CheckSettings2.window())
  })
})
