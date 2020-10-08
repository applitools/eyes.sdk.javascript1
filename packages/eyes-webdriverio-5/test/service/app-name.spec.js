/* eslint-disable no-undef */
'use strict'

const url = 'http://applitools.github.io/demo/TestPages/FramesTestPage/'
const {strictEqual} = require('assert')

describe('appName1', () => {
  beforeEach(() => {
    browser.url(url)
  })

  it('check1', () => {
    browser.eyesCheck('region')
    browser.eyesClearProperties()
    strictEqual('appName1', browser.eyesGetConfiguration().getAppName())
  })
})

describe('appName2', () => {
  beforeEach(() => {
    browser.url(url)
  })

  it('check2', () => {
    browser.eyesCheck('region')
    strictEqual('appName2', browser.eyesGetConfiguration().getAppName())
  })
})

// this test doesn't pass because in `beforeTest` hook we set the appName, and that runs *after* the `beforeEach` hook and overrides it.
describe.skip('appName3', () => {
  beforeEach(() => {
    browser.url(url)
    browser.eyesGetConfiguration().setAppName('appName3_')
  })

  it('check3', () => {
    browser.eyesCheck('region')
    strictEqual('appName3_', browser.eyesGetConfiguration().getAppName())
  })
})

describe('appName4', () => {
  it('check4', () => {
    const configuration = browser.eyesGetConfiguration()
    configuration.setAppName('appName4_1')
    browser.eyesSetConfiguration(configuration)
    browser.eyesCheck('region')
    strictEqual('appName4_1', browser.eyesGetConfiguration().getAppName())
  })
})
