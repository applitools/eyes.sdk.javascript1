'use strict'

const {remote} = require('webdriverio')
const {By, Logger} = require('../../index')
const WDIOWrappedDriver = require('../../src/WDIOWrappedDriver')

describe('TestEdgeSwitchToFrame', () => {
  let browser
  before(async () => {
    browser = await remote({
      capabilities: {
        browserName: 'MicrosoftEdge',
        browserVersion: '18.17763',
        platformName: 'Windows 10',
      },
      user: process.env.SAUCE_USERNAME,
      key: process.env.SAUCE_ACCESS_KEY,
      logLevel: 'error',
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
