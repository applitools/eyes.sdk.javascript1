'use strict';
const {
  Region,
  IgnoreRegionByRectangle,
  FloatingRegionByRectangle,
} = require('@applitools/eyes-sdk-core');
const {describe, it} = require('mocha');
const {expect} = require('chai');
const createCheckSettings = require('../../../src/sdk/createCheckSettings');

describe('createCheckSettings', () => {
  it('handles single ignore region', () => {
    const checkSettings = createCheckSettings({ignore: {left: 1, top: 2, width: 3, height: 4}});
    expect(checkSettings.getIgnoreRegions()).to.eql([
      new IgnoreRegionByRectangle(new Region({left: 1, top: 2, width: 3, height: 4})),
    ]);
  });

  it('handles single layout region', () => {
    const checkSettings = createCheckSettings({layout: {left: 1, top: 2, width: 3, height: 4}});
    expect(checkSettings.getLayoutRegions()).to.eql([
      new IgnoreRegionByRectangle(new Region({left: 1, top: 2, width: 3, height: 4})),
    ]);
  });

  it('handles single strict region', () => {
    const checkSettings = createCheckSettings({strict: {left: 1, top: 2, width: 3, height: 4}});
    expect(checkSettings.getStrictRegions()).to.eql([
      new IgnoreRegionByRectangle(new Region({left: 1, top: 2, width: 3, height: 4})),
    ]);
  });

  it('handles strict, layout and ignore regions', () => {
    const checkSettings = createCheckSettings({
      strict: {left: 1, top: 2, width: 3, height: 4},
      layout: {left: 5, top: 6, width: 7, height: 8},
      ignore: {left: 9, top: 10, width: 11, height: 12},
    });
    expect(checkSettings.getStrictRegions()).to.eql([
      new IgnoreRegionByRectangle(new Region({left: 1, top: 2, width: 3, height: 4})),
    ]);
    expect(checkSettings.getLayoutRegions()).to.eql([
      new IgnoreRegionByRectangle(new Region({left: 5, top: 6, width: 7, height: 8})),
    ]);
    expect(checkSettings.getIgnoreRegions()).to.eql([
      new IgnoreRegionByRectangle(new Region({left: 9, top: 10, width: 11, height: 12})),
    ]);
  });

  it('handles multiple ignore regions', () => {
    const ignore = [{left: 1, top: 2, width: 3, height: 4}, {left: 5, top: 6, width: 7, height: 8}];
    const expected = ignore.map(region => new IgnoreRegionByRectangle(new Region(region)));
    const checkSettings = createCheckSettings({ignore});
    expect(checkSettings.getIgnoreRegions()).to.eql(expected);
  });

  it('handles multiple layout regions', () => {
    const layout = [{left: 1, top: 2, width: 3, height: 4}, {left: 5, top: 6, width: 7, height: 8}];
    const expected = layout.map(region => new IgnoreRegionByRectangle(new Region(region)));
    const checkSettings = createCheckSettings({layout});
    expect(checkSettings.getLayoutRegions()).to.eql(expected);
  });

  it('handles multiple strict regions', () => {
    const strict = [{left: 1, top: 2, width: 3, height: 4}, {left: 5, top: 6, width: 7, height: 8}];
    const expected = strict.map(region => new IgnoreRegionByRectangle(new Region(region)));
    const checkSettings = createCheckSettings({strict});
    expect(checkSettings.getStrictRegions()).to.eql(expected);
  });

  it('handles multiple strict, layout and ignore regions', () => {
    const strict = [{left: 1, top: 2, width: 3, height: 4}, {left: 5, top: 6, width: 7, height: 8}];
    const layout = [
      {left: 10, top: 20, width: 30, height: 40},
      {left: 50, top: 60, width: 70, height: 80},
    ];
    const ignore = [
      {left: 100, top: 200, width: 300, height: 400},
      {left: 500, top: 600, width: 700, height: 800},
    ];
    const expectedStrict = strict.map(region => new IgnoreRegionByRectangle(new Region(region)));
    const expectedLayout = layout.map(region => new IgnoreRegionByRectangle(new Region(region)));
    const expectedIgnore = ignore.map(region => new IgnoreRegionByRectangle(new Region(region)));
    const checkSettings = createCheckSettings({strict, layout, ignore});
    expect(checkSettings.getStrictRegions()).to.eql(expectedStrict);
    expect(checkSettings.getIgnoreRegions()).to.eql(expectedIgnore);
    expect(checkSettings.getLayoutRegions()).to.eql(expectedLayout);
  });

  it('throws on non-region ignore input', async () => {
    const err = await Promise.resolve()
      .then(() => createCheckSettings({ignore: 'bla'}))
      .then(x => x, err => err);
    expect(err).to.be.an.instanceof(Error);
  });

  it('throws on non-region layout input', async () => {
    const err = await Promise.resolve()
      .then(() => createCheckSettings({layout: 'bla'}))
      .then(x => x, err => err);
    expect(err).to.be.an.instanceof(Error);
  });

  it('throws on non-region strict input', async () => {
    const err = await Promise.resolve()
      .then(() => createCheckSettings({strict: 'bla'}))
      .then(x => x, err => err);
    expect(err).to.be.an.instanceof(Error);
  });

  it('handles single floating region', () => {
    const checkSettings = createCheckSettings({
      floating: {
        left: 1,
        top: 2,
        width: 3,
        height: 4,
        maxUpOffset: 5,
        maxDownOffset: 6,
        maxLeftOffset: 7,
        maxRightOffset: 8,
      },
    });
    expect(checkSettings.getFloatingRegions()).to.eql([
      new FloatingRegionByRectangle(new Region({left: 1, top: 2, width: 3, height: 4}), 5, 6, 7, 8),
    ]);
  });

  it('handles multiple floating regions', () => {
    const floating = [
      {
        left: 1,
        top: 2,
        width: 3,
        height: 4,
        maxUpOffset: 5,
        maxDownOffset: 6,
        maxLeftOffset: 7,
        maxRightOffset: 8,
      },
      {
        left: 10,
        top: 11,
        width: 12,
        height: 13,
        maxUpOffset: 14,
        maxDownOffset: 15,
        maxLeftOffset: 16,
        maxRightOffset: 17,
      },
    ];
    const expected = floating.map(
      region =>
        new FloatingRegionByRectangle(
          new Region(region),
          region.maxUpOffset,
          region.maxDownOffset,
          region.maxLeftOffset,
          region.maxRightOffset,
        ),
    );
    const checkSettings = createCheckSettings({floating});
    expect(checkSettings.getFloatingRegions()).to.eql(expected);
  });

  it('handles multiple floating, layout, strict and ignore regions', () => {
    const floating = [
      {
        left: 1,
        top: 2,
        width: 3,
        height: 4,
        maxUpOffset: 5,
        maxDownOffset: 6,
        maxLeftOffset: 7,
        maxRightOffset: 8,
      },
      {
        left: 10,
        top: 11,
        width: 12,
        height: 13,
        maxUpOffset: 14,
        maxDownOffset: 15,
        maxLeftOffset: 16,
        maxRightOffset: 17,
      },
    ];
    const expected = floating.map(
      region =>
        new FloatingRegionByRectangle(
          new Region(region),
          region.maxUpOffset,
          region.maxDownOffset,
          region.maxLeftOffset,
          region.maxRightOffset,
        ),
    );

    const strict = [{left: 1, top: 2, width: 3, height: 4}, {left: 5, top: 6, width: 7, height: 8}];
    const layout = [
      {left: 10, top: 20, width: 30, height: 40},
      {left: 50, top: 60, width: 70, height: 80},
    ];
    const ignore = [
      {left: 100, top: 200, width: 300, height: 400},
      {left: 500, top: 600, width: 700, height: 800},
    ];
    const expectedStrict = strict.map(region => new IgnoreRegionByRectangle(new Region(region)));
    const expectedLayout = layout.map(region => new IgnoreRegionByRectangle(new Region(region)));
    const expectedIgnore = ignore.map(region => new IgnoreRegionByRectangle(new Region(region)));
    const checkSettings = createCheckSettings({floating, layout, ignore, strict});
    expect(checkSettings.getFloatingRegions()).to.eql(expected);
    expect(checkSettings.getIgnoreRegions()).to.eql(expectedIgnore);
    expect(checkSettings.getLayoutRegions()).to.eql(expectedLayout);
    expect(checkSettings.getStrictRegions()).to.eql(expectedStrict);
  });

  it('throws on non-region floating input', async () => {
    const err = await Promise.resolve()
      .then(() => createCheckSettings({floating: 'bla'}))
      .then(x => x, err => err);
    expect(err).to.be.an.instanceof(Error);
  });

  it('handles useDom and enablePatterns', () => {
    let checkSettings = createCheckSettings({useDom: true, enablePatterns: false});
    expect(checkSettings.getUseDom()).to.be.true;
    expect(checkSettings.getEnablePatterns()).to.be.false;

    checkSettings = createCheckSettings({});
    expect(checkSettings.getUseDom()).to.be.undefined;
    expect(checkSettings.getEnablePatterns()).to.be.undefined;
  });
});
