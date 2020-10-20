'use strict'

const ServerConnector = require('../server/ServerConnector')
const Configuration = require('../config/Configuration')
const Logger = require('../logging/Logger')

function setupServerConfig({serverUrl, apiKey}) {
  const logger = new Logger(!!process.env.APPLITOOLS_SHOW_LOGS)
  const configuration = new Configuration()
  configuration.setServerUrl(serverUrl)
  configuration.setApiKey(apiKey)
  return {configuration, logger}
}

async function closeBatch({
  batchIds = [],
  serverUrl = '',
  apiKey = process.env.APPLITOOLS_API_KEY,
}) {
  try {
    const getAgentId = () => 'core/close'
    const {logger, configuration} = setupServerConfig({serverUrl, apiKey})
    const server = new ServerConnector({logger, configuration, getAgentId})
    for (const batchId of batchIds) {
      await server.deleteBatchSessions(batchId)
    }
  } catch (error) {
    throw new Error(error)
  }
}

module.exports = closeBatch
