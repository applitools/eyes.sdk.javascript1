'use strict';

const assert = require('assert');
const { AppEnvironment, RectangleSize } = require('../../index');

describe('AppEnvironment', () => {
  it('constructor without arguments', async () => {
    let ae = new AppEnvironment();
    assert.strictEqual(ae.getDisplaySize(), undefined);
    assert.strictEqual(ae.getHostingApp(), undefined);
    assert.strictEqual(ae.getOs(), undefined);

    ae.setDisplaySize(new RectangleSize(10, 100));
    assert.deepStrictEqual(ae.getDisplaySize(), new RectangleSize(10, 100));

    ae.setHostingApp('Testing app');
    assert.strictEqual(ae.getHostingApp(), 'Testing app');

    ae.setOs('Some OS');
    assert.strictEqual(ae.getOs(), 'Some OS');

    ae = new AppEnvironment({ os: 'p1', hostingApp: 'p2', displaySize: new RectangleSize(1, 1) });
    assert.strictEqual('p1', ae.getOs());
    assert.strictEqual('p2', ae.getHostingApp());
    assert.deepStrictEqual(new RectangleSize(1, 1), ae.getDisplaySize());
  });

  it('toString()', async () => {
    let ae = new AppEnvironment({ os: 'p1', hostingApp: 'p2', displaySize: new RectangleSize(1, 1) });
    assert.deepStrictEqual(`${ae}`, "[OS = 'p1' HostingApp = 'p2' DisplaySize = 1x1]");
    ae = new AppEnvironment({ os: null, hostingApp: null, displaySize: new RectangleSize(2, 2) });
    assert.deepStrictEqual(`${ae}`, '[OS = ? HostingApp = ? DisplaySize = 2x2]');
  });
});
