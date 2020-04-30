'use strict'
const {Eyes, Target} = require('../../../index')
const {Builder, By} = require('selenium-webdriver')
const {getBatch, sauceUrl} = require('./util/TestSetup')
const batch = getBatch()

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
    eyes = new Eyes()
    eyes.setBatch(batch)
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
    eyes = new Eyes()
    eyes.setBatch(batch)
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

  it.skip(`Native iOS app on sauce lab`, async () => {
    driver = await new Builder()
      .withCapabilities({
        browserName: '',
        platformName: 'iOS',
        platformVersion: '10.3',
        deviceName: 'iPhone 7 Simulator',
        deviceOrientation: 'portrait',
        username: process.env.SAUCE_USERNAME,
        accessKey: process.env.SAUCE_ACCESS_KEY,
        app: 'https://store.applitools.com/download/iOS.TestApp.app.zip',
        clearSystemFiles: true,
        noReset: true,
      })
      .usingServer(sauceUrl)
      .build()
    eyes = new Eyes()
    eyes.setBatch(batch)
    await eyes.open(driver, 'JS test', 'Checking eyes settings in appium tests')
    await eyes.check(
      'Check',
      Target.window()
        // .ignoreRegions(new Region(900, 0, 540, 100))
        .fully(),
    )
    await eyes.close()
  })
})
