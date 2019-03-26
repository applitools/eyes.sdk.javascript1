'use strict';

const assert = require('assert');

const { Configuration } = require('../../../index');

describe('Configuration', () => {
  describe('constructor', () => {
    it('clone', () => {
      const configuration = new Configuration();
      configuration.appName = 'test';
      configuration.apiKey = 'apiKey';

      const configurationCopy = new Configuration(configuration);

      assert.strictEqual(configuration.appName, configurationCopy.appName);
      assert.strictEqual(configuration.apiKey, configurationCopy.apiKey);
    });

    it('from object', () => {
      const object = {
        appName: 'test',
        apiKey: 'apiKey',
      };

      const configuration = new Configuration(object);

      assert.strictEqual(configuration.appName, 'test');
      assert.strictEqual(configuration.apiKey, 'apiKey');
    });
  });

  it('saveNewTests', () => {
    const configuration = new Configuration();
    assert.strictEqual(configuration.saveNewTests, true);

    configuration.saveNewTests = false;
    assert.strictEqual(configuration.saveNewTests, false);

    configuration.saveNewTests = true;
    assert.strictEqual(configuration.saveNewTests, true);
  });

  it('mergeConfig', () => {
    const configuration = new Configuration();
    configuration.appName = 'test';
    configuration.apiKey = 'apiKey';

    const configuration2 = new Configuration();
    configuration2.appName = 'new test name';
    configuration.apiKey = 'apiKey2';
    configuration.mergeConfig(configuration2);

    assert.strictEqual(configuration.appName, configuration2.appName);
    assert.notStrictEqual(configuration.apiKey, configuration2.apiKey);
  });

  it('cloneConfig', () => {
    const configuration = new Configuration();
    configuration.appName = 'test';
    configuration.apiKey = 'apiKey';

    const configuration2 = configuration.cloneConfig();
    configuration.appName = 'new test name';

    assert.notStrictEqual(configuration.appName, configuration2.appName);
  });
});
