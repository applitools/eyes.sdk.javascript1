'use strict'
const cwd = process.cwd()
const path = require('path')
const {getEyes, Browsers} = require('../util/TestSetup')
const spec = require(path.resolve(cwd, 'src/SpecWrappedDriver'))
const {Target} = require(cwd)

describe('Coverage Tests', () => {
  let driver, eyes
  beforeEach(async () => {
    driver = await spec.build({capabilities: Browsers.chrome()})
    eyes = getEyes('classic', 'CSS')
  })
  afterEach(async () => {
    await eyes.abortIfNotClosed()
    await spec.cleanup(driver)
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
