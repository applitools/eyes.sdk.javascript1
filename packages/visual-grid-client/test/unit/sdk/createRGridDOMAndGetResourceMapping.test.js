/* global fetch */
'use strict'
const {describe, it, before, after, beforeEach} = require('mocha')
const {expect} = require('chai')
const makeCreateRGridDOMAndGetResourceMapping = require('../../../src/sdk/createRGridDOMAndGetResourceMapping')
const makeGetAllResources = require('../../../src/sdk/getAllResources')
const createResourceCache = require('../../../src/sdk/createResourceCache')
const extractCssResources = require('../../../src/sdk/extractCssResources')
const makeFetchResource = require('../../../src/sdk/fetchResource')
const testLogger = require('../../util/testLogger')
const {testServer} = require('@applitools/sdk-shared')
const {loadJsonFixture, loadFixtureBuffer} = require('../../util/loadFixture')
const toRGridResource = require('../../util/toRGridResource')
const createRGridDom = require('../../../src/sdk/createRGridDom')
const getTestCssResources = require('../../util/getTestCssResources')
require('@applitools/isomorphic-fetch')

describe('createRGridDOMAndGetResourceMapping', () => {
  let server
  let baseUrl
  let fut
  before(async () => {
    server = await testServer()
    baseUrl = `http://localhost:${server.port}`
  })
  after(async () => {
    await server.close()
  })

  beforeEach(() => {
    const getAllResources = makeGetAllResources({
      resourceCache: createResourceCache(),
      fetchResource: makeFetchResource({logger: testLogger, fetch}),
      fetchCache: createResourceCache(),
      extractCssResources,
      logger: console,
    })
    fut = makeCreateRGridDOMAndGetResourceMapping({getAllResources})
  })

  it('works', async () => {
    const imgName = 'smurfs.jpg'
    const imgPath = `iframes/inner/${imgName}`
    const imgUrl = `${baseUrl}/${imgPath}`
    const imgResource = toRGridResource({
      url: imgUrl,
      type: 'image/jpeg',
      value: loadFixtureBuffer(imgPath),
    })

    const testCdt = loadJsonFixture('test.cdt.json')
    const testUrl = `${baseUrl}/test.html`
    const testDom = createRGridDom({
      cdt: testCdt,
      resources: getTestCssResources(baseUrl),
    })
    const expectedTestResource = toRGridResource({
      url: testUrl,
      type: 'x-applitools-html/cdt',
      value: testDom.getContent(),
    })

    const innerFrameUrl = `${baseUrl}/iframes/inner/test.html`
    const innerFrameCdt = loadJsonFixture('iframes/inner/test.cdt.json')

    const innerFrameDom = createRGridDom({
      cdt: innerFrameCdt,
      resources: {
        [imgUrl]: imgResource,
      },
    })

    const expectedInnerFrameResource = toRGridResource({
      url: innerFrameUrl,
      type: 'x-applitools-html/cdt',
      value: innerFrameDom.getContent(),
    })

    const frameCdt = loadJsonFixture('inner-frame.cdt.json')

    const expectedRGridDom = createRGridDom({
      cdt: frameCdt,
      resources: {
        [testUrl]: expectedTestResource,
        [innerFrameUrl]: expectedInnerFrameResource,
      },
    })

    const {rGridDom, allResources} = await fut({
      url: `${baseUrl}/iframes/frame.html`,
      cdt: frameCdt,
      resourceUrls: [],
      resourceContents: {},
      frames: [
        {
          url: testUrl,
          cdt: testCdt,
          resourceUrls: [`${baseUrl}/test.css`],
          resourceContents: {},
        },
        {
          url: innerFrameUrl,
          cdt: innerFrameCdt,
          resourceUrls: [imgUrl],
          resourceContents: {},
        },
      ],
    })

    expect(rGridDom.getContent()).to.eql(expectedRGridDom.getContent())

    // first, a sanity check
    expect(Object.keys(allResources).filter(url => url.endsWith('.html'))).to.not.be.empty

    // The following expect is actually included in the expect after it, but it has a better output than the latter.
    expect(allResources[testUrl].getContent()).to.eql(expectedTestResource.getContent())
    expect(allResources[testUrl]).to.eql(expectedTestResource)

    // The following expect is actually included in the expect after it, but it has a better output than the latter.
    expect(allResources[innerFrameUrl].getContent()).to.eql(expectedInnerFrameResource.getContent())
    expect(allResources[innerFrameUrl]).to.eql(expectedInnerFrameResource)
  })
})
