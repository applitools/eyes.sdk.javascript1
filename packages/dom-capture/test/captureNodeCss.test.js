'use strict';
const {describe, it} = require('mocha');
const {expect} = require('chai');
const makeCaptureNodeCss = require('../src/browser/captureNodeCss');

const nodeToCss = {
  node1: 'css1',
  node2: 'css2',
};

function extractCssFromNode(node, baseUrl) {
  return {
    cssText: nodeToCss[node],
    styleBaseUrl: baseUrl,
    isUnfetched: !(node in nodeToCss),
  };
}

const cssToBundle = {
  css1url1: 'bundle1.1',
  css1url2: 'bundle1.2',
  css2url1: 'bundle2.1',
  css2url2: 'bundle2.2',
};

const cssToUnfetched = {
  css1url1: new Set(['unfetched1.1']),
  css1url2: new Set(['unfetched1.2']),
  css2url1: new Set(['unfetched2.1']),
  css2url2: new Set(['unfetched2.2']),
};

function getBundledCssFromCssText(cssText, resourceUrl) {
  return {
    bundledCss: cssToBundle[cssText + resourceUrl],
    unfetchedResources: cssToUnfetched[cssText + resourceUrl],
  };
}

describe('extractCssFromNode', () => {
  const unfetchedToken = '###';
  const captureNodeCss = makeCaptureNodeCss({
    extractCssFromNode,
    getBundledCssFromCssText,
    unfetchedToken,
  });
  it('works', async () => {
    const res1 = await captureNodeCss('node1', 'url1');
    expect(res1.bundledCss).to.equal('bundle1.1');
    expect(res1.unfetchedResources).to.eql(new Set(['unfetched1.1']));

    const res2 = await captureNodeCss('node1', 'url2');
    expect(res2.bundledCss).to.equal('bundle1.2');
    expect(res2.unfetchedResources).to.eql(new Set(['unfetched1.2']));

    const res3 = await captureNodeCss('node2', 'url1');
    expect(res3.bundledCss).to.equal('bundle2.1');
    expect(res3.unfetchedResources).to.eql(new Set(['unfetched2.1']));

    const res4 = await captureNodeCss('node2', 'url2');
    expect(res4.bundledCss).to.equal('bundle2.2');
    expect(res4.unfetchedResources).to.eql(new Set(['unfetched2.2']));
  });

  it('handles unfetched css', async () => {
    const {bundledCss, unfetchedResources} = await captureNodeCss('nothing', 'some url');
    expect(bundledCss).to.equal('###some url###');
    expect(unfetchedResources).to.eql(new Set(['some url']));
  });
});
