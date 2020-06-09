'use strict'

const path = require('path')
const cwd = process.cwd()
const {testServer} = require('@applitools/sdk-shared')
const {Target} = require(cwd)
const spec = require(path.resolve(cwd, 'src/SpecWrappedDriver'))
const {getEyes, Browsers} = require('../util/TestSetup')

describe('TestVisualGridRefererHeader', () => {
  let testServer1, testServer2
  let driver

  before(async () => {
    const staticPath = path.join(__dirname, '../fixtures')
    testServer1 = await testServer({port: 5555, staticPath})
    testServer2 = await testServer({
      staticPath,
      port: 5556,
      allowCors: false,
      middleWare: (req, res, next) => {
        if (req.headers.referer === 'http://localhost:5555/cors.html') {
          next()
        } else {
          res.status(404).send('Not found')
        }
      },
    })
  })

  after(async () => {
    // await new Promise(r => setTimeout(r, 30000))
    await Promise.all([testServer1.close(), testServer2.close()])
  })

  beforeEach(async () => {
    driver = await spec.build({capabilities: Browsers.chrome()})
  })

  it('send referer header', async () => {
    const url = 'http://localhost:5555/cors.html'
    await spec.visit(driver, url)
    const eyes = getEyes('VG')
    await eyes.open(driver, 'VgFetch', ' VgFetch referer')
    await eyes.check('referer', Target.window())
    await eyes.close()
  })
})
