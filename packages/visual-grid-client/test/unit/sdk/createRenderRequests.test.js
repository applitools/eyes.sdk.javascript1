'use strict';
const {describe, it} = require('mocha');
const {expect} = require('chai');
const getSha256Hash = require('../../util/getSha256Hash');
const createRenderRequests = require('../../../src/sdk/createRenderRequests');
const createRGridDom = require('../../../src/sdk/createRGridDom');

describe('createRenderRequests', () => {
  it('works', () => {
    const r1 = {getUrl: () => 'url1', getHashAsObject: () => 'hash1'};
    const r2 = {getUrl: () => 'url2', getHashAsObject: () => 'hash2'};
    const url = 'url';
    const cdt = 'cdt';
    const resources = [r1, r2];
    const browsers = [{width: 1, height: 2, name: 'b1'}, {width: 3, height: 4, name: 'b2'}];
    const sizeMode = 'sizeMode';
    const selector = 'selector';
    const region = {left: 1, top: 2, width: 3, height: 4};
    const scriptHooks = 'scriptHooks';
    const sendDom = 'sendDom';
    const renderInfo = {getResultsUrl: () => 'resultsUrl'};
    const renderRequests = createRenderRequests({
      url,
      resources,
      dom: createRGridDom({resources: {['url1']: r1, ['url2']: r2}, cdt}),
      browsers,
      renderInfo,
      sizeMode,
      selector,
      region,
      scriptHooks,
      sendDom,
      noOffsetSelectors: [],
      offsetSelectors: [],
    });

    const resourcesObj = {url1: 'hash1', url2: 'hash2'};
    const dom = {
      hash: getSha256Hash(JSON.stringify({resources: resourcesObj, domNodes: 'cdt'})),
      hashFormat: 'sha256',
    };

    expect(renderRequests.map(r => r.toJSON())).to.eql([
      {
        webhook: 'resultsUrl',
        url,
        dom,
        resources: resourcesObj,
        browser: {name: 'b1', platform: 'Linux'},
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
        url,
        dom,
        resources: resourcesObj,
        browser: {name: 'b2', platform: 'Linux'},
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
    ]);
  });

  it('handles emulation info with deviceName', () => {
    const url = 'url';
    const cdt = 'cdt';
    const resources = [];
    const deviceName = 'deviceName';
    const screenOrientation = 'screenOrientation';
    const browsers = [{deviceName, screenOrientation}];
    const renderInfo = {getResultsUrl: () => 'resultsUrl'};
    const renderRequests = createRenderRequests({
      url,
      resources,
      dom: createRGridDom({resources: {}, cdt}),
      browsers,
      renderInfo,
      noOffsetSelectors: [],
      offsetSelectors: [],
    });

    const dom = {
      hash: getSha256Hash(JSON.stringify({resources: {}, domNodes: 'cdt'})),
      hashFormat: 'sha256',
    };

    expect(renderRequests.map(r => r.toJSON())).to.eql([
      {
        webhook: 'resultsUrl',
        url,
        dom,
        resources: {},
        renderInfo: {
          emulationInfo: {deviceName, screenOrientation},
          height: undefined,
          width: undefined,
          selector: undefined,
          region: undefined,
          sizeMode: undefined,
        },
      },
    ]);
  });

  it('handles emulation info with device', () => {
    const url = 'url';
    const cdt = 'cdt';
    const resources = [];
    const browsers = [{width: 1, height: 2, deviceScaleFactor: 3}];
    const renderInfo = {getResultsUrl: () => 'resultsUrl'};
    const renderRequests = createRenderRequests({
      url,
      resources,
      dom: createRGridDom({resources: {}, cdt}),
      browsers,
      renderInfo,
      noOffsetSelectors: [],
      offsetSelectors: [],
    });

    const dom = {
      hash: getSha256Hash(JSON.stringify({resources: {}, domNodes: 'cdt'})),
      hashFormat: 'sha256',
    };

    expect(renderRequests.map(r => r.toJSON())).to.eql([
      {
        webhook: 'resultsUrl',
        url,
        dom,
        resources: {},
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
    ]);
  });

  it('handles ignore, layout, strict, accessibility and floating regions', () => {
    const url = 'url';
    const cdt = '';
    const resources = [];
    const browsers = [{width: 1, height: 2}];
    const renderInfo = {getResultsUrl: () => 'resultsUrl'};
    const ignore = ['kuku', {selector: 'bla'}];
    const layout = [{selector: 'bla2'}, 'kuku2'];
    const strict = ['kuku3', {selector: 'bla3'}, {selector: 'bla4'}];
    const accessibility = [
      'kuku4',
      {selector: 'bla5', accessibilityType: 'RegularText'},
      {selector: 'bla6', accessibilityType: 'LargeText'},
    ];
    const floating = [{some: 'thing'}, {selector: 'sel'}];
    const renderRequests = createRenderRequests({
      url,
      resources,
      dom: createRGridDom({resources: {}, cdt}),
      browsers,
      renderInfo,
      noOffsetSelectors: [ignore, layout, strict, accessibility],
      offsetSelectors: [floating],
    });

    const dom = {
      hash: getSha256Hash(JSON.stringify({resources: {}, domNodes: ''})),
      hashFormat: 'sha256',
    };

    expect(renderRequests.map(r => r.toJSON())).to.eql([
      {
        webhook: 'resultsUrl',
        url,
        dom,
        resources: {},
        renderInfo: {
          height: 2,
          width: 1,
          selector: undefined,
          region: undefined,
          sizeMode: undefined,
        },
        selectorsToFindRegionsFor: ['bla', 'bla2', 'bla3', 'bla4', 'bla5', 'bla6', 'sel'],
      },
    ]);
  });
});
