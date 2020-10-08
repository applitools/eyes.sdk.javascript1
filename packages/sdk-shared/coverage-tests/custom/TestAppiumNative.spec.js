'use strict'
const cwd = process.cwd()
const path = require('path')
const {getEyes} = require('../../src/test-setup')
const spec = require(path.resolve(cwd, 'src/spec-driver'))
const {Target, Region} = require(cwd)

describe.skip('TestAppiumNative (@native @mobile)', () => {
  let driver, destroyDriver, eyes
  afterEach(async () => {
    await destroyDriver()
    await eyes.abortIfNotClosed()
  })

  it(`AndroidNativeAppTest1`, async () => {
    ;[driver, destroyDriver] = await spec.build({
      capabilities: {
        browserName: '',
        name: 'AndroidNativeAppTest1',
        platformName: 'Android',
        deviceName: 'Android Emulator',
        platformVersion: '6.0',
        app: 'http://saucelabs.com/example_files/ContactManager.apk',
        clearSystemFiles: true,
        noReset: true,
      },
    })

    eyes = new getEyes()
    await eyes.open(driver, 'Mobile Native Tests', 'Android Native App 1')
    await eyes.check('Contact list', Target.window().ignore(new Region(0, 0, 768, 48)))
    await eyes.close()
  })

  it.skip(`AndroidNativeAppTest2`, async () => {
    ;[driver, destroyDriver] = await spec.build({
      capabilities: {
        browserName: '',
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
    })
    eyes = getEyes()
    await eyes.open(driver, 'Mobile Native Tests', 'Android Native App 2')

    let scrollableElement = await driver.findElement(
      {type: '-android uiautomator', sleector: 'new UiSelector().scrollable(true)'}, // TODO figure out how to use in SpecDriver
    )
    await eyes.check(
      'Main window with ignore',
      Target.region(scrollableElement).ignore(scrollableElement),
    )
    await eyes.close(false)
  })

  it.skip(`Native iOS app on sauce lab`, async () => {
    ;[driver, destroyDriver] = await spec.build({
      capabilities: {
        browserName: '',
        platformName: 'iOS',
        platformVersion: '10.3',
        deviceName: 'iPhone 7 Simulator',
        deviceOrientation: 'portrait',
        app: 'https://store.applitools.com/download/iOS.TestApp.app.zip',
        clearSystemFiles: true,
        noReset: true,
      },
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
