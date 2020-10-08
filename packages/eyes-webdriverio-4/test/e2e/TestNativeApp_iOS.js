'use strict'

const {ConsoleLogHandler, Eyes} = require('../../index')
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

  beforeEach(function() {
    const browserOptions = {
      port: '80',
      path: '/wd/hub',
      host: 'ondemand.saucelabs.com',
      desiredCapabilities: {
        // platform: "iOS",
        platformName: 'iOS',
        platformVersion: '11.2',
        // platformVersion: '11.3',
        deviceName: 'iPhone 7 Simulator',
        // deviceName: "iPhone X Simulator",
        // app: "https://store.applitools.com/download/iOS.TestApp.app.zip",
        app: 'https://applitools.bintray.com/Examples/HelloWorldiOS_1_0.zip',
        // appiumVersion: '1.7.2',
        // appiumVersion: '1.8.1',
        baseUrl:
          'https://matan:ec79e940-078b-41d4-91a6-d7d6008cf1ea@ondemand.saucelabs.com:443/wd/hub',
        username: 'matan',
        accesskey: 'ec79e940-078b-41d4-91a6-d7d6008cf1ea',
        clearSystemFiles: 'true',
        noReset: 'true',
        // browserName: '',
        // deviceOrientation: 'portrait'
      },
    }

    const browser = webdriverio.remote(browserOptions)
    return browser
      .init()
      .then(() => {
        return eyes.open(browser, 'iOS Example', 'Main activity')
      })
      .catch(e => {
        console.log(e)
        throw e
      })
  })

  afterEach(function() {
    return eyes
      .close(false)
      .catch(() => {
        return eyes.abortIfNotClosed()
      })
      .then(() => {
        return browser.end()
      })
  })

  TestNativeApp.shouldBehaveLike('TestNativeApp', {eyes: eyes})
})
