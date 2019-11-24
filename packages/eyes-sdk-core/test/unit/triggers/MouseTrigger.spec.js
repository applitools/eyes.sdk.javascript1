'use strict';

const assert = require('assert');
const { MouseTrigger, Region, Location } = require('../../../index');

describe('MouseTrigger', () => {
  it('TestMouseTrigger1', async () => {
    const control = new Region(1, 2, 3, 4);
    const loc = new Location(5, 6);
    let mt = new MouseTrigger(MouseTrigger.MouseAction.Click, control, loc);

    assert.deepStrictEqual(control, mt.getControl());
    assert.deepStrictEqual(loc, mt.getLocation());
    assert.strictEqual(MouseTrigger.MouseAction.Click, mt.getMouseAction());

    mt = new MouseTrigger(MouseTrigger.MouseAction.DoubleClick, Region.EMPTY, loc);
  });

  it('TestMouseTrigger2', async () => {
    const control = new Region(1, 2, 3, 4);

    assert.throws(() => {
      const mt = new MouseTrigger(MouseTrigger.MouseAction.Click, control, null);
    });
  });
});
