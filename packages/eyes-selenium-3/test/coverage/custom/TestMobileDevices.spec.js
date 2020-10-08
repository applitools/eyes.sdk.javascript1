'use strict'
const {Target, StitchMode} = require('../../../index')
const {Builder} = require('selenium-webdriver')
const {getEyes} = require('./util/TestSetup')

const iPadAgent11 =
  'Mozilla/5.0 (iPad; CPU OS 11_0_1 like Mac OS X) AppleWebKit/604.2.10 (KHTML, like Gecko) Version/11.0 Mobile/15A8401 Safari/604.1'
const iPadAgent10 =
  'Mozilla/5.0 (iPad; CPU OS 10_3 like Mac OS X) AppleWebKit/603.1.30 (KHTML, like Gecko) Version/10.0 Mobile/14E269 Safari/602.1'
let iPadLandscape = [
  {
    mobileEmulation: getMobileEmulation(iPadAgent11, 512, 352, 4),
    name: 'iPad Air 2 Simulator 10.3',
  },
  {
    mobileEmulation: getMobileEmulation(iPadAgent11, 512, 349, 4),
    name: 'iPad Air 2 Simulator 12.0',
  },
  {
    mobileEmulation: getMobileEmulation(iPadAgent11, 512, 333, 4),
    name: 'iPad Air 2 Simulator 11.3',
  },
  {
    mobileEmulation: getMobileEmulation(iPadAgent11, 683, 477, 4),
    name: 'iPad Pro (12.9 inch) (2nd generation) Simulator 11.0',
  },
  {
    mobileEmulation: getMobileEmulation(iPadAgent11, 556, 382, 4),
    name: 'iPad Pro (10.5 inch) Simulator 11.0',
  },
]
let iPadPortrait = [
  {
    mobileEmulation: getMobileEmulation(iPadAgent10, 768, 960, 2),
    name: 'iPad Air 2 Simulator 10.3',
  },
  {
    mobileEmulation: getMobileEmulation(iPadAgent10, 768, 954, 2),
    name: 'iPad Air 2 Simulator 11.0',
  },
  {
    mobileEmulation: getMobileEmulation(iPadAgent10, 1024, 1296, 2),
    name: 'iPad Pro (12.9 inch) (2nd generation) Simulator 11.0',
  },
  {
    mobileEmulation: getMobileEmulation(iPadAgent10, 834, 1042, 2),
    name: 'iPad Pro (10.5 inch) Simulator 11.0',
  },
  {
    mobileEmulation: getMobileEmulation(iPadAgent10, 768, 922, 2),
    name: 'iPad (5th generation) Simulator 11.0',
  },
]
const iPhoneAgent =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 13_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0 Mobile/15E148 Safari/604.1'
let iPhoneLandscape = [
  {
    mobileEmulation: getMobileEmulation(iPhoneAgent, 724, 304, 3),
    name: 'iPhone XS Simulator 12.2',
  },
  {
    mobileEmulation: getMobileEmulation(iPhoneAgent, 724, 271, 3),
    name: 'iPhone 11 Pro Simulator 13.0',
  },
  {
    mobileEmulation: getMobileEmulation(iPhoneAgent, 808, 344, 3),
    name: 'iPhone XS Max Simulator 12.2',
  },
  {
    mobileEmulation: getMobileEmulation(iPhoneAgent, 808, 307, 3),
    name: 'iPhone 11 Pro Max Simulator 13.0',
  },
  {
    mobileEmulation: getMobileEmulation(iPhoneAgent, 808, 343, 2),
    name: 'iPhone XR Simulator 12.2',
  },
  {
    mobileEmulation: getMobileEmulation(iPhoneAgent, 808, 310, 2),
    name: 'iPhone 11 Simulator 13.0',
  },
  {
    mobileEmulation: getMobileEmulation(iPhoneAgent, 736, 364, 3),
    name: 'iPhone 6 Plus Simulator 11.0',
  },
  {
    mobileEmulation: getMobileEmulation(iPhoneAgent, 667, 331, 2),
    name: 'iPhone 7 Simulator 10.3',
  },
  {
    mobileEmulation: getMobileEmulation(iPhoneAgent, 736, 370, 3),
    name: 'iPhone 7 Plus Simulator 10.3',
  },
  {
    mobileEmulation: getMobileEmulation(iPhoneAgent, 568, 232, 2),
    name: 'iPhone 5s Simulator 10.3',
  },
]
let iPhonePortrait = [
  {
    mobileEmulation: getMobileEmulation(iPhoneAgent, 375, 635, 3),
    name: 'iPhone XS Simulator 12.2',
  },
  {
    mobileEmulation: getMobileEmulation(iPhoneAgent, 414, 719, 3),
    name: 'iPhone XS Max Simulator 12.2',
  },
  {
    mobileEmulation: getMobileEmulation(iPhoneAgent, 414, 719, 2),
    name: 'iPhone XR Simulator 12.2',
  },
  {
    mobileEmulation: getMobileEmulation(iPhoneAgent, 414, 622, 3),
    name: 'iPhone 6 Plus Simulator 11.0',
  },
  {
    mobileEmulation: getMobileEmulation(iPhoneAgent, 375, 559, 2),
    name: 'iPhone 7 Simulator 10.3',
  },
  {
    mobileEmulation: getMobileEmulation(iPhoneAgent, 320, 460, 2),
    name: 'iPhone 5s Simulator 10.3',
  },
]
let androidAgent =
  'Mozilla/5.0 (Linux; Android 8.0.0; Android SDK built for x86_64 Build/OSR1.180418.004) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Mobile Safari/537.36'
let android = {
  mobileEmulation: getMobileEmulation(androidAgent, 384, 512, 2),
  name: 'Android Emulator 8.0',
  orientation: 'Portrait',
}
const data = [
  android,
  ...addOrientation(iPadLandscape, 'Landscape'),
  ...addOrientation(iPadPortrait, 'Portrait'),
  ...addOrientation(iPhoneLandscape, 'Landscape'),
  ...addOrientation(iPhonePortrait, 'Portrait'),
]
describe('TestMobileDevices', () => {
  let page = ['mobile', 'desktop', 'scrolled_mobile']
  page.forEach(page => {
    describe(`${page}`, () => {
      before(function() {
        if (page === 'desktop' || page === 'scrolled_mobile') this.skip()
      })
      data.forEach(device => {
        it(`${device.name}`, async () => {
          let webDriver, eyes
          try {
            webDriver = await new Builder()
              .withCapabilities(getDeviceEmulationCaps(device.mobileEmulation))
              .build()
            eyes = getEyes(StitchMode.CSS)
            eyes.setSaveNewTests(false)
            eyes.addProperty('Orientation', device.orientation.toLowerCase())
            eyes.addProperty('Page', page)
            webDriver.get(
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
            await webDriver.quit()
            await eyes.abortIfNotClosed()
          }
        })
      })
    })
  })
})

function getMobileEmulation(agent, width, height, pixelRatio) {
  return {
    deviceMetrics: {
      width: width,
      height: height,
      pixelRatio: pixelRatio,
    },
    userAgent: agent,
  }
}
function addOrientation(data, orientation) {
  data = data.map(device => ({...device, orientation: orientation}))
  return data
}
function getDeviceEmulationCaps(mobileEmulation) {
  return {
    browserName: 'chrome',
    'goog:chromeOptions': {
      mobileEmulation: mobileEmulation,
      args: ['headless'],
    },
  }
}
