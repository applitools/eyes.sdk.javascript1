'use strict';
const {describe, it} = require('mocha');
const {expect} = require('chai');
const arrayBufferToBase64 = require('../src/browser/arrayBufferToBase64');

describe('arrayBufferToBase64', () => {
  it('works', () => {
    const base64 = arrayBufferToBase64(Buffer.from('bla'));
    expect(base64).to.equal(Buffer.from('bla').toString('base64'));
  });
});
