'use strict'

const {describe, it, before, after} = require('mocha')
const {expect} = require('chai')
const puppeteer = require('puppeteer')
const testServer = require('@applitools/sdk-shared/src/run-test-server')
const fs = require('fs')
const path = require('path')
const {getProcessPageAndSerialize} = require('@applitools/dom-snapshot')

describe('browser visual grid', () => {
  let baseUrl, closeServer
  const apiKey = process.env.APPLITOOLS_API_KEY // TODO bad for tests. what to do
  let browser, page
  const browserVisualGrid = fs
    .readFileSync(path.resolve(__dirname, '../fixtures/test-app/dist/app.js'))
    .toString()

  before(async () => {
    if (!apiKey) {
      throw new Error('APPLITOOLS_API_KEY env variable is not defined')
    }
    const server = await testServer({port: 3456}) // TODO fixed port avoids 'need-more-resources' for dom. Is this desired? should both paths be tested?
    baseUrl = `http://localhost:${server.port}`
    closeServer = server.close

    browser = await puppeteer.launch({
      args: ['--disable-web-security'],
      // headless: false,
      // devtools: true,
    })
    page = await browser.newPage()
    page.on('console', msg => {
      console.log('[page]', msg.text())
    })

    await page.setCookie({name: 'auth', value: 'secret', url: baseUrl})
  })

  after(async () => {
    await closeServer()
    await browser.close()
    // await new Promise(r => setTimeout(r, 100000));
  })

  it('passes with correct screenshot', async () => {
    await page.goto(`${baseUrl}/test.html`)
    const processPageAndSerializeScript = await getProcessPageAndSerialize()
    await page.evaluate(browserVisualGrid)
    const showLogs = !!process.env.APPLITOOLS_SHOW_LOGS
    const testScript = `const { openEyes } = makeRenderingGridClient({ apiKey: '${apiKey}', showLogs: ${showLogs} });
    openEyes({
      appName: 'some app',
      testName: 'browser version - passes with correct screenshot',
      browser: [
        {width: 640, height: 480, name: 'chrome'},
        {width: 800, height: 600, name: 'firefox'},
        {deviceName: 'iPhone X'},
      ]
    }).then(({checkWindow, close}) => {
      return ((${processPageAndSerializeScript})()).then(({cdt, url, blobs, resourceUrls}) => {
        const resourceContents = blobs.map(blob =>
          blob.value ? Object.assign(blob, {value: Buffer.from(blob.value, 'base64')}) : blob
        );

        checkWindow({
          resourceUrls,
          resourceContents,
          cdt,
          tag: 'first',
          url,
        });

        return close();
      });
    });
`
    const results = await page.evaluate(testScript)
    expect(results[0]._status).to.equal('Passed')
    expect(results[1]._status).to.equal('Passed')
    expect(results[2]._status).to.equal('Passed')
  })
})
