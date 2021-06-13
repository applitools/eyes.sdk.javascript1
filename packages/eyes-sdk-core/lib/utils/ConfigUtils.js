'use strict'

const GeneralUtils = require('./GeneralUtils')
const Logger = require('../logging/Logger')

function getConfig({
  configParams = [],
  configPath,
  logger = new Logger(!!process.env.APPLITOOLS_SHOW_LOGS),
} = {}) {
  const possibleConfigs = ['applitools.config.js', 'eyes.config.js', 'eyes.json']
  const envConfig = populateEnvConfig(configParams)
  try {
    const envConfigPath = GeneralUtils.getEnvValue('CONFIG_PATH')
    const customConfigPath = envConfigPath || configPath

    if (customConfigPath) {
      logger.log('Loading configuration from', customConfigPath)
      const config = require(customConfigPath)
      return Object.assign(config, envConfig)
    } else {
      const config = require(findConfigFile(possibleConfigs))
      return Object.assign(config, envConfig)
    }
  } catch (ex) {
    if (Object.keys(envConfig).length) {
      return envConfig
    }
    const errorMessage = `An error occurred while loading configuration. configPath=${configPath}\n`
    logger.log(errorMessage, ex)
    throw new Error(`${errorMessage}${ex}`)
  }
}

/**
 * @param {string} camelCaseStr
 * @return {string}
 */
function toEnvVarName(camelCaseStr) {
  return camelCaseStr.replace(/(.)([A-Z])/g, '$1_$2').toUpperCase()
}

function findConfigFile(possibleConfigs, errors = []) {
  let index = 0

  for (const configFile of possibleConfigs) {
    try {
      return require.resolve(`./${configFile}`, {paths: [process.cwd()]})
    } catch (error) {
      // save errors to continue checking for other config files
      // throw the earliest encountered error
      errors.push(error)
      if (index === possibleConfigs.length - 1) {
        throw errors[0]
      }
    } finally {
      index++
    }
  }
}

function populateEnvConfig(configParams) {
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

  return envConfig
}

module.exports = {
  getConfig,
  toEnvVarName,
}
