'use strict'
const {describe, it} = require('mocha')
const {expect} = require('chai')
const getSha256Hash = require('../../util/getSha256Hash')
const createRenderRequests = require('../../../src/sdk/createRenderRequests')
const createRGridDom = require('../../../src/sdk/createRGridDom')

describe('createRenderRequests', () => {
  let url, renderInfo, dom, domObj, resources, resourcesObj

  beforeEach(() => {
    url = 'url'
    renderInfo = {
      getResultsUrl: () => 'resultsUrl',
      getStitchingServiceUrl: () => 'stitchingServiceUrl',
    }
    const cdt = 'cdt'
    domObj = {
      contentType: 'x-applitools-html/cdt',
      hash: getSha256Hash(JSON.stringify({resources: {}, domNodes: cdt})),
      hashFormat: 'sha256',
    }
    dom = createRGridDom({resources: {}, cdt})
    resources = []
    resourcesObj = {}
  })

  it('works', () => {
    const r1 = {getUrl: () => 'url1', getHashAsObject: () => 'hash1'}
    const r2 = {getUrl: () => 'url2', getHashAsObject: () => 'hash2'}
    const url = 'url'
    const cdt = 'cdt'
    const resources = [r1, r2]
    const dom = createRGridDom({resources: {['url1']: r1, ['url2']: r2}, cdt})
    const browsers = [
      {width: 1, height: 2, name: 'b1'},
      {width: 3, height: 4, name: 'b2'},
    ]
    const sizeMode = 'sizeMode'
    const selector = 'selector'
    const region = {left: 1, top: 2, width: 3, height: 4}
    const scriptHooks = 'scriptHooks'
    const sendDom = 'sendDom'

    const renderRequests = createRenderRequests({
      url,
      pages: Array(browsers.length).fill({rGridDom: dom, allResources: resources}),
      browsers,
      renderInfo,
      sizeMode,
      selector,
      region,
      scriptHooks,
      sendDom,
      noOffsetSelectors: [],
      offsetSelectors: [],
    })

    const resourcesObj = {url1: 'hash1', url2: 'hash2'}
    const domObj = {
      contentType: 'x-applitools-html/cdt',
      hash: getSha256Hash(JSON.stringify({resources: resourcesObj, domNodes: 'cdt'})),
      hashFormat: 'sha256',
    }

    expect(renderRequests.map(r => r.toJSON())).to.eql([
      {
        webhook: 'resultsUrl',
        stitchingService: 'stitchingServiceUrl',
        url,
        dom: domObj,
        resources: resourcesObj,
        browser: {name: 'b1'},
        scriptHooks,
        sendDom,
        renderInfo: {
          width: 1,
          height: 2,
          selector,
          sizeMode,
          region: {x: 1, y: 2, width: 3, height: 4, coordinatesType: 'SCREENSHOT_AS_IS'},
        },
      },
      {
        webhook: 'resultsUrl',
        stitchingService: 'stitchingServiceUrl',
        url,
        dom: domObj,
        resources: resourcesObj,
        browser: {name: 'b2'},
        scriptHooks,
        sendDom,
        renderInfo: {
          width: 3,
          height: 4,
          selector,
          sizeMode,
          region: {x: 1, y: 2, width: 3, height: 4, coordinatesType: 'SCREENSHOT_AS_IS'},
        },
      },
    ])
  })

  it('handles emulation info with deviceName', () => {
    const deviceName = 'deviceName'
    const screenOrientation = 'screenOrientation'
    const browsers = [{deviceName, screenOrientation}]
    const renderRequests = createRenderRequests({
      url,
      pages: [{rGridDom: dom, allResources: resources}],
      browsers,
      renderInfo,
      noOffsetSelectors: [],
      offsetSelectors: [],
    })

    expect(renderRequests.map(r => r.toJSON())).to.eql([
      {
        webhook: 'resultsUrl',
        stitchingService: 'stitchingServiceUrl',
        url,
        dom: domObj,
        resources: resourcesObj,
        renderInfo: {
          emulationInfo: {deviceName, screenOrientation},
          height: undefined,
          width: undefined,
          selector: undefined,
          region: undefined,
          sizeMode: undefined,
        },
      },
    ])
  })

  it('handles emulation info with device', () => {
    const browsers = [{width: 1, height: 2, deviceScaleFactor: 3}]
    const renderInfo = {
      getResultsUrl: () => 'resultsUrl',
      getStitchingServiceUrl: () => 'stitchingServiceUrl',
    }
    const renderRequests = createRenderRequests({
      url,
      pages: [{rGridDom: dom, allResources: resources}],
      browsers,
      renderInfo,
      noOffsetSelectors: [],
      offsetSelectors: [],
    })

    expect(renderRequests.map(r => r.toJSON())).to.eql([
      {
        webhook: 'resultsUrl',
        stitchingService: 'stitchingServiceUrl',
        url,
        dom: domObj,
        resources: resourcesObj,
        renderInfo: {
          emulationInfo: {
            width: 1,
            height: 2,
            deviceScaleFactor: 3,
            screenOrientation: undefined,
            mobile: undefined,
          },
          height: 2,
          width: 1,
          selector: undefined,
          region: undefined,
          sizeMode: undefined,
        },
      },
    ])
  })

  it('handles ignore, layout, strict, content, accessibility and floating regions', () => {
    const browsers = [{width: 1, height: 2}]
    const ignore = ['kuku', {type: 'css', selector: 'bla'}]
    const layout = [{type: 'css', selector: 'bla2'}, 'kuku2']
    const strict = ['kuku3', {type: 'css', selector: 'bla3'}, {type: 'css', selector: 'bla4'}]
    const content = ['c1', {type: 'css', selector: 'c2'}, {type: 'css', selector: 'c3'}]
    const accessibility = [
      'kuku4',
      {type: 'css', selector: 'bla5', accessibilityType: 'RegularText'},
      {type: 'css', selector: 'bla6', accessibilityType: 'LargeText'},
    ]
    const floating = [{some: 'thing'}, {type: 'css', selector: 'sel'}]
    const renderRequests = createRenderRequests({
      url,
      pages: [{rGridDom: dom, allResources: resources}],
      browsers,
      renderInfo,
      noOffsetSelectors: [ignore, layout, strict, content, accessibility],
      offsetSelectors: [floating],
    })

    expect(renderRequests.map(r => r.toJSON())).to.eql([
      {
        webhook: 'resultsUrl',
        stitchingService: 'stitchingServiceUrl',
        url,
        dom: domObj,
        resources: resourcesObj,
        renderInfo: {
          height: 2,
          width: 1,
          selector: undefined,
          region: undefined,
          sizeMode: undefined,
        },
        selectorsToFindRegionsFor: [
          {type: 'css', selector: 'bla'},
          {type: 'css', selector: 'bla2'},
          {type: 'css', selector: 'bla3'},
          {type: 'css', selector: 'bla4'},
          {type: 'css', selector: 'c2'},
          {type: 'css', selector: 'c3'},
          {type: 'css', selector: 'bla5'},
          {type: 'css', selector: 'bla6'},
          {type: 'css', selector: 'sel'},
        ],
      },
    ])
  })

  it('handles iosDeviceInfo', () => {
    const iosDeviceInfo = {
      deviceName: 'ios device',
      iosVersion: 'ios version',
      screenOrientation: 'ios screen orientation',
    }
    const browsers = [{iosDeviceInfo}]
    const renderRequests = createRenderRequests({
      url,
      pages: [{rGridDom: dom, allResources: resources}],
      browsers,
      renderInfo,
    })

    expect(renderRequests.map(r => r.toJSON())).to.eql([
      {
        webhook: 'resultsUrl',
        stitchingService: 'stitchingServiceUrl',
        url,
        dom: domObj,
        resources: resourcesObj,
        browser: {name: 'safari'},
        platform: {name: 'ios'},
        renderInfo: {
          iosDeviceInfo: {
            name: 'ios device',
            version: 'ios version',
            screenOrientation: 'ios screen orientation',
          },
          region: undefined,
          selector: undefined,
          sizeMode: undefined,
          width: undefined,
          height: undefined,
        },
      },
    ])
  })

  it('handles multiple dom snapshots', () => {
    const browsers = [
      {width: 1, height: 1, name: '1'},
      {width: 2, height: 2, name: '2'},
      {width: 3, height: 3, name: '1'},
    ]
    const dom1 = createRGridDom({resources: {}, cdt: 'cdt1'})
    const dom2 = createRGridDom({resources: {}, cdt: 'cdt2'})
    const renderRequests = createRenderRequests({
      url,
      pages: [
        {rGridDom: dom1, allResources: resources},
        {rGridDom: dom2, allResources: resources},
        {rGridDom: dom1, allResources: resources},
      ],
      browsers,
      renderInfo,
    })

    expect(renderRequests.map(r => r.toJSON())).to.eql(
      browsers.map(browser => ({
        webhook: 'resultsUrl',
        stitchingService: 'stitchingServiceUrl',
        url,
        dom: {
          contentType: 'x-applitools-html/cdt',
          hash: getSha256Hash(JSON.stringify({resources: {}, domNodes: `cdt${browser.name}`})),
          hashFormat: 'sha256',
        },
        resources: resourcesObj,
        browser: {name: browser.name},
        renderInfo: {
          width: browser.width,
          height: browser.height,
          region: undefined,
          selector: undefined,
          sizeMode: undefined,
        },
      })),
    )
  })
})
