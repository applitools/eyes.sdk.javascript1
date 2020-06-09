'use strict';
const {describe, it, before, beforeEach} = require('mocha');
const {expect} = require('chai');
const makeHandleCypressViewport = require('../../../src/browser/makeHandleCypressViewport');

describe('handleCypressViewport', () => {
  let handleCypressViewport, _width, _height;

  before(() => {
    handleCypressViewport = makeHandleCypressViewport({
      cy: {
        viewport: (width, height) => ((_width = width), (_height = height), Promise.resolve()),
        then: true,
      },
    });
  });

  beforeEach(() => {
    _width = _height = undefined;
  });

  it('works', () => {
    handleCypressViewport({height: 10, width: 20});
    expect(_height).to.eql(10);
    expect(_width).to.eql(20);
  });

  it('returns a promise if setting viewport', () => {
    expect(handleCypressViewport({height: 10, width: 20})).to.have.property('then');
  });

  it('returns a promise if not setting viewport', () => {
    expect(handleCypressViewport({})).to.have.property('then');
  });

  it('does not set viewport if there are more than 1 viewports', () => {
    handleCypressViewport([
      {height: 10, width: 20},
      {height: 10, width: 20},
    ]);
    expect(_height).to.eql(undefined);
    expect(_width).to.eql(undefined);
  });

  it('does set viewport if there is 1 viewport in an array', () => {
    handleCypressViewport([{height: 10, width: 20}]);
    expect(_height).to.eql(10);
    expect(_width).to.eql(20);
  });

  it('does not set viewport if there is no browser arg', () => {
    handleCypressViewport({});
    expect(_height).to.eql(undefined);
    expect(_width).to.eql(undefined);
  });

  it('does not set viewport if there empty array browser arg', () => {
    handleCypressViewport([]);
    expect(_height).to.eql(undefined);
    expect(_width).to.eql(undefined);
  });

  it('does not set viewport if there is no height', () => {
    handleCypressViewport({width: 20});
    expect(_height).to.eql(undefined);
    expect(_width).to.eql(undefined);
  });

  it('does not set viewport if there is no height and no width', () => {
    handleCypressViewport({});
    expect(_height).to.eql(undefined);
    expect(_width).to.eql(undefined);
  });
});
