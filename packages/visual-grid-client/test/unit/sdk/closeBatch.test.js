'use strict';
const {describe, it} = require('mocha');
const {expect} = require('chai');
const makeCloseBatch = require('../../../src/sdk/makeCloseBatch');
const makeGlobalState = require('../../../src/sdk/globalState');

describe('closeBatch', () => {
  it('works', async () => {
    const globalState = makeGlobalState({logger: {log: () => {}}});
    const closeBatch = makeCloseBatch({globalState, dontCloseBatches: false, isDisabled: false});
    const _deleteCalledWith = [];
    const deleteBatchSessions = async id => _deleteCalledWith.push(id);
    globalState.batchStore.addId('1');
    globalState.batchStore.addId('2');
    globalState.batchStore.setCloseBatch(deleteBatchSessions);

    await closeBatch();
    expect(_deleteCalledWith).to.eql(['1', '2']);
  });

  it('dontCloseBatches works', async () => {
    const globalState = makeGlobalState({logger: {log: () => {}}});
    const closeBatch = makeCloseBatch({globalState, dontCloseBatches: true, isDisabled: false});
    const _deleteCalledWith = [];
    const deleteBatchSessions = async id => _deleteCalledWith.push(id);
    globalState.batchStore.addId('1');
    globalState.batchStore.addId('2');
    globalState.batchStore.setCloseBatch(deleteBatchSessions);

    await closeBatch();
    expect(_deleteCalledWith).to.eql([]);
  });

  it('isDisabled works', async () => {
    const globalState = makeGlobalState({logger: {log: () => {}}});
    const closeBatch = makeCloseBatch({globalState, dontCloseBatches: false, isDisabled: true});
    const _deleteCalledWith = [];
    const deleteBatchSessions = async id => _deleteCalledWith.push(id);
    globalState.batchStore.addId('1');
    globalState.batchStore.addId('2');
    globalState.batchStore.setCloseBatch(deleteBatchSessions);

    await closeBatch();
    expect(_deleteCalledWith).to.eql([]);
  });
});
