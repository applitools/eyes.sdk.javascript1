'use strict'

const ServerConnector = require('../server/ServerConnector')
const RunningSession = require('../server/RunningSession')
const Configuration = require('../config/Configuration')
const Logger = require('../logging/Logger')

class BatchClose {
  constructor({batchIds = [], serverUrl, apiKey}) {
    this._batchIds = batchIds
    this._serverUrl = serverUrl
    this._apiKey = apiKey
  }

  setBatchIds(batchIds) {
    if (batchIds && batchIds.length > 0) {
      this._batchIds = batchIds
      return this
    } else {
      // err handling ?
    }
  }

  setUrl(serverUrl) {
    if (serverUrl) {
      this._serverUrl = serverUrl
      return this
    } else {
      // err handling ?
    }
  }

  _setupServerConfig({serverUrl, apiKey = process.env.APPLITOOLS_API_KEY}) {
    const configuration = new Configuration({serverUrl, apiKey})
    const logger = new Logger(!!process.env.APPLITOOLS_SHOW_LOGS)

    configuration.setServerUrl(serverUrl)
    configuration.setApiKey(apiKey)

    return {configuration, logger}
  }

  async close() {
    try {
      const serverUrl = this._serverUrl
      const batchIds = this._batchIds
      return await this.closeBatch({batchIds, serverUrl})
    } catch (error) {
      // err handling ?
    }
  }

  async closeBatch({batchIds, serverUrl}) {
    try {
      const {logger, configuration} = this._setupServerConfig(serverUrl)
      // getAgentId ?
      const getAgentId = () => 'core/close'
      const server = new ServerConnector({logger, configuration, getAgentId})

      for (const batchId of batchIds) {
        // isAborted and save?
        const isAborted = false
        const save = false
        // should I use RunningSession?
        const runningSession = new RunningSession({batchId})
        return await server.stopSession(runningSession, isAborted, save)
      }
    } catch (error) {
      // err handling ?
      console.error(error)
    }
  }
}

module.exports = BatchClose
