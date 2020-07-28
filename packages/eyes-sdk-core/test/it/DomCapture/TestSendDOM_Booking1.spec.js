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
})
