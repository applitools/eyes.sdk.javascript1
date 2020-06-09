// 'use strict';

const {describe, it} = require('mocha');
const {expect} = require('chai');
const sanitizeAuthUrl = require('../src/browser/sanitizeAuthUrl');

describe('sanitizeAuthUrl', () => {
  it('works', () => {
    expect(
      sanitizeAuthUrl('https://usr:pass@www.google.com:7373/?hello=true&yo=89?#yo=true'),
    ).to.eql('https://www.google.com:7373/?hello=true&yo=89?#yo=true');
    expect(sanitizeAuthUrl('https://usr:pass@www.google.com? ')).to.eql('https://www.google.com/?');
    expect(sanitizeAuthUrl('https://usr:pass@www.google.com/?')).to.eql('https://www.google.com/?');
    expect(sanitizeAuthUrl('https://usr:pass@www.google.com?hello=true&yo=89?#yo=true')).to.eql(
      'https://www.google.com/?hello=true&yo=89?#yo=true',
    );
  });

  it('works for blobs', () => {
    expect(
      sanitizeAuthUrl('blob:http://localhost:7373/78b8e9cf-9e25-49fd-aba8-6a19ff4415f1'),
    ).to.eql('blob:http://localhost:7373/78b8e9cf-9e25-49fd-aba8-6a19ff4415f1');
  });
});
