'use strict'

const assert = require('assert')
const {Configuration, BatchInfo} = require('../../index')
const {resetEnvVars} = require('../testUtils')

describe('TestEnvironmentVariables', () => {
  let apiKey
  before(() => {
    apiKey = process.env.APPLITOOLS_API_KEY
    console.log(apiKey)
  })
  beforeEach(() => {
    resetEnvVars()
  })

  after(() => {
    resetEnvVars()
    console.log(apiKey)
    process.env.APPLITOOLS_API_KEY = apiKey
  })

  it('TestApiKeyEnvironmentVariables', () => {
    process.env.APPLITOOLS_API_KEY = 'ApiKeyTest1234'
    const config = new Configuration()
    assert.strictEqual('ApiKeyTest1234', config.getApiKey())
    process.env.bamboo_APPLITOOLS_API_KEY = 'bambooApiKeyTest1234'

    assert.strictEqual('ApiKeyTest1234', config.getApiKey())
    process.env.APPLITOOLS_API_KEY = null
    assert.strictEqual('bambooApiKeyTest1234', config.getApiKey())
  })

  it('TestServerUrlEnvironmentVariables', () => {
    let config = new Configuration()
    assert.strictEqual('https://eyesapi.applitools.com', config.getServerUrl())

    process.env.APPLITOOLS_SERVER_URL = 'https://some.testurl.com/'
    config = new Configuration()
    assert.strictEqual('https://some.testurl.com/', config.getServerUrl())

    process.env.bamboo_APPLITOOLS_SERVER_URL = 'https://bamboo.testurl.com/'
    config = new Configuration()
    assert.strictEqual('https://some.testurl.com/', config.getServerUrl())

    process.env.APPLITOOLS_SERVER_URL = null
    config = new Configuration()
    assert.strictEqual('https://bamboo.testurl.com/', config.getServerUrl())
  })

  it('TestDontCloseBatchesEnvironmentVariables', () => {
    process.env.APPLITOOLS_DONT_CLOSE_BATCHES = 'true'
    let config = new Configuration()
    assert.strictEqual(true, config.getDontCloseBatches())

    process.env.bamboo_APPLITOOLS_DONT_CLOSE_BATCHES = 'false'
    config = new Configuration()
    assert.strictEqual(true, config.getDontCloseBatches())

    process.env.APPLITOOLS_DONT_CLOSE_BATCHES = null
    config = new Configuration()
    assert.strictEqual(false, config.getDontCloseBatches())

    process.env.bamboo_APPLITOOLS_DONT_CLOSE_BATCHES = 'true'
    config = new Configuration()
    assert.strictEqual(true, config.getDontCloseBatches())
  })

  it('TestBatchIdEnvironmentVariables', () => {
    process.env.APPLITOOLS_BATCH_ID = 'testBatchId'
    let batchInfo = new BatchInfo()
    assert.strictEqual('testBatchId', batchInfo.getId())

    process.env.bamboo_APPLITOOLS_BATCH_ID = 'bambooTestBatchId'
    batchInfo = new BatchInfo()
    assert.strictEqual('testBatchId', batchInfo.getId())

    process.env.APPLITOOLS_BATCH_ID = null
    batchInfo = new BatchInfo()
    assert.strictEqual('bambooTestBatchId', batchInfo.getId())
  })

  it('TestBatchNameEnvironmentVariables', () => {
    process.env.APPLITOOLS_BATCH_NAME = 'testBatchName'
    let batchInfo = new BatchInfo()
    assert.strictEqual('testBatchName', batchInfo.getName())

    process.env.bamboo_APPLITOOLS_BATCH_NAME = 'bambooTestBatchName'
    batchInfo = new BatchInfo()
    assert.strictEqual('testBatchName', batchInfo.getName())

    process.env.APPLITOOLS_BATCH_NAME = null
    batchInfo = new BatchInfo()
    assert.strictEqual('bambooTestBatchName', batchInfo.getName())
  })

  it('TestBatchSequenceNameEnvironmentVariables', () => {
    process.env.APPLITOOLS_BATCH_SEQUENCE = 'testBatchSequence'
    let batchInfo = new BatchInfo()
    assert.strictEqual('testBatchSequence', batchInfo.getSequenceName())

    process.env.bamboo_APPLITOOLS_BATCH_SEQUENCE = 'bambooTestBatchSequence'
    batchInfo = new BatchInfo()
    assert.strictEqual('testBatchSequence', batchInfo.getSequenceName())

    process.env.APPLITOOLS_BATCH_SEQUENCE = null
    batchInfo = new BatchInfo()
    assert.strictEqual('bambooTestBatchSequence', batchInfo.getSequenceName())
  })

  it('TestBatchNotifyEnvironmentVariables', () => {
    process.env.APPLITOOLS_BATCH_NOTIFY = 'true'
    let batchInfo = new BatchInfo()
    assert.strictEqual(true, batchInfo.getNotifyOnCompletion())

    process.env.bamboo_APPLITOOLS_BATCH_NOTIFY = 'false'
    batchInfo = new BatchInfo()
    assert.strictEqual(true, batchInfo.getNotifyOnCompletion())

    process.env.APPLITOOLS_BATCH_NOTIFY = null
    batchInfo = new BatchInfo()
    assert.strictEqual(false, batchInfo.getNotifyOnCompletion())

    process.env.bamboo_APPLITOOLS_BATCH_NOTIFY = 'true'
    batchInfo = new BatchInfo()
    assert.strictEqual(true, batchInfo.getNotifyOnCompletion())
  })

  it('TestBranchEnvironmentVariables', () => {
    process.env.APPLITOOLS_BRANCH = 'testBranchName'
    let config = new Configuration()
    assert.strictEqual('testBranchName', config.getBranchName())

    process.env.bamboo_APPLITOOLS_BRANCH = 'bambooTestBranchName'
    config = new Configuration()
    assert.strictEqual('testBranchName', config.getBranchName())

    process.env.APPLITOOLS_BRANCH = null
    config = new Configuration()
    assert.strictEqual('bambooTestBranchName', config.getBranchName())
  })

  it('TestParentBranchEnvironmentVariables', () => {
    process.env.APPLITOOLS_PARENT_BRANCH = 'testParentBranchName'
    let config = new Configuration()
    assert.strictEqual('testParentBranchName', config.getParentBranchName())

    process.env.bamboo_APPLITOOLS_PARENT_BRANCH = 'bambooParentTestBranchName'
    config = new Configuration()
    assert.strictEqual('testParentBranchName', config.getParentBranchName())

    process.env.APPLITOOLS_PARENT_BRANCH = null
    config = new Configuration()
    assert.strictEqual('bambooParentTestBranchName', config.getParentBranchName())
  })

  it('TestBaselineBranchEnvironmentVariables', () => {
    process.env.APPLITOOLS_BASELINE_BRANCH = 'testBaselineBranchName'
    let config = new Configuration()
    assert.strictEqual('testBaselineBranchName', config.getBaselineBranchName())

    process.env.bamboo_APPLITOOLS_BASELINE_BRANCH = 'bambooBaselineTestBranchName'
    config = new Configuration()
    assert.strictEqual('testBaselineBranchName', config.getBaselineBranchName())

    process.env.APPLITOOLS_BASELINE_BRANCH = null
    config = new Configuration()
    assert.strictEqual('bambooBaselineTestBranchName', config.getBaselineBranchName())
  })
})
