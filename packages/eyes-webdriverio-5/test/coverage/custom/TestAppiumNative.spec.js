'use strict'
const {Eyes, Target} = require('../../../index')
const {remote} = require('webdriverio')
const {getBatch} = require('./util/TestSetup')
const batch = getBatch()

describe('TestAppiumNative', () => {
  let browser, eyes

  afterEach(async () => {
    await browser.deleteSession()
    await eyes.abortIfNotClosed()
  })

  it(`AndroidNativeAppTest1`, async () => {
    browser = await remote({
      logLevel: 'silent',
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
      protocol: 'https',
      hostname: 'ondemand.saucelabs.com',
      port: 443,
      path: '/wd/hub',
    })

    eyes = new Eyes()
    eyes.setBatch(batch)
    await eyes.open(browser, 'Mobile Native Tests', 'Android Native App 1')
    await eyes.checkWindow('Contact list')
    await eyes.close()
  })

  it.skip(`AndroidNativeAppTest2`, async () => {
    browser = await remote({
      logLevel: 'silent',
      capabilities: {
        browserName: '',
        username: process.env.SAUCE_USERNAME,
        accessKey: process.env.SAUCE_ACCESS_KEY,
        name: 'AndroidNAtiveAppTest2',
        platformName: 'Android',
        deviceName: 'Samsung Galaxy S8 WQHD GoogleAPI Emulator',
        platformVersion: '7.1',
        automationName: 'uiautomator2',
        app: 'https://applitools.bintray.com/Examples/app-debug.apk',
        appPackage: 'com.applitoolstest',
        appActivity: 'com.applitoolstest.ScrollActivity',
        newCommandTimeout: 600,
      },
      protocol: 'https',
      hostname: 'ondemand.saucelabs.com',
      port: 443,
      path: '/wd/hub',
    })

    eyes = new Eyes()
    eyes.setBatch(batch)
    let driver = await eyes.open(browser, 'Mobile Native Tests', 'Android Native App 2')

    let scrollableElement = await driver.findElement(
      '-android uiautomator',
      'new UiSelector().scrollable(true)',
    )
    await eyes.check(
      'Main window with ignore',
      Target.region(scrollableElement).ignore(scrollableElement),
    )
    await eyes.close(false)
  })
})
