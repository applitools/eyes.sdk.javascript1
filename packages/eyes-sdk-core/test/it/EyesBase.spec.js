'use strict'

const assert = require('assert')
const {
  GeneralUtils: {sleep},
} = require('@applitools/eyes-common')
const {EyesBaseImpl} = require('../testUtils')
const {EyesBase, Configuration, RunningSession, BatchInfo} = require('../../index')

process.env.APPLITOOLS_COMPARE_TO_BRANCH_BASE = true

describe('EyesBase', () => {
  let eyes
  describe('getAndSetBatchInfo()', () => {
    beforeEach(() => {
      eyes = new EyesBaseImpl()
      eyes._getScmMergeBaseTime = async (branchName, parentBranchName) =>
        `some-datetime-of-${branchName}-${parentBranchName}`
      eyes._getAndSaveBatchInfoFromServer = async batchId => ({
        scmSourceBranch: `barnch-name-of-${batchId}`,
        scmTargetBranch: `parent-barnch-name-of-${batchId}`,
      })

      process.env.APPLITOOLS_BRANCH = null
      process.env.APPLITOOLS_PARENT_BRANCH = null
      process.env.APPLITOOLS_BATCH_ID = null
    })

    it('should return batch info on local branch test', async () => {
      const configuration = new Configuration({
        branchName: 'some-feature',
        parentBranchName: 'master-branch',
      })
      eyes.setConfiguration(configuration)
      const result = await eyes.handleScmMergeBaseTime()

      const expected = 'some-datetime-of-some-feature-master-branch'
      assert.deepStrictEqual(result, expected)
    })

    it('should return batch info on local branch test with env variables', async () => {
      process.env.APPLITOOLS_BRANCH = 'some-feature'
      process.env.APPLITOOLS_PARENT_BRANCH = 'master-branch'
      const result = await eyes.handleScmMergeBaseTime()

      const expected = 'some-datetime-of-some-feature-master-branch'
      assert.deepStrictEqual(result, expected)
    })

    it('should return batch info on ci branch test', async () => {
      eyes.setBatch('batch-name', 'some-batch-id')
      const result = await eyes.handleScmMergeBaseTime()

      const expected =
        'some-datetime-of-barnch-name-of-some-batch-id-parent-barnch-name-of-some-batch-id'
      assert.deepStrictEqual(result, expected)
    })

    it('should return batch info on ci branch test with env variables', async () => {
      process.env.APPLITOOLS_BATCH_ID = 'some-batch-id'
      const result = await eyes.handleScmMergeBaseTime()

      const expected =
        'some-datetime-of-barnch-name-of-some-batch-id-parent-barnch-name-of-some-batch-id'
      assert.deepStrictEqual(result, expected)
    })

    it('should return batch info with no scm data on same branch test', async () => {
      const configuration = new Configuration({
        branchName: 'some-feature',
        parentBranchName: 'some-feature',
      })
      eyes.setConfiguration(configuration)
      const result = await eyes.handleScmMergeBaseTime()

      const expected = undefined
      assert.deepStrictEqual(result, expected)
    })

    it('should return batch info on local branch test with batcn id', async () => {
      const configuration = new Configuration({
        branchName: 'some-feature',
        parentBranchName: 'master-branch',
      })
      eyes.setConfiguration(configuration)
      eyes.setBatch('batch-name', 'BID')
      const result = await eyes.handleScmMergeBaseTime()

      const expected = 'some-datetime-of-some-feature-master-branch'
      assert.deepStrictEqual(result, expected)
    })
  })

  describe('startSession()', () => {
    let startSessionArgs

    beforeEach(async () => {
      eyes = new EyesBaseImpl()
      eyes.handleScmMergeBaseTime = async () => {
        await sleep(10)
        return 'some-datetime'
      }
      const rs = new RunningSession()
      eyes._serverConnector = {startSession: async args => ((startSessionArgs = args), rs)}
      await eyes.openBase('appName', 'testName')
    })

    it('should set SessionStartInfo with ParentBranchBaselineSavedBefore', async () => {
      await eyes.startSession()

      assert.strictEqual(startSessionArgs.getBranchName(), undefined)
      assert.strictEqual(startSessionArgs.getParentBranchName(), undefined)
      assert.strictEqual(startSessionArgs.getParentBranchBaselineSavedBefore(), 'some-datetime')
    })

    it('should set SessionStartInfo with branch name and parent branch name', async () => {
      const configuration = new Configuration({
        branchName: 'aaa',
        parentBranchName: 'bbb',
        testName: 'ddd',
      })
      eyes.setConfiguration(configuration)
      await eyes.startSession()

      assert.strictEqual(startSessionArgs.getBranchName(), 'aaa')
      assert.strictEqual(startSessionArgs.getParentBranchName(), 'bbb')
      assert.strictEqual(startSessionArgs.getParentBranchBaselineSavedBefore(), 'some-datetime')
    })
  })

  describe('getUserSetBatchId()', () => {
    beforeEach(() => {
      eyes = new EyesBase()
      process.env.APPLITOOLS_BATCH_ID = null
    })

    it('returns user set batchId', async () => {
      process.env.APPLITOOLS_BATCH_ID = 'someId'
      const batchId = eyes.getUserSetBatchId()
      assert.strictEqual(batchId, 'someId')
    })

    it('returns user set batchId in configuration', async () => {
      const configuration = new Configuration({})
      configuration.setBatch(new BatchInfo({id: 'some id'}))
      eyes.setConfiguration(configuration)

      const batchId = eyes.getUserSetBatchId()
      assert.strictEqual(batchId, 'some id')
    })

    it('returns undefined if user did not set batch id', async () => {
      const batchId = eyes.getUserSetBatchId()
      assert.strictEqual(batchId, undefined)
    })

    it('returns undefined if the user did not set batch id but it was auto generated', async () => {
      eyes.getBatch().getId()
      const batchId = eyes.getUserSetBatchId()
      assert.strictEqual(batchId, undefined)
    })
  })

  it('sends request headers for all requests', async () => {
    const eyes = new EyesBaseImpl()
    const serverConnector = eyes._serverConnector
    serverConnector._axios.defaults.adapter = async config => ({
      status: 200,
      config,
      data: config.headers,
      headers: {},
      request: {},
    })
    eyes.setAgentId('custom')

    const {data} = await serverConnector._axios.request({url: 'http://bla.url'})
    assert.strictEqual(data['x-applitools-eyes-client'], 'custom [implBaseAgent]')
    assert.ok(data['x-applitools-eyes-client-request-id'])
  })
})
