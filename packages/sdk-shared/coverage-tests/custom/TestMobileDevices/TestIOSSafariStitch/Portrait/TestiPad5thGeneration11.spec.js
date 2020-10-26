'use strict'
const {getMobileEmulation, testMobileDevices, iPadAgent10} = require('../../TestMobileDevices')
let device = {
  mobileEmulation: getMobileEmulation(iPadAgent10, 768, 922, 2),
  name: 'iPad (5th generation) Simulator 11.0',
  orientation: 'Portrait',
}
describe(`${device.name} Portrait`, () => {
  describe(`mobile`, () => {
    it('TestIOSSafariStitch', testMobileDevices(device, 'mobile'))
  })
  describe(`desktop`, () => {
    it.skip('TestIOSSafariStitch', testMobileDevices(device, 'desktop'))
  })
  describe(`scrolled_mobile`, () => {
    it('TestIOSSafariStitch', testMobileDevices(device, 'scrolled_mobile'))
  })
})
