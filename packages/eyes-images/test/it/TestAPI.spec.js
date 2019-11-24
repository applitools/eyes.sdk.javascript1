'use strict';

const assert = require('assert');
const { Eyes } = require('../../index');

describe('TestAPI', function () {
  this.timeout(5 * 60 * 1000);

  it('EnsureApiExists', async function () {
    const eyes = new Eyes();
    const config = eyes.getConfiguration();

    assert.ok(config);

    config.setAppName('Test API').setTestName('Ensure API Exists');
    eyes.setConfiguration(config);

    assert.strictEqual('Test API', eyes.getAppName());
    assert.strictEqual('Ensure API Exists', eyes.getTestName());
  });
});
