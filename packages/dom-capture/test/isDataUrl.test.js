'use strict';
const {describe, it} = require('mocha');
const {expect} = require('chai');
const isDataUrl = require('../src/browser/isDataUrl');

describe('isDataUrl', () => {
  it('works', () => {
    const html = 'data:text/html,lots of STUFF';
    const css1 = 'data:text/css; charset=utf-8, some stuff';
    const css2 = 'data:text/css;, some stuff';
    const noneDataUrl = 'https://data:/css';
    const noneUrl = 'bla bla';

    expect(isDataUrl(html)).to.be.true;
    expect(isDataUrl(css1)).to.be.true;
    expect(isDataUrl(css2)).to.be.true;
    expect(isDataUrl(noneDataUrl)).to.be.false;
    expect(isDataUrl(noneUrl)).to.be.false;
  });
});
