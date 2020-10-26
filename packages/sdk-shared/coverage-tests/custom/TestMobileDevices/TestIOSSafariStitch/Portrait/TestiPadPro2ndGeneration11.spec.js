'use strict'
const {getMobileEmulation, testMobileDevices, iPadAgent10} = require('../../TestMobileDevices')
let device = {
  mobileEmulation: getMobileEmulation(iPadAgent10, 1024, 1296, 2),
  name: 'iPad Pro (12.9 inch) (2nd generation) Simulator 11.0',
  orientation: 'Portrait',
}
describe(`${device.name} Portrait`, () => {
  describe(`mobile`, () => {
    it('TestIOSSafariStitch', testMobileDevices(device, 'mobile'))
  })
  describe(`desktop`, () => {
    it('TestIOSSafariStitch', testMobileDevices(device, 'desktop'))
  })
  describe(`scrolled_mobile`, () => {
    it('TestIOSSafariStitch', testMobileDevices(device, 'scrolled_mobile'))
  })
})
