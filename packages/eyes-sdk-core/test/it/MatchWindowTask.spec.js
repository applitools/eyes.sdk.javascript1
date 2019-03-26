'use strict';

const assert = require('assert');
const { MatchWindowTask, CheckSettings, EyesBase } = require('../../index');

describe('MatchWindowTask', () => {
  const eyes = new EyesBase();
  const task = new MatchWindowTask(true, true, true, true, eyes, true);

  describe('createImageMatchSettings', () => {
    const checkSettings = new CheckSettings();

    it('should return correct default values', async () => {
      const ms = await task.createImageMatchSettings(checkSettings, null)
      const expectedSerialization = '{"matchLevel":"Strict","exact":null,"ignoreCaret":false,' +
        '"useDom":false,"enablePatterns":false,"ignore":[],"layout":[],"strict":[],"content":[],"floating":[]}';
      assert.strictEqual(JSON.stringify(ms), expectedSerialization, 'ImageMatchSettings serialization does not match!');
    });
  });
});
