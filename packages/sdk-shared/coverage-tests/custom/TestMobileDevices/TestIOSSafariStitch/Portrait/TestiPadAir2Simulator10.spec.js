'use strict'
const {getMobileEmulation, testMobileDevices, iPadAgent10} = require('../../TestMobileDevices')
let device = {
  mobileEmulation: getMobileEmulation(iPadAgent10, 768, 960, 2),
  name: 'iPad Air 2 Simulator 10.3',
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
