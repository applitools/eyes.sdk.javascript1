'use strict'
const cwd = process.cwd()
const path = require('path')
const {getEyes} = require('../../src/test-setup')
const spec = require(path.resolve(cwd, 'src/spec-driver'))
const {Target} = require(cwd)

describe('app viewport (@native @mobile @ios)', function() {
  let driver, destroyDriver, eyes
  before(async () => {
    ;[driver, destroyDriver] = await spec.build({
      device: 'app-ios',
    })
    eyes = new getEyes()
  })

  afterEach(async () => {
    await destroyDriver()
    await eyes.abortIfNotClosed()
  })

  it('should capture the app without the system status/navigation bars', async () => {
    await eyes.open(driver, 'Mobile Native Tests', 'app viewport')
    await eyes.check('check', Target.window())
    await eyes.close(true)
  })
})
