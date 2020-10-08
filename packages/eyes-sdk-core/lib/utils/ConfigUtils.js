'use strict'

const {cosmiconfigSync} = require('cosmiconfig')
const GeneralUtils = require('./GeneralUtils')
const Logger = require('../logging/Logger')

function getConfig({
  configParams = [],
  configPath,
  logger = new Logger(!!process.env.APPLITOOLS_SHOW_LOGS),
} = {}) {
  const explorer = cosmiconfigSync('applitools', {
    searchPlaces: ['applitools.config.js', 'package.json', 'eyes.config.js', 'eyes.json'],
  })

  let defaultConfig = {}
  try {
    configPath = GeneralUtils.getEnvValue('CONFIG_PATH') || configPath
    const result = configPath ? explorer.load(configPath) : explorer.search()

    if (result) {
      const {config, filepath} = result
      logger.log('Loading configuration from', filepath)
      defaultConfig = config
    }
  } catch (ex) {
    logger.log(`An error occurred while loading configuration. configPath=${configPath}\n`, ex)
  }

  const envConfig = {}
  for (const p of configParams) {
    envConfig[p] = GeneralUtils.getEnvValue(toEnvVarName(p))
    if (envConfig[p] === 'true') {
      envConfig[p] = true
    } else if (envConfig[p] === 'false') {
      envConfig[p] = false
    }
  }

  Object.keys(envConfig).forEach(value => {
    if (envConfig[value] === undefined) {
      delete envConfig[value]
    }
  })

  return Object.assign({}, defaultConfig, envConfig)
}

/**
 * @param {string} camelCaseStr
 * @return {string}
 */
function toEnvVarName(camelCaseStr) {
  return camelCaseStr.replace(/(.)([A-Z])/g, '$1_$2').toUpperCase()
}

module.exports = {
  getConfig,
  toEnvVarName,
}
