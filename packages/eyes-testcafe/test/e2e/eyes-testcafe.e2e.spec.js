'use strict';

const { describe, it } = require('mocha');
const { expect } = require('chai');
const createTestCafe = require('testcafe');
const path = require('path');

describe('Eyes TestCafe e2e', () => {
  it('works', async () => {
    const testCafe = await createTestCafe('localhost', 1337);
    try {
      const runner = testCafe.createRunner();
      runner.screenshots('logs/');

      const failedCount = await runner.src(path.resolve(__dirname, 'testcafe/*.testcafe.js')).browsers('chrome:headless').run();
      expect(failedCount).to.equal(0);
    } finally {
      await testCafe.close();
    }
  });
});
