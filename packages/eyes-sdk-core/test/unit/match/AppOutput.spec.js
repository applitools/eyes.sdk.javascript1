'use strict';

const assert = require('assert');

const { AppOutput, Location } = require('../../../index');

describe('AppOutput', () => {
  it('constructor without arguments', () => {
    const ao = new AppOutput({
      title: 'title',
      imageLocation: new Location(10, 30),
      screenshot: 'some fake base64 screenshot serialized',
      screenshotUrl: 'abc',
    });
    assert.strictEqual('title', ao.getTitle());
    assert.deepStrictEqual(new Location(10, 30), ao.getImageLocation());
    assert.strictEqual('some fake base64 screenshot serialized', ao.getScreenshot64());
    assert.strictEqual('abc', ao.getScreenshotUrl());
  });
});
