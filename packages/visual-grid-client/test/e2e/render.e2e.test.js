'use strict'

const uaParser = require('ua-parser-js')
const fetch = require('node-fetch')
const {describe, it, before} = require('mocha')
const {expect} = require('chai')
const makeRenderer = require('../../src/sdk/renderer')
const createRenderRequests = require('../../src/sdk/createRenderRequests')
const {RenderingInfo} = require('@applitools/eyes-sdk-core')

describe('render e2e', () => {
  let renderingInfo
  const apiKey = process.env.APPLITOOLS_API_KEY
  before(async () => {
    renderingInfo = await fetch(
      `https://eyesapi.applitools.com/api/sessions/renderInfo?apiKey=${apiKey}`,
    )
      .then(r => r.json())
      .then(json => new RenderingInfo(json))
  })

  it('renders older browser versions', async () => {
    const browsers = [
      {width: 640, height: 480, name: 'chrome'},
      {width: 640, height: 480, name: 'chrome-1'},
      {width: 640, height: 480, name: 'chrome-2'},
      {width: 640, height: 480, name: 'firefox'},
      {width: 640, height: 480, name: 'firefox-1'},
      {width: 640, height: 480, name: 'firefox-2'},
      {width: 640, height: 480, name: 'safari'},
      {width: 640, height: 480, name: 'safari-1'},
      {width: 640, height: 480, name: 'safari-2'},
      {width: 640, height: 480, name: 'edgechromium'},
      {width: 640, height: 480, name: 'edgechromium-1'},
      {width: 640, height: 480, name: 'edgechromium-2'},
    ]

    const {createRGridDOMAndGetResourceMapping, renderBatch, waitForRenderedStatus} = makeRenderer({
      apiKey,
      showLogs: process.env.APPLITOOLS_SHOW_LOGS,
      renderingInfo,
    })

    const page = await createRGridDOMAndGetResourceMapping({
      resourceUrls: [],
      resourceContents: [],
      cdt: [{nodeType: 3, nodeValue: 'renders older browser versions - works!'}],
      frames: [],
    })

    const renderRequests = createRenderRequests({
      url: 'http://something',
      pages: Array(browsers.length).fill(page),
      browsers,
      renderInfo: renderingInfo,
      sizeMode: 'full-page',
    })

    const renderIds = await renderBatch(renderRequests)

    const renderStatusResults = await Promise.all(
      renderIds.map(renderId => waitForRenderedStatus(renderId)),
    )

    const majorVersions = renderStatusResults.map(({userAgent}) =>
      Number(uaParser(userAgent).browser.major),
    )

    const [
      chrome,
      chrome1,
      chrome2,
      firefox,
      firefox1,
      firefox2,
      safari,
      safari1,
      safari2,
      edgechromium,
      edgechromium1,
      edgechromium2,
    ] = majorVersions

    expect(chrome1).to.equal(chrome - 1)
    expect(chrome2).to.equal(chrome - 2)
    expect(firefox1).to.equal(firefox - 1)
    expect(firefox2).to.equal(firefox - 2)
    expect(safari1).to.equal(safari - 1)
    expect(safari2).to.equal(safari - 2)
    expect(edgechromium1).to.equal(edgechromium - 1)
    expect(edgechromium2).to.equal(edgechromium - 2)
  })
})
