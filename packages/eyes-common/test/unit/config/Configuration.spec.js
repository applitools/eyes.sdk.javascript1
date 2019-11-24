'use strict';

const assert = require('assert');

const { Configuration, MatchLevel, AccessibilityLevel, RectangleSize, StitchMode, BatchInfo, ImageMatchSettings, SessionType, ProxySettings, PropertyData } = require('../../../index');

const STRING_CONFIGS = [
  '_appName',
  '_testName',
  '_displayName',
  '_agentId',
  '_serverUrl',
  '_baselineEnvName',
  '_environmentName',
  '_branchName',
  '_parentBranchName',
  '_baselineBranchName',
  '_hostApp',
  '_hostOS',
  '_hostAppInfo',
  '_hostOSInfo',
  '_deviceInfo',
];

const BOOLEAN_CONFIGS = [
  '_showLogs',
  '_saveDebugData',
  '_isDisabled',
  '_removeSession',
  '_compareWithParentBranch',
  '_saveFailedTests',
  '_saveNewTests',
  '_ignoreBaseline',
  '_saveDiffs',
  '_sendDom',
  '_forceFullPageScreenshot',
  '_hideScrollbars',
  '_hideCaret',
  '_isThrowExceptionOn',
  '_dontCloseBatches',
];

const NUMBER_CONFIGS = [
  '_waitBeforeScreenshots',
  '_stitchOverlap',
  '_concurrentSessions',
  '_matchTimeout',
  '_connectionTimeout',
];

