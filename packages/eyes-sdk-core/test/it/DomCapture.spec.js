'use strict'

require('chromedriver')
const assert = require('assert')
const fs = require('fs')
const path = require('path')
const {Builder, By} = require('selenium-webdriver')
const {Options: ChromeOptions} = require('selenium-webdriver/chrome')

const {
  Logger,
  ConsoleLogHandler,
  FileLogHandler,
  PerformanceUtils,
  DateTimeUtils,
} = require('../..')
const {DomCapture} = require('../../index')

/**
 * @param {Logger} logger_
 * @param {WebDriver} driver_
 * @param {string} url
 * @param {string} testName
 * @param {function} [initCode]
 * @return {Promise<string>}
 */
async function captureDom(logger_, driver_, url, testName) {
  try {
    await driver_.get(url)

    const timeStart = PerformanceUtils.start()
    const actualDomJsonString = await DomCapture.getFullWindowDom(logger_, {
      specs: {
        toSupportedSelector({type, selector}) {
          return By[type](selector)
        },
      },
      controller: {
        async getBrowserName() {
          const capabilities = await driver_.getCapabilities()
          return capabilities.get('browserName')
        },
        async getBrowserVersion() {
          const capabilities = await driver_.getCapabilities()
          return capabilities.get('browserVersion')
        },
        async getSource() {
          return driver_.getCurrentUrl()
        },
      },
      executor: {
        executeScript: driver_.executeScript.bind(driver_),
      },
      finder: {
        findElement: driver_.findElement.bind(driver_),
      },
      context: {
        frame(reference) {
          return driver_.switchTo().frame(reference)
        },
        frameParent() {
          return driver_.switchTo().parentFrame()
        },
      },
    })
    logger_.log(`Capturing actual dom took ${timeStart.end().summary}`)

    if (process.env.APPLITOOLS_UPDATE_FIXTURES) {
      fs.writeFileSync(
        path.resolve(__dirname, '../fixtures', `${testName}.json`),
        JSON.stringify(JSON.parse(actualDomJsonString), null, 2),
      )
    }

    return actualDomJsonString
  } catch (err) {
    logger_.log(`Error: ${err}`)
    throw err
  }
}

/**
 * @param {string} testName
 * @return {Promise<object>}
 */
async function getExpectedDom(testName) {
  const expectedDomBuffer = await fs.readFileSync(
    path.join(__dirname, `../fixtures/${testName}.json`),
  )
  return JSON.parse(expectedDomBuffer)
}

