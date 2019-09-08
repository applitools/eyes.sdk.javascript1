'use strict';

const path = require('path');
const { describe, it } = require('mocha');
const { expect } = require('chai');
const { CheckSettings } = require('@applitools/eyes-sdk-core');
const { Configuration } = require('@applitools/eyes-common');
const { Eyes, TestResultsStatus } = require('../../');
const { makeFakeT, makeFakeTestCafe } = require('../util/fake-testcafe');

describe('Eyes TestCafe it', () => {
  before(() => {
    global.document = {
      title: 'Eyes TestCafe it',
    };
  });

  after(() => {
    delete global.document;
  });

  it('works', async () => {
    const t = makeFakeT({ screenshotPath: path.resolve(__dirname, '../fixtures/minions-800x500.png') });
    const { ClientFunction } = makeFakeTestCafe();
    const configuration = new Configuration({ showLogs: !!process.env.APPLITOOLS_SHOW_LOGS, viewportSize: { width: 800, height: 600 } });
    const eyes = new Eyes({ t, configuration, ClientFunction });
    await eyes.open('TestCafe app', 'TestCafe Eyes it helloworld');
    await eyes.check('TestCafe helloworld', new CheckSettings());
    const testResults = await eyes.close();
    expect(testResults.getStatus()).to.equal(TestResultsStatus.Passed);
  });
});
