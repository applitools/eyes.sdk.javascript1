/* global fetch */
'use strict'
const {describe, it, beforeEach} = require('mocha')
const {expect} = require('chai')
const mapValues = require('lodash.mapvalues')
const makeGetAllResources = require('../../../src/sdk/getAllResources')
const extractCssResources = require('../../../src/sdk/extractCssResources')
const makeFetchResource = require('../../../src/sdk/fetchResource')
const createResourceCache = require('../../../src/sdk/createResourceCache')
const {testServerInProcess} = require('@applitools/test-server')
const testLogger = require('../../util/testLogger')
const {loadFixtureBuffer} = require('../../util/loadFixture')
const resourceType = require('../../../src/sdk/resourceType')
const toRGridResource = require('../../util/toRGridResource')
const getTestCssResources = require('../../util/getTestCssResources')
const getTestSvgResources = require('../../util/getTestSvgResources')
require('@applitools/isomorphic-fetch')

describe('getAllResources', () => {
  let closeServer
  let getAllResources, resourceCache

  beforeEach(() => {
    const fetchResource = makeFetchResource({
      logger: testLogger,
      fetchCache: createResourceCache(),
      fetch,
    })
    resourceCache = createResourceCache()
    const getAllResourcesOrig = makeGetAllResources({
      resourceCache,
      extractCssResources,
      fetchResource,
      logger: testLogger,
    })

    getAllResources = async args => {
      const r = await getAllResourcesOrig(args)
      for (const resource of Object.values(r)) {
        resource._sha256hash = undefined // make sure all resources dont calculate the hash for simplicity.
      }
      return r
    }
  })

  it('works for absolute urls', async () => {
    const server = await testServerInProcess()
    const baseUrl = `http://localhost:${server.port}`
    closeServer = server.close

    const jpgName = 'smurfs.jpg'
    const cssName = 'test.css'
    const jsonName = 'test.cdt.json'
    const jsName = 'test.js'
    const jpgUrl = `${baseUrl}/${jpgName}`
    const cssUrl = `${baseUrl}/${cssName}`
    const jsonUrl = `${baseUrl}/${jsonName}`
    const jsUrl = `${baseUrl}/${jsName}`
    const jpgContent = loadFixtureBuffer(jpgName)
    const jsonContent = loadFixtureBuffer(jsonName)
    const jsContent = loadFixtureBuffer(jsName)

    const expected = Object.assign(getTestCssResources(baseUrl), {
      [jpgUrl]: toRGridResource({url: jpgUrl, type: 'image/jpeg', value: jpgContent}),
      [jsonUrl]: toRGridResource({
        url: jsonUrl,
        type: 'application/json; charset=UTF-8',
        value: jsonContent,
      }),
      [jsUrl]: toRGridResource({
        url: jsUrl,
        type: 'application/javascript; charset=UTF-8',
        value: jsContent,
      }),
    })

    try {
      const resources = await getAllResources({resourceUrls: [jpgUrl, cssUrl, jsonUrl, jsUrl]})
      expect(resources).to.eql(expected)
    } catch (ex) {
      throw ex
    } finally {
      await closeServer()
    }
  })

  it('sets and gets css/svg resources from cache', async () => {
    const url = 'https://google.com'
    const type = 'text/css'
    const value = 'value'
    const rGridResource = toRGridResource({url, type, value})

    let called = 0
    const fetchResource = async _url => (++called, {url, type, value})
    resourceCache = createResourceCache()
    getAllResources = makeGetAllResources({
      resourceCache,
      extractCssResources,
      fetchResource,
      logger: testLogger,
    })

    const expected = {
      [url]: rGridResource,
    }

    const resourcesFromCache = await getAllResources({resourceUrls: [url]})
    const resourcesFromCache2 = await getAllResources({resourceUrls: [url]})
    expect(called).to.eql(1)

    resourcesFromCache[url]._sha256hash = undefined
    resourcesFromCache2[url]._sha256hash = undefined
    expect(resourcesFromCache).to.eql(expected)
    expect(resourcesFromCache2).to.eql(expected)
  })

  it('works for svg urls', async () => {
    const server = await testServerInProcess()
    const baseUrl = `http://localhost:${server.port}`
    closeServer = server.close

    const file1 = 'basic.svg'
    const file2 = 'basic2.svg'
    const file3 = 'with-style.svg'
    const svg1Url = `${baseUrl}/${file1}`
    const svg2Url = `${baseUrl}/${file2}`
    const svg3Url = `${baseUrl}/${file3}`
    const svg1Content = loadFixtureBuffer(file1)
    const svg2Content = loadFixtureBuffer(file2)
    const svg3Content = loadFixtureBuffer(file3)

    const expected = Object.assign(getTestSvgResources(baseUrl), {
      [svg1Url]: toRGridResource({url: svg1Url, type: 'image/svg+xml', value: svg1Content}),
      [svg2Url]: toRGridResource({
        url: svg2Url,
        type: 'image/svg+xml',
        value: svg2Content,
      }),
      [svg3Url]: toRGridResource({
        url: svg3Url,
        type: 'image/svg+xml',
        value: svg3Content,
      }),
    })

    try {
      const resources = await getAllResources({resourceUrls: [svg1Url, svg2Url, svg3Url]})
      expect(resources).to.eql(expected)
    } catch (ex) {
      console.log(ex)
      throw ex
    } finally {
      await closeServer()
    }
  })

  it('fetches with cache', async () => {
    const url = 'url'
    const type = 'type'
    const value = 'value'
    const rGridResource = toRGridResource({url, type, value})
    rGridResource._content = '' // yuck! but this is the symmetrical yuck of getAllResources::fromCacheToRGridResource since we save resource in cache without content, but with SHA256

    resourceCache.setValue(url, {url, type, hash: undefined})

    const expected = {
      [url]: rGridResource,
    }

    const resourcesFromCache = await getAllResources({resourceUrls: [url]})
    expect(resourcesFromCache).to.eql(expected)
  })

  it('fetches with user-agent and referer headers', async () => {
    const fetchResource = async (url, options) => ({
      url,
      type: 'text/plain',
      value: JSON.stringify(options),
    })
    resourceCache = createResourceCache()
    getAllResources = makeGetAllResources({
      resourceCache,
      extractCssResources,
      fetchResource,
      logger: testLogger,
    })

    const url = 'http://localhost/some/url.html'
    const userAgent = 'some-user-agent'
    const referer = 'some-referer'
    const resources = await getAllResources({
      resourceUrls: [url],
      userAgent,
      referer,
    })

    expect(resources).to.eql({
      [url]: toRGridResource({
        url,
        type: 'text/plain',
        value: JSON.stringify({headers: {Referer: referer, 'User-Agent': 'some-user-agent'}}),
      }),
    })
  })

  it('works for urls with long paths', async () => {
    const server = await testServerInProcess()
    closeServer = server.close

    const url = `long/path/to/something.js`
    const absoluteUrl = `http://localhost:${server.port}/${url}`
    const expected = {
      [absoluteUrl]: toRGridResource({
        url: absoluteUrl,
        type: 'application/javascript; charset=UTF-8',
        value: loadFixtureBuffer(url),
      }),
    }

    try {
      const resources = await getAllResources({resourceUrls: [absoluteUrl]})
      expect(resources).to.eql(expected)
    } catch (ex) {
      throw ex
    } finally {
      await closeServer()
    }
  })

  it('gets inner css resources also for cached resources', async () => {
    const baseUrl = `http://some/`

    const jpgName1 = 'smurfs1.jpg'
    const jpgName2 = 'smurfs2.jpg'
    const jpgName3 = 'smurfs3.jpg'
    const cssName = 'test.css'
    const importedName = 'imported.css'
    const importedNestedName = 'imported-nested.css'
    const fontZillaName = 'zilla_slab.woff2'
    const fontShadowName = 'shadows_into_light.woff2'
    const jpgUrl1 = `${baseUrl}/${jpgName1}`
    const jpgUrl2 = `${baseUrl}/${jpgName2}`
    const jpgUrl3 = `${baseUrl}/${jpgName3}`
    const cssUrl = `${baseUrl}/${cssName}`
    const importedUrl = `${baseUrl}/${importedName}`
    const importedNestedUrl = `${baseUrl}/${importedNestedName}`
    const fontZillaUrl = `${baseUrl}/${fontZillaName}`
    const fontShadowUrl = `${baseUrl}/${fontShadowName}`
    const jpgContent1 = loadFixtureBuffer(jpgName1)
    const jpgContent2 = loadFixtureBuffer(jpgName2)
    const jpgContent3 = loadFixtureBuffer(jpgName3)
    const cssContent = loadFixtureBuffer(cssName)
    const importedContent = loadFixtureBuffer(importedName)
    const importedNestedContent = loadFixtureBuffer(importedNestedName)
    const fontZillaContent = loadFixtureBuffer(fontZillaName)
    const fontShadowContent = loadFixtureBuffer(fontShadowName)
    const jpgType = 'image/jpeg'
    const cssType = 'text/css; charset=UTF-8'
    const fontType = 'font/woff2'

    resourceCache.setValue(jpgUrl1, {url: jpgUrl1, type: jpgType, hash: undefined})
    resourceCache.setValue(jpgUrl2, {url: jpgUrl2, type: jpgType, hash: undefined})
    resourceCache.setValue(jpgUrl3, {url: jpgUrl3, type: jpgType, hash: undefined})
    resourceCache.setValue(cssUrl, {
      url: cssUrl,
      type: cssType,
      hash: undefined,
      content: loadFixtureBuffer('test.css'),
    })
    resourceCache.setValue(importedUrl, {
      url: importedUrl,
      type: cssType,
      hash: undefined,
      content: loadFixtureBuffer('imported.css'),
    })
    resourceCache.setValue(importedNestedUrl, {
      url: importedNestedUrl,
      type: cssType,
      hash: undefined,
      content: loadFixtureBuffer('imported-nested.css'),
    })
    resourceCache.setValue(fontZillaUrl, {url: fontZillaUrl, type: fontType, hash: undefined})
    resourceCache.setValue(fontShadowUrl, {url: fontShadowUrl, type: fontType, hash: undefined})

    resourceCache.setDependencies(cssUrl, [importedUrl, fontZillaUrl])
    resourceCache.setDependencies(importedUrl, [
      importedNestedUrl,
      fontShadowUrl,
      jpgUrl1,
      jpgUrl2,
      jpgUrl3,
    ])

    const expected = mapValues(
      {
        [cssUrl]: {type: cssType, value: cssContent},
        [importedUrl]: {type: cssType, value: importedContent},
        [importedNestedUrl]: {
          type: cssType,
          value: importedNestedContent,
        },
        [fontShadowUrl]: {type: fontType, value: fontShadowContent},
        [jpgUrl1]: {type: jpgType, value: jpgContent1},
        [jpgUrl2]: {type: jpgType, value: jpgContent2},
        [jpgUrl3]: {type: jpgType, value: jpgContent3},
        [fontZillaUrl]: {type: fontType, value: fontZillaContent},
      },
      (o, url) => {
        const rGridResource = toRGridResource({type: o.type, value: o.value, url})
        if (resourceType(rGridResource.getContentType()) !== 'CSS') {
          rGridResource._content = '' // yuck! but this is the symmetrical yuck of getAllResources::fromCacheToRGridResource since we save resource in cache without content, but with SHA256
        }
        return rGridResource
      },
    )

    const resourcesFromCache = await getAllResources({resourceUrls: [cssUrl]})
    try {
      expect(resourcesFromCache).to.eql(expected)
    } catch (ex) {
      console.log(ex)
      throw ex
    }
  })

  it("doesn't crash with unsupported protocols", async () => {
    const resources = await getAllResources({
      resourceUrls: ['data:text/html,<div>', 'blob:http://localhost/something.css'],
    }).then(
      x => x,
      err => err,
    )
    expect(resources).to.eql({})
  })

  it('handles empty resources', async () => {
    const resources = await getAllResources({
      preResources: {
        one: {url: 'one', type: 'some-type', value: null},
        two: {url: 'two', type: 'some-type', value: 'some-content'},
      },
    })
    const result = Object.entries(resources).map(r => r.toString())
    const expected = [
      'one,RGridResource { {"url":"one","contentType":"some-type","content":""} }',
      'two,RGridResource { {"url":"two","contentType":"some-type","content":"some-content"} }',
    ]
    expect(result).to.eql(expected)
  })

  it('handles empty resources extracted from cache', async () => {
    const url = 'https://some.com/img.jpg'
    const type = 'image/jpeg'
    const value = null

    const fetchResource = () => {}
    resourceCache = createResourceCache()
    // value was set in previous checkWindow or previous frame calls to createRGridDOMAndGetResourceMapping
    resourceCache.setValue(url, {url, type, value})
    getAllResources = makeGetAllResources({
      resourceCache,
      extractCssResources,
      fetchResource,
      logger: testLogger,
    })

    const resourcesFromCache = await getAllResources({
      resourceUrls: [url],
    })
    const content = resourcesFromCache[url].getContent()
    expect(content).to.eql('')
  })

  it('handles uppercase urls', async () => {
    const server = await testServerInProcess()
    closeServer = server.close
    try {
      const url = `HTTP://LOCALHOST:${server.port}/imported2.css`
      const resources = await getAllResources({resourceUrls: [url]}).then(
        x => x,
        err => err,
      )
      expect(resources).to.eql({
        [url]: toRGridResource({
          url,
          type: 'text/css; charset=UTF-8',
          value: loadFixtureBuffer('imported2.css'),
        }),
      })
    } catch (ex) {
      throw ex
    } finally {
      await closeServer()
    }
  })

  it('gets resources from prefilled resources', async () => {
    const server = await testServerInProcess()
    closeServer = server.close

    const baseUrl = `http://localhost:${server.port}`

    const cssName = 'blob.css'
    const cssValue = loadFixtureBuffer(cssName)
    const cssUrl = `${baseUrl}/${cssName}`
    const cssType = 'text/css; charset=UTF-8'

    const imgName = 'smurfs4.jpg'
    const imgUrl = `${baseUrl}/${imgName}`
    const imgValue = loadFixtureBuffer(imgName)
    const imgType = 'image/jpeg'

    const fontZillaName = 'zilla_slab.woff2'
    const fontZillaUrl = `${baseUrl}/${fontZillaName}`
    const fontZillaValue = loadFixtureBuffer(fontZillaName)
    const fontZillaType = 'font/woff2'

    const preResources = {
      [cssUrl]: {url: cssUrl, type: cssType, value: cssValue},
      [imgUrl]: {url: imgUrl, type: imgType, value: imgValue},
    }

    try {
      const resources = await getAllResources({
        resourceUrls: [fontZillaUrl],
        preResources,
      })

      const expected = mapValues(
        {
          [cssUrl]: {url: cssUrl, type: cssType, value: cssValue},
          [imgUrl]: {url: imgUrl, type: imgType, value: imgValue},
          [fontZillaUrl]: {url: fontZillaUrl, type: fontZillaType, value: fontZillaValue},
        },
        toRGridResource,
      )

      expect(resources).to.eql(expected)
    } finally {
      await closeServer()
    }
  })

  it('doesnt process prefilled resources', async () => {
    const server = await testServerInProcess()
    closeServer = server.close

    const baseUrl = `http://localhost:${server.port}`

    const cssName = 'hasDependency.css' // has smurfs4.jpg as dependecy
    const cssValue = loadFixtureBuffer(cssName)
    const cssUrl = `${baseUrl}/${cssName}`
    const cssType = 'text/css; charset=UTF-8'

    const preResources = {
      [cssUrl]: {url: cssUrl, type: cssType, value: cssValue},
    }

    try {
      const resources = await getAllResources({
        resourceUrls: [],
        preResources,
      })

      const expected = mapValues(
        {
          [cssUrl]: {url: cssUrl, type: cssType, value: cssValue},
        },
        toRGridResource,
      )

      expect(resources).to.eql(expected)
    } finally {
      await closeServer()
    }
  })

  // TODO enable this
  it.skip('works for unknown content-type', async () => {
    const server = await testServerInProcess()
    closeServer = server.close

    const url = 'no-content-type'
    const absoluteUrl = `http://localhost:${server.port}/${url}`
    const expected = {
      [absoluteUrl]: toRGridResource({
        url: absoluteUrl,
        type: 'application/x-applitools-unknown',
        value: loadFixtureBuffer(url),
      }),
    }

    try {
      const resources = await getAllResources({resourceUrls: [absoluteUrl]})
      expect(resources).to.deep.equal(expected)
    } catch (ex) {
      throw ex
    } finally {
      await closeServer()
    }

    const expectedFromCache = mapValues(expected, rGridResource => {
      rGridResource._content = null // yuck! but this is the symmetrical yuck of getAllResources::fromCacheToRGridResource since we save resource in cache without content, but with SHA256
      return rGridResource
    })

    const resourcesFromCache = await getAllResources({resourceUrls: [absoluteUrl]})
    expect(resourcesFromCache).to.deep.equal(expectedFromCache)
  })

  it('uses cache for all resources that were passed as preResources', async () => {
    const baseUrl = 'http://fake'
    const cssName = 'blob.css'
    const imgName = 'smurfs4.jpg'
    const cssUrl = `${baseUrl}/${cssName}`
    const imgUrl = `${baseUrl}/${imgName}`
    const cssBuffer = loadFixtureBuffer(cssName)
    const imgBuffer = loadFixtureBuffer(imgName)

    const resources = await getAllResources({
      resourceUrls: [],
      preResources: {
        [cssUrl]: {
          url: cssUrl,
          type: 'text/css',
          value: cssBuffer,
        },
        [imgUrl]: {
          url: imgUrl,
          type: 'bla jpeg',
          value: imgBuffer,
        },
      },
    })

    expect(resources).to.eql({
      [cssUrl]: toRGridResource({
        url: cssUrl,
        type: 'text/css',
        value: cssBuffer,
      }),
      [imgUrl]: toRGridResource({
        url: imgUrl,
        type: 'bla jpeg',
        value: imgBuffer,
      }),
    })
  })

  it("doesn't fail when fetchResource fails", async () => {
    let output = ''
    const fetchResource = makeFetchResource({
      logger: testLogger,
      fetchCache: createResourceCache(),
      fetch,
    })
    resourceCache = createResourceCache()
    getAllResources = makeGetAllResources({
      resourceCache,
      extractCssResources,
      fetchResource,
      logger: {
        log: (...args) => {
          output += args.join('')
        },
      },
    })
    const url = 'http://localhost:1234/err/bla.css'
    const resources = await getAllResources({resourceUrls: [url]})
    expect(resources).to.eql({[url]: toRGridResource({url, errorStatusCode: 504})})
    expect(output).to.contain(
      'error fetching resource at http://localhost:1234/err/bla.css, setting errorStatusCode to 504',
    )
  })

  it('handles the case when the same resource appears both in resourceUrls and preResources', async () => {
    const server = await testServerInProcess()
    const baseUrl = `http://localhost:${server.port}`
    const url = `${baseUrl}/smurfs.jpg`
    const preResources = {
      [url]: {url, type: 'bla-type', value: 'bla-value'},
    }

    try {
      const resources = await getAllResources({resourceUrls: [url], preResources})
      expect(resources).to.eql(mapValues(preResources, toRGridResource))
    } finally {
      await server.close()
    }
  })

  it('handles the case when the same resource appears both in preResources and as a dependency of another resourceUrl', async () => {
    const server = await testServerInProcess()
    const baseUrl = `http://localhost:${server.port}`
    const url = `${baseUrl}/smurfs.jpg`
    const preResources = {
      [url]: {url, type: 'bla-type', value: 'bla-value'},
    }
    const cssName = 'single-resource.css'
    const cssUrl = `${baseUrl}/${cssName}`
    const cssValue = loadFixtureBuffer(cssName)

    try {
      const resources = await getAllResources({resourceUrls: [cssUrl], preResources})
      expect(resources).to.eql(
        mapValues(
          Object.assign(preResources, {
            [cssUrl]: {url: cssUrl, type: 'text/css; charset=UTF-8', value: cssValue},
          }),
          toRGridResource,
        ),
      )
    } finally {
      await server.close()
    }
  })

  it('handles the case when the same resource appears both in preResources and as a dependency of another preResource', async () => {
    const server = await testServerInProcess()
    const baseUrl = `http://localhost:${server.port}`
    const jpgUrl = `${baseUrl}/smurfs.jpg`
    const cssName = 'single-resource.css'
    const cssUrl = `${baseUrl}/${cssName}`
    const cssValue = loadFixtureBuffer(cssName)
    const preResources = {
      [jpgUrl]: {url: jpgUrl, type: 'bla-type', value: 'bla-value'},
      [cssUrl]: {url: cssUrl, type: 'text/css', value: cssValue},
    }

    try {
      const resources = await getAllResources({resourceUrls: [], preResources})
      expect(resources).to.eql(mapValues(preResources, toRGridResource))
    } finally {
      await server.close()
    }
  })

  it('handles recursive reference inside a dependency', async () => {
    const server = await testServerInProcess()
    const baseUrl = `http://localhost:${server.port}`
    const name = 'recursive.css'
    const url = `${baseUrl}/${name}`
    try {
      const resources = await getAllResources({resourceUrls: [url]})
      expect(resources).to.eql(
        mapValues(
          {
            [url]: {url, type: 'text/css; charset=UTF-8', value: loadFixtureBuffer(name)},
          },
          toRGridResource,
        ),
      )
    } finally {
      await server.close()
    }
  })

  it('handles recursive reference inside a dependency from a preResource', async () => {
    const server = await testServerInProcess()
    const baseUrl = `http://localhost:${server.port}`
    const name = 'recursive.css'
    const url = `${baseUrl}/${name}`
    const value = loadFixtureBuffer(name)
    const preResources = {
      [url]: {url, type: 'text/css; charset=UTF-8', value},
    }
    try {
      const resources = await getAllResources({resourceUrls: [], preResources})
      expect(resources).to.eql(mapValues(preResources, toRGridResource))
    } finally {
      await server.close()
    }
  })

  it('handles mutually recursive references', async () => {
    const server = await testServerInProcess()
    const baseUrl = `http://localhost:${server.port}`
    const name1 = 'recursive-1.css'
    const url1 = `${baseUrl}/${name1}`
    const name2 = 'recursive-2.css'
    const url2 = `${baseUrl}/${name2}`
    try {
      const resources = await getAllResources({resourceUrls: [url1]})
      expect(resources).to.eql(
        mapValues(
          {
            [url1]: {url: url1, type: 'text/css; charset=UTF-8', value: loadFixtureBuffer(name1)},
            [url2]: {url: url2, type: 'text/css; charset=UTF-8', value: loadFixtureBuffer(name2)},
          },
          toRGridResource,
        ),
      )
    } finally {
      await server.close()
    }
  })

  it('returns resource from cache with content', async () => {
    const fontResource = {url: 'font.ttf', type: 'font/ttf', value: 'should have this value!'}
    await getAllResources({
      resourceUrls: [],
      preResources: {[fontResource.url]: fontResource},
    })
    const resources = await getAllResources({
      resourceUrls: [fontResource.url],
      preResources: {},
    })
    expect(resources[fontResource.url]).to.eql(toRGridResource(fontResource))
  })

  it("doesn't send user-agent header when fetching google fonts", async () => {
    const fetchResource = async (url, options) => ({
      url,
      type: 'text/plain',
      value: JSON.stringify(options),
    })
    resourceCache = createResourceCache()
    getAllResources = makeGetAllResources({
      resourceCache,
      extractCssResources,
      fetchResource,
      logger: testLogger,
    })
    const resources = await getAllResources({
      resourceUrls: ['https://some/url', 'https://fonts.googleapis.com/css?family=Zilla+Slab'],
      preResources: {},
      userAgent: 'bla',
    })
    expect(resources).to.eql({
      'https://some/url': toRGridResource({
        url: 'https://some/url',
        type: 'text/plain',
        value: JSON.stringify({headers: {'User-Agent': 'bla'}}),
      }),
      'https://fonts.googleapis.com/css?family=Zilla+Slab': toRGridResource({
        url: 'https://fonts.googleapis.com/css?family=Zilla+Slab',
        type: 'text/plain',
        value: JSON.stringify({headers: {}}),
      }),
    })
  })

  it('handles resources with errorStatusCode (non-200 resources) from preResources', async () => {
    const resources = await getAllResources({
      resourceUrls: [],
      preResources: {'http://resource-1': {url: 'http://resource-1', errorStatusCode: 500}},
    })
    expect(resources).to.eql({
      'http://resource-1': toRGridResource({url: 'http://resource-1', errorStatusCode: 500}),
    })
  })

  it('handles resources with errorStatusCode (non-200 resources) from resourceUrls', async () => {
    const server = await testServerInProcess()
    const baseUrl = `http://localhost:${server.port}`
    closeServer = server.close

    try {
      const url = `${baseUrl}/predefined-status/401`
      const resources = await getAllResources({
        resourceUrls: [url],
        preResources: {},
      })
      expect(resources).to.eql({
        [url]: toRGridResource({url, errorStatusCode: 401}),
      })
    } finally {
      await closeServer()
    }
  })

  it('handles resources with errorStatusCode (non-200 resources) from cache', async () => {
    const url = 'http://resource-1'
    await getAllResources({
      resourceUrls: [],
      preResources: {[url]: {url, errorStatusCode: 500}},
    })

    const resources = await getAllResources({resourceUrls: [url], preResources: {}})
    expect(resources).to.eql({
      [url]: toRGridResource({url, errorStatusCode: 500}),
    })
  })

  it('handles preResources with dependencies', async () => {
    const url1 = 'http://resource-1'
    const url2 = 'http://resource-2'
    const resources1 = await getAllResources({
      resourceUrls: [],
      preResources: {
        [url1]: {url: url1, type: 'type-1', value: 'value-1', dependencies: [url2]},
        [url2]: {url: url2, type: 'type-2', value: 'value-2'},
      },
    })

    const expectedResources = {
      [url1]: toRGridResource({url: url1, type: 'type-1', value: 'value-1'}),
      [url2]: toRGridResource({url: url2, type: 'type-2', value: 'value-2'}),
    }

    expect(resources1).to.eql(expectedResources)
    const resources2 = await getAllResources({resourceUrls: [url1], preResources: {}})
    expect(resources2).to.eql(expectedResources)
  })

  // TODO add tests for cookies
})
