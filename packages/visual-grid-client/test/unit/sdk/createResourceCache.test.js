'use strict';
const {describe, it, beforeEach} = require('mocha');
const {expect} = require('chai');
const createResourceCache = require('../../../src/sdk/createResourceCache');

describe('createResourceCache', () => {
  let cache;

  beforeEach(() => {
    cache = createResourceCache();
  });

  it('gets and sets value', () => {
    cache.setValue('kaka', 'maika');
    expect(cache.getValue('kaka')).to.equal('maika');
    cache.setValue('kaka', 'baba');
    expect(cache.getValue('kaka')).to.equal('baba');
  });

  it('sets dependencies', () => {
    cache.setValue('kaka', 'maika');
    cache.setValue('a', 'aaa');
    cache.setValue('b', 'bbb');
    cache.setValue('c', 'ccc');
    cache.setDependencies('kaka', ['a', 'b', 'c']);
    expect(cache.getWithDependencies('kaka')).to.eql({
      kaka: 'maika',
      a: 'aaa',
      b: 'bbb',
      c: 'ccc',
    });

    cache.setDependencies('kaka', ['d']);
    expect(cache.getWithDependencies('kaka')).to.eql({
      kaka: 'maika',
    });
  });

  it('gets nested dependencies', () => {
    cache.setValue('a', 'aaa');
    cache.setValue('b', 'bbb');
    cache.setDependencies('a', ['b']);
    cache.setValue('kaka', 'maika');
    cache.setDependencies('kaka', ['a']);
    expect(cache.getWithDependencies('kaka')).to.eql({
      kaka: 'maika',
      a: 'aaa',
      b: 'bbb',
    });
  });

  it('does not go into infinite loop', () => {
    cache.setValue('a', 'aaa');
    cache.setValue('b', 'bbb');
    cache.setValue('c', 'ccc');
    cache.setDependencies('a', ['b']);
    cache.setDependencies('b', ['c']);
    cache.setDependencies('c', ['a']);
    expect(cache.getWithDependencies('a')).to.eql({
      a: 'aaa',
      b: 'bbb',
      c: 'ccc',
    });
  });

  it('getWithDependencies returns undefined if no value for entry', () => {
    cache.setDependencies('kaka', ['a', 'b']);
    cache.setValue('a', 'aaa');
    expect(cache.getWithDependencies('kaka')).to.equal(undefined);
  });

  it('getWithDependencies handles recursive dependencies', () => {
    cache.setValue('a', 'aaa');
    cache.setDependencies('a', ['a']);
    expect(cache.getWithDependencies('a')).to.eql({a: 'aaa'});
  });
});
