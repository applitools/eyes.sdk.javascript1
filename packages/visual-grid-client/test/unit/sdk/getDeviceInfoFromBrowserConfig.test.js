'use strict'
const {describe, it} = require('mocha')
const {expect} = require('chai')
const getDeviceInfoFromBrowserConfig = require('../../../src/sdk/getDeviceInfoFromBrowserConfig')

describe('getDeviceInfoFromBrowserConfig', () => {
  it('returns "Desktop" for desktop browsers', () => {
    expect(getDeviceInfoFromBrowserConfig({})).to.equal('Desktop')
    expect(getDeviceInfoFromBrowserConfig({name: 'chrome'})).to.equal('Desktop')
  })

  it('returns "(Chrome emulation)" suffix for chrome emulated devices', () => {
    expect(getDeviceInfoFromBrowserConfig({deviceName: 'bla'})).to.equal('bla (Chrome emulation)')
    expect(getDeviceInfoFromBrowserConfig({chromeEmulationInfo: {deviceName: 'bla'}})).to.equal(
      'bla (Chrome emulation)',
    )
  })

  it('returns device name for ios devices', () => {
    expect(getDeviceInfoFromBrowserConfig({iosDeviceInfo: {deviceName: 'bla'}})).to.equal('bla')
  })
})
