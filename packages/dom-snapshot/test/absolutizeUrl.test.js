'use strict';
const {describe, it} = require('mocha');
const {expect} = require('chai');
const absolutizeUrl = require('../src/browser/absolutizeUrl');

describe('absolutizeUrl', () => {
  it('works', () => {
    expect(absolutizeUrl('style.css', 'https://some.org')).to.equal('https://some.org/style.css');
    expect(absolutizeUrl('style.css?#hello=true', 'https://some.org')).to.equal(
      'https://some.org/style.css?#hello=true',
    );
    expect(absolutizeUrl('style.css', 'https://some.org/app')).to.equal(
      'https://some.org/style.css',
    );
    expect(absolutizeUrl('style.css', 'https://some.org/app/')).to.equal(
      'https://some.org/app/style.css',
    );
    expect(absolutizeUrl('style.css', 'https://some.org/app/bla')).to.equal(
      'https://some.org/app/style.css',
    );
    expect(absolutizeUrl('/style.css', 'https://some.org/app/bla')).to.equal(
      'https://some.org/style.css',
    );
  });
});
