function makeBatchClose(closeBatch) {
  return function BatchClose() {
    const that = {
      batchIds: null,
      serverUrl: null,
      apiKey: null,
      proxy: null,
    }

    that.setBatchIds = function(batchIds) {
      that.batchIds = batchIds
      return that
    }

    that.setUrl = function(serverUrl) {
      that.serverUrl = serverUrl
      return that
    }

    that.setApiKey = function(apiKey) {
      that.apiKey = apiKey
      return that
    }

    that.setProxy = function(proxy) {
      that.proxy = proxy
      return that
    }

    that.close = async function() {
      const {batchIds, serverUrl, apiKey, proxy} = that
      await closeBatch({batchIds, serverUrl, apiKey, proxy})
    }

    return that
  }
}

module.exports = makeBatchClose
