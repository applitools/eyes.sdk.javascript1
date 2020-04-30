'use strict'

const {remote} = require('webdriverio')
const {EyesWebDriver, WebDriver, Eyes, By, Logger} = require('../../index')

describe('TestEdgeSwitchToFrame', () => {
  let browser
  beforeEach(async () => {
    const edgeBstack = {
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
    }
    browser = await remote(edgeBstack)
  })

  afterEach(async () => {
    await browser.deleteSession()
  })

  it('should not throw an error', async function() {
    const driver = new EyesWebDriver(new Logger(), new WebDriver(browser), new Eyes())
    await driver.url('https://applitools.github.io/demo/TestPages/FramesTestPage')
    const frame = await driver.findElement(By.css('[name="frame1"]'))
    await driver.switchTo().frame(frame)
  })
})
