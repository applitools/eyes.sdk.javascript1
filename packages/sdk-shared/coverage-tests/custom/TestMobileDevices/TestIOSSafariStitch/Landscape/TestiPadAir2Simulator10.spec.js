'use strict'
const {getMobileEmulation, testMobileDevices, iPadAgent11} = require('../../TestMobileDevices')
let device = {
  mobileEmulation: getMobileEmulation(iPadAgent11, 512, 352, 4),
  name: 'iPad Air 2 Simulator 10.3',
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
