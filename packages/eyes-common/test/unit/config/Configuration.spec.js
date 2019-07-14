'use strict';

const assert = require('assert');

const { Configuration, MatchLevel } = require('../../../index');

describe('Configuration', () => {
  describe('constructor', () => {
    it('clone', () => {
      const configuration = new Configuration();
      configuration.setAppName('test');
      configuration.setApiKey('apiKey');

      const configurationCopy = new Configuration(configuration);

      assert.strictEqual(configuration.getAppName(), configurationCopy.getAppName());
      assert.strictEqual(configuration.getApiKey(), configurationCopy.getApiKey());
    });

    it('from object', () => {
      const object = {
        appName: 'test',
        apiKey: 'apiKey',
      };

      const configuration = new Configuration(object);

      assert.strictEqual(configuration.getAppName(), 'test');
      assert.strictEqual(configuration.getApiKey(), 'apiKey');
    });
  });

  it('saveNewTests', () => {
    const configuration = new Configuration();
    assert.strictEqual(configuration.getSaveNewTests(), true);

    configuration.setSaveNewTests(false);
    assert.strictEqual(configuration.getSaveNewTests(), false);

    configuration.setSaveNewTests(true);
    assert.strictEqual(configuration.getSaveNewTests(), true);
  });

  it('mergeConfig', () => {
    const configuration = new Configuration();
    configuration.setAppName('test');
    configuration.setApiKey('apiKey');

    const configuration2 = new Configuration();
    configuration2.setAppName('new test name');
    configuration.setApiKey('apiKey2');
    configuration.mergeConfig(configuration2);

    assert.strictEqual(configuration.getAppName(), configuration2.getAppName());
    assert.notStrictEqual(configuration.getApiKey(), configuration2.getApiKey());
  });

  it('cloneConfig', () => {
    const configuration = new Configuration();
    configuration.setAppName('test');
    configuration.setApiKey('apiKey');

    const configuration2 = configuration.cloneConfig();
    configuration.setAppName('new test name');

    assert.notStrictEqual(configuration.getAppName(), configuration2.getAppName());
  });

  describe('defaultMatchSettings', () => {
    it('default values', () => {
      const configuration = new Configuration();

      assert.strictEqual(configuration.getMatchLevel(), MatchLevel.Strict);
      assert.strictEqual(configuration.getIgnoreCaret(), true);
      assert.strictEqual(configuration.getUseDom(), false);
      assert.strictEqual(configuration.getEnablePatterns(), false);
      assert.strictEqual(configuration.getIgnoreDisplacements(), false);
    });

    it('set values', () => {
      const configuration = new Configuration();
      configuration.setMatchLevel(MatchLevel.Content);
      configuration.setIgnoreCaret(false);
      configuration.setUseDom(true);
      configuration.setEnablePatterns(true);
      configuration.setIgnoreDisplacements(true);

      assert.strictEqual(configuration.getMatchLevel(), MatchLevel.Content);
      assert.strictEqual(configuration.getIgnoreCaret(), false);
      assert.strictEqual(configuration.getUseDom(), true);
      assert.strictEqual(configuration.getEnablePatterns(), true);
      assert.strictEqual(configuration.getIgnoreDisplacements(), true);
    });

    it('to object', () => {
      const configuration = new Configuration();
      configuration.setMatchLevel(MatchLevel.Content);
      configuration.setIgnoreCaret(false);
      configuration.setUseDom(true);
      configuration.setEnablePatterns(true);
      configuration.setIgnoreDisplacements(true);

      assert.deepStrictEqual(configuration.toJSON().defaultMatchSettings, {
        matchLevel: 'Content',
        enablePatterns: true,
        ignoreDisplacements: true,
        ignoreCaret: false,
        useDom: true,
        ignore: [],
        content: [],
        layout: [],
        strict: [],
        floating: [],
        exact: undefined,
      });
    });

    it('from object', () => {
      const configuration = new Configuration();
      configuration.setDefaultMatchSettings({
        matchLevel: 'Content',
        enablePatterns: true,
        ignoreDisplacements: true,
        ignoreCaret: false,
        useDom: true,
        ignore: [],
        content: [],
        layout: [],
        strict: [],
        floating: [],
        exact: undefined,
      });

      assert.strictEqual(configuration.getMatchLevel(), MatchLevel.Content);
      assert.strictEqual(configuration.getIgnoreCaret(), false);
      assert.strictEqual(configuration.getUseDom(), true);
      assert.strictEqual(configuration.getEnablePatterns(), true);
      assert.strictEqual(configuration.getIgnoreDisplacements(), true);
    });
  });
});
