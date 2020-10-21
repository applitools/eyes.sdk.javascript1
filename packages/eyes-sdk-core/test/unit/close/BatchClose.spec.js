const makeBatchClose = require('../../../lib/close/BatchClose')
const {expect} = require('chai')
const {presult} = require('../../../lib/troubleshoot/utils')

describe('BatchClose', () => {
  it('should provide a fluent API', () => {
    const BatchClose = makeBatchClose(() => {})
    const batchClose = BatchClose()
    expect(batchClose)
      .to.haveOwnProperty('setUrl')
      .and.be.a('function')
    expect(batchClose)
      .to.haveOwnProperty('setBatchIds')
      .and.be.a('function')
    expect(batchClose)
      .to.haveOwnProperty('close')
      .and.be.a('function')
    expect(batchClose)
      .to.haveOwnProperty('setApiKey')
      .and.be.a('function')
    expect(batchClose)
      .to.haveOwnProperty('setProxy')
      .and.be.a('function')
  })

  it('should set batchIds', async () => {
    const batchIds = ['123', '456']
    const expectedBatchIds = []
    const BatchClose = makeBatchClose(({batchIds}) => expectedBatchIds.push(...batchIds))
    await BatchClose()
      .setBatchIds(batchIds)
      .close()
    expect(expectedBatchIds).to.eql(batchIds)
  })

  it('should set server url', async () => {
    let expectedServerUrl
    const url = 'http://localhost:1234'
    const BatchClose = makeBatchClose(({serverUrl}) => (expectedServerUrl = serverUrl))
    await BatchClose()
      .setUrl(url)
      .close()
    expect(expectedServerUrl).to.equal(url)
  })

  it('should set proxy', async () => {
    let proxy = {
      protocol: 'https',
      host: 'localhost',
      port: 1234,
      isHttpOnly: false,
      url: 'http://localhost:1234',
    }
    let expectedProxy = {}
    const BatchClose = makeBatchClose(({proxy}) => Object.assign(expectedProxy, proxy))
    await BatchClose()
      .setProxy(proxy)
      .close()
    expect(expectedProxy).to.eql(proxy)
  })

  it('should set apiKey', async () => {
    let expectedApiKey
    const apiKey = '1234'
    const BatchClose = makeBatchClose(({apiKey}) => (expectedApiKey = apiKey))
    await BatchClose()
      .setApiKey(apiKey)
      .close()
    expect(expectedApiKey).to.eql(apiKey)
  })

  it('should call closeBatch with correct paramters', async () => {
    const response = {}
    const serverUrl = 'http://localhost:1234'
    const batchIds = ['123', '456']
    const apiKey = '1234'
    const proxy = {host: 'localhost'}
    const BatchClose = makeBatchClose(({serverUrl, batchIds, proxy, apiKey}) =>
      Object.assign(response, {serverUrl, batchIds, proxy, apiKey}),
    )

    await BatchClose()
      .setUrl(serverUrl)
      .setBatchIds(batchIds)
      .setApiKey(apiKey)
      .setProxy(proxy)
      .close()

    expect(response).to.eql({serverUrl, batchIds, apiKey, proxy})
  })

  it('should throw if no batchIds were provided', async () => {
    let expectedBatchIds
    const BatchClose = makeBatchClose(({batchIds}) => (expectedBatchIds = batchIds))
    await BatchClose()
      .setBatchIds()
      .close()
    expect(expectedBatchIds).to.be.undefined
  })
})
