'use strict'

const {Builder} = require('selenium-webdriver')
const {Logger} = require('../../..')
const assert = require('assert')
const {captureDom} = require('./DomCapture_utils')

describe('DomCapture', function() {
  let driver,
    logger = new Logger(process.env.APPLITOOLS_SHOW_LOGS)
  beforeEach(async function() {
    driver = await new Builder()
      .withCapabilities({browserName: 'chrome', 'goog:chromeOptions': {args: ['headless']}})
      .usingServer(process.env.CVG_TESTS_REMOTE)
      .build()

    await driver
      .manage()
      .window()
      .setRect({x: 0, y: 0, width: 800, height: 600})
  })

  afterEach(async function() {
    await driver.quit()
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
})
