'use strict'
const {getMobileEmulation, testMobileDevices, iPadAgent11} = require('../../TestMobileDevices')
let device = {
  mobileEmulation: getMobileEmulation(iPadAgent11, 683, 477, 4),
  name: 'iPad Pro (12.9 inch) (2nd generation) Simulator 11.0',
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
