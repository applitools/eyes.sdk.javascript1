'use strict';

const {describe, it} = require('mocha');
const {expect} = require('chai');
const calculateSelectorsToFindRegionsFor = require('../../../src/sdk/calculateSelectorsToFindRegionsFor');

describe('calculateSelectorsToFindRegionsFor', () => {
  it('handles no sizeMode selector and no selectors', () => {
    expect(calculateSelectorsToFindRegionsFor({noOffsetSelectors: [], offsetSelectors: []})).to.be
      .undefined;
    expect(
      calculateSelectorsToFindRegionsFor({
        noOffsetSelectors: [],
        offsetSelectors: [],
        sizeMode: 'bla',
      }),
    ).to.be.undefined;
  });

  it('handles sizeMode selector, but no selectors', () => {
    expect(
      calculateSelectorsToFindRegionsFor({
        noOffsetSelectors: [],
        offsetSelectors: [],
        sizeMode: 'selector',
        selector: 'bla',
      }),
    ).to.eql(['bla']);
  });

  it('handles no sizeMode selector, with no-offset selector', () => {
    expect(
      calculateSelectorsToFindRegionsFor({
        noOffsetSelectors: [{selector: 'bla'}],
        offsetSelectors: [],
      }),
    ).to.eql(['bla']);
  });

  it('handles no sizeMode selector, with no-offset second index selector', () => {
    expect(
      calculateSelectorsToFindRegionsFor({
        noOffsetSelectors: [undefined, {selector: 'bla'}],
        offsetSelectors: [],
      }),
    ).to.eql(['bla']);
  });

  it('handles no sizeMode selector, with no-offset multiple selectors', () => {
    expect(
      calculateSelectorsToFindRegionsFor({
        noOffsetSelectors: [undefined, {selector: 'bla'}, {selector: 'bla2'}],
        offsetSelectors: [],
      }),
    ).to.eql(['bla', 'bla2']);
  });

  it('handles no sizeMode selector, with no-offset array', () => {
    expect(
      calculateSelectorsToFindRegionsFor({
        noOffsetSelectors: [[{selector: 'bla'}], undefined, undefined],
        offsetSelectors: [],
      }),
    ).to.eql(['bla']);
  });

  it('handles no sizeMode selector, with no-offset second index array', () => {
    expect(
      calculateSelectorsToFindRegionsFor({
        noOffsetSelectors: [undefined, [{selector: 'bla'}], undefined],
        offsetSelectors: [],
      }),
    ).to.eql(['bla']);
  });

  it('handles no sizeMode selector, with no-offset multiple arrays', () => {
    expect(
      calculateSelectorsToFindRegionsFor({
        noOffsetSelectors: [[{selector: 'bla'}], undefined, [{selector: 'bla2'}]],
        offsetSelectors: [],
      }),
    ).to.eql(['bla', 'bla2']);
  });

  it('handles no sizeMode selector, with combined no-offset arrays and selectors', () => {
    expect(
      calculateSelectorsToFindRegionsFor({
        noOffsetSelectors: [undefined, [{selector: 'bla'}], {selector: 'bla2'}],
        offsetSelectors: [],
      }),
    ).to.eql(['bla', 'bla2']);
  });

  it('handles no sizeMode selector, with no-offset combined selector and absolute regions', () => {
    expect(
      calculateSelectorsToFindRegionsFor({
        noOffsetSelectors: [
          [{a: 'b'}, {selector: 'bla'}, {c: 'd'}, {selector: 'kuku'}],
          undefined,
          undefined,
        ],
        offsetSelectors: [],
      }),
    ).to.eql(['bla', 'kuku']);
  });

  it('handles no sizeMode selector, with no-offset combined selector and absolute regions', () => {
    expect(
      calculateSelectorsToFindRegionsFor({
        noOffsetSelectors: [
          [{a: 'b'}, {selector: 'bla'}, {c: 'd'}, {selector: 'kuku'}],
          [{a: 'b'}, {selector: 'aaa'}, {c: 'd'}, {selector: 'bbb'}],
          undefined,
        ],
        offsetSelectors: [],
      }),
    ).to.eql(['bla', 'kuku', 'aaa', 'bbb']);
  });

  it('handles no sizeMode selector, with offset-selector', () => {
    expect(
      calculateSelectorsToFindRegionsFor({
        noOffsetSelectors: [undefined, undefined, undefined],
        offsetSelectors: [{selector: 'bla'}],
      }),
    ).to.eql(['bla']);
  });

  it('handles no sizeMode selector, with offset-selector array', () => {
    expect(
      calculateSelectorsToFindRegionsFor({
        noOffsetSelectors: [undefined, undefined, undefined],
        offsetSelectors: [[{selector: 'bla'}]],
      }),
    ).to.eql(['bla']);
  });

  it('handles no sizeMode selector, with offset combined selector and absolute regions', () => {
    expect(
      calculateSelectorsToFindRegionsFor({
        noOffsetSelectors: [undefined, undefined, undefined],
        offsetSelectors: [[{a: 'b'}, {selector: 'bla'}, {c: 'd'}, {selector: 'kuku'}]],
      }),
    ).to.eql(['bla', 'kuku']);
  });

  it('handles no sizeMode selector, no-offset AND offset selectors', () => {
    expect(
      calculateSelectorsToFindRegionsFor({
        noOffsetSelectors: [{selector: 'ignore'}, {selector: 'layout'}, {selector: 'strict'}, {selector: 'content'}],
        offsetSelectors: [{selector: 'float'}],
      }),
    ).to.eql(['ignore', 'layout', 'strict', 'content', 'float']);
  });

  it('handles sizeMode selector, with no-offset AND offset selectors', () => {
    expect(
      calculateSelectorsToFindRegionsFor({
        sizeMode: 'selector',
        selector: 'selector',
        noOffsetSelectors: [{selector: 'ignore'}, {selector: 'layout'}, {selector: 'strict'}, {selector: 'content'}],
        offsetSelectors: [{selector: 'float'}],
      }),
    ).to.eql(['selector', 'ignore', 'layout', 'strict', 'content', 'float']);
  });

  it('handles no sizeMode selector, with no-offset selector AND offset selector *arrays* (including duplicates)', () => {
    expect(
      calculateSelectorsToFindRegionsFor({
        noOffsetSelectors: [
          [{a: 'b'}, {selector: 'bla'}, {c: 'd'}, {selector: 'kuku'}, {selector: 'ignore'}],
          [{a: 'b'}, {selector: 'bla'}, {c: 'd'}, {selector: 'layout'}],
          [{a: 'b'}, {selector: 'bla'}, {c: 'd'}, {selector: 'strict'}],
          [{a: 'b'}, {selector: 'bla'}, {c: 'd'}, {selector: 'content'}]
        ],
        offsetSelectors: [
          [{a: 'b'}, {selector: 'bla'}, {c: 'd'}, {selector: 'kuku'}, {selector: 'float'}],
        ],
      }),
    ).to.eql(['bla', 'kuku', 'ignore', 'bla', 'layout', 'bla', 'strict', 'bla', 'content', 'bla', 'kuku', 'float']);
  });

  it('handles sizeMode selector, with no-offset selector AND offset selector *arrays* (including duplicates)', () => {
    expect(
      calculateSelectorsToFindRegionsFor({
        noOffsetSelectors: [
          [{a: 'b'}, {selector: 'bla'}, {c: 'd'}, {selector: 'kuku'}, {selector: 'ignore'}],
          {selector: 'layout'},
          [{selector: 'strict'}, {selector: 'yo'}, {d: 'g'}],
          [{selector: 'content'}],
        ],
        offsetSelectors: [
          [{a: 'b'}, {selector: 'bla'}, {c: 'd'}, {selector: 'kuku'}, {selector: 'float'}],
        ],
        sizeMode: 'selector',
        selector: 'selector',
      }),
    ).to.eql([
      'selector',
      'bla',
      'kuku',
      'ignore',
      'layout',
      'strict',
      'yo',
      'content',
      'bla',
      'kuku',
      'float',
    ]);
  });
});
