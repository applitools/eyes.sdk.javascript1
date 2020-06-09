'use strict';
const {describe, it} = require('mocha');
const {expect} = require('chai');
const makeExtractCssFromNode = require('../src/browser/extractCssFromNode');
const {URL} = require('url');
const {JSDOM} = require('jsdom');

function absolutizeUrl(url, absoluteUrl) {
  return new URL(url, absoluteUrl).href;
}

const cssTexts = {
  'http://bla/url1': 'div{display:block;}',
  'http://bla/url2': '@import "url1";aside{color:salmon;}',
  'http://bla/url3': '@import "unfetched";table{opacity:1;}',
};

function getCssFromCache(url) {
  return cssTexts[url];
}

describe('extractCssFromNode', () => {
  const extractCssFromNode = makeExtractCssFromNode({getCssFromCache, absolutizeUrl});
  it('handles style elements', async () => {
    const dom = new JSDOM('<style>div{display:none;}</style>');
    const {cssText, styleBaseUrl, isUnfetched} = extractCssFromNode(
      dom.window.document.querySelector('style'),
      'bla',
    );
    expect(cssText).to.equal('div{display:none;}');
    expect(styleBaseUrl).to.equal('bla');
    expect(isUnfetched).to.be.undefined;
  });

  it('handles link elements', async () => {
    const dom = new JSDOM('<link rel="stylesheet" href="url1"></link>');
    const {cssText, styleBaseUrl, isUnfetched} = extractCssFromNode(
      dom.window.document.querySelector('link'),
      'http://bla/some.css',
    );
    expect(cssText).to.equal(cssTexts['http://bla/url1']);
    expect(styleBaseUrl).to.equal('http://bla/url1');
    expect(isUnfetched).to.be.false;
  });

  it('handles unfetched css', async () => {
    const dom = new JSDOM('<link rel="stylesheet" href="nothing"></link>');
    const {cssText, styleBaseUrl, isUnfetched} = extractCssFromNode(
      dom.window.document.querySelector('link'),
      'http://bla/some.css',
    );
    expect(cssText).to.be.undefined;
    expect(styleBaseUrl).to.equal('http://bla/nothing');
    expect(isUnfetched).to.be.true;
  });

  it('handles data url link elements', async () => {
    const dom = new JSDOM(
      '<link rel="stylesheet" href="data:text/css; charset=utf-8,.someClass{color:salmon;}"></link>',
    );
    const {cssText, styleBaseUrl, isUnfetched} = extractCssFromNode(
      dom.window.document.querySelector('link'),
      'http://bla/some.css',
    );
    expect(cssText).to.equal('.someClass{color:salmon;}');
    expect(styleBaseUrl).to.equal('http://bla/some.css');
    expect(isUnfetched).to.be.false;
  });
});
