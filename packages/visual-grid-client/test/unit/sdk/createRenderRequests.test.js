'use strict'
const {describe, it} = require('mocha')
const {expect} = require('chai')
const getSha256Hash = require('../../util/getSha256Hash')
const createRenderRequest = require('../../../src/sdk/createRenderRequest')
const createRGridDom = require('../../../src/sdk/createRGridDom')

describe('createRenderRequest', () => {
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
    const browser = {width: 1, height: 2, name: 'b1'}
    const sizeMode = 'sizeMode'
    const selector = 'selector'
    const region = {left: 1, top: 2, width: 3, height: 4}
    const scriptHooks = 'scriptHooks'
    const sendDom = 'sendDom'

    const renderRequest = createRenderRequest({
      url,
      dom,
      resources,
      browser,
      renderInfo,
      sizeMode,
      selector,
      region,
      scriptHooks,
      sendDom,
      userRegions: [],
    })

    const resourcesObj = {url1: 'hash1', url2: 'hash2'}
    const domObj = {
      contentType: 'x-applitools-html/cdt',
      hash: getSha256Hash(JSON.stringify({resources: resourcesObj, domNodes: 'cdt'})),
      hashFormat: 'sha256',
    }

    expect(renderRequest.toJSON()).to.eql({
      webhook: 'resultsUrl',
      stitchingService: 'stitchingServiceUrl',
      url,
      dom: domObj,
      resources: resourcesObj,
      browser: {name: 'b1'},
      scriptHooks,
      sendDom,
      enableMultipleResultsPerSelector: true,
      renderInfo: {
        width: 1,
        height: 2,
        selector,
        sizeMode,
        region: {x: 1, y: 2, width: 3, height: 4, coordinatesType: 'SCREENSHOT_AS_IS'},
      },
    })
  })

  it('handles emulation info with deviceName', () => {
    const deviceName = 'deviceName'
    const screenOrientation = 'screenOrientation'
    const browser = {deviceName, screenOrientation}
    const renderRequest = createRenderRequest({
      url,
      dom,
      resources,
      browser,
      renderInfo,
      userRegions: [],
    })

    expect(renderRequest.toJSON()).to.eql({
      webhook: 'resultsUrl',
      stitchingService: 'stitchingServiceUrl',
      url,
      dom: domObj,
      resources: resourcesObj,
      enableMultipleResultsPerSelector: true,
      renderInfo: {
        emulationInfo: {deviceName, screenOrientation},
        height: undefined,
        width: undefined,
        selector: undefined,
        region: undefined,
        sizeMode: undefined,
      },
    })
  })

  it('handles emulation info with device', () => {
    const browser = {width: 1, height: 2, deviceScaleFactor: 3}
    const renderInfo = {
      getResultsUrl: () => 'resultsUrl',
      getStitchingServiceUrl: () => 'stitchingServiceUrl',
    }
    const renderRequest = createRenderRequest({
      url,
      dom,
      resources,
      browser,
      renderInfo,
      userRegions: [],
    })

    expect(renderRequest.toJSON()).to.eql({
      webhook: 'resultsUrl',
      stitchingService: 'stitchingServiceUrl',
      url,
      dom: domObj,
      resources: resourcesObj,
      enableMultipleResultsPerSelector: true,
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
    })
  })

  it('handles selectorsToFindRegionsFor', () => {
    const browser = {width: 1, height: 2}
    const renderRequest = createRenderRequest({
      url,
      dom,
      resources,
      browser,
      renderInfo,
      selectorsToFindRegionsFor: [{selector: 'bla', type: 'css'}],
    })

    expect(renderRequest.toJSON()).to.eql({
      webhook: 'resultsUrl',
      stitchingService: 'stitchingServiceUrl',
      url,
      dom: domObj,
      resources: resourcesObj,
      enableMultipleResultsPerSelector: true,
      renderInfo: {
        height: 2,
        width: 1,
        selector: undefined,
        region: undefined,
        sizeMode: undefined,
      },
      selectorsToFindRegionsFor: [{type: 'css', selector: 'bla'}],
    })
  })

  it('handles iosDeviceInfo', () => {
    const iosDeviceInfo = {
      deviceName: 'ios device',
      iosVersion: 'ios version',
      screenOrientation: 'ios screen orientation',
    }
    const browser = {iosDeviceInfo}
    const renderRequest = createRenderRequest({
      url,
      dom,
      resources,
      browser,
      renderInfo,
    })

    expect(renderRequest.toJSON()).to.eql({
      webhook: 'resultsUrl',
      stitchingService: 'stitchingServiceUrl',
      url,
      dom: domObj,
      resources: resourcesObj,
      browser: {name: 'safari'},
      platform: {name: 'ios'},
      enableMultipleResultsPerSelector: true,
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
    })
  })
})
