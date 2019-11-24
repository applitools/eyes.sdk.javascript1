'use strict';
const {describe, it} = require('mocha');
const {expect} = require('chai');
const makeCheckWindow = require('../../../src/sdk/checkWindow');
const makeTestController = require('../../../src/sdk/makeTestController');

describe('checkWindow', () => {
  it('handles fetchHeaders correctly', async () => {
    const fetchHeaders = {['User-Agent']: 'some agent'};
    const checkWindow = makeCheckWindow({
      testController: makeTestController({numOfTests: 0, logger: console}),
      createRGridDOMAndGetResourceMapping: () => {},
      renderBatch: () => {},
      waitForRenderedStatus: () => {},
      renderInfo: {},
      logger: console,
      getCheckWindowPromises: () => {},
      setCheckWindowPromises: () => {},
      browsers: [],
      wrappers: [],
      renderThroat: () => {},
      testName: 'some test',
      openEyesPromises: () => {},
      fetchHeaders,
    });
    await checkWindow({resourceUrls: [], referrer: 'some referrer'});
    expect(fetchHeaders).to.eql({Referer: 'some referrer', ['User-Agent']: 'some agent'});

    await checkWindow({resourceUrls: []});
    expect(fetchHeaders).to.eql({Referer: undefined, ['User-Agent']: 'some agent'});

    await checkWindow({resourceUrls: [], referrer: 'some referrer 2'});
    expect(fetchHeaders).to.eql({Referer: 'some referrer 2', ['User-Agent']: 'some agent'});
  });
});
