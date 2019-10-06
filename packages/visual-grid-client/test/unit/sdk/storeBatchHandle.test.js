'use strict';
const {describe, it} = require('mocha');
const {expect} = require('chai');
const storeBatchHandle = require('../../../src/sdk/storeBatchHandle');

describe('storeBatchHandle', () => {
  let _batchID = '1';
  const wrapper = {
    getExistingBatchId: () => _batchID,
    _serverConnector: {
      deleteBatchSessions: () => {},
    },
  };

  it('works', async () => {
    const batches = new Map([['2', 'foo']]);
    storeBatchHandle([wrapper], batches);
    expect(batches.get('1').name).to.equal('bound deleteBatchSessions');
    expect(batches.get('2')).to.equal('foo');
  });

  it('works for no id', async () => {
    _batchID = undefined;
    const batches = new Map([['2', 'foo']]);
    storeBatchHandle([wrapper], batches);
    expect(batches.get('2')).to.equal('foo');
    expect(batches.has('1')).to.be.false;
  });
});
