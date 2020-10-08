'use strict'

const assert = require('assert')

const {BatchInfo} = require('../../../index')

describe('BatchInfo', () => {
  it('create empty batch', () => {
    const batch = new BatchInfo()
    assert.strictEqual(typeof batch.getId(), 'string')
    assert.strictEqual(typeof batch.getName(), 'undefined')
    assert.strictEqual(typeof batch.getStartedAt(), 'object')
    assert.strictEqual(typeof batch.getSequenceName(), 'undefined')
  })

  it('create batch by name', () => {
    const batch = new BatchInfo('hello')
    assert.strictEqual(typeof batch.getId(), 'string')
    assert.strictEqual(typeof batch.getName(), 'string')
    assert.strictEqual(typeof batch.getStartedAt(), 'object')
    assert.strictEqual(typeof batch.getSequenceName(), 'undefined')
    assert.strictEqual(batch.getName(), 'hello')
  })

  it('create batch by name, startedAt, id, sequenceName', () => {
    const started = new Date()
    const batch = new BatchInfo('hello', started, 'id')
    assert.strictEqual(typeof batch.getId(), 'string')
    assert.strictEqual(typeof batch.getName(), 'string')
    assert.strictEqual(typeof batch.getStartedAt(), 'object')
    assert.strictEqual(typeof batch.getSequenceName(), 'undefined')
    assert.strictEqual(batch.getId(), 'id')
    assert.strictEqual(batch.getName(), 'hello')
    assert.strictEqual(batch.getStartedAt(), started)
  })

  it('create batch from object', () => {
    const started = new Date()
    const batch = new BatchInfo({id: 'id', name: 'hello', startedAt: started, sequenceName: 'bla'})
    assert.strictEqual(typeof batch.getId(), 'string')
    assert.strictEqual(typeof batch.getName(), 'string')
    assert.strictEqual(typeof batch.getStartedAt(), 'object')
    assert.strictEqual(typeof batch.getSequenceName(), 'string')
    assert.strictEqual(batch.getId(), 'id')
    assert.strictEqual(batch.getName(), 'hello')
    assert.strictEqual(batch.getStartedAt(), started)
    assert.strictEqual(batch.getSequenceName(), 'bla')
  })

  it('create batch from another batch', () => {
    const batch = new BatchInfo('hello', new Date(), 'id')
    const batch2 = new BatchInfo(batch)
    assert.strictEqual(batch.getId(), batch2.getId())
    assert.strictEqual(batch.getName(), batch2.getName())
    assert.strictEqual(batch.getStartedAt(), batch2.getStartedAt())
  })

  it('should use APPLITOOLS_BATCH_NOTIFY env variable', async function() {
    process.env.APPLITOOLS_BATCH_NOTIFY = 'true'
    let batchInfo = new BatchInfo()
    assert.strictEqual(batchInfo.getNotifyOnCompletion(), true)

    process.env.APPLITOOLS_BATCH_NOTIFY = 'false'
    batchInfo = new BatchInfo()
    assert.strictEqual(batchInfo.getNotifyOnCompletion(), false)

    process.env.APPLITOOLS_BATCH_NOTIFY = true
    batchInfo = new BatchInfo()
    assert.strictEqual(batchInfo.getNotifyOnCompletion(), true)

    process.env.APPLITOOLS_BATCH_NOTIFY = false
    batchInfo = new BatchInfo()
    assert.strictEqual(batchInfo.getNotifyOnCompletion(), false)

    batchInfo = new BatchInfo()
    batchInfo.setNotifyOnCompletion(true)
    assert.strictEqual(batchInfo.getNotifyOnCompletion(), true)

    batchInfo = new BatchInfo()
    batchInfo.setNotifyOnCompletion(false)
    assert.strictEqual(batchInfo.getNotifyOnCompletion(), false)
  })
})
