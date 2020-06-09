'use strict'

const assert = require('assert')
const {EyesBase, Configuration} = require('../../index')
const {resetEnvVars} = require('../testUtils')

describe('EyesBase', () => {
  describe('setBatch()', () => {
    let eyes
    let apiKey
    before(() => {
      apiKey = process.env.APPLITOOLS_API_KEY
      resetEnvVars()
      eyes = new EyesBase()
    })
    after(() => {
      resetEnvVars()
      process.env.APPLITOOLS_API_KEY = apiKey
    })

    it('should create default batch', () => {
      const batch = eyes.getBatch()
      assert.strictEqual(typeof batch.getId(), 'string')
      assert.strictEqual(typeof batch.getName(), 'undefined')
      assert.strictEqual(typeof batch.getStartedAt(), 'object')
      assert.strictEqual(typeof batch.getSequenceName(), 'undefined')
    })

    it('should create batch with name', () => {
      eyes.setBatch('batch name')

      const batch = eyes.getBatch()
      assert.strictEqual(typeof batch.getId(), 'string')
      assert.strictEqual(batch.getName(), 'batch name')
      assert.strictEqual(typeof batch.getStartedAt(), 'object')
      assert.strictEqual(typeof batch.getSequenceName(), 'undefined')
    })

    it('should thrown an error because of wrong arguments order', () => {
      assert.throws(() => {
        eyes.setBatch(new Date(), 'my batch')
      })
    })

    it('should create batch with name, id', () => {
      eyes.setBatch('batch name', 'fake batch id')

      const batch = eyes.getBatch()
      assert.strictEqual(batch.getId(), 'fake batch id')
      assert.strictEqual(batch.getName(), 'batch name')
      assert.strictEqual(typeof batch.getStartedAt(), 'object')
      assert.strictEqual(typeof batch.getSequenceName(), 'undefined')
    })

    it('should create batch with name, id, time', () => {
      const time = new Date()
      time.setMilliseconds(0)

      eyes.setBatch('batch name2', 'fake batch id2', time)

      const batch = eyes.getBatch()
      assert.strictEqual(batch.getId(), 'fake batch id2')
      assert.strictEqual(batch.getName(), 'batch name2')
      assert.strictEqual(batch.getStartedAt().getTime(), time.getTime())
      assert.strictEqual(typeof batch.getSequenceName(), 'undefined')
    })

    it('should create batch with name, id, time, sequence', () => {
      const time = new Date()
      time.setMilliseconds(0)

      eyes.setBatch('batch name2', 'fake batch id2', time)

      const batch = eyes.getBatch()
      assert.strictEqual(batch.getId(), 'fake batch id2')
      assert.strictEqual(batch.getName(), 'batch name2')
      assert.strictEqual(batch.getStartedAt().getTime(), time.getTime())
      assert.strictEqual(batch.getSequenceName(), undefined)
    })

    it('should create batch from object', () => {
      const date = new Date(2019)
      eyes.setBatch({
        id: 'fake batch id',
        name: 'batch name',
        startedAt: date,
        sequenceName: 'beta sequence',
      })

      assert.strictEqual(eyes.getBatch().getId(), 'fake batch id')
      assert.strictEqual(eyes.getBatch().getName(), 'batch name')
      assert.strictEqual(eyes.getBatch().getStartedAt(), date)
      assert.strictEqual(eyes.getBatch().getSequenceName(), 'beta sequence')
    })

    it('should create batch from BatchInfo', () => {
      const defaultBatch = eyes.getBatch()

      eyes.setBatch('batch name', 'fake batch id')
      eyes.getBatch().setSequenceName('gamma sequence')

      const batch = eyes.getBatch()
      assert.strictEqual(batch.getId(), 'fake batch id')
      assert.strictEqual(batch.getName(), 'batch name')
      assert.strictEqual(batch.getSequenceName(), 'gamma sequence')
      assert.notDeepStrictEqual(batch, defaultBatch)
      assert.deepStrictEqual(eyes.getBatch(), batch)

      eyes.setBatch(defaultBatch)
      assert.deepStrictEqual(eyes.getBatch(), defaultBatch)
    })

    it('should create batch by default using values from env', () => {
      process.env.APPLITOOLS_BATCH_ID = 'fake id in env'
      process.env.APPLITOOLS_BATCH_NAME = 'fake batch name in env'
      process.env.APPLITOOLS_BATCH_SEQUENCE = 'delta sequence'

      const batch = eyes.getBatch()
      assert.strictEqual(batch.getId(), 'fake id in env')
      assert.strictEqual(batch.getName(), 'fake batch name in env')
      assert.strictEqual(batch.getSequenceName(), 'delta sequence')
    })
    afterEach(() => {
      eyes.setBatch(undefined)

      delete process.env.APPLITOOLS_BATCH_ID
      delete process.env.APPLITOOLS_BATCH_NAME
      delete process.env.APPLITOOLS_BATCH_SEQUENCE
    })
  })

  it('should not modify Configuration object', async () => {
    const eyes = new EyesBase()
    const originalConfig = new Configuration()
    originalConfig.setAppName('AppName')
    originalConfig.setTestName('TestName')
    originalConfig.setViewportSize({width: 500, height: 500})
    eyes.setConfiguration(originalConfig)

    //imitate internal use
    eyes._configuration.setAppName('OtherAppName')
    eyes._configuration.setTestName('OtherTestName')
    eyes._configuration.setViewportSize({width: 300, height: 300})

    const eyesConfig = eyes.getConfiguration()

    assert.strictEqual(originalConfig.getAppName(), 'AppName')
    assert.strictEqual(eyesConfig.getAppName(), 'OtherAppName')
    assert.strictEqual(originalConfig.getTestName(), 'TestName')
    assert.strictEqual(eyesConfig.getTestName(), 'OtherTestName')
    assert.deepStrictEqual(originalConfig.getViewportSize().toJSON(), {width: 500, height: 500})
    assert.deepStrictEqual(eyesConfig.getViewportSize().toJSON(), {width: 300, height: 300})
  })

  describe('getFullAgentId', () => {
    it('works with base agent id only', () => {
      const origGetBaseAgentID = EyesBase.prototype.getBaseAgentId
      try {
        EyesBase.prototype.getBaseAgentId = () => 'base id'
        const eyes = new EyesBase()
        assert.strictEqual(eyes.getFullAgentId(), 'base id')
      } finally {
        EyesBase.prototype.getBaseAgentId = origGetBaseAgentID
      }
    })

    it('works with base agent and user set agent id', () => {
      const origGetBaseAgentID = EyesBase.prototype.getBaseAgentId
      try {
        EyesBase.prototype.getBaseAgentId = () => 'base id'
        const eyes = new EyesBase()
        eyes.setAgentId('custom')
        assert.strictEqual(eyes.getFullAgentId(), 'custom [base id]')
      } finally {
        EyesBase.prototype.getBaseAgentId = origGetBaseAgentID
      }
    })

    it('throws when no base agent id was not set', () => {
      const eyes = new EyesBase()
      assert.throws(() => {
        eyes.getFullAgentId()
      })
    })

    it('sets agent id via configuration', () => {
      const origGetBaseAgentID = EyesBase.prototype.getBaseAgentId
      try {
        EyesBase.prototype.getBaseAgentId = () => 'base id'
        const eyes = new EyesBase()
        eyes.setAgentId('custom-wrong')
        eyes.setConfiguration(new Configuration({agentId: 'custom'}))
        assert.strictEqual(eyes.getFullAgentId(), 'custom [base id]')
      } finally {
        EyesBase.prototype.getBaseAgentId = origGetBaseAgentID
      }
    })
  })
})
