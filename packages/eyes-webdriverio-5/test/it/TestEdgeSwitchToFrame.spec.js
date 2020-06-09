'use strict'

const {remote} = require('webdriverio')
const {By, Logger} = require('../../index')
const WDIOWrappedDriver = require('../../src/WDIOWrappedDriver')

describe('TestEdgeSwitchToFrame', () => {
  let browser
  before(async () => {
    browser = await remote({
      capabilities: {
        'bstack:options': {
          os: 'Windows',
          osVersion: '10',
          local: 'false',
          seleniumVersion: '3.5.2',
        },
        resolution: '1920x1080',
        browserName: 'Edge',
        browserVersion: '18.0',
      },
      logLevel: 'error',
      user: process.env.BROWSERSTACK_USERNAME,
      key: process.env.BROWSERSTACK_ACCESS_KEY,
    })
  })

  after(async () => {
    await browser.deleteSession()
  })

  it('should not throw an error', async () => {
    const driver = new WDIOWrappedDriver(new Logger(false), browser)
    await driver.url('https://applitools.github.io/demo/TestPages/FramesTestPage')
    const frame = await driver.findElement(By.css('[name="frame1"]'))
    await driver.switchTo().frame(frame)
  })
})
