'use strict';
const {describe, it} = require('mocha');
const {expect} = require('chai');
const makeBatchStore = require('../../../src/sdk/makeBatchStore');

describe('storeBatchHandle', () => {
  let _batchID = '1';
  const batchStore = makeBatchStore();

  it('addId works', async () => {
    batchStore.addId('2');
    expect(batchStore.ids.has('2')).to.be.true;
  });

  it('hasCloseBatch works', async () => {
    expect(batchStore.hasCloseBatch()).to.be.false;
    const foo = () => {};
    batchStore.setCloseBatch(foo);
    expect(batchStore.hasCloseBatch()).to.be.true;
    expect(batchStore.closeBatch).to.equal(foo);
  });
});
