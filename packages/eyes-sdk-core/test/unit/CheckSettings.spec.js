'use strict'

const assert = require('assert')
const FakeCheckSettings = require('../utils/FakeCheckSettings')

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
    }
    const checkSettings = FakeCheckSettings.from(object)

    const checkSettings2 = FakeCheckSettings.region(object.region)
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

    assert.deepStrictEqual(checkSettings, checkSettings2)
  })
})
