'use strict'
const cwd = process.cwd()
const path = require('path')
const {getEyes, sauceUrl} = require('../util/TestSetup')
const spec = require(path.resolve(cwd, 'src/SpecWrappedDriver'))
const {Target, Region} = require(cwd)

describe('TestAppiumNative (@native)', () => {
  let driver, eyes
  afterEach(async () => {
    await spec.cleanup(driver)
    await eyes.abortIfNotClosed()
  })

  it(`AndroidNativeAppTest1`, async () => {
    driver = await spec.build({
      capabilities: {
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
      },
      serverUrl: sauceUrl,
    })

    eyes = new getEyes()
    await eyes.open(driver, 'Mobile Native Tests', 'Android Native App 1')
    await eyes.check('Contact list', Target.window().ignore(new Region(0, 0, 768, 48)))
    await eyes.close()
  })

  it.skip(`AndroidNativeAppTest2`, async () => {
    driver = await spec.build({
      capabilities: {
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
      },
      serverUrl: sauceUrl,
    })
    eyes = getEyes()
    await eyes.open(driver, 'Mobile Native Tests', 'Android Native App 2')

    let scrollableElement = await driver.findElement(
      new By('-android uiautomator', 'new UiSelector().scrollable(true)'), // TODO figure out how to use in SpecWrappedDriver
    )
    await eyes.check(
      'Main window with ignore',
      Target.region(scrollableElement).ignore(scrollableElement),
    )
    await eyes.close(false)
  })

  it.skip(`Native iOS app on sauce lab`, async () => {
    driver = await spec.build({
      capabilities: {
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
      },
      serverUrl: sauceUrl,
    })
    eyes = getEyes()
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
