'use strict'

const ServerConnector = require('../server/ServerConnector')
const Configuration = require('../config/Configuration')
const Logger = require('../logging/Logger')

function setupServerConfig({serverUrl, apiKey, proxy}) {
  const logger = new Logger(!!process.env.APPLITOOLS_SHOW_LOGS)
  const configuration = new Configuration()
  if (serverUrl) configuration.setServerUrl(serverUrl)
  if (apiKey) configuration.setApiKey(apiKey)
  if (proxy) configuration.setProxy(proxy)
  return {configuration, logger}
}

async function closeBatch({
  batchIds = [],
  serverUrl,
  apiKey = process.env.APPLITOOLS_API_KEY,
  proxy,
}) {
  try {
    const getAgentId = () => 'core/close'
    const {logger, configuration} = setupServerConfig({serverUrl, apiKey, proxy})
    const server = new ServerConnector({logger, configuration, getAgentId})
    for (const batchId of batchIds) {
      await server.deleteBatchSessions(batchId)
    }
  } catch (error) {
    throw new Error(error)
  }
}

module.exports = closeBatch
