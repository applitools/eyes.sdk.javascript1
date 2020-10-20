const nock = require('nock')
const closeBatch = require('../../../lib/close/closeBatch')
const {expect} = require('chai')
const {presult} = require('../../../lib/troubleshoot/utils')

describe('closeBatch', () => {
  let serverUrl, apiKey, batchIds, scopes

  beforeEach(() => {
    serverUrl = 'http://localhost:1234'
    apiKey = '12345'

    batchIds = ['123', '456']
    scopes = []

    batchIds.forEach(batchId => {
      const scope = nock(serverUrl)
        .delete(`/api/sessions/batches/${batchId}/close/bypointerid`)
        .query({apiKey})
        .reply(200)
      scopes.push(scope)
    })
  })

  it('should throw', async () => {
    nock(serverUrl)
      .delete(`/api/sessions/batches/678/close/bypointerid`)
      .query({apiKey})
      .replyWithError({message: 'something went wrong', code: 500})
    const [err] = await presult(closeBatch({batchIds: ['678'], serverUrl, apiKey}))
    expect(err.message).to.equal('Error: something went wrong')
  })

  it('should setup configuration', async () => {
    const [err] = await presult(closeBatch({batchIds, serverUrl, apiKey}))
    expect(err).to.be.undefined
    batchIds.forEach((batchId, index) => {
      expect(scopes[index].basePath).to.equal(serverUrl)
      expect(scopes[index].interceptors[0].path).to.include(batchId)
      expect(scopes[index].interceptors[0].queries).to.eql({apiKey})
    })
  })

  it('should call deleteBatchSession per batchId', async () => {
    await closeBatch({batchIds, serverUrl, apiKey})
    batchIds.forEach((batchId, index) => {
      expect(scopes[index].interceptors[0].path).to.include(batchId[index])
    })
  })
})
