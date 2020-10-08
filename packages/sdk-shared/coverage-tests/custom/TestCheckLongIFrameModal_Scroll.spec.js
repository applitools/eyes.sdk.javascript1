'use strict'
const path = require('path')
const cwd = process.cwd()
const spec = require(path.resolve(cwd, 'src/spec-driver'))
const {getEyes} = require('../../src/test-setup')
const {TestCheckLongIFrameModal} = require('./TestFluentApi_utils')

describe('Coverage tests', () => {
  let driver, destroyDriver, eyes

  afterEach(async () => {
    await eyes.abortIfNotClosed()
    await destroyDriver()
  })

  beforeEach(async () => {
    ;[driver, destroyDriver] = await spec.build({browser: 'chrome'})
    await spec.visit(driver, 'https://applitools.github.io/demo/TestPages/FramesTestPage/')
    eyes = await getEyes({branchName: 'v2'})
    eyes.setMatchTimeout(0)
  })

  it('TestCheckLongIFrameModal_Scroll', () =>
    TestCheckLongIFrameModal({testName: 'TestCheckLongIFrameModal_Scroll', eyes, driver}))
})
