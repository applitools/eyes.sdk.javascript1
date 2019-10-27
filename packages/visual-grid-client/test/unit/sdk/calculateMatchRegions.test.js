'use strict';

const {describe, it} = require('mocha');
const {expect} = require('chai');
const calculateMatchRegions = require('../../../src/sdk/calculateMatchRegions');

describe('calculateMatchRegions', () => {
  it('handles null ignore regions', () => {
    const {
      noOffsetRegions: [ignoreRegions, layoutRegions, strictRegions, contentRegions],
      offsetRegions: [floatingRegions],
    } = calculateMatchRegions({
      noOffsetSelectors: [undefined, undefined, undefined, undefined],
      offsetSelectors: [undefined],
    });
    expect(ignoreRegions).to.be.undefined;
    expect(floatingRegions).to.be.undefined;
    expect(layoutRegions).to.be.undefined;
    expect(strictRegions).to.be.undefined;
    expect(contentRegions).to.be.undefined;
  });

  it('handles non-selector no-offset ignore regions', () => {
    const ignore = ['bla'];
    expect(
      calculateMatchRegions({
        noOffsetSelectors: [ignore, undefined, undefined],
        offsetSelectors: [undefined],
      }),
    ).to.eql({
      noOffsetRegions: [ignore, undefined, undefined],
      offsetRegions: [undefined],
    });
  });

  it('handles single no-offset region', () => {
    const ignore = {bla: 'kuku'};
    expect(
      calculateMatchRegions({
        noOffsetSelectors: [ignore, undefined, undefined],
        offsetSelectors: [undefined],
      }),
    ).to.eql({
      noOffsetRegions: [[ignore], undefined, undefined],
      offsetRegions: [undefined],
    });
  });

  it('handles single no-offset region with type', () => {
    const accessibility = {bla: 'kuku', accessibilityType: 'RegularText'};
    expect(
      calculateMatchRegions({
        noOffsetSelectors: [undefined, undefined, undefined, accessibility],
        offsetSelectors: [undefined],
      }),
    ).to.eql({
      noOffsetRegions: [undefined, undefined, undefined, [accessibility]],
      offsetRegions: [undefined],
    });
  });

  it('handles single no-offset with order region', () => {
    const ignore = {bla: 'kuku'};
    const layout = {bla: 'kuku'};
    const content = {bla: 'kuku'};
    expect(
      calculateMatchRegions({
        noOffsetSelectors: [ignore, undefined, layout, content],
        offsetSelectors: [undefined],
      }),
    ).to.eql({
      noOffsetRegions: [[ignore], undefined, [layout], [content]],
      offsetRegions: [undefined],
    });
  });

  it('handles single no-offset with order region and types', () => {
    const a1 = {bla: 'kuku', accessibilityType: 'LargeText'};
    const a2 = {bla: 'kuku', accessibilityType: 'RegularText'};
    expect(
      calculateMatchRegions({
        noOffsetSelectors: [undefined, undefined, a2, a1],
        offsetSelectors: [undefined],
      }),
    ).to.eql({
      noOffsetRegions: [undefined, undefined, [a2], [a1]],
      offsetRegions: [undefined],
    });
  });

  it('handles no-offset exact region with order region and types', () => {
    const a1 = {top: 100, left: 0, width: 1000, height: 100, accessibilityType: 'LargeText'};
    const a2 = {top: 2, left: 2, width: 2, height: 2, accessibilityType: 'RegularText'};
    expect(
      calculateMatchRegions({
        noOffsetSelectors: [undefined, undefined, a1, a2],
        offsetSelectors: [undefined],
      }),
    ).to.eql({
      noOffsetRegions: [undefined, undefined, [a1], [a2]],
      offsetRegions: [undefined],
    });
  });

  it('handles single offset region', () => {
    const floating = {bla: 'kuku'};
    expect(
      calculateMatchRegions({
        noOffsetSelectors: [undefined, undefined, undefined],
        offsetSelectors: [floating],
      }),
    ).to.eql({
      noOffsetRegions: [undefined, undefined, undefined],
      offsetRegions: [[floating]],
    });
  });

  it('handles offset region with order', () => {
    const floating = {bla: 'kuku'};
    const whatever = {bla: 'whatever'};
    expect(
      calculateMatchRegions({
        noOffsetSelectors: [undefined, undefined, undefined],
        offsetSelectors: [whatever, floating],
      }),
    ).to.eql({
      noOffsetRegions: [undefined, undefined, undefined],
      offsetRegions: [[whatever], [floating]],
    });
  });

  it('handles single no-offset region in middle of array with order', () => {
    const layout = {bla: 'kuku'};
    expect(
      calculateMatchRegions({
        noOffsetSelectors: [undefined, layout, undefined],
        offsetSelectors: [undefined],
      }),
    ).to.eql({
      noOffsetRegions: [undefined, [layout], undefined],
      offsetRegions: [undefined],
    });
  });

  it('handles no-offset regions without image offset', () => {
    const ignore = [{selector: 'bla'}, {selector: 'kuku'}];
    const layout = [{selector: 'bla2'}];
    const strict = [{selector: 'bla3'}, {selector: 'kuku3'}];
    const selectorRegions = [
      {toJSON: () => 'aaa'},
      {toJSON: () => 'bbb'},
      {toJSON: () => 'ccc'},
      {toJSON: () => 'ddd'},
      {toJSON: () => 'eee'},
    ];
    selectorRegions.forEach(r => (r.getError = () => {}));
    expect(
      calculateMatchRegions({
        noOffsetSelectors: [ignore, layout, strict],
        offsetSelectors: [undefined],
        selectorRegions,
      }),
    ).to.eql({
      noOffsetRegions: [['aaa', 'bbb'], ['ccc'], ['ddd', 'eee']],
      offsetRegions: [undefined],
    });
  });

  it('handles selector offset-regions without image offset', () => {
    const offset = x => ({
      maxUpOffset: x + 1,
      maxDownOffset: x + 2,
      maxRightOffset: x + 3,
      maxLeftOffset: x + 4,
    });
    const floating = [{selector: 'bla'}, {selector: 'kuku'}].map((x, i) =>
      Object.assign(x, offset(i)),
    );
    const selectorRegions = [{toJSON: () => ({bla: 'aaa'})}, {toJSON: () => ({kuku: 'bbb'})}];
    selectorRegions.forEach(r => (r.getError = () => {}));
    expect(
      calculateMatchRegions({
        offsetSelectors: [floating],
        noOffsetSelectors: [undefined, undefined, undefined],
        selectorRegions,
      }),
    ).to.eql({
      noOffsetRegions: [undefined, undefined, undefined],
      offsetRegions: [[{bla: 'aaa'}, {kuku: 'bbb'}].map((x, i) => Object.assign(x, offset(i)))],
    });
  });

  it('handles non-offset regions *with* image offset', () => {
    const ignore = [{selector: 'bla'}];
    const layout = [{selector: 'bla2'}];
    const strict = [{selector: 'bla3'}];
    const content = [{selector: 'bla4'}];
    const selectorRegions = [
      undefined,
      {getLeft: () => 1, getTop: () => 2, getWidth: () => 3, getHeight: () => 4},
      {getLeft: () => 1, getTop: () => 2, getWidth: () => 4, getHeight: () => 4},
      {getLeft: () => 1, getTop: () => 2, getWidth: () => 5, getHeight: () => 4},
      {getLeft: () => 11, getTop: () => 22, getWidth: () => 55, getHeight: () => 44},
    ];
    selectorRegions.forEach(r => r && (r.getError = () => {}));
    const imageLocationRegion = {getLeft: () => 1, getTop: () => 2};

    expect(
      calculateMatchRegions({
        noOffsetSelectors: [ignore, layout, strict, content],
        offsetSelectors: [undefined],
        selectorRegions,
        imageLocationRegion,
      }),
    ).to.eql({
      noOffsetRegions: [
        [
          {
            width: 3,
            height: 4,
            left: 0,
            top: 0,
          },
        ],
        [
          {
            width: 4,
            height: 4,
            left: 0,
            top: 0,
          },
        ],
        [
          {
            width: 5,
            height: 4,
            left: 0,
            top: 0,
          },
        ],
        [
          {
            height: 44,
            left: 10,
            top: 20,
            width: 55,
          },
        ],
      ],
      offsetRegions: [undefined],
    });
  });

  it('handles selector non-offset regions *with* image offset, correcting negative coordinates in output', () => {
    const ignore = [{selector: 'bla'}];
    const layout = [{selector: 'bla2'}];
    const strict = [{selector: 'bla3'}];
    const content = [{selector: 'bla4'}];
    const selectorRegions = [
      undefined,
      {getLeft: () => 1, getTop: () => 2, getWidth: () => 3, getHeight: () => 4},
      {getLeft: () => 2, getTop: () => 2, getWidth: () => 3, getHeight: () => 4},
      {getLeft: () => 0, getTop: () => 2, getWidth: () => 3, getHeight: () => 4},
      {getLeft: () => 10, getTop: () => 20, getWidth: () => 30, getHeight: () => 40},
    ];
    selectorRegions.forEach(r => r && (r.getError = () => {}));
    const imageLocationRegion = {getLeft: () => 3, getTop: () => 4};

    expect(
      calculateMatchRegions({
        noOffsetSelectors: [ignore, layout, strict, content],
        offsetSelectors: [undefined],
        selectorRegions,
        imageLocationRegion,
      }),
    ).to.eql({
      noOffsetRegions: [
        [
          {
            width: 3,
            height: 4,
            left: 0,
            top: 0,
          },
        ],
        [
          {
            width: 3,
            height: 4,
            left: 0,
            top: 0,
          },
        ],
        [
          {
            width: 3,
            height: 4,
            left: 0,
            top: 0,
          },
        ],
        [
          {
            height: 40,
            left: 7,
            top: 16,
            width: 30,
          },
        ],
      ],
      offsetRegions: [undefined],
    });
  });

  it('handles combined non-selector non-offset regions and normal non-offset regions', () => {
    const ignore = ['kuku', {selector: 'bla'}, 'bubu', {selector: 'clams'}];
    const layout = [{selector: 'bla2'}, 'kuku2', 'bubu2', {selector: 'clams2'}];
    const strict = [{selector: 'bla3'}, {selector: 'clams3'}, 'kuku3'];
    const content = [{selector: 'bla4'}, 'kuku3'];
    const selectorRegions = [
      {toJSON: () => 'aaa'},
      {toJSON: () => 'bbb'},
      {toJSON: () => 'ccc'},
      {toJSON: () => 'ddd'},
      {toJSON: () => 'eee'},
      {toJSON: () => 'fff'},
      {toJSON: () => 'ggg'},
    ];
    selectorRegions.forEach(r => (r.getError = () => {}));

    expect(
      calculateMatchRegions({
        noOffsetSelectors: [ignore, layout, strict, content],
        offsetSelectors: [undefined],
        selectorRegions,
      }),
    ).to.eql({
      noOffsetRegions: [
        ['kuku', 'aaa', 'bubu', 'bbb'],
        ['ccc', 'kuku2', 'bubu2', 'ddd'],
        ['eee', 'fff', 'kuku3'],
        ['ggg', 'kuku3'],
      ],
      offsetRegions: [undefined],
    });
  });

  it('handles offset and non-offset regions', () => {
    const offset = x => ({
      maxUpOffset: x + 1,
      maxDownOffset: x + 2,
      maxRightOffset: x + 3,
      maxLeftOffset: x + 4,
    });
    const ignore = ['kuku', {selector: 'bla'}, 'bubu', {selector: 'clams'}];
    const layout = [{selector: 'bla2'}, 'bubu2'];
    const strict = ['kuku2', {selector: 'bla'}, 'bubu3', 'dudu3', {selector: 'bla'}];
    const content = [{selector: 'blaaa'}, 'aaa3'];
    const floating = [{kuku: 'kuku'}, {selector: 'bla'}, {bubu: 'bubu'}, {selector: 'clams'}].map(
      (x, i) => Object.assign(x, offset(i)),
    );
    const selectorRegions = [
      {toJSON: () => 'aaa'},
      {toJSON: () => 'bbb'},
      {toJSON: () => 'ccc'},
      {toJSON: () => 'ddd'},
      {toJSON: () => 'eee'},
      {toJSON: () => 'fff'},
      {toJSON: () => ({one: 'ggg'})},
      {toJSON: () => ({two: 'hhh'})},
    ];
    selectorRegions.forEach(r => (r.getError = () => {}));
    expect(
      calculateMatchRegions({
        noOffsetSelectors: [ignore, layout, strict, content],
        offsetSelectors: [floating],
        selectorRegions,
      }),
    ).to.eql({
      noOffsetRegions: [
        ['kuku', 'aaa', 'bubu', 'bbb'],
        ['ccc', 'bubu2'],
        ['kuku2', 'ddd', 'bubu3', 'dudu3', 'eee'],
        ['fff', 'aaa3'],
      ],
      offsetRegions: [
        [{kuku: 'kuku'}, {one: 'ggg'}, {bubu: 'bubu'}, {two: 'hhh'}].map((x, i) =>
          Object.assign(x, offset(i)),
        ),
      ],
    });
  });
});
