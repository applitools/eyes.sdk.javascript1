// 'use strict';

const {describe, it} = require('mocha');
const {expect} = require('chai');
const toUriEncoding = require('../src/browser/toUriEncoding');

describe('toUriEncoding', () => {
  it('works', () => {
    expect(toUriEncoding('\\2f somePath\\2fgargamel3.jpg')).to.eql('/somePath/gargamel3.jpg');
    expect(toUriEncoding('\\E9motion')).to.eql('émotion');
    expect(toUriEncoding('\\E9 dition')).to.eql('édition');
    expect(toUriEncoding('\\0000E9dition')).to.eql('édition');
  });
});
