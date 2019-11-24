'use strict';
const {describe, it} = require('mocha');
const {expect} = require('chai');
const makeGlobalState = require('../../../src/sdk/globalState');
const testLogger = require('../../util/testLogger');

describe('globalState', () => {
  it('waits for queued renders', async () => {
    const {getQueuedRendersCount, setQueuedRendersCount, waitForQueuedRenders} = makeGlobalState({
      logger: testLogger,
    });
    expect(getQueuedRendersCount()).to.equal(0);

    setQueuedRendersCount(1);

    expect(getQueuedRendersCount()).to.equal(1);

    let resolved1, resolved2;
    waitForQueuedRenders(0).then(() => (resolved1 = true));
    waitForQueuedRenders(0).then(() => (resolved2 = true));

    setQueuedRendersCount(1);
    expect(resolved1).to.be.undefined;
    expect(resolved2).to.be.undefined;
    setQueuedRendersCount(0);
    await Promise.resolve();
    expect(resolved1).to.equal(true);
    setQueuedRendersCount(0);
    await Promise.resolve();
    expect(resolved1).to.equal(true);
    expect(resolved2).to.equal(true);
  });
});
