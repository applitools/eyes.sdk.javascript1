'use strict'
const {Eyes, EyesWebElement, Target, Region, StitchMode, BatchInfo, By} = require('../../../index')
const {remote} = require('webdriverio')
const appName = 'TestScrolling'
const batch = new BatchInfo('Webdriverio 5 tests')

describe.skip(appName, () => {
  describe('ChromeEmulation', () => {
    let eyes, browser

    it('TestWebAppScrolling', async () => {
      browser = await remote({
        logLevel: 'silent',
        capabilities: {
          browserName: 'chrome',
          'goog:chromeOptions': {
            mobileEmulation: {
              deviceMetrics: {width: 360, height: 740, pixelRatio: 4},
              userAgent:
                'Mozilla/5.0 (Linux; Android 8.0.0; SM-G960F Build/R16NW) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.137 Mobile Safari/537.36',
            },
            args: ['--window-size=360,740', 'headless'],
          },
        },
      })
      try {
        await browser.url('https://applitools.github.io/demo/TestPages/MobileDemo/adaptive.html')
        eyes = new Eyes()
        eyes.setBatch(batch)
        let eyesDriver = await eyes.open(browser, appName, `TestWebAppScrolling`, {
          width: 360,
          height: 740,
        })
        let element = await eyesDriver.findElement(By.css('.content'))
        let scrollHeight = await element.getScrollHeight()
        let width = await element.getScrollWidth()
        for (let currentPosition = 0; currentPosition < scrollHeight; currentPosition += 6000) {
          let height = Math.min(6000, scrollHeight - currentPosition)
          await eyes.check(
            'TestWebAppScrolling',
            Target.region(new Region(0, currentPosition, width, height))
              .fully()
              .scrollRootElement(element),
          )
        }
        await eyes.close()
      } finally {
        await eyes.abortIfNotClosed()
        await browser.deleteSession()
      }
    })

    it('TestWebAppScrolling2', async () => {
      browser = await remote({
        logLevel: 'silent',
        capabilities: {
          browserName: 'chrome',
          'goog:chromeOptions': {
            mobileEmulation: {
              deviceMetrics: {width: 386, height: 512, pixelRatio: 4},
              userAgent:
                'Mozilla/5.0 (Linux; Android 7.1.1; Nexus 9) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.110 Safari/537.36',
            },
            args: ['--window-size=386,512', 'headless'],
          },
        },
      })
      try {
        await browser.url('https://applitools.github.io/demo/TestPages/MobileDemo/AccessPayments/')
        eyes = new Eyes()
        eyes.setBatch(batch)
        eyes.setParentBranchName('master')
        eyes.setStitchMode(StitchMode.CSS)
        await eyes.open(browser, appName, 'TestWebAppScrolling2', {width: 386, height: 512})
        await eyes.check('big page on mobile', Target.window().fully())
        await eyes.close()
      } finally {
        await eyes.abortIfNotClosed()
        await browser.deleteSession()
      }
    })

    it('TestWebAppScrolling3', async () => {
      browser = await remote({
        logLevel: 'silent',
        capabilities: {
          browserName: 'chrome',
          'goog:chromeOptions': {
            mobileEmulation: {
              deviceMetrics: {width: 386, height: 512, pixelRatio: 1},
              userAgent:
                'Mozilla/5.0 (Linux; Android 7.1.1; Nexus 9) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.110 Safari/537.36',
            },
            args: ['--window-size=386,512', 'headless'],
          },
        },
      })
      try {
        await browser.url('https://www.applitools.com/customers')
        eyes = new Eyes()
        eyes.setBatch(batch)
        eyes.setParentBranchName('master')
        await eyes.open(browser, appName, 'TestWebAppScrolling3', {width: 386, height: 512})
        await eyes.check(
          'long page on mobile',
          Target.region(By.css('div.page'))
            .fully(false)
            .sendDom(false),
        )
        await eyes.close()
      } finally {
        await eyes.abortIfNotClosed()
        await browser.deleteSession()
      }
    })
  })

  describe.skip('SauceLabs', () => {
    let eyes, browser
    const sauceCaps = {
      browserName: 'Chrome',
      deviceName: 'Samsung Galaxy S9 WQHD GoogleAPI Emulator',
      platformName: 'Android',
      platformVersion: '8.1',
      deviceOrientation: 'portrait',
      username: process.env.SAUCE_USERNAME,
      accessKey: process.env.SAUCE_ACCESS_KEY,
    }

    beforeEach(async () => {
      browser = await remote({
        logLevel: 'silent',
        capabilities: sauceCaps,
        hostname: 'ondemand.saucelabs.com',
        port: 443,
        protocol: 'https',
      })
    })

    afterEach(async () => {
      await browser.deleteSession()
      await eyes.abortIfNotClosed()
    })
    // falls down due to timeout, the page used for testing needs to much screenshots so it takes to much on the sauceLabs
    it.skip('TestWebAppScrolling', async () => {
      await browser.get('https://applitools.github.io/demo/TestPages/MobileDemo/adaptive.html')
      eyes = new Eyes()
      eyes.setBatch(batch)
      let eyesDriver = await eyes.open(browser, appName, `TestWebAppScrolling`, {
        width: 360,
        height: 740,
      })
      let element = await browser.findElement(By.css('.content'))
      let eyesElement = new EyesWebElement(eyes._logger, eyesDriver, element)
      let size = await eyesElement.getScrollSize()
      for (let currentPosition = 0; currentPosition < size.getHeight(); currentPosition += 6000) {
        let height = Math.min(6000, size.getHeight() - currentPosition)
        await eyes.check(
          'TestWebAppScrolling',
          Target.region(new Region(0, currentPosition, size.getWidth(), height))
            .fully()
            .scrollRootElement(element),
        )
      }
      await eyes.close()
    })

    it('TestWebAppScrolling2', async () => {
      await browser.url('https://applitools.github.io/demo/TestPages/MobileDemo/AccessPayments/')
      eyes = new Eyes()
      eyes.setBatch(batch)
      await eyes.open(browser, appName, 'TestWebAppScrolling2', {width: 386, height: 512})
      await eyes.check('big page on mobile', Target.window().fully())
      await eyes.close()
    })

    it('TestWebAppScrolling3', async () => {
      await browser.url('https://www.applitools.com/customers')
      eyes = new Eyes()
      eyes.setBatch(batch)
      eyes.setParentBranchName('master')
      await eyes.open(browser, appName, 'TestWebAppScrolling3', {width: 386, height: 512})
      await eyes.check(
        'long page on mobile',
        Target.region(By.css('div.page'))
          .fully(false)
          .sendDom(false),
      )
      await eyes.close()
    })
  })
})
