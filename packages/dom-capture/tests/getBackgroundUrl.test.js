'use strict';

const {describe, it} = require('mocha');
const {expect} = require('chai');
const getBackgroundImageUrl = require('../src/browser/getBackgroundImageUrl');

describe('getBackgroundImageUrl', () => {
  it('gets background url from all kinds of computed property variations', async () => {
    expect(getBackgroundImageUrl("url('hello.jpg')")).to.equal('hello.jpg');
    expect(getBackgroundImageUrl('url("hello.jpg")')).to.equal('hello.jpg');

    const svgValue =
      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1024' height='105' viewBox='0 0 1024 105'%3E %3Cpath fill='%23f9f9f9' fill-rule='evenodd' d='M1024 1.283V105H0V63.124c50 22.584 142.333 34.03 277 34.336C479 97.92 671 0 910 0c37.062 0 75.062.428 114 1.283z'/%3E %3C/svg%3E";
    expect(getBackgroundImageUrl(`url("${svgValue}")`)).to.equal(svgValue);
  });
});
