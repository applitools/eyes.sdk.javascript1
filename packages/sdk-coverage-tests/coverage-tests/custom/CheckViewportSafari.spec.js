'use strict'

const cwd = process.cwd()
const path = require('path')
const spec = require(path.resolve(cwd, 'src/SpecWrappedDriver'))
const {Target} = require(cwd)
const {getEyes} = require('../util/TestSetup')

describe('CheckViewportSafari', () => {
  let driver, eyes

  afterEach(async () => {
    await eyes.abort()
    await spec.cleanup(driver)
  })

  it('Safari11', async () => {
    driver = await spec.build({
      serverUrl: 'https://ondemand.saucelabs.com:443/wd/hub',
      capabilities: {
        username: process.env.SAUCE_USERNAME,
        accessKey: process.env.SAUCE_ACCESS_KEY,
        seleniumVersion: '3.4.0',
        browserName: 'safari',
        version: '11.0',
        platform: 'macOS 10.12',
      },
    })
    eyes = new getEyes()
    await spec.visit(driver, 'https://applitools.github.io/demo/TestPages/FramesTestPage/')
    await eyes.open(driver, 'Safari 11', 'viewport', {width: 800, height: 600})
    await spec.executeScript(driver, 'window.scrollTo(0, 9999)')
    await eyes.check('', Target.window())
    return eyes.close()
  })

  it('Safari12', async () => {
    driver = await spec.build({
      serverUrl: 'https://ondemand.saucelabs.com:443/wd/hub',
      capabilities: {
        username: process.env.SAUCE_USERNAME,
        accessKey: process.env.SAUCE_ACCESS_KEY,
        seleniumVersion: '3.4.0',
        browserName: 'safari',
        version: '12.1',
        platform: 'macOS 10.13',
      },
    })
    eyes = new getEyes()
    await spec.visit(driver, 'https://applitools.github.io/demo/TestPages/FramesTestPage/')
    await eyes.open(driver, 'Safari 12', 'viewport', {width: 800, height: 600})
    await spec.executeScript(driver, 'window.scrollTo(0, 9999)')
    await eyes.check('', Target.window())
    return eyes.close()
  })
})
