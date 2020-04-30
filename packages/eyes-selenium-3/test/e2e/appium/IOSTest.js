'use strict'

const {Builder, Capabilities, By} = require('selenium-webdriver')
const {GeneralUtils} = require('@applitools/eyes-common-legacy')
const {ConsoleLogHandler} = require('@applitools/eyes-sdk-core-legacy')
const {Eyes, Target, StitchMode} = require('../../../index')

describe('IOSTest', function() {
  this.timeout(10 * 60 * 1000)

  const batchInfo = 'Java3 Tests'

  const dataProvider = []
  dataProvider.push(
    ...GeneralUtils.cartesianProduct('iPhone X Simulator', ['portrait', 'landscape'], '11.0', [
      false,
      true,
    ]),
  )

  // dataProvider.push(...TestUtils.cartesianProduct(
  //   ['iPhone 7 Simulator', 'iPhone 6 Plus Simulator'],
  //   ['portrait', 'landscape'],
  //   ['10.0', '11.0'],
  //   [false, true]
  // ));

  dataProvider.forEach(row => {
    const [deviceName, deviceOrientation, platformVersion, fully] = row

    let testName = `${deviceName} ${platformVersion} ${deviceOrientation}`
    if (fully) testName += ' fully'

    it(testName, function() {
      const eyes = new Eyes()
      eyes.setBatch(batchInfo)

      const caps = Capabilities.iphone()
      caps.set('appiumVersion', '1.7.2')
      caps.set('deviceName', deviceName)
      caps.set('deviceOrientation', deviceOrientation)
      caps.set('platformVersion', platformVersion)
      caps.set('platformName', 'iOS')
      caps.set('browserName', 'Safari')

      caps.set('browserstack.user', process.env.BROWSERSTACK_USERNAME)
      caps.set('browserstack.key', process.env.BROWSERSTACK_ACCESS_KEY)

      const driver = new Builder()
        .withCapabilities(caps)
        .usingServer('https://hub-cloud.browserstack.com/wd/hub')
        .build()

      eyes.setLogHandler(new ConsoleLogHandler(true))
      eyes.setStitchMode(StitchMode.Scroll)

      eyes.addProperty('Orientation', deviceOrientation)
      eyes.addProperty('Stitched', fully ? 'True' : 'False')

      return eyes
        .open(driver, 'Eyes Selenium SDK - iOS Safari Cropping', testName)
        .then(driver => {
          driver.get('https://www.applitools.com/customers')

          eyes.check('Initial view', Target.region(By.css('body')).fully(fully))
          return eyes.close()
        })
        .then(() => {
          eyes.abort()

          return driver.quit()
        })
    })
  })
})
