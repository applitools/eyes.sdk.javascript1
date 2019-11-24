'use strict';

const path = require('path');
const assert = require('assert');

const { ConfigUtils, Logger } = require('../../../index');

describe('ConfigUtils', () => {
  describe('getConfig()', () => {
    let prevEnv;
    const logger = new Logger();
    const configPath = path.resolve(__dirname, '..', '..', 'fixtures');

    function getConfigAtConfigPath(args) {
      const cwd = process.cwd();
      process.chdir(configPath);
      const config = ConfigUtils.getConfig(args);
      process.chdir(cwd);
      return config;
    }

    beforeEach(() => {
      prevEnv = process.env;
      process.env = {};
    });

    afterEach(() => {
      process.env = prevEnv;
    });

    it('loads default config from file', () => {
      const config = getConfigAtConfigPath();
      const expectedConfig = { bla: 'kuku', it: 'works' };
      assert.deepStrictEqual(config, expectedConfig);
    });

    it('loads config with env variables', () => {
      process.env.APPLITOOLS_BLA = 'env kuku';
      const config = getConfigAtConfigPath({ configParams: ['bla'] });
      const expectedConfig = { bla: 'env kuku', it: 'works' };
      assert.deepStrictEqual(config, expectedConfig);
    });

    it('loads config with bamboo prefix variable', () => {
      process.env.bamboo_APPLITOOLS_BLA = 'env kuku bamboo';
      const config = getConfigAtConfigPath({ configParams: ['bla'] });
      const expectedConfig = { bla: 'env kuku bamboo', it: 'works' };
      assert.deepStrictEqual(config, expectedConfig);
    });

    it('handles custom configParams', () => {
      const config = ConfigUtils.getConfig({ configParams: ['bla'], logger });
      assert.strictEqual(config.bla, undefined);

      process.env.APPLITOOLS_BLA = 'aaa';
      const configWithBla = ConfigUtils.getConfig({ configParams: ['bla'], logger });
      delete process.env.APPLITOOLS_BLA;
      assert.strictEqual(configWithBla.bla, 'aaa');
    });

    it('handles custom configPath', () => {
      const config = ConfigUtils.getConfig({ configPath: path.resolve(configPath, 'eyes.json'), logger });
      const expectedConfig = { saveDebugData: true, apiKey: 'default api key' };
      assert.deepStrictEqual(config, expectedConfig);
    });

    it('handles boolean config params', () => {
      process.env.APPLITOOLS_BLA1 = 'false';
      process.env.APPLITOOLS_BLA2 = 'true';
      const configWithBla = ConfigUtils.getConfig({ configParams: ['bla1', 'bla2'], logger });
      assert.strictEqual(configWithBla.bla1, false);
      assert.strictEqual(configWithBla.bla2, true);
    });
  });

  describe('toEnvVarName()', () => {
    it('works', () => {
      assert.strictEqual(ConfigUtils.toEnvVarName('someCamelCase'), 'SOME_CAMEL_CASE');
      assert.strictEqual(ConfigUtils.toEnvVarName('CapitalSomeCamelCase'), 'CAPITAL_SOME_CAMEL_CASE');
    });
  });
});
