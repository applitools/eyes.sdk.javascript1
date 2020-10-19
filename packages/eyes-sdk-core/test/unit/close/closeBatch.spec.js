const closeBatch = require('../../../lib/close/closeBatch')
const sinon = require('sinon')
const {expect} = require('chai')
const {presult} = require('../../../lib/troubleshoot/utils')
const ServerConnector = require('../../../lib/server/ServerConnector')

describe('closeBatch', () => {
  let sandbox, deleteBatchSessionsStub
  beforeEach(() => {
    sandbox = sinon.createSandbox()
    deleteBatchSessionsStub = sandbox.stub(ServerConnector.prototype, 'deleteBatchSessions')
  })

  afterEach(() => {
    sandbox.restore()
  })

  it('should throw', async () => {
    const batchIds = ['123', '456']
    deleteBatchSessionsStub.callsFake(() => {
      throw new Error('something happened')
    })
    const [err] = await presult(closeBatch({batchIds}))
    expect(err.message).to.equal('Error: something happened')
  })

  it('should call deleteBatchSession per batchId', async () => {
    const batchIds = ['123', '456']
    await closeBatch({batchIds})
    expect(deleteBatchSessionsStub.callCount).to.equal(2)
    batchIds.forEach((batchId, index) =>
      expect(deleteBatchSessionsStub.getCall(index).args).to.eql([batchId]),
    )
  })
})
