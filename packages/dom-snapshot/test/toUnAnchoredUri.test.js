// 'use strict';

const {describe, it} = require('mocha');
const {expect} = require('chai');
const toUnAnchoredUri = require('../src/browser/toUnAnchoredUri');

describe('toUnAnchoredUri', () => {
  it('works', () => {
    expect(toUnAnchoredUri('https://www.google.com?#helloyo#hi&a=true')).to.eql(
      'https://www.google.com?',
    );
    expect(toUnAnchoredUri('https://www.google.com? ')).to.eql('https://www.google.com?');
    expect(toUnAnchoredUri('https://www.google.com/hi/hello?#helloyo#hi&a=true')).to.eql(
      'https://www.google.com/hi/hello?',
    );
    expect(toUnAnchoredUri('file.jpg#hello')).to.eql('file.jpg');
  });
});
