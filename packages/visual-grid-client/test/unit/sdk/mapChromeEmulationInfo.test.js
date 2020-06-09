'use strict'
const {describe, it} = require('mocha')
const {expect} = require('chai')
const mapChromeEmulationInfo = require('../../../src/sdk/mapChromeEmulationInfo')

describe('mapChromeEmulationInfo', () => {
  it('works', () => {
    const name = 'someName'
    const deviceName = 'someDeviceName'
    const screenOrientation = 'someScreenOrientation'

    const browser = {
      someOtherKey: 'val',
      deviceName: 'override',
      name: 'override',
      screenOrientation: 'override',
    }
    const browserResult = mapChromeEmulationInfo({
      ...browser,
      chromeEmulationInfo: {deviceName, name, screenOrientation},
    })
    expect(browserResult).to.eql({...browser, deviceName, name, screenOrientation})
  })

  it('doees not affect regular browser', () => {
    const browser = {
      someOtherKey: 'val',
      deviceName: 'one',
      name: 'two',
      screenOrientation: 'three',
    }
    const browserResult = mapChromeEmulationInfo(browser)
    expect(browserResult).to.eql(browser)
  })
})
