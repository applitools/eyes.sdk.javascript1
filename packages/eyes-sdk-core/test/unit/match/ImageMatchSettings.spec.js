'use strict';

const assert = require('assert');

const { ImageMatchSettings, ExactMatchSettings, MatchLevel, Region } = require('../../../index');

describe('ImageMatchSettings', () => {
  describe('toJSON()', () => {
    it('empty instance', () => {
      const ims = new ImageMatchSettings();
      const expectedSerialization = '{"matchLevel":"Strict","ignore":[],"layout":[],"strict":[],' +
        '"content":[],"floating":[]}';
      assert.strictEqual(JSON.stringify(ims), expectedSerialization, 'ImageMatchSettings serialization does not match!');
    });

    it('with modified exact and ignore caret', () => {
      const ims = new ImageMatchSettings({ matchLevel: MatchLevel.Content, exact: new ExactMatchSettings(), ignoreCaret: true });
      const expectedSerialization = '{"matchLevel":"Content","exact":{"minDiffIntensity":0,"minDiffWidth":0,' +
        '"minDiffHeight":0,"matchThreshold":0},"ignoreCaret":true,"ignore":[],"layout":[],"strict":[],' +
        '"content":[],"floating":[]}';
      assert.strictEqual(JSON.stringify(ims), expectedSerialization, 'ImageMatchSettings serialization does not match!');
    });

    it('with ignore regions', () => {
      const ims = new ImageMatchSettings();
      ims.setIgnoreRegions([new Region(10, 20, 30, 40)]);
      const expectedSerialization = '{"matchLevel":"Strict","ignore":[{"left":10,"top":20,"width":30,"height":40,' +
        '"coordinatesType":"SCREENSHOT_AS_IS"}],"layout":[],"strict":[],"content":[],"floating":[]}';
      assert.strictEqual(JSON.stringify(ims), expectedSerialization, 'ImageMatchSettings serialization does not match!');
    });

    it('with modified useDom and enablePatterns', () => {
      const ims = new ImageMatchSettings({ useDom: true, enablePatterns: false });
      const expectedSerialization = '{"matchLevel":"Strict","useDom":true,"enablePatterns":false,' +
        '"ignore":[],"layout":[],"strict":[],"content":[],"floating":[]}';
      assert.strictEqual(JSON.stringify(ims), expectedSerialization, 'ImageMatchSettings serialization does not match!');
    });
  });
});
