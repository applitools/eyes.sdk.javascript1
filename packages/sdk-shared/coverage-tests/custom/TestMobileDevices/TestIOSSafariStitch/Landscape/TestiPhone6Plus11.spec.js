'use strict'
const {getMobileEmulation, testMobileDevices, iPhoneAgent} = require('../../TestMobileDevices')
let device = {
  mobileEmulation: getMobileEmulation(iPhoneAgent, 736, 364, 3),
  name: 'iPhone 6 Plus Simulator 11.0',
  orientation: 'Landscape',
}
describe.skip(`${device.name} Landscape`, () => {
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
