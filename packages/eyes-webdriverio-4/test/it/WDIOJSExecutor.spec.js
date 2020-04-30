'use strict'
const chromedriver = require('chromedriver')
const {remote} = require('webdriverio')
const assert = require('assert')
const WDIODriver = require('../../src/wrappers/WDIODriver')
const WDIOElement = require('../../src/wrappers/WDIOElement')
const WDIOJSExecutor = require('../../src/wrappers/WDIOJSExecutor')
const {Logger} = require('../../index')

describe('WDIOJSExecutor', function() {
  let logger, browser, driver, executor

  before(async () => {
    logger = new Logger(false)
    await chromedriver.start([], true)
    browser = remote({
      desiredCapabilities: {
        browserName: 'chrome',
        chromeOptions: {
          args: ['disable-infobars', 'headless'],
        },
      },
      logLevel: 'error',
      port: 9515,
      path: '/',
    })
    await browser.init()
    await browser.url('https://applitools.github.io/demo/TestPages/FramesAndRegionsPage/')
  })

  beforeEach(async () => {
    driver = new WDIODriver(logger, browser)
    executor = new WDIOJSExecutor(logger, driver)
  })

  after(async () => {
    await browser.end()
    chromedriver.stop()
  })

  it('executeScript(...args)', async () => {
    const {value: element} = await browser.element('#frame_main')
    const wrappedFrame = await driver.finder.findElement('#frame_aside')
    const args = [element, wrappedFrame]
    const results = await executor.executeScript('return arguments', ...args)
    args.forEach((arg, index) => {
      assert.strictEqual(WDIOElement.elementId(arg), WDIOElement.elementId(results[index]))
    })
  })
})
