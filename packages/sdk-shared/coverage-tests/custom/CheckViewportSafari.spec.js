'use strict'

const cwd = process.cwd()
const path = require('path')
const spec = require(path.resolve(cwd, 'src/SpecDriver'))
const {Target} = require(cwd)
const {getEyes} = require('../../src/test-setup')

describe('CheckViewportSafari (@webdriver @safari)', () => {
  let driver, eyes

  afterEach(async () => {
    await eyes.abort()
    await spec.cleanup(driver)
  })

  it('Safari11', async () => {
    driver = await spec.build({browser: 'safari-11', remote: 'sauce', legacy: true})
    eyes = new getEyes()
    await spec.visit(driver, 'https://applitools.github.io/demo/TestPages/FramesTestPage/')
    await eyes.open(driver, 'Safari 11', 'viewport', {width: 800, height: 600})
    await spec.executeScript(driver, 'window.scrollTo(0, 9999)')
    await eyes.check('', Target.window())
    return eyes.close()
  })

  it('Safari12', async () => {
    driver = await spec.build({browser: 'safari-12', remote: 'sauce', legacy: true})
    eyes = new getEyes()
    await spec.visit(driver, 'https://applitools.github.io/demo/TestPages/FramesTestPage/')
    await eyes.open(driver, 'Safari 12', 'viewport', {width: 800, height: 600})
    await spec.executeScript(driver, 'window.scrollTo(0, 9999)')
    await eyes.check('', Target.window())
    return eyes.close()
  })
})
