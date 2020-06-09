'use strict';
const {describe, it} = require('mocha');
const {expect} = require('chai');
const pollify = require('../src/browser/pollify');
const {delay} = require('@applitools/functional-commons');

describe('pollify', () => {
  it('works', async () => {
    const someFunc = () => new Promise(r => setTimeout(r, 100, 'hello'));
    const somFuncPoll = pollify(someFunc, {});
    const r = somFuncPoll();
    expect(JSON.parse(r)).to.eql({status: 'WIP', value: null, error: null});
    await delay(100);
    const r2 = somFuncPoll();
    expect(JSON.parse(r2)).to.eql({status: 'SUCCESS', value: 'hello', error: null});
  });

  it('returns error when processPage rejects', async () => {
    const someFunc = () => new Promise((_res, rej) => setTimeout(rej, 100, new Error('someErr')));
    const somFuncPoll = pollify(someFunc, {});
    let r = somFuncPoll();
    await delay(100);
    r = somFuncPoll();
    expect(JSON.parse(r)).to.eql({status: 'ERROR', value: null, error: 'someErr'});
  });
});
