'use strict'

const {ConsoleLogHandler} = require('@applitools/eyes-sdk-core')
const {Eyes} = require('../../index')
const {TestNativeApp} = require('./TestNativeApp')
const webdriverio = require('webdriverio')

const appName = 'NativeApp'

let eyes = new Eyes()
let browser

describe.skip(appName, function() {
  before(function() {
    eyes.setApiKey(process.env.APPLITOOLS_API_KEY)
    eyes.setLogHandler(new ConsoleLogHandler(true))
  })

  beforeEach(async () => {
    const browserOptions = {
      port: '80',
      path: '/wd/hub',
      host: 'ondemand.saucelabs.com',
      desiredCapabilities: {
        platformName: 'Android',
        platformVersion: 6.0,
        deviceName: 'Android Emulator',
        app: 'https://applitools.bintray.com/Examples/app-debug.apk',
        appPackage: 'com.applitoolstest',
        appActivity: 'com.applitoolstest.ScrollActivity',
        newCommandTimeout: 600,
        appiumVersion: '1.7.2',
        baseUrl: `http://${process.env.SAUCE_USERNAME}:${process.env.SAUCE_ACCESS_KEY}@ondemand.saucelabs.com:80/wd/hub`,
        username: process.env.SAUCE_USERNAME,
        accesskey: process.env.SAUCE_ACCESS_KEY,
      },
    }

    browser = webdriverio.remote(browserOptions)
    await browser.init()
    return eyes.open(browser, 'Android Example', 'Main activity')
  })

  afterEach(async () => {
    try {
      return eyes.close(false)
    } catch (e) {
      await eyes.abortIfNotClosed()
    } finally {
      await browser.end()
    }
  })

  TestNativeApp.shouldBehaveLike('TestNativeApp', {eyes: eyes})
})
