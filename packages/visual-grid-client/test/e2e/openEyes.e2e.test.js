'use strict'

const {describe, it, before, after, beforeEach} = require('mocha')
const {expect} = require('chai')
const puppeteer = require('puppeteer')
const makeRenderingGridClient = require('../../src/sdk/renderingGridClient')
const testServer = require('@applitools/sdk-shared/src/run-test-server')
const {presult} = require('@applitools/functional-commons')
const {DiffsFoundError, deserializeDomSnapshotResult} = require('@applitools/eyes-sdk-core')
const {getProcessPageAndSerialize} = require('@applitools/dom-snapshot')
const fs = require('fs')
const {resolve} = require('path')
const testLogger = require('../util/testLogger')
const {ApiAssertions} = require('@applitools/sdk-shared')

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
    const server = await testServer({port: 3458}) // TODO fixed port avoids 'need-more-resources' for dom. Is this desired? should both paths be tested?
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

  before(async () => {
    if (process.env.APPLITOOLS_UPDATE_FIXTURES) {
      await page.goto(`${baseUrl}/test.html`)
      const {cdt} = await processPage()

      for (const el of cdt) {
        const attr = el.attributes && el.attributes.find(x => x.name === 'data-blob')
        if (attr) {
          if (el.nodeName === 'LINK') {
            const hrefAttr = el.attributes.find(x => x.name === 'href')
            hrefAttr.value = attr.value
          }

          if (el.nodeName === 'IMG') {
            const srcAttr = el.attributes.find(x => x.name === 'src')
            srcAttr.value = attr.value
          }
        }
      }

      const cdtStr = JSON.stringify(cdt, null, 2)
      fs.writeFileSync(resolve(__dirname, '../fixtures/test.cdt.json'), cdtStr)
    }
  })

  it('passes with correct screenshot', async () => {
    await page.goto(`${baseUrl}/test.html`)

    const {cdt, url, resourceContents, resourceUrls} = await processPage()

    const {checkWindow, close} = await openEyes({
      appName: 'some app',
      testName: 'passes with correct screenshot',
      browser: [
        {width: 640, height: 480, name: 'chrome'},
        {width: 800, height: 600, name: 'firefox'},
        {deviceName: 'iPhone X'},
      ],
      showLogs: process.env.APPLITOOLS_SHOW_LOGS,
    })

    const scriptHooks = {
      beforeCaptureScreenshot: "document.body.style.backgroundColor = 'gold'",
    }

    checkWindow({
      snapshot: {resourceUrls, resourceContents, cdt},
      tag: 'first',
      url,
      scriptHooks,
      ignore: [{selector: 'div[class*="bg-"]'}],
      floating: [{selector: 'img[src*="smurfs.jpg"]', maxUpOffset: 3}],
    })

    const [errArr, results] = await presult(close())
    errArr && console.log(errArr)
    expect(errArr).to.be.undefined

    expect(results.length).to.eq(3)
    expect(results.map(r => r.getStatus())).to.eql(['Passed', 'Passed', 'Passed'])

    const expectedIgnoreRegions = [
      [
        {left: 8, top: 412, width: 151, height: 227},
        {left: 8, top: 667, width: 151, height: 227},
        {left: 8, top: 922, width: 151, height: 227},
      ],
      [
        {left: 8, top: 418, width: 151, height: 227},
        {left: 8, top: 674, width: 151, height: 227},
        {left: 8, top: 930, width: 151, height: 227},
      ],
      [
        {left: 8, top: 471, width: 151, height: 227},
        {left: 8, top: 726, width: 151, height: 227},
        {left: 8, top: 981, width: 151, height: 227},
      ],
    ]

    const expectedFloatingRegions = [
      [
        {
          maxLeftOffset: 0,
          maxRightOffset: 0,
          maxUpOffset: 3,
          maxDownOffset: 0,
          left: 8,
          top: 163,
          width: 151,
          height: 227,
        },
      ],
      [
        {
          maxLeftOffset: 0,
          maxRightOffset: 0,
          maxUpOffset: 3,
          maxDownOffset: 0,
          left: 8,
          top: 168,
          width: 151,
          height: 227,
        },
      ],
      [
        {
          maxLeftOffset: 0,
          maxRightOffset: 0,
          maxUpOffset: 3,
          maxDownOffset: 0,
          left: 8,
          top: 221,
          width: 151,
          height: 227,
        },
      ],
    ]

    for (const [index, testResults] of results.entries()) {
      const testData = await ApiAssertions.getApiData(testResults, apiKey)
      expect(testData.actualAppOutput[0].imageMatchSettings.ignore).to.eql(
        expectedIgnoreRegions[index],
      )
      expect(testData.actualAppOutput[0].imageMatchSettings.floating).to.eql(
        expectedFloatingRegions[index],
      )
    }
  })

  it('fails with incorrect screenshot', async () => {
    await page.goto(`${baseUrl}/test.html`)

    const {cdt, url, resourceContents, resourceUrls} = await processPage()

    const {checkWindow, close} = await openEyes({
      appName: 'some app',
      testName: 'fails with incorrect screenshot',
      browser: [
        {width: 640, height: 480, name: 'chrome'},
        {width: 800, height: 600, name: 'firefox'},
        {deviceName: 'iPhone X'},
      ],
      showLogs: process.env.APPLITOOLS_SHOW_LOGS,
    })

    const scriptHooks = {
      beforeCaptureScreenshot: "document.body.style.backgroundColor = 'gold'",
    }

    cdt.find(node => node.nodeValue === "hi, I'm red").nodeValue = 'WRONG TEXT'

    checkWindow({
      snapshot: {resourceUrls, resourceContents, cdt},
      tag: 'first',
      url,
      scriptHooks,
    })

    const [results] = await presult(close())
    expect(results.length).to.eq(3)
    results.map(r => expect(r).to.be.instanceOf(DiffsFoundError))
  })
})
