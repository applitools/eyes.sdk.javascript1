'use strict';

const assert = require('assert');

const { MatchResult } = require('../../../index');

describe('MatchResult', () => {
  it('constructor without arguments', () => {
    const mr = new MatchResult();
    assert.strictEqual(mr.getAsExpected(), undefined);
    assert.strictEqual(mr.getWindowId(), undefined);

    mr.setWindowId('dummy win id');
    mr.setAsExpected(true);

    assert.strictEqual(mr.getWindowId(), 'dummy win id');
    assert.strictEqual(mr.getAsExpected(), true);
  });
});
