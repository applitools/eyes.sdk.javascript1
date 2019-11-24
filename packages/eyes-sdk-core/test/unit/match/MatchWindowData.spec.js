'use strict';

const assert = require('assert');

const { MatchWindowData, MouseTrigger, AppOutput, Region, Location, ImageMatchSettings, ImageMatchOptions } = require('../../../index');

describe('MatchWindowData', () => {
  let trigger_, appOut_;
  before(() => {
    trigger_ = new MouseTrigger(MouseTrigger.MouseAction.Click, new Region(0, 0, 0, 0), new Location(0, 0));
    appOut_ = new AppOutput({ title: 'Dummy', screenshot: 'blob as base64', screenshotUrl: 'bla', imageLocation: new Location(20, 40) });
  });

  it('constructor without arguments', () => {
    const mwd = new MatchWindowData({ appOutput: appOut_, tag: 'mytag' });
    const ims = new ImageMatchSettings();
    mwd._options = new ImageMatchOptions({ userInputs: ims });
    mwd._options._userInputs = [trigger_];
    assert.strictEqual(appOut_, mwd.getAppOutput());
    assert.deepStrictEqual([trigger_], mwd.getOptions().getUserInputs());
    assert.strictEqual('mytag', mwd.getTag());
    assert.throws(() => new MatchWindowData({ tag: 'tag' }));
  });
});
