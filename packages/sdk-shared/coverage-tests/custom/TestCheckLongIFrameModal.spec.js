'use strict'
const path = require('path')
const cwd = process.cwd()
const spec = require(path.resolve(cwd, 'src/SpecDriver'))
const {getEyes} = require('../../src/test-setup')
const {TestCheckLongIFrameModal} = require('./TestFluentApi_utils')

describe.skip('Coverage tests', () => {
  let driver, eyes

  afterEach(async () => {
    await eyes.abortIfNotClosed()
    await spec.cleanup(driver)
  })

  beforeEach(async () => {
    driver = await spec.build({browser: 'chrome'})
    await spec.visit(driver, 'https://applitools.github.io/demo/TestPages/FramesTestPage/')
    eyes = await getEyes({isCssStitching: true, branchName: 'v2'})
    eyes.setMatchTimeout(0)
  })

  it('TestCheckLongIFrameModal', () =>
    TestCheckLongIFrameModal({testName: 'TestCheckLongIFrameModal', eyes, driver}))
})
