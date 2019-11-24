'use strict';
const {describe, it} = require('mocha');
const {expect} = require('chai');
const getBatch = require('../../../src/sdk/getBatch');

describe('getBatch', () => {
  it('works with batchName', () => {
    const {batchName, batchId, batchSequence} = getBatch({
      batchName: 'bla',
      batchId: 'kuku',
      batchSequence: 'tra',
    });
    expect(batchName).to.equal('bla');
    expect(batchId).to.equal('kuku');
    expect(batchSequence).to.equal('tra');
  });

  it('works without batchName', () => {
    const {batchId} = getBatch({batchId: 'kuku'});
    expect(batchId).to.equal('kuku');
  });

  it('works without batchId', () => {
    const {batchName} = getBatch({batchName: 'bla'});
    expect(batchName).to.equal('bla');
  });
});
