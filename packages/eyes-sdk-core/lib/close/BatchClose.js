function makeBatchClose(closeBatch) {
  return function BatchClose() {
    this._batchIds = null
    this._serverUrl = null

    this.setBatchIds = function(batchIds) {
      if (batchIds && batchIds.length > 0) {
        this._batchIds = batchIds
      }
      return this
    }

    this.setUrl = function(serverUrl) {
      if (serverUrl) {
        this._serverUrl = serverUrl
      }
      return this
    }

    this.close = async function() {
      try {
        const serverUrl = this._serverUrl
        const batchIds = this._batchIds
        await closeBatch({batchIds, serverUrl})
      } catch (error) {
        throw new Error(error.message)
      }
    }

    return this
  }
}

module.exports = makeBatchClose