let /** @type {Logger} */ logger
let /** @type {WebDriver} */ driver
describe('DomCapture', function() {
  this.timeout(5 * 60 * 1000)

  before(function() {
    logger = new Logger()
    if (process.env.CI == null && process.env.APPLITOOLS_LOGS_PATH != null) {
      const dateString = DateTimeUtils.toLogFileDateTime()
      const extendedTestName = `${this.test.parent.title}_${dateString}`
      const logsPath = process.env.APPLITOOLS_LOGS_PATH || '.'
      const pathName = path.join(logsPath, 'JavaScript', extendedTestName)
      logger.setLogHandler(new FileLogHandler(true, path.join(pathName, 'log.log')))
      logger.getLogHandler().open()
    } else {
      logger.setLogHandler(new ConsoleLogHandler(false))
    }
  })

  beforeEach(async function() {
    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(new ChromeOptions().headless())
      .usingServer(process.env.CVG_TESTS_REMOTE)
      .build()

    if (!driver.findElementByXPath) {
      driver.findElementByXPath = xPath => driver.findElement(By.xpath(xPath))
    }

    if (!driver.url) {
      driver.url = url => driver.get(url)
    }

    await driver
      .manage()
      .window()
      .setRect({x: 0, y: 0, width: 800, height: 600})
  })

  it('TestSendDOM_Simple_HTML', async function() {
    const actualDomJsonString = await captureDom(
      logger,
      driver,
      'https://applitools-dom-capture-origin-1.surge.sh/test.html',
      this.test.title,
    )
    const actualDomJson = JSON.parse(actualDomJsonString)

    const expectedDomJson = await getExpectedDom(this.test.title)
    assert.deepStrictEqual(actualDomJson, expectedDomJson)
  })

  it('TestSendDOM_1', async function() {
    const actualDomJsonString = await captureDom(
      logger,
      driver,
      'http://applitools.github.io/demo/TestPages/DomTest/dom_capture.html',
      this.test.title,
    )
    const actualDomJson = JSON.parse(actualDomJsonString)

    const expectedDomJson = await getExpectedDom(this.test.title)
    assert.deepStrictEqual(actualDomJson, expectedDomJson)
  })

  it('TestSendDOM_2', async function() {
    const actualDomJsonString = await captureDom(
      logger,
      driver,
      'http://applitools.github.io/demo/TestPages/DomTest/dom_capture_2.html',
      this.test.title,
    )
    const actualDomJson = JSON.parse(actualDomJsonString)

    const expectedDomJson = await getExpectedDom(this.test.title)
    assert.deepStrictEqual(actualDomJson, expectedDomJson)
  })

  it('TestSendDOM_NSA', async function() {
    const actualDomJsonString = await captureDom(
      logger,
      driver,
      'https://nikita-andreev.github.io/applitools/dom_capture.html?aaa',
      this.test.title,
    )
    const actualDomJson = JSON.parse(actualDomJsonString)

    const expectedDomJson = await getExpectedDom(this.test.title)
    assert.deepStrictEqual(actualDomJson, expectedDomJson)
  })

  it('TestSendDOM_yuriieasternpeak', async function() {
    const actualDomJsonString = await captureDom(
      logger,
      driver,
      'https://yuriieasternpeak.github.io/webdriver.io-test-html-pages/',
      this.test.title,
    )
    const actualDomJson = JSON.parse(actualDomJsonString)

    const expectedDomJson = await getExpectedDom(this.test.title)
    assert.deepStrictEqual(actualDomJson, expectedDomJson)
  })

  it('TestSendDOM_Booking1', async function() {
    const actualDomJsonString = await captureDom(
      logger,
      driver,
      'https://www.booking.com/searchresults.en-gb.html?label=gen173nr-1FCAEoggJCAlhYSDNYBGhqiAEBmAEuwgEKd2luZG93cyAxMMgBDNgBAegBAfgBC5ICAXmoAgM;sid=ce4701a88873eed9fbb22893b9c6eae4;city=-2600941;from_idr=1&;ilp=1;d_dcp=1',
      this.test.title,
    )
    const actualDomJson = JSON.parse(actualDomJsonString)
    assert.ok(actualDomJson)
  })

  it('TestSendDOM_Booking2', async function() {
    const actualDomJsonString = await captureDom(
      logger,
      driver,
      'https://booking.kayak.com/flights/TLV-MIA/2018-09-25/2018-10-31?sort=bestflight_a',
      this.test.title,
    )
    const actualDomJson = JSON.parse(actualDomJsonString)
    assert.ok(actualDomJson)
  })

  it('TestSendDOM_BestBuy1', async function() {
    const actualDomJsonString = await captureDom(
      logger,
      driver,
      'https://www.bestbuy.com/site/apple-macbook-pro-13-display-intel-core-i5-8-gb-memory-256gb-flash-storage-silver/6936477.p?skuId=6936477&intl=nosplash',
      this.test.title,
    )
    const actualDomJson = JSON.parse(actualDomJsonString)
    assert.ok(actualDomJson)
  })

  it('TestSendDOM_cbtnuggets', async function() {
    const actualDomJsonString = await captureDom(
      logger,
      driver,
      'https://www.cbtnuggets.com/',
      this.test.title,
    )
    const actualDomJson = JSON.parse(actualDomJsonString)
    assert.ok(actualDomJson)
  })

  it('TestSendDOM_nytimes', async function() {
    const url = 'https://cooking.nytimes.com/'
    const actualDomJsonString = await captureDom(logger, driver, url, this.test.title)
    const actualDomJson = JSON.parse(actualDomJsonString)
    assert.ok(actualDomJson)
  })

  it('TestSendDOM_nbcnews', async function() {
    const url = 'https://www.nbcnews.com/'
    const actualDomJsonString = await captureDom(logger, driver, url, this.test.title)
    const actualDomJson = JSON.parse(actualDomJsonString)
    assert.ok(actualDomJson)
  })

  afterEach(async function() {
    await driver.close()
  })

  after(async function() {
    logger.getLogHandler().close()
  })
})
