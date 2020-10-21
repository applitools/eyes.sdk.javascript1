'use strict'

const ServerConnector = require('../server/ServerConnector')
const Configuration = require('../config/Configuration')
const Logger = require('../logging/Logger')
const {presult} = require('../troubleshoot/utils')

async function closeBatch({batchIds, serverUrl, apiKey, proxy}) {
  if (!batchIds) throw new Error('no batchIds were set')
  const serverConnector = new ServerConnector({
    logger: new Logger(!!process.env.APPLITOOLS_SHOW_LOGS),
    configuration: new Configuration({serverUrl, apiKey}),
    proxy,
    getAgentId: () => '',
  })

  const promises = batchIds.map(batchId => serverConnector.deleteBatchSessions(batchId))
  const results = await Promise.all(promises.map(presult))
  const error = results.find(([err]) => !!err)
  if (error) throw error[0]
}

module.exports = closeBatch
