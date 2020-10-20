const makeBatchClose = require('../../../lib/close/BatchClose')
const {expect} = require('chai')

describe('BatchClose', () => {
  const BatchClose = makeBatchClose(() => 'hi')
  it('should provide a fluent API', () => {
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
  })

  it('should set batchIds', () => {
    const batchIds = ['123', '456']
    const batchClose = BatchClose().setBatchIds(batchIds)
    expect(batchClose._batchIds).to.eql(batchIds)
  })

  it('should set server url', () => {
    const url = 'http://localhost:1234'
    const batchClose = BatchClose().setUrl(url)
    expect(batchClose._serverUrl).to.equal(url)
  })

  it('should call closeBatch', async () => {
    const result = []
    const BatchClose = makeBatchClose(() => result.push('works'))
    BatchClose()
      .setUrl('http://localhost:1234')
      .setBatchIds(['123', '456'])
      .close()

    expect(result).to.eql(['works'])
  })
})
