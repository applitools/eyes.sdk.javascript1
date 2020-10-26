'use strict'
const {getMobileEmulation, testMobileDevices, iPadAgent11} = require('../../TestMobileDevices')
let device = {
  mobileEmulation: getMobileEmulation(iPadAgent11, 556, 382, 4),
  name: 'iPad Pro (10.5 inch) Simulator 11.0',
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