describe('Configuration', () => {
  function _getMethodName(propertyName) {
    if (propertyName === '_proxySettings') {
      return 'Proxy';
    }

    return `${propertyName.charAt(1).toUpperCase()}${propertyName.slice(2)}`;
  }

  it('EnsureSetMethodPerProperty', () => {
    const config = new Configuration();
    const properties = Object.getOwnPropertyNames(config);

    for (const pi of properties) {
      const methodName = _getMethodName(pi);

      assert.strictEqual(typeof config[`set${methodName}`], 'function', `property '${pi}' doesn't have matching setter`);
      assert.strictEqual(typeof config[`get${methodName}`], 'function', `property '${pi}' doesn't have matching getter`);
    }
  });

  function _modifyValue(type, origValue) {
    let modifiedValue = origValue;
    if (STRING_CONFIGS.includes(type)) {
      modifiedValue = `${origValue}_dummy`;
    } else if (BOOLEAN_CONFIGS.includes(type)) {
      modifiedValue = origValue !== true;
    } else if (type === '_batch') {
      modifiedValue = new BatchInfo(`${origValue.getName()}_dummy`);
    } else if (type === '_defaultMatchSettings') {
      modifiedValue = new ImageMatchSettings();
    } else if (NUMBER_CONFIGS.includes(type)) {
      modifiedValue = origValue == null ? 1 : parseInt(origValue, 10) + 1;
    } else if (type === '_viewportSize') {
      if (origValue == null) {
        modifiedValue = new RectangleSize(0, 0);
      } else {
        modifiedValue = new RectangleSize(origValue.getWidth() + 1, origValue.getHeight() + 1);
      }
    } else if (type === '_stitchMode') {
      modifiedValue = modifiedValue === StitchMode.SCROLL ? StitchMode.CSS : StitchMode.SCROLL;
    } else if (type === '_sessionType') {
      modifiedValue = origValue === SessionType.SEQUENTIAL ? SessionType.PROGRESSION : SessionType.SEQUENTIAL;
    } else if (type === '_apiKey') {
      modifiedValue = 'dummyapikey';
    } else if (type === '_proxySettings') {
      modifiedValue = new ProxySettings('http://localhost:8888');
    } else if (type === '_properties') {
      modifiedValue = [new PropertyData('dummy', 'value')];
    } else if (type === '_browsersInfo') {
      modifiedValue = [
        {
          width: 1333,
          height: 1222,
          name: 'chrome',
        },
      ];
    }
    return modifiedValue;
  }

  it('TestConfigurationCopyConstructor', () => {
    const config = new Configuration();
    const properties = Object.getOwnPropertyNames(config);

    for (const pi of properties) {
      const methodName = _getMethodName(pi);

      const origValue = config[`get${methodName}`]();
      const modifiedValue = _modifyValue(pi, origValue);
      assert.notStrictEqual(origValue, modifiedValue, `Member not modified: ${pi}`);
      config[`set${methodName}`](modifiedValue);
    }

    const copiedConfig = new Configuration(config);
    for (const pi of properties) {
      const methodName = _getMethodName(pi);

      const origValue = config[`get${methodName}`]();
      const copiedValue = copiedConfig[`get${methodName}`]();
      assert.deepStrictEqual(origValue, copiedValue, `Member not copied: ${pi}`);
    }
  });

  describe('constructor', () => {
    it('clone', () => {
      const configuration = new Configuration();
      configuration.setAppName('test');
      configuration.setApiKey('apiKey');

      const configurationCopy = new Configuration(configuration);

      assert.strictEqual(configuration.getAppName(), configurationCopy.getAppName());
      assert.strictEqual(configuration.getApiKey(), configurationCopy.getApiKey());

      configuration.setDisplayName('test name1');
      configurationCopy.setDisplayName('test name2');

      assert.strictEqual(configuration.getDisplayName(), 'test name1');
      assert.strictEqual(configurationCopy.getDisplayName(), 'test name2');
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
      assert.strictEqual(configuration.getAccessibilityValidation(), AccessibilityLevel.None);
      assert.strictEqual(configuration.getIgnoreCaret(), true);
      assert.strictEqual(configuration.getUseDom(), false);
      assert.strictEqual(configuration.getEnablePatterns(), false);
      assert.strictEqual(configuration.getIgnoreDisplacements(), false);
    });

    it('set values', () => {
      const configuration = new Configuration();
      configuration.setMatchLevel(MatchLevel.Content);
      configuration.setAccessibilityValidation(AccessibilityLevel.AA);
      configuration.setIgnoreCaret(false);
      configuration.setUseDom(true);
      configuration.setEnablePatterns(true);
      configuration.setIgnoreDisplacements(true);

      assert.strictEqual(configuration.getMatchLevel(), MatchLevel.Content);
      assert.strictEqual(configuration.getAccessibilityValidation(), AccessibilityLevel.AA);
      assert.strictEqual(configuration.getIgnoreCaret(), false);
      assert.strictEqual(configuration.getUseDom(), true);
      assert.strictEqual(configuration.getEnablePatterns(), true);
      assert.strictEqual(configuration.getIgnoreDisplacements(), true);
    });

    it('to object', () => {
      const configuration = new Configuration();
      configuration.setMatchLevel(MatchLevel.Content);
      configuration.setAccessibilityValidation(AccessibilityLevel.AA);
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
      assert.strictEqual(configuration.getAccessibilityValidation(), AccessibilityLevel.AA);
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

  it('Server url by default', async function() {
    const configuration = new Configuration();
    assert.strictEqual(configuration.getServerUrl(), 'https://eyesapi.applitools.com');
  });

  it('Bamboo env variables', async function () {
    process.env.bamboo_APPLITOOLS_API_KEY = 'test_APPLITOOLS_API_KEY';
    process.env.bamboo_APPLITOOLS_SERVER_URL = 'test_APPLITOOLS_SERVER_URL';
    process.env.bamboo_APPLITOOLS_BATCH_ID = 'test_APPLITOOLS_BATCH_ID';
    process.env.bamboo_APPLITOOLS_BATCH_NAME = 'test_APPLITOOLS_BATCH_NAME';
    process.env.bamboo_APPLITOOLS_BATCH_SEQUENCE = 'test_APPLITOOLS_BATCH_SEQUENCE';
    process.env.bamboo_APPLITOOLS_BATCH_NOTIFY = true;
    process.env.bamboo_APPLITOOLS_BRANCH = 'test_APPLITOOLS_BRANCH';
    process.env.bamboo_APPLITOOLS_PARENT_BRANCH = 'test_APPLITOOLS_PARENT_BRANCH';
    process.env.bamboo_APPLITOOLS_BASELINE_BRANCH = 'test_APPLITOOLS_BASELINE_BRANCH';
    process.env.bamboo_APPLITOOLS_DONT_CLOSE_BATCHES = true;

    const configuration = new Configuration();

    assert.strictEqual(configuration.getApiKey(), 'test_APPLITOOLS_API_KEY');
    assert.strictEqual(configuration.getServerUrl(), 'test_APPLITOOLS_SERVER_URL');
    assert.strictEqual(configuration.getBatch().getId(), 'test_APPLITOOLS_BATCH_ID');
    assert.strictEqual(configuration.getBatch().getName(), 'test_APPLITOOLS_BATCH_NAME');
    assert.strictEqual(configuration.getBatch().getSequenceName(), 'test_APPLITOOLS_BATCH_SEQUENCE');
    assert.strictEqual(configuration.getBatch().getNotifyOnCompletion(), true);
    assert.strictEqual(configuration.getBranchName(), 'test_APPLITOOLS_BRANCH');
    assert.strictEqual(configuration.getParentBranchName(), 'test_APPLITOOLS_PARENT_BRANCH');
    assert.strictEqual(configuration.getBaselineBranchName(), 'test_APPLITOOLS_BASELINE_BRANCH');
    assert.strictEqual(configuration.getDontCloseBatches(), true);
  });
});
