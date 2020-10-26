'use strict'

const path = require('path')
const cwd = process.cwd()
const startTestServer = require('../../src/test-server')
const {Target} = require(cwd)
const spec = require(path.resolve(cwd, 'src/spec-driver'))
const {getEyes} = require('../../src/test-setup')
const adjustUrlToDocker = require('../util/adjust-url-to-docker')

describe('TestDisableBrowserFetching', () => {
  let testServer
  let driver, destroyDriver

  before(async () => {
    const staticPath = path.join(__dirname, '../fixtures')
    testServer = await startTestServer({
      port: 5557,
      staticPath,
      middlewareFile: path.resolve(__dirname, '../util/ua-middleware'),
    })
  })

  after(async () => {
    await testServer.close()
  })

  beforeEach(async () => {
    ;[driver, destroyDriver] = await spec.build({browser: 'chrome'})
  })

  afterEach(async () => {
    await destroyDriver()
  })

  it('sends dontFetchResources to dom snapshot', async () => {
    const url = adjustUrlToDocker('http://localhost:5557/ua.html')
    await spec.visit(driver, url)
    const eyes = getEyes({vg: true, disableBrowserFetching: true})
    await eyes.open(driver, 'VgFetch', 'TestDisableBrowserFetching', {width: 800, height: 600})
    await eyes.check(Target.window())
    await eyes.close()
  })
})
