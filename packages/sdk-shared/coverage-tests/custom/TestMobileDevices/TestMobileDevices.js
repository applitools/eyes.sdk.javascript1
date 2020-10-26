'use strict'
const cwd = process.cwd()
const path = require('path')
const {Target, StitchMode} = require(cwd)
const spec = require(path.resolve(cwd, 'src/spec-driver'))
const {getEyes} = require('../../../src/test-setup')

const iPhoneAgent =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 13_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0 Mobile/15E148 Safari/604.1'
const iPadAgent11 =
  'Mozilla/5.0 (iPad; CPU OS 11_0_1 like Mac OS X) AppleWebKit/604.2.10 (KHTML, like Gecko) Version/11.0 Mobile/15A8401 Safari/604.1'
const iPadAgent10 =
  'Mozilla/5.0 (iPad; CPU OS 10_3 like Mac OS X) AppleWebKit/603.1.30 (KHTML, like Gecko) Version/10.0 Mobile/14E269 Safari/602.1'

function testMobileDevices(device, page) {
  return async () => {
    let webDriver, destroyDriver, eyes
    try {
      ;[webDriver, destroyDriver] = await spec.build({
        capabilities: getDeviceEmulationCaps(device.mobileEmulation),
      })
      eyes = getEyes()
      eyes.setParentBranchName('')
      eyes.setSaveNewTests(false)
      eyes.setStitchMode(StitchMode.SCROLL)
      eyes.addProperty('Orientation', device.orientation.toLowerCase())
      eyes.addProperty('Page', page)
      await spec.visit(
        webDriver,
        `https://applitools.github.io/demo/TestPages/DynamicResolution/${page}.html`,
      )
      await eyes.open(
        webDriver,
        'Eyes Selenium SDK - iOS Safari Cropping',
        `${device.name} ${device.orientation} ${page} fully`,
      )
      await eyes.check('step 1', Target.window().fully())
      await eyes.close()
    } finally {
      await destroyDriver()
      await eyes.abortIfNotClosed()
    }
  }
}

function getMobileEmulation(agent, width, height, pixelRatio) {
  return {
    deviceMetrics: {width, height, pixelRatio},
    userAgent: agent,
  }
}

function getDeviceEmulationCaps(mobileEmulation) {
  return {
    browserName: 'chrome',
    'goog:chromeOptions': {
      mobileEmulation: mobileEmulation,
      args: ['headless', 'hide-scrollbars'],
    },
  }
}
module.exports = {
  testMobileDevices: testMobileDevices,
  getMobileEmulation: getMobileEmulation,
  iPadAgent10: iPadAgent10,
  iPadAgent11: iPadAgent11,
  iPhoneAgent: iPhoneAgent,
}
