'use strict'
const {getMobileEmulation, testMobileDevices, iPhoneAgent} = require('../../TestMobileDevices')
let device = {
  mobileEmulation: getMobileEmulation(iPhoneAgent, 320, 460, 2),
  name: 'iPhone 5s Simulator 10.3',
  orientation: 'Portrait',
}
describe.skip(`${device.name} Portrait`, () => {
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
