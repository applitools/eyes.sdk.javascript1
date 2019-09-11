'use strict';

const path = require('path');
const { describe, it } = require('mocha');
const { expect } = require('chai');
const { Eyes, TestResultsStatus, Target, Configuration } = require('../../');
const { makeFakeT, makeFakeTestCafe } = require('../util/fake-testcafe');

describe('Eyes TestCafe it', () => {
  before(() => {
    global.document = {
      title: 'Eyes TestCafe it',
    };

    global.navigator = {
      userAgent: 'Mozilla/5.0 (Linux; Android 5.0; SAMSUNG SM-G900P Build/LRX21T) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/2.1 Chrome/34.0.1847.76 Mobile Safari/537.36',
    };
  });

  after(() => {
    delete global.document;
    delete global.navigator;
  });

  it('works', async () => {
    const t = makeFakeT({ screenshotPath: path.resolve(__dirname, '../fixtures/minions-800x500.png') });
    const { ClientFunction } = makeFakeTestCafe();
    const configuration = new Configuration({ showLogs: !!process.env.APPLITOOLS_SHOW_LOGS, viewportSize: { width: 800, height: 600 } });
    const eyes = new Eyes({ t, configuration, ClientFunction });
    await eyes.open('TestCafe app', 'TestCafe Eyes it helloworld');
    await eyes.check('TestCafe helloworld', Target.window());
    const testResults = await eyes.close();
    expect(testResults.getStatus()).to.equal(TestResultsStatus.Passed);
  });
});
