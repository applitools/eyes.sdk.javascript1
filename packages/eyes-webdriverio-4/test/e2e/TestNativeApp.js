'use strict'

const {strictEqual} = require('assert')
const shared = require('shared-examples-for')

shared.examplesFor('TestNativeApp', function(test) {
  it('TestCheckWindow', async () => {
    const result = await test.eyes.checkWindow('Window')
    strictEqual(result.getAsExpected(), true)
  })
})

module.exports.TestNativeApp = shared
