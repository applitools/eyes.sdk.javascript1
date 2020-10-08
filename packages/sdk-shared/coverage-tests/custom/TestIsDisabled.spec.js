'use strict'
const cwd = process.cwd()
const path = require('path')
const {getEyes} = require('../../src/test-setup')
const spec = require(path.resolve(cwd, 'src/spec-driver'))
const {Target} = require(cwd)

describe('Coverage Tests', () => {
  let driver, destroyDriver, eyes
  beforeEach(async () => {
    ;[driver, destroyDriver] = await spec.build({browser: 'chrome'})
    eyes = getEyes('classic', 'CSS')
  })
  afterEach(async () => {
    await eyes.abortIfNotClosed()
    await destroyDriver()
  })

  it('TestIsDisabled', async () => {
    eyes.setIsDisabled(true)
    await eyes.open(driver, 'Demo C# app', 'hello world', {width: 800, height: 600})
    await spec.visit(driver, 'https://applitools.com/helloworld?diff1')
    await eyes.check('', Target.window().fully())
    await eyes.check('Number test', Target.region('.random-number'))
    await eyes.check('', Target.window().withName('1'))
    await eyes.check('', Target.region('#someId').withName('2'))
    await eyes.checkFrame('ab', 'ab')
    await eyes.close()
  })
})
