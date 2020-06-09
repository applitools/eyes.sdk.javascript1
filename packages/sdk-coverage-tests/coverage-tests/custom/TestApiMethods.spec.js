'use strict'
const cwd = process.cwd()
const path = require('path')
const spec = require(path.resolve(cwd, 'src/SpecWrappedDriver'))
const {getEyes, Browsers} = require('../util/TestSetup')
const {Target} = require(cwd)

describe('api methods', () => {
  let driver, eyes
  beforeEach(async () => {
    driver = await spec.build({capabilities: Browsers.chrome()})
  })
  afterEach(async function() {
    await spec.cleanup(driver)
    await eyes.abortIfNotClosed()
  })
  describe('classic', function() {
    beforeEach(async function() {
      eyes = await getEyes({isCssStitching: true})
    })
    it('TestCloseAsync', testCloseAsync)
  })
  describe('visualGrid', function() {
    beforeEach(async function() {
      eyes = await getEyes({isVisualGrid: true})
    })
    it('TestCloseAsync', testCloseAsync)
  })

  async function testCloseAsync() {
    await spec.visit(driver, 'https://applitools.com/helloworld')
    await eyes.open(driver, 'TestApiMethods', `TestCloseAsync_1`, {
      width: 800,
      height: 600,
    })
    await eyes.check('step 1', Target.window())
    await eyes.closeAsync()

    const el = await spec.findElement(driver, 'button')
    await spec.click(driver, el)
    await eyes.open(driver, 'TestApiMethods', `TestCloseAsync_2`, {
      width: 800,
      height: 600,
    })
    await eyes.check('step 2', Target.window())
    await eyes.closeAsync()

    await eyes.getRunner().getAllTestResults()
  }
})
