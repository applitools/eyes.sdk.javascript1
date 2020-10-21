function makeBatchClose(closeBatch) {
  return function BatchClose() {
    this._batchIds = null
    this._serverUrl = null
    this._apiKey = null
    this._proxy = null

    this.setBatchIds = function(batchIds) {
      this._batchIds = batchIds
      return this
    }

    this.setUrl = function(serverUrl) {
      this._serverUrl = serverUrl
      return this
    }

    this.setApiKey = function(apiKey) {
      this._apiKey = apiKey
      return this
    }

    this.setProxy = function(proxy) {
      this._proxy = proxy
      return this
    }

    this.close = async function() {
      try {
        const serverUrl = this._serverUrl
        const batchIds = this._batchIds
        const apiKey = this._apiKey
        const proxy = this._proxy
        await closeBatch({batchIds, serverUrl, apiKey, proxy})
      } catch (error) {
        throw new Error(error.message)
      }
    }

    return this
  }
}

module.exports = makeBatchClose
