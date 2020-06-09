'use strict'
const {Target, StitchMode} = require('../../../index')
const {Builder, By} = require('selenium-webdriver')
const {sauceUrl, getEyes} = require('./util/TestSetup')

describe('TestAppiumNative', () => {
  let driver, eyes

  afterEach(async () => {
    await driver.quit()
    await eyes.abortIfNotClosed()
  })

  it(`AndroidNativeAppTest1`, async () => {
    driver = await new Builder()
      .withCapabilities({
        browserName: '',
        username: process.env.SAUCE_USERNAME,
        accessKey: process.env.SAUCE_ACCESS_KEY,
        name: 'AndroidNativeAppTest1',
        platformName: 'Android',
        deviceName: 'Android Emulator',
        platformVersion: '6.0',
        app: 'http://saucelabs.com/example_files/ContactManager.apk',
        clearSystemFiles: true,
        noReset: true,
      })
      .usingServer(sauceUrl)
      .build()
    eyes = getEyes(StitchMode.SCROLL)
    await eyes.open(driver, 'Mobile Native Tests', 'Android Native App 1')
    await eyes.checkWindow('Contact list')
    await eyes.close()
  })

  it.skip(`AndroidNativeAppTest2`, async () => {
    driver = await new Builder()
      .withCapabilities({
        browserName: '',
        username: process.env.SAUCE_USERNAME,
        accessKey: process.env.SAUCE_ACCESS_KEY,
        name: 'AndroidNativeAppTest2',
        platformName: 'Android',
        deviceName: 'Samsung Galaxy S8 WQHD GoogleAPI Emulator',
        platformVersion: '7.1',
        automationName: 'uiautomator2',
        app: 'https://applitools.bintray.com/Examples/app-debug.apk',
        appPackage: 'com.applitoolstest',
        appActivity: 'com.applitoolstest.ScrollActivity',
        newCommandTimeout: 600,
      })
      .usingServer(sauceUrl)
      .build()
    eyes = getEyes(StitchMode.SCROLL)
    await eyes.open(driver, 'Mobile Native Tests', 'Android Native App 2')

    let scrollableElement = await driver.findElement(
      new By('-android uiautomator', 'new UiSelector().scrollable(true)'),
    )
    await eyes.check(
      'Main window with ignore',
      Target.region(scrollableElement).ignore(scrollableElement),
    )
    await eyes.close(false)
  })
})
