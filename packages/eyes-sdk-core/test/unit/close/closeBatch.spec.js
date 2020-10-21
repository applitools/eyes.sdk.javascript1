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
  })

  it('should throw', async () => {
    nock(serverUrl)
      .delete(`/api/sessions/batches/678/close/bypointerid`)
      .query({apiKey})
      .replyWithError({message: 'something went wrong', code: 500})
    const [err] = await presult(closeBatch({batchIds: ['678'], serverUrl, apiKey}))
    expect(err.message).to.equal('something went wrong')
  })

  it('should handle a single batchId deletion failure', async () => {
    nock(serverUrl)
      .delete(`/api/sessions/batches/888/close/bypointerid`)
      .query({apiKey})
      .reply(200)
    nock(serverUrl)
      .delete(`/api/sessions/batches/999/close/bypointerid`)
      .query({apiKey})
      .replyWithError({message: 'something went wrong', code: 500})
    const [err] = await presult(closeBatch({batchIds: ['888', '999'], serverUrl, apiKey}))
    expect(err.message).to.equal('something went wrong')
  })

  it('should send the correct close batch requests to the server', async () => {
    scopes = []

    batchIds.forEach(batchId => {
      const scope = nock(serverUrl)
        .delete(`/api/sessions/batches/${batchId}/close/bypointerid`)
        .query({apiKey})
        .reply(200)
      scopes.push(scope)
    })

    await closeBatch({batchIds, serverUrl, apiKey})
    batchIds.forEach((batchId, index) => {
      expect(scopes[index].basePath).to.equal(serverUrl)
      expect(scopes[index].interceptors[0].path).to.equal(
        `/api/sessions/batches/${batchId}/close/bypointerid`,
      )
      expect(scopes[index].interceptors[0].queries).to.eql({apiKey})
    })
  })
})
