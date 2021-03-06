/* global browser */
'use strict'
const {expect} = require('chai')
const {Target} = require('../../..')
const {getTestInfo} = require('@applitools/test-utils')
const {version} = require('../../../package.json')

describe('EyesServiceTest', () => {
  it('checkWindow', () => {
    browser.url('https://applitools.github.io/demo/TestPages/FramesTestPage/index.html')
    browser.eyesCheck('', Target.window())
    const testResults = browser.eyesGetTestResults()
    const data = browser.call(() => getTestInfo(testResults, process.env.APPLITOOLS_API_KEY))
    expect(data.startInfo.agentId).to.equal(`eyes-webdriverio-service/${version}`)
  })
})
