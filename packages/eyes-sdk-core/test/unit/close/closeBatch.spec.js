const nock = require('nock')
const closeBatch = require('../../../lib/close/closeBatch')
const {expect} = require('chai')
const {presult} = require('../../../lib/troubleshoot/utils')

describe('closeBatch', () => {
  it('should throw if delete batch failed', async () => {
    const serverUrl = 'http://localhost:1234'
    const apiKey = '12345'
    const message = 'something went wrong'

    nock(serverUrl)
      .delete(`/api/sessions/batches/678/close/bypointerid`)
      .query({apiKey})
      .replyWithError({message, code: 500})
    const [err] = await presult(closeBatch({batchIds: ['678'], serverUrl, apiKey}))
    expect(err.message).to.equal(message)
  })

  it('should handle a single batchId deletion failure', async () => {
    const serverUrl = 'http://localhost:1234'
    const apiKey = '12345'
    const message = 'something went wrong'

    const success = nock(serverUrl)
      .delete(`/api/sessions/batches/888/close/bypointerid`)
      .query({apiKey})
      .reply(200)
    const failed = nock(serverUrl)
      .delete(`/api/sessions/batches/999/close/bypointerid`)
      .query({apiKey})
      .replyWithError({message, code: 500})

    const scopes = {success, failed}
    expect(scopes['success'].interceptors[0].errorMessage).to.be.undefined
    expect(scopes['failed'].interceptors[0].errorMessage.message).to.equal(message)
  })

  it('should throw if no batchIds were provided', async () => {
    const message = 'no batchIds were set'
    const [err] = await presult(closeBatch({}))
    expect(err.message).to.equal(message)
  })

  it('should send the correct close batch requests to the server', async () => {
    const serverUrl = 'http://localhost:1234'
    const apiKey = '12345'
    const batchIds = ['123', '456']

    const scopes = batchIds.map(batchId => {
      return nock(serverUrl)
        .delete(`/api/sessions/batches/${batchId}/close/bypointerid`)
        .query({apiKey})
        .reply(200)
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
