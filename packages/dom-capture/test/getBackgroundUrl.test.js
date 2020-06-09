'use strict';

const {describe, it} = require('mocha');
const {expect} = require('chai');
const getBackgroundImageUrl = require('../src/browser/getBackgroundImageUrl');

describe('getBackgroundImageUrl', () => {
  it('gets background url from all kinds of computed property variations', async () => {
    expect(getBackgroundImageUrl("url('hello.jpg')")).to.equal('hello.jpg');
    expect(getBackgroundImageUrl('url("hello.jpg")')).to.equal('hello.jpg');
  });
});
