'use strict'

const assert = require('assert')
const chromedriver = require('chromedriver')
const {Builder} = require('selenium-webdriver')
const testServer = require('../../util/testServer')
const {
  Eyes,
  Target,
  ConsoleLogHandler,
  TestResultsStatus,
  VisualGridRunner,
} = require('../../../index')

describe('TestVisualGridRefererHeader', () => {
  let closeTestServer, closeTestServer2
  let serverUrl, driver

  before(async () => {
    const testServer1 = testServer({port: 5555})
    const testServer2 = testServer({
      port: 5556,
      allowCORS: false,
      middleWare: (req, res, next) => {
        if (req.headers.referer === 'http://localhost:5555/cors.html') {
          next()
        } else {
          res.status(404).send('Not found')
        }
      },
    })
    const cd = chromedriver.start(['--whitelisted-ips=127.0.0.1'], true)

    ;[{close: closeTestServer}, {close: closeTestServer2}] = await Promise.all([
      testServer1,
      testServer2,
      cd,
    ])
  })

  after(async () => {
    // await new Promise(r => setTimeout(r, 30000))
    await Promise.all([chromedriver.stop(), closeTestServer(), closeTestServer2()])
  })

  beforeEach(async () => {
    driver = await new Builder()
      .withCapabilities({
        browserName: 'chrome',
        'goog:chromeOptions': {
          args: ['headless'],
        },
      })
      .build()
  })

  it('send referer header', async () => {
    const url = 'http://localhost:5555/cors.html'
    await driver.get(url)
    const eyes = setupEyes()
    await eyes.open(driver, 'VgFetch', ' VgFetch referer')
    await eyes.check('referer', Target.window())
    const testResults = await eyes.close(false)
    assert.strictEqual(testResults.getStatus(), TestResultsStatus.Passed)
  })

  function setupEyes() {
    const runner = new VisualGridRunner()
    const eyes = new Eyes(runner)
    eyes.setServerUrl(serverUrl)
    if (process.env.APPLITOOLS_SHOW_LOGS) {
      eyes.setLogHandler(new ConsoleLogHandler(true))
    }
    eyes.setMatchTimeout(0)
    return eyes
  }
})
