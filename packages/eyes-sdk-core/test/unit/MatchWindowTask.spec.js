'use strict';

const assert = require('assert');
const { MatchWindowTask, CheckSettings, EyesBase } = require('../../index');

describe('MatchWindowTask', () => {
  const eyes = new EyesBase();
  const task = new MatchWindowTask(true, true, true, true, eyes, true);

  describe('createImageMatchSettings', () => {
    const checkSettings = new CheckSettings();

    it('should return correct default values', async () => {
      const ms = await task.createImageMatchSettings(checkSettings, null);
      const expectedSerialization = '{"matchLevel":"Strict","accessibilityLevel":"None","ignoreCaret":false,"useDom":false,"enablePatterns":false,' +
        '"ignoreDisplacements":false,"exact":null,"ignore":[],"layout":[],"strict":[],"content":[],"accessibility":[],"floating":[]}';
      assert.strictEqual(JSON.stringify(ms), expectedSerialization, 'ImageMatchSettings serialization does not match!');
    });
  });
});
