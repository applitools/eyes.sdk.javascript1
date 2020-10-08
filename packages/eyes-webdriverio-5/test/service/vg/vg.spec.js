/* global browser */
'use strict'
const {expect} = require('chai')
const {ApiAssertions} = require('@applitools/sdk-shared')
const {version} = require('../../../package.json')

describe('vg', () => {
  it('full page', () => {
    browser.url('http://applitools.github.io/demo/TestPages/FramesTestPage/')
    browser.eyesCheck('full page')
  })
  after(() => {
    const testResults = browser.eyesGetTestResults()
    const data = browser.call(() =>
      ApiAssertions.getApiData(testResults, process.env.APPLITOOLS_API_KEY),
    )
    expect(data.startInfo.agentId).to.equal(`eyes-webdriverio-service-visualgrid/${version}`)
  })
})
