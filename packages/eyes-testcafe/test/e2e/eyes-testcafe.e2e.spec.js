'use strict';

const { describe, it } = require('mocha');
const { expect } = require('chai');
const createTestCafe = require('testcafe');
const path = require('path');

describe('Eyes TestCafe e2e', () => {
  let testCafe, runner;

  beforeEach(async () => {
    testCafe = await createTestCafe('localhost', 1337);
    runner = testCafe.createRunner();
    runner.screenshots('logs/').browsers('chrome:headless');
  });

  afterEach(async () => {
    await testCafe.close();
  });

  it('should match viewport screenshot', async () => {
    const failedCount = await runner.src(path.resolve(__dirname, 'testcafe/helloworld-viewport.testcafe.js')).run();
    expect(failedCount).to.equal(0);
  });

  it('should match region screenshot', async () => {
    const failedCount = await runner.src(path.resolve(__dirname, 'testcafe/helloworld-region.testcafe.js')).run();
    expect(failedCount).to.equal(0);
  });
});
