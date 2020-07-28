'use strict'

const assert = require('assert')
const FakeCheckSettings = require('../utils/FakeCheckSettings')
const FakeWrappedDriver = require('../utils/FakeWrappedDriver')
const MockDriver = require('../utils/MockDriver')
const {Logger} = require('../../index')

const fs = require('fs')
const path = require('path')
const ncp = require('ncp')
const {promisify} = require('util')
const pncp = promisify(ncp)

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

  // TODO complete rest of properties
  it('toCheckWindowConfiguration', async () => {
    const mockDriver = new MockDriver()
    mockDriver.mockElements([
      {id: 'id0', selector: 'element0', rect: {x: 1, y: 2, width: 500, height: 501}},
      {id: 'id1', selector: 'element1', rect: {x: 10, y: 11, width: 101, height: 102}},
      {id: 'id2', selector: 'element2', rect: {x: 20, y: 21, width: 201, height: 202}},
      {id: 'id3', selector: 'element3', rect: {x: 30, y: 31, width: 301, height: 302}},
      {id: 'id4', selector: 'element4', rect: {x: 40, y: 41, width: 401, height: 402}},
    ])
    const driver = new FakeWrappedDriver(new Logger(process.env.APPLITOOLS_SHOW_LOGS), mockDriver)
    const checkSettings = new FakeCheckSettings()
    checkSettings.accessibility({id: 'id0'}, 'bla')
    checkSettings.accessibility({id: 'id-not-mocked', selector: 'not-mocked'}, 'bla')
    const checkWindowConfiguration = await checkSettings.toCheckWindowConfiguration(driver)
    assert.deepStrictEqual(checkWindowConfiguration.accessibility, [
      {accessibilityType: 'bla', selector: '/HTML[1]/BODY[1]/DIV[2]', type: 'xpath'},
      {accessibilityType: 'bla', selector: '//[data-fake-selector="not-mocked"]', type: 'xpath'},
    ])
  })

  // TODO this test makes more sense to run inside docker
  it('resilient to duplicate copies of the SDK', async () => {
    // create another lib folder inside this folder
    const otherLibFolder = path.resolve(__dirname, 'lib2')
    fs.rmdirSync(otherLibFolder, {recursive: true})
    fs.mkdirSync(otherLibFolder)

    // copy lib folder contents into the new lib folder
    await pncp(path.resolve(__dirname, '../../lib'), otherLibFolder)

    try {
      const DriverCheckSettings2 = require('./lib2/fluent/DriverCheckSettings') // eslint-disable-line node/no-missing-require
      new FakeCheckSettings(DriverCheckSettings2.window())
    } finally {
      fs.rmdirSync(otherLibFolder, {recursive: true})
    }
  })
})
