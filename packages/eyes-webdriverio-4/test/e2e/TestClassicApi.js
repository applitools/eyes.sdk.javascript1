'use strict'

const shared = require('shared-examples-for')
const {By} = require('../../index')

shared.examplesFor('TestClassicApi', function(test) {
  it('TestIgnoreCaret', async () => {
    test.eyes.setHideCaret(true)
    await test.browser.$('/html/body/input').setValue('test')

    await test.eyes.checkRegionBy(By.xPath('/html/body/input'), 'input')
  })
})

module.exports.TestClassicApi = shared
