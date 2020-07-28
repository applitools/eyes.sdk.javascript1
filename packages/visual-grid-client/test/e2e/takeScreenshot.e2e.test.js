'use strict'

const {describe, it, before, after} = require('mocha')
const {expect} = require('chai')
const puppeteer = require('puppeteer')
const takeScreenshot = require('../../src/sdk/takeScreenshot')
const {getProcessPageAndSerialize} = require('@applitools/dom-snapshot')
const fetch = require('node-fetch')
const {presult} = require('@applitools/functional-commons')
const {testServer} = require('@applitools/sdk-shared')

describe('takeScreenshot e2e', () => {
  let server, browser, page

  before(async () => {
    server = await testServer({port: 3459})
    browser = await puppeteer.launch()
    page = await browser.newPage()
  })

  after(async () => {
    await server.close()
    await browser.close()
  })

  it('returns url to screenshot', async () => {
    const website = `http://localhost:${server.port}/test-iframe.html`
    const apiKey = process.env.APPLITOOLS_API_KEY
    const serverUrl = 'https://eyesapi.applitools.com'
    const renderInfo = await fetch(
      `${serverUrl}/api/sessions/renderInfo?apiKey=${apiKey}`,
    ).then(r => r.json())

    const processPageAndSerialize = `(${await getProcessPageAndSerialize()})()`
    await page.goto(website)
    const {cdt, url, resourceUrls, blobs, frames} = await page.evaluate(processPageAndSerialize)
    const [err, result] = await presult(
      takeScreenshot({
        apiKey,
        showLogs: process.env.APPLITOOLS_SHOW_LOGS,
        renderInfo,
        cdt,
        url,
        resourceUrls,
        blobs,
        frames,
        browsers: [{width: 1920, height: 1440}],
      }),
    )

    err && console.log(err)
    expect(err).to.be.undefined

    const [{imageLocation, renderId}] = result
    expect(renderId).to.not.be.undefined

    console.log(imageLocation)
    expect(imageLocation).to.match(/https:\/\/.+/)
  })
})
