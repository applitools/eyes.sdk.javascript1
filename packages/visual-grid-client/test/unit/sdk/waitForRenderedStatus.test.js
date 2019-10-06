'use strict';
const {describe, it} = require('mocha');
const {expect} = require('chai');
const makeWaitForRenderedStatus = require('../../../src/sdk/waitForRenderedStatus');
const {failMsg} = makeWaitForRenderedStatus;
const {RenderStatus, RenderStatusResults} = require('@applitools/eyes-sdk-core');
const testLogger = require('../../util/testLogger');
const psetTimeout = require('util').promisify(setTimeout);
const {presult} = require('@applitools/functional-commons');

describe('waitForRenderedStatus', () => {
  it('returns rendered result', async () => {
    const expectedStatus = new RenderStatusResults({status: RenderStatus.RENDERED});
    const waitForRenderedStatus = makeWaitForRenderedStatus({
      logger: testLogger,
      getRenderStatus: async () => expectedStatus,
    });
    const status = await waitForRenderedStatus('render1');
    expect(status).to.eql(expectedStatus.toJSON());
  });

  it('polls until rendered', async () => {
    let counter = 0;

    const waitForRenderedStatus = makeWaitForRenderedStatus({
      logger: testLogger,
      getRenderStatus: async () => {
        counter++;
        await psetTimeout(100);
        if (counter < 3) {
          return new RenderStatusResults({status: RenderStatus.RENDERING});
        } else {
          return new RenderStatusResults({status: RenderStatus.RENDERED});
        }
      },
    });

    const notYetPromise = Promise.race([
      presult(
        waitForRenderedStatus('render1').then(status => {
          expect(status).to.eql(new RenderStatusResults({status: RenderStatus.RENDERED}));
        }),
      ),
      psetTimeout(150).then(() => 'not yet'),
    ]);
    expect(counter).to.equal(1);
    await psetTimeout(150);
    expect(counter).to.equal(2);
    await psetTimeout(100);
    expect(counter).to.equal(3);
    expect(await notYetPromise).to.equal('not yet');
  });

  it('stops polling when stop condition is met', async () => {
    let stop = false;
    psetTimeout(50).then(() => (stop = true));
    const expectedStatus = new RenderStatusResults({status: RenderStatus.RENDERING}); // this is important, because of the stop condition we will get a result of RENDERING
    const waitForRenderedStatus = makeWaitForRenderedStatus({
      logger: testLogger,
      getRenderStatus: async () => {
        await psetTimeout(50);
        return expectedStatus;
      },
    });
    const [err, _status] = await presult(waitForRenderedStatus('render1', () => stop));
    expect(err).to.be.an.instanceOf(Error);
    expect(err.message).to.equal('aborted render render1');
  });

  it("throws error if there's an error in render", async () => {
    const expectedStatus = new RenderStatusResults({status: RenderStatus.ERROR, error: 'bla'});
    const waitForRenderedStatus = makeWaitForRenderedStatus({
      logger: testLogger,
      getRenderStatus: async () => expectedStatus,
    });
    const [err, _status] = await presult(waitForRenderedStatus('render1'));
    expect(err).to.be.an.instanceOf(Error);
    expect(err.message).to.eql(failMsg('render1', 'bla'));
  });

  it('keeps trying if wrapper throws exception (e.g. 500 Internal server error)', async () => {
    let output = '';
    const log = (...args) => (output += args.join(', '));
    const waitForRenderedStatus = makeWaitForRenderedStatus({
      logger: {log, verbose: log},
      timeout: 100,
      getRenderStatus: async () => {
        await psetTimeout(50);
        throw new Error('bla');
      },
    });
    const [err, _statuses] = await presult(waitForRenderedStatus('render1'));
    expect(err).to.be.an.instanceOf(Error);
    expect(err.message).to.equal(failMsg('render1'));
    expect(output).to.contain(
      '[waitForRenderedStatus] error during getRenderStatus for render1: Error: bla[waitForRenderedStatus] error during getRenderStatus for render1: Error: bla',
    );
  });

  it('throws error on timeout', async () => {
    const expectedStatus = new RenderStatusResults({status: RenderStatus.RENDERING});
    const waitForRenderedStatus = makeWaitForRenderedStatus({
      logger: testLogger,
      timeout: 200,
      getRenderStatus: async () => {
        await psetTimeout(50);
        return expectedStatus;
      },
    });
    const [err, _status] = await presult(waitForRenderedStatus('render1'));
    expect(err).to.be.an.instanceOf(Error);
    expect(err.message).to.equal(failMsg('render1'));
  });

  it('keeps polling on undefined render status', async () => {
    let counter = 0;

    const waitForRenderedStatus = makeWaitForRenderedStatus({
      logger: testLogger,
      getRenderStatus: async () => {
        counter++;
        await psetTimeout(100);
        if (counter < 3) {
          return new RenderStatusResults();
        } else {
          return new RenderStatusResults({status: RenderStatus.RENDERED});
        }
      },
    });

    const notYetPromise = Promise.race([
      presult(
        waitForRenderedStatus('render1').then(status => {
          expect(status).to.eql(new RenderStatusResults({status: RenderStatus.RENDERED}));
        }),
      ),
      psetTimeout(150).then(() => 'not yet'),
    ]);
    expect(counter).to.equal(1);
    await psetTimeout(150);
    expect(counter).to.equal(2);
    await psetTimeout(100);
    expect(counter).to.equal(3);
    expect(await notYetPromise).to.equal('not yet');
  });
});
