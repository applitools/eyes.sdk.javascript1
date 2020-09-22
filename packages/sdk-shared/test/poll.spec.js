const assert = require('assert')
const poll = require('../utils/poll')

describe('poll', () => {
  it('works', async () => {
    const key = 'key'
    const context = {[key]: {}}
    const r = poll(context, key)
    assert.deepStrictEqual(r, {status: 'WIP'})
    context[key].value = 'result'
    const r2 = poll(context, key)
    assert.deepStrictEqual(r2, {status: 'SUCCESS', value: 'result'})
  })

  it('returns result by chunks', async () => {
    const key = 'key'
    const context = {[key]: {}}
    const r = poll(context, key, {chunkByteLength: 5})
    assert.deepStrictEqual(r, {status: 'WIP'})
    context[key].value = '😊12345єїжtrdh'
    const r2 = poll(context, key, {chunkByteLength: 5})
    assert.deepStrictEqual(r2, {status: 'SUCCESS_CHUNKED', value: '"😊', done: false})
    const r3 = poll(context, key, {chunkByteLength: 5})
    assert.deepStrictEqual(r3, {status: 'SUCCESS_CHUNKED', value: '12345', done: false})
    const r4 = poll(context, key, {chunkByteLength: 5})
    assert.deepStrictEqual(r4, {status: 'SUCCESS_CHUNKED', value: 'єї', done: false})
    const r5 = poll(context, key, {chunkByteLength: 5})
    assert.deepStrictEqual(r5, {status: 'SUCCESS_CHUNKED', value: 'жtrd', done: false})
    const r6 = poll(context, key, {chunkByteLength: 5})
    assert.deepStrictEqual(r6, {status: 'SUCCESS_CHUNKED', value: 'h"', done: true})
  })

  it('returns error when rejects', async () => {
    const key = 'key'
    const context = {[key]: {}}
    const r = poll(context, key)
    assert.deepStrictEqual(r, {status: 'WIP'})
    context[key].error = 'error'
    const r2 = poll(context, key)
    assert.deepStrictEqual(r2, {status: 'ERROR', error: 'error'})
  })
})
