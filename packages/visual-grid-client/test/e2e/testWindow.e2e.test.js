'use strict'

const {describe, it, before, after, beforeEach} = require('mocha')
const {expect} = require('chai')
const puppeteer = require('puppeteer')
const makeRenderingGridClient = require('../../src/sdk/renderingGridClient')
const {testServer} = require('@applitools/sdk-shared')
const {presult} = require('@applitools/functional-commons')
const {DiffsFoundError, deserializeDomSnapshotResult} = require('@applitools/eyes-sdk-core')
const {getProcessPageAndSerialize} = require('@applitools/dom-snapshot')

describe('testWindow', () => {
  let baseUrl, closeServer, testWindow
  const apiKey = process.env.APPLITOOLS_API_KEY // TODO bad for tests. what to do
  let browser, page
  let processPage

  beforeEach(() => {
    testWindow = makeRenderingGridClient(
      Object.assign({
        showLogs: process.env.APPLITOOLS_SHOW_LOGS,
        apiKey,
        fetchResourceTimeout: 2000,
      }),
    ).testWindow
  })

  before(async () => {
    if (!apiKey) {
      throw new Error('APPLITOOLS_API_KEY env variable is not defined')
    }
    const server = await testServer({port: 3455}) // TODO fixed port avoids 'need-more-resources' for dom. Is this desired? should both paths be tested?
    baseUrl = `http://localhost:${server.port}`
    closeServer = server.close

    browser = await puppeteer.launch()
    page = await browser.newPage()

    await page.setCookie({name: 'auth', value: 'secret', url: baseUrl})

    const processPageAndSerializeScript = await getProcessPageAndSerialize()
    processPage = () =>
      page.evaluate(`(${processPageAndSerializeScript})()`).then(deserializeDomSnapshotResult)
  })

  after(async () => {
    await closeServer()
    await browser.close()
  })

  it('passes with correct screenshot', async () => {
    await page.goto(`${baseUrl}/test.html`)

    const {cdt, url, resourceContents, resourceUrls} = await processPage()

    const openParams = {
      appName: 'some app',
      testName: 'passes with correct screenshot',
      browser: [
        {width: 640, height: 480, name: 'chrome'},
        {width: 800, height: 600, name: 'firefox'},
        {deviceName: 'iPhone X'},
      ],
      showLogs: process.env.APPLITOOLS_SHOW_LOGS,
      saveDebugData: process.env.APPLITOOLS_SAVE_DEBUG_DATA,
    }

    const checkParams = {
      resourceUrls,
      resourceContents,
      cdt,
      tag: 'first',
      url,
      scriptHooks: {
        beforeCaptureScreenshot: "document.body.style.backgroundColor = 'gold'",
      },
    }

    const results = await testWindow({openParams, checkParams})
    expect(results.length).to.eq(3)
    expect(results.map(r => r.getStatus())).to.eql(['Passed', 'Passed', 'Passed'])
  })

  it('fails with incorrect screenshot', async () => {
    await page.goto(`${baseUrl}/test.html`)

    const {cdt, url, resourceContents, resourceUrls} = await processPage()

    const openParams = {
      appName: 'some app',
      testName: 'fails with incorrect screenshot',
      browser: [
        {width: 640, height: 480, name: 'chrome'},
        {width: 800, height: 600, name: 'firefox'},
        {deviceName: 'iPhone X'},
      ],
      showLogs: process.env.APPLITOOLS_SHOW_LOGS,
      saveDebugData: process.env.APPLITOOLS_SAVE_DEBUG_DATA,
    }

    cdt.find(node => node.nodeValue === "hi, I'm red").nodeValue = 'WRONG TEXT'
    const checkParams = {
      resourceUrls,
      resourceContents,
      cdt,
      tag: 'first',
      url,
      scriptHooks: {
        beforeCaptureScreenshot: "document.body.style.backgroundColor = 'gold'",
      },
    }

    const [err] = await presult(testWindow({openParams, checkParams}))

    expect(err.length).to.eq(3)
    err.map(r => expect(r).to.be.instanceOf(DiffsFoundError))
  })
})
