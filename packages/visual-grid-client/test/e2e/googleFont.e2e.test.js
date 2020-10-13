/* global navigator */
'use strict'

const {describe, it, before, after, beforeEach} = require('mocha')
const {expect} = require('chai')
const puppeteer = require('puppeteer')
const makeRenderingGridClient = require('../../src/sdk/renderingGridClient')
const testServer = require('@applitools/sdk-shared/src/run-test-server')
const {deserializeDomSnapshotResult} = require('@applitools/eyes-sdk-core')
const {getProcessPageAndSerialize} = require('@applitools/dom-snapshot')
const testLogger = require('../util/testLogger')

describe('openEyes', () => {
  let baseUrl, closeServer, openEyes
  const apiKey = process.env.APPLITOOLS_API_KEY // TODO bad for tests. what to do
  let browser, page
  let processPage

  beforeEach(() => {
    openEyes = makeRenderingGridClient({
      showLogs: process.env.APPLITOOLS_SHOW_LOGS,
      apiKey,
      fetchResourceTimeout: 2000,
      logger: testLogger,
    }).openEyes
  })

  before(async () => {
    if (!apiKey) {
      throw new Error('APPLITOOLS_API_KEY env variable is not defined')
    }
    const server = await testServer({port: 3457}) // TODO fixed port avoids 'need-more-resources' for dom. Is this desired? should both paths be tested?
    baseUrl = `http://localhost:${server.port}`
    closeServer = server.close

    browser = await puppeteer.launch()
    page = await browser.newPage()

    const processPageAndSerializeScript = await getProcessPageAndSerialize()
    processPage = () =>
      page.evaluate(`(${processPageAndSerializeScript})()`).then(deserializeDomSnapshotResult)
  })

  after(async () => {
    await closeServer()
    await browser.close()
  })

  it('renders google font on IE correctly', async () => {
    await page.goto(`${baseUrl}/google-font.html`)
    const userAgent = await page.evaluate(() => navigator.userAgent)

    const {cdt, url, resourceContents, resourceUrls} = await processPage()

    const {checkWindow, close} = await openEyes({
      appName: 'some app',
      testName: 'renders google font on IE correctly',
      browser: [{width: 640, height: 480, name: 'ie11'}],
      userAgent,
    })

    checkWindow({
      url,
      snapshot: {
        resourceUrls,
        resourceContents,
        cdt,
      },
    })

    const results = await close(false)
    expect(results.length).to.eq(1)
    expect(results[0].getStatus()).to.equal('Passed')
  })
})
