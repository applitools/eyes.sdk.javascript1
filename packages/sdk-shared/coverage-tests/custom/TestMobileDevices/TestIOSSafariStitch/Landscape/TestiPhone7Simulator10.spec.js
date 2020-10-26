'use strict'
const {getMobileEmulation, testMobileDevices, iPhoneAgent} = require('../../TestMobileDevices')
let device = {
  mobileEmulation: getMobileEmulation(iPhoneAgent, 667, 331, 2),
  name: 'iPhone 7 Simulator 10.3',
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
