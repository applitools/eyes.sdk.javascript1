/* global browser, jasmine */
'use strict'

// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/lib/config.ts

exports.config = {
  seleniumAddress: 'http://localhost:4444/wd/hub',
  suites: {
    example: 'example.js',
  },
  capabilities: {
    browserName: 'chrome',
    'goog:chromeOptions': {
      // args: ['headless'],
      // debuggerAddress: '127.0.0.1:9222',
    },
  },
  framework: 'jasmine2',
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 300000,
  },
  onPrepare: () => {
    browser.waitForAngularEnabled(false)
    // we need this to get appName and testName and pass them to eyes.open in beforeEach
    jasmine.getEnv().addReporter({
      specStarted: result => {
        global.testName = result.description
        global.appName = result.fullName.replace(` ${result.description}`, '')
      },
    })
  },
}
