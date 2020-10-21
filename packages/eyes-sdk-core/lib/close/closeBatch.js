'use strict'

const ServerConnector = require('../server/ServerConnector')
const Configuration = require('../config/Configuration')
const Logger = require('../logging/Logger')
const {presult} = require('../troubleshoot/utils')

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
  const getAgentId = () => ''
  const {logger, configuration} = setupServerConfig({serverUrl, apiKey, proxy})
  const serverConnector = new ServerConnector({logger, configuration, getAgentId})

  const promises = batchIds.map(batchId => serverConnector.deleteBatchSessions(batchId))
  const results = await Promise.all(promises.map(presult))
  const err = results.find(([err]) => !!err)
  if (err) throw err[0]
}

module.exports = closeBatch
