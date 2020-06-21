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
      serverUrl: 'https://hub-cloud.browserstack.com/wd/hub',
      capabilities: {
        'bstack:options': {
          os: 'OS X',
          osVersion: 'High Sierra',
          local: 'false',
          seleniumVersion: '3.5.2',
          userName: process.env.BROWSERSTACK_USERNAME,
          accessKey: process.env.BROWSERSTACK_ACCESS_KEY,
        },
        browserName: 'Safari',
        browserVersion: '11.0',
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
      serverUrl: 'https://hub-cloud.browserstack.com/wd/hub',
      capabilities: {
        'bstack:options': {
          os: 'OS X',
          osVersion: 'Mojave',
          local: 'false',
          seleniumVersion: '3.13.0',
          userName: process.env.BROWSERSTACK_USERNAME,
          accessKey: process.env.BROWSERSTACK_ACCESS_KEY,
        },
        browserName: 'Safari',
        browserVersion: '12.1',
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
