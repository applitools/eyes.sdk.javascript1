'use strict'

const path = require('path')
const cwd = process.cwd()
const startTestServer = require('../../src/test-server')
const {Target} = require(cwd)
const spec = require(path.resolve(cwd, 'src/spec-driver'))
const {getEyes} = require('../../src/test-setup')
const adjustUrlToDocker = require('../util/adjust-url-to-docker')

describe('DOMSnapshotSkipList', () => {
  let testServer
  let driver, destroyDriver

  before(async () => {
    const staticPath = path.join(__dirname, '../fixtures')
    testServer = await startTestServer({
      port: 5558,
      staticPath,
      middlewareFile: path.resolve(__dirname, '../util/ephemeral-middleware'),
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

  it('skip list for DOM snapshot works with dependencies for blobs', async () => {
    const url = adjustUrlToDocker('http://localhost:5558/skip-list/skip-list.html')
    await spec.visit(driver, url)
    const eyes = getEyes({vg: true})
    await eyes.open(driver, 'Applitools Eyes SDK', 'DOMSnapshotSkipList', {width: 800, height: 600})
    await eyes.check(Target.window().fully())
    await spec.visit(driver, url)
    await eyes.check(Target.window().fully())
    await eyes.close()
  })
})
