'use strict'

const path = require('path')
const cwd = process.cwd()
const {testServer} = require('@applitools/test-server')
const {Target} = require(cwd)
const spec = require(path.resolve(cwd, 'dist/spec-driver'))
const {setupEyes} = require('@applitools/test-utils')
const adjustUrlToDocker = require('../util/adjust-url-to-docker')

describe('TestCookies', () => {
  let server, corsServer
  let driver, destroyDriver

  before(async () => {
    const staticPath = path.join(__dirname, '../fixtures/cookies')
    const corsStaticPath = path.join(__dirname, '../fixtures/cookies/cors_images')

    corsServer = await testServer({
        port: 5558,
        staticPath: corsStaticPath,
        allowCors: true,
        middlewareFile: path.join(__dirname, '../util/restrict-cookies-middleware.js'),
    })
    server = await testServer({
      port: 5557,
      staticPath,
      middlewareFile: path.join(__dirname, '../util/create-cookies-middleware.js'),
    })
    
  })

  after(async () => {
    await server.close()
    await corsServer.close()
  })

  beforeEach(async () => {
    ;[driver, destroyDriver] = await spec.build({browser: 'chrome', attach: true})
  })

  afterEach(async () => {
    await destroyDriver()
  })

  it('get cookies', async () => {
    const url = adjustUrlToDocker('http://localhost:5557')
    await spec.visit(driver, url)
    const eyes = setupEyes({vg: true, disableBrowserFetching: true})
    await eyes.open(driver, 'Cookies', 'TestCookies', {width: 800, height: 600})
    await eyes.check(Target.window())
    await eyes.close()
  })
})
