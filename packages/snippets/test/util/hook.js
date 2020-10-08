const playwright = require('playwright')
const {remote} = require('webdriverio')

const drivers = new Map()

exports.mochaHooks = {
  async beforeAll() {
    global.getDriver = async function(name) {
      let {driver} = drivers.get(name) || {}
      if (!driver) {
        if (name === 'chrome') {
          const browser = await playwright.chromium.launch()
          const context = await browser.newContext()
          driver = await context.newPage()
          await driver.setViewportSize({width: 800, height: 600})
          drivers.set('chrome', {driver, cleanup: () => browser.close()})
        } else if (name === 'internet explorer') {
          driver = await remote({
            protocol: 'https',
            hostname: 'ondemand.saucelabs.com',
            path: '/wd/hub',
            port: 443,
            logLevel: 'silent',
            capabilities: {
              browserName: 'internet explorer',
              browserVersion: '11.285',
              platformName: 'Windows 10',
              'sauce:options': {
                name: 'Snippets tests',
                username: process.env.SAUCE_USERNAME,
                accessKey: process.env.SAUCE_ACCESS_KEY,
              },
            },
            connectionRetryCount: 0,
          })
          await driver.setWindowSize(816, 686)
          drivers.set('internet explorer', {driver, cleanup: () => driver.deleteSession()})
        } else if (name === 'ios safari') {
          driver = await remote({
            protocol: 'https',
            hostname: 'ondemand.saucelabs.com',
            path: '/wd/hub',
            port: 443,
            logLevel: 'silent',
            capabilities: {
              name: 'Snippets tests',
              browserName: 'Safari',
              deviceName: 'iPhone XS Simulator',
              deviceOrientation: 'portrait',
              platformVersion: '13.4',
              platformName: 'iOS',
              username: process.env.SAUCE_USERNAME,
              accessKey: process.env.SAUCE_ACCESS_KEY,
            },
            connectionRetryCount: 0,
          })
          drivers.set('ios safari', {driver, cleanup: () => driver.deleteSession()})
        }
      }
      return driver
    }
  },

  async afterAll() {
    for (const {cleanup} of drivers.values()) {
      await cleanup()
    }
  },
}
