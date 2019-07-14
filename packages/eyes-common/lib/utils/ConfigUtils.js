'use strict';

const cosmiconfig = require('cosmiconfig');

const { Logger } = require('../logging/Logger');

/**
 * @ignore
 */
class ConfigUtils {
  static getConfig({ configParams = [], configPath, logger = new Logger(process.env.APPLITOOLS_SHOW_LOGS) } = {}) {
    const explorer = cosmiconfig('applitools', {
      searchPlaces: ['package.json', 'applitools.config.js', 'eyes.config.js', 'eyes.json'],
    });

    let defaultConfig = {};
    try {
      const result = configPath ? explorer.loadSync(configPath) : explorer.searchSync();
      if (result) {
        const { config, filepath } = result;
        logger.log('Loading configuration from', filepath);
        defaultConfig = config;
      }
    } catch (ex) {
      logger.log(`An error occurred while loading configuration. configPath=${configPath}\n`, ex);
    }

    const envConfig = {};
    for (const p of configParams) {
      envConfig[p] = process.env[`APPLITOOLS_${ConfigUtils.toEnvVarName(p)}`];
      if (envConfig[p] === 'true') {
        envConfig[p] = true;
      } else if (envConfig[p] === 'false') {
        envConfig[p] = false;
      }
    }

    Object.keys(envConfig).forEach((value) => {
      if (envConfig[value] === undefined) {
        delete envConfig[value];
      }
    });

    return Object.assign({}, defaultConfig, envConfig);
  }

  /**
   * @param {string} camelCaseStr
   * @return {string}
   */
  static toEnvVarName(camelCaseStr) {
    return camelCaseStr.replace(/(.)([A-Z])/g, '$1_$2').toUpperCase();
  }
}

exports.ConfigUtils = ConfigUtils;
