'use strict'
const cwd = process.cwd()
const path = require('path')
const {getEyes} = require('../../src/test-setup')
const spec = require(path.resolve(cwd, 'src/spec-driver'))
const {RectangleSize, Target, Region} = require(cwd)
const appName = 'TestScrolling'

describe(appName, () => {
  describe('ChromeEmulation', () => {
    let eyes, driver, args

    beforeEach(async () => {
      args = []
      if (!process.env.NO_HEADLESS) args.push('headless')
    })

    it.skip('TestWebAppScrolling', async () => {
      args.push('--window-size=360,740')
      driver = await spec.build({
        capabilities: {
          browserName: 'chrome',
          'goog:chromeOptions': {
            mobileEmulation: {
              deviceMetrics: {width: 360, height: 740, pixelRatio: 4},
              userAgent:
                'Mozilla/5.0 (Linux; Android 8.0.0; SM-G960F Build/R16NW) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.137 Mobile Safari/537.36',
            },
            args: args,
          },
        },
      })
      try {
        await spec.visit(
          driver,
          'https://applitools.github.io/demo/TestPages/MobileDemo/adaptive.html',
        )
        eyes = getEyes({stitchMode: 'CSS'})
        await eyes.open(driver, appName, `TestWebAppScrolling`, {
          width: 360,
          height: 740,
        })
        let element = await spec.findElement(driver, '.content')
        let scrollSize = await spec.executeScript(
          driver,
          element => [element.scrollWidth, element.scrollHeight],
          element,
        )
        let size = new RectangleSize(Math.ceil(scrollSize[0]) || 0, Math.ceil(scrollSize[1]) || 0)
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
      } finally {
        await eyes.abortIfNotClosed()
        await spec.cleanup(driver)
      }
    })

    it.skip('TestWebAppScrolling2', async () => {
      args.push('--window-size=386,512')
      driver = await spec.build({
        capabilities: {
          browserName: 'chrome',
          'goog:chromeOptions': {
            mobileEmulation: {
              deviceMetrics: {width: 386, height: 512, pixelRatio: 4},
              userAgent:
                'Mozilla/5.0 (Linux; Android 7.1.1; Nexus 9) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.110 Safari/537.36',
            },
            args: args,
          },
        },
      })
      try {
        await spec.visit(
          driver,
          'https://applitools.github.io/demo/TestPages/MobileDemo/AccessPayments/',
        )
        eyes = getEyes({stitchMode: 'CSS'})
        await eyes.open(driver, appName, 'TestWebAppScrolling2', {width: 386, height: 512})
        await eyes.check('big page on mobile', Target.window().fully())
        await eyes.close()
      } finally {
        await eyes.abortIfNotClosed()
        await spec.cleanup(driver)
      }
    })

    it.skip('TestWebAppScrolling3', async () => {
      args.push('--window-size=386,512')
      driver = await spec.build({
        capabilities: {
          browserName: 'chrome',
          'goog:chromeOptions': {
            mobileEmulation: {
              deviceMetrics: {width: 386, height: 512, pixelRatio: 1},
              userAgent:
                'Mozilla/5.0 (Linux; Android 7.1.1; Nexus 9) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.110 Safari/537.36',
            },
            prefs: {'profile.default_content_settings.cookies': 2},
            args: args,
          },
        },
      })
      try {
        await spec.visit(driver, 'https://www.applitools.com/customers')
        eyes = getEyes()
        eyes.setBranchName('default')
        await eyes.open(driver, appName, 'TestWebAppScrolling3', {width: 386, height: 512})
        let el = await spec.findElement(driver, 'main#site-main')
        await spec.click(driver, '#onetrust-accept-btn-handler')
        await eyes.check(
          'long page on mobile',
          Target.region(el)
            .fully(false)
            .sendDom(false),
        )
        await eyes.close()
      } finally {
        await eyes.abortIfNotClosed()
        await spec.cleanup(driver)
      }
    })
  })
})
