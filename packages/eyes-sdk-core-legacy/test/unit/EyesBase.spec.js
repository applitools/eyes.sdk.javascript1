'use strict'

const assert = require('assert')
const EyesSDK = require('../../index')
const PromiseFactory = require('@applitools/eyes-common-legacy').PromiseFactory

const EyesBase = EyesSDK.EyesBase

describe('EyesBase', function() {
  /** @type {EyesBase} */ var eyes
  before(function() {
    eyes = new EyesBase(new PromiseFactory(), EyesBase.DEFAULT_EYES_SERVER, false)
    eyes.setApiKey(process.env.APPLITOOLS_API_KEY)
    eyes._promiseFactory.setFactoryMethods(function(asyncAction) {
      return new Promise(asyncAction)
    }, undefined)
  })

  describe('setBatch()', function() {
    it('should create an default batch', function() {
      var batch = eyes.getBatch()
      assert.strictEqual(typeof batch.id, 'string')
      assert.strictEqual(typeof batch.name, 'undefined')
      assert.strictEqual(typeof batch.startedAt, 'string')
    })

    it('should create batch with name', function() {
      eyes.setBatch('batch name')

      var batch = eyes.getBatch()
      assert.strictEqual(typeof batch.id, 'string')
      assert.strictEqual(batch.name, 'batch name')
      assert.strictEqual(typeof batch.startedAt, 'string')
    })

    it('should create batch with name, id', function() {
      eyes.setBatch('batch name', 'fake batch id')

      var batch = eyes.getBatch()
      assert.strictEqual(batch.id, 'fake batch id')
      assert.strictEqual(batch.name, 'batch name')
      assert.strictEqual(typeof batch.startedAt, 'string')
    })

    it('should create batch with name, id, time', function() {
      var time = new Date().toUTCString()
      eyes.setBatch('batch name2', 'fake batch id2', time)

      var batch = eyes.getBatch()
      assert.strictEqual(batch.id, 'fake batch id2')
      assert.strictEqual(batch.name, 'batch name2')
      assert.strictEqual(batch.startedAt, time)
    })

    it('should create batch from BatchInfo', function() {
      var defaultBatch = eyes.getBatch()

      eyes.setBatch('batch name', 'fake batch id')

      var batch = eyes.getBatch()
      assert.strictEqual(batch.id, 'fake batch id')
      assert.strictEqual(batch.name, 'batch name')
      assert.notDeepStrictEqual(batch, defaultBatch)
      assert.deepStrictEqual(eyes.getBatch(), batch)

      eyes.setBatch(defaultBatch)
      assert.deepStrictEqual(eyes.getBatch(), defaultBatch)
    })

    it('should create batch by default using values from env', function() {
      process.env.APPLITOOLS_BATCH_ID = 'fake id in env'
      process.env.APPLITOOLS_BATCH_NAME = 'fake batch name in env'

      var batch = eyes.getBatch()
      assert.strictEqual(batch.id, 'fake id in env')
      assert.strictEqual(batch.name, 'fake batch name in env')
    })

    afterEach(function() {
      eyes._batch = undefined
    })
  })

  describe('setProxy()', function() {
    it('should create a proxy string without auth', function() {
      eyes.setProxy('127.0.0.1:80')

      var actualProxy = eyes.getProxy()
      assert.strictEqual(actualProxy, '127.0.0.1:80')
    })

    it('should create a proxy string', function() {
      eyes.setProxy('127.0.0.1', 'admin', 'pa##word')

      var actualProxy = eyes.getProxy()
      assert.strictEqual(actualProxy, 'http://admin:pa##word@127.0.0.1')
    })

    it('should create a proxy string with protocol', function() {
      eyes.setProxy('http://127.0.0.1:90', 'admin', 'pa##word')

      var actualProxy = eyes.getProxy()
      assert.strictEqual(actualProxy, 'http://admin:pa##word@127.0.0.1:90')
    })

    afterEach(function() {
      delete eyes._serverConnector._httpOptions.proxy
    })
  })
})
