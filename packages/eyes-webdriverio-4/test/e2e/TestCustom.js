'use strict'

const chromedriver = require('chromedriver')
const {remote} = require('webdriverio')
const {Eyes, ConsoleLogHandler, Target} = require('../../index')

let browser, eyes, driver

describe('TestCustom', function() {
  before(async () => {
    await chromedriver.start([], true)

    eyes = new Eyes()
    if (process.env.APPLITOOLS_SHOW_LOGS) {
      eyes.setLogHandler(new ConsoleLogHandler(true))
    }
  })

  beforeEach(async function() {
    const chrome = {
      port: 9515,
      path: '/',
      desiredCapabilities: {
        browserName: 'chrome',
        chromeOptions: {
          args: ['headless', 'disable-infobars'],
        },
      },
    }
    browser = remote(chrome)
    await browser.init()
    driver = await eyes.open(browser, 'wdio4 e2e tests', this.currentTest.fullTitle(), {
      width: 600,
      height: 500,
    })
  })

  afterEach(async () => {
    await browser.end()
    await eyes.abort()
  })

  after(async () => {
    chromedriver.stop()
  })

  it('check element when switch to frame directly using wdio browser', async () => {
    await driver.url('https://applitools.github.io/demo/TestPages/RefreshDomPage/iframe')
    await browser.frame('frame')
    await eyes.check('Handle', Target.region('#inner-img')) // image should be 3 minions on white background
    return eyes.close()
  })
})
