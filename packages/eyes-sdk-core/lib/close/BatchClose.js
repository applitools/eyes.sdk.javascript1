'use strict'

const closeBatch = require('./closeBatch')

class BatchClose {
  constructor() {
    this._batchIds = null
    this._serverUrl = null
    this._apiKey = null
  }

  setBatchIds(batchIds) {
    if (batchIds && batchIds.length > 0) {
      this._batchIds = batchIds
      return this
    }
  }

  setUrl(serverUrl) {
    if (serverUrl) {
      this._serverUrl = serverUrl
      return this
    }
  }

  async close() {
    try {
      const serverUrl = this._serverUrl
      const batchIds = this._batchIds
      await closeBatch({batchIds, serverUrl})
    } catch (error) {
      throw new Error(error.message)
    }
  }
}

module.exports = BatchClose
