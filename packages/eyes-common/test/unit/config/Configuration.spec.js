'use strict';

const assert = require('assert');

const { Configuration, MatchLevel, AccessibilityLevel } = require('../../../index');

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
      assert.strictEqual(configuration.getAccessibilityLevel(), AccessibilityLevel.None);
      assert.strictEqual(configuration.getIgnoreCaret(), true);
      assert.strictEqual(configuration.getUseDom(), false);
      assert.strictEqual(configuration.getEnablePatterns(), false);
      assert.strictEqual(configuration.getIgnoreDisplacements(), false);
    });

    it('set values', () => {
      const configuration = new Configuration();
      configuration.setMatchLevel(MatchLevel.Content);
      configuration.setAccessibilityLevel(AccessibilityLevel.AA);
      configuration.setIgnoreCaret(false);
      configuration.setUseDom(true);
      configuration.setEnablePatterns(true);
      configuration.setIgnoreDisplacements(true);

      assert.strictEqual(configuration.getMatchLevel(), MatchLevel.Content);
      assert.strictEqual(configuration.getAccessibilityLevel(), AccessibilityLevel.AA);
      assert.strictEqual(configuration.getIgnoreCaret(), false);
      assert.strictEqual(configuration.getUseDom(), true);
      assert.strictEqual(configuration.getEnablePatterns(), true);
      assert.strictEqual(configuration.getIgnoreDisplacements(), true);
    });

    it('to object', () => {
      const configuration = new Configuration();
      configuration.setMatchLevel(MatchLevel.Content);
      configuration.setAccessibilityLevel(AccessibilityLevel.AA);
      configuration.setIgnoreCaret(false);
      configuration.setUseDom(true);
      configuration.setEnablePatterns(true);
      configuration.setIgnoreDisplacements(true);

      assert.deepStrictEqual(configuration.toJSON().defaultMatchSettings, {
        matchLevel: 'Content',
        accessibilityLevel: 'AA',
        enablePatterns: true,
        ignoreDisplacements: true,
        ignoreCaret: false,
        useDom: true,
        ignore: [],
        content: [],
        accessibility: [],
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
        accessibilityLevel: 'AA',
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
      assert.strictEqual(configuration.getAccessibilityLevel(), AccessibilityLevel.AA);
      assert.strictEqual(configuration.getIgnoreCaret(), false);
      assert.strictEqual(configuration.getUseDom(), true);
      assert.strictEqual(configuration.getEnablePatterns(), true);
      assert.strictEqual(configuration.getIgnoreDisplacements(), true);
    });
  });

  it('should parse empty config', () => {
    const config = {};
    const cfg = new Configuration(config);
    assert.ok(cfg instanceof Configuration);
  });

  it('should parse a single browser', () => {
    const config = {
      browsersInfo: [
        {
          width: 1920,
          height: 1080,
          name: 'chrome',
        },
      ],
    };
    const cfg = new Configuration(config);
    assert.strictEqual(cfg._browsersInfo.length, 1);
    assert.strictEqual(cfg._browsersInfo[0].name, config.browsersInfo[0].name);
    assert.strictEqual(cfg._browsersInfo[0].width, config.browsersInfo[0].width);
    assert.strictEqual(cfg._browsersInfo[0].height, config.browsersInfo[0].height);
  });

  it('should parse config from array', () => {
    const config = {
      browsersInfo: [
        {
          width: 1920,
          height: 1080,
          name: 'chrome',
        },
        {
          width: 800,
          height: 600,
          name: 'firefox',
        },
        {
          deviceName: 'iPhone 4',
          screenOrientation: 'portrait',
        },
      ],
    };
    const cfg = new Configuration(config);
    assert.strictEqual(cfg._browsersInfo.length, config.browsersInfo.length);
    assert.strictEqual(cfg._browsersInfo[0].name, config.browsersInfo[0].name);
    assert.strictEqual(cfg._browsersInfo[1].name, config.browsersInfo[1].name);
    assert.strictEqual(cfg._browsersInfo[2].deviceName, config.browsersInfo[2].deviceName);
  });

  it('test return type', () => {
    let config = new Configuration();
    assert.ok(config instanceof Configuration);

    // use method from eyes-selenium/lib/config/Configuration
    config = config.setWaitBeforeScreenshots(24062019);
    assert.ok(config instanceof Configuration); // check that type is not changed

    // use method from eyes-common/lib/config/Configuration
    config = config.setHostApp('demo');
    assert.ok(config instanceof Configuration); // check that type is not changed

    // check that we still have access to methods
    assert.strictEqual(config.getHostApp(), 'demo');
    assert.strictEqual(config.getWaitBeforeScreenshots(), 24062019);
  });
});
