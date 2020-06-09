'use strict';
const {describe, it} = require('mocha');
const {expect} = require('chai');
const makeGetBundledCssFromCssText = require('../src/browser/getBundledCssFromCssText');
const {parse: parseCss, CSSImportRule} = require('cssom');
const {URL} = require('url');

function absolutizeUrl(url, absoluteUrl) {
  return new URL(url, absoluteUrl).href;
}

function getCss(url) {
  return `\n/** ${url} **/\n${cssTexts[url]}`;
}

const cssTexts = {
  'http://bla/url1': 'div{display:block;}',
  'http://bla/url2': '@import "url1";aside{color:salmon;}',
  'http://bla/url3': '@import "unfetched";table{opacity:1;}',
};

function getCssFromCache(url) {
  return cssTexts[url];
}
describe('getBundledCssFromCssText', () => {
  const unfetchedToken = '###';
  const getBundlesCssFromCssText = makeGetBundledCssFromCssText({
    parseCss,
    CSSImportRule,
    absolutizeUrl,
    getCssFromCache,
    unfetchedToken,
  });

  it('works without @import', async () => {
    const cssText = 'div{display:none;}';
    const {bundledCss, unfetchedResources} = getBundlesCssFromCssText(cssText, 'bla');
    expect(bundledCss).to.equal(`\n/** bla **/\n${cssText}`);
    expect(unfetchedResources).to.be.undefined;
  });

  it('works with @import', async () => {
    const cssText = '@import "url1";\nspan{display:inline;}';
    const {bundledCss, unfetchedResources} = getBundlesCssFromCssText(
      cssText,
      'http://bla/some.css',
    );
    expect(bundledCss).to.equal(
      `${getCss('http://bla/url1')}\n/** http://bla/some.css **/\n${cssText}`,
    );
    expect(unfetchedResources).to.be.undefined;
  });

  it('works with nested @imports', async () => {
    const cssText = '@import "url2";\nspan{display:inline;}';
    const {bundledCss, unfetchedResources} = getBundlesCssFromCssText(
      cssText,
      'http://bla/some.css',
    );
    expect(bundledCss).to.equal(
      `${getCss('http://bla/url1')}${getCss(
        'http://bla/url2',
      )}\n/** http://bla/some.css **/\n${cssText}`,
    );
    expect(unfetchedResources).to.be.undefined;
  });

  it('handles unfetched resources', async () => {
    const cssText = '@import "nothing";';
    const {bundledCss, unfetchedResources} = getBundlesCssFromCssText(
      cssText,
      'http://bla/some.css',
    );
    expect(bundledCss).to.equal(
      `\n###http://bla/nothing###\n/** http://bla/some.css **/\n${cssText}`,
    );
    expect(unfetchedResources).to.eql(new Set(['http://bla/nothing']));
  });

  it('handles nested unfetched resources', async () => {
    const cssText = '@import "url3";';
    const {bundledCss, unfetchedResources} = getBundlesCssFromCssText(
      cssText,
      'http://bla/some.css',
    );
    expect(bundledCss).to.equal(
      `\n###http://bla/unfetched###${getCss(
        'http://bla/url3',
      )}\n/** http://bla/some.css **/\n${cssText}`,
    );
    expect(unfetchedResources).to.eql(new Set(['http://bla/unfetched']));
  });
});
