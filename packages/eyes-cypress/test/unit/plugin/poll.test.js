'use strict';
const {describe, it} = require('mocha');
const {expect} = require('chai');
const poll = require('../../../src/browser/poll');
const {promisify: p} = require('util');
const psetTimeout = p(setTimeout);

describe('poll', () => {
  it('works', async () => {
    let status = 'IDLE';
    const func = async arg => ({status, results: `result_${arg}`});
    const pollFunc = poll(func);
    const ret = pollFunc(123);
    await psetTimeout(0);
    status = 'DONE';
    const result = await ret;
    expect(result).to.equal('result_123');
  });

  it('throws on rejection', async () => {
    const func = async () => {
      throw new Error('some error');
    };
    const result = await poll(func)().then(
      x => x,
      err => err,
    );
    expect(result).to.be.an.instanceof(Error);
    expect(result.message).to.equal('some error');
  });

  it('throws on rejection in nested poll', async () => {
    let status = 'IDLE';
    const func = async () => {
      if (status === 'IDLE') {
        status = 'WIP';
        return {status};
      }

      throw new Error('some error');
    };

    const result = await poll(func)().then(
      x => x,
      err => err,
    );
    expect(result).to.be.an.instanceof(Error);
    expect(result.message).to.equal('some error');
  });
});
