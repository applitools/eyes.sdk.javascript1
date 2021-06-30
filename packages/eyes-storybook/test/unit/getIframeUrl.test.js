'use strict';
const {describe, it} = require('mocha');
const {expect} = require('chai');
const getIframeUrl = require('../../src/getIframeUrl');

describe('getIframeUrl', () => {
  it("keeps pathname that doesn't have a trailing slash", () => {
    const baseUrl = 'http://some/url';
    const expected = 'http://some/url/iframe.html?eyes-storybook=true';
    expect(getIframeUrl(baseUrl)).to.equal(expected);
  });

  it("keeps pathname that doesn't have a trailing slash and has query params", () => {
    const baseUrl = 'http://some/url?qqq=www';
    const expected = 'http://some/url/iframe.html?eyes-storybook=true';
    expect(getIframeUrl(baseUrl)).to.equal(expected);
  });

  it("keeps long pathname that doesn't have a trailing slash", () => {
    const baseUrl = 'http://some/url/that/works';
    const expected = 'http://some/url/that/works/iframe.html?eyes-storybook=true';
    expect(getIframeUrl(baseUrl)).to.equal(expected);
  });

  it('keeps pathname that has a trailing slash', () => {
    const baseUrl = 'http://some/url/';
    const expected = 'http://some/url/iframe.html?eyes-storybook=true';
    expect(getIframeUrl(baseUrl)).to.equal(expected);
  });

  it('keeps pathname that has a trailing slash and query params', () => {
    const baseUrl = 'http://some/url/?qqq=www';
    const expected = 'http://some/url/iframe.html?eyes-storybook=true';
    expect(getIframeUrl(baseUrl)).to.equal(expected);
  });

  it('removes .html files from pathname', () => {
    const baseUrl = 'http://some/url/index.html';
    const expected = 'http://some/url/iframe.html?eyes-storybook=true';
    expect(getIframeUrl(baseUrl)).to.equal(expected);
  });

  it('removes .html files from pathname with query params', () => {
    const baseUrl = 'http://some/url/index.html/?hello=world';
    const expected = 'http://some/url/iframe.html?eyes-storybook=true';
    expect(getIframeUrl(baseUrl)).to.equal(expected);
  });

  it('throws on invalid base URL', () => {
    const baseUrl = 'bla';
    try {
      getIframeUrl(baseUrl);
      expect(true).to.be(false);
    } catch (ex) {
      expect(ex).to.be.an.instanceOf(TypeError);
    }
  });
});
