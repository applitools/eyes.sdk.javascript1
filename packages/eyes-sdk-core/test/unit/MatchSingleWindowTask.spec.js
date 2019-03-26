'use strict';

const assert = require('assert');
const { MatchSingleWindowTask, CheckSettings, ImageMatchSettings } = require('../../index');

describe('MatchSingleWindowTask', () => {
  const eyes = {getDefaultMatchSettings: () => new ImageMatchSettings({ useDom: true, enablePatterns: false })};
  const task = new MatchSingleWindowTask(true, true, true, eyes, true, true, true);

  describe('createImageMatchSettings', () => {
    const checkSettings = new CheckSettings();

    it('should return correct default values', async () => {
      const ms = await task.createImageMatchSettings(checkSettings, null)
      const expectedSerialization = '{"matchLevel":"Strict","exact":null,"ignoreCaret":false,"useDom":true,' +
        '"enablePatterns":false,"ignore":[],"layout":[],"strict":[],"content":[],"floating":[]}';
      assert.strictEqual(JSON.stringify(ms), expectedSerialization, 'ImageMatchSettings serialization does not match!');
    });
  });
});
