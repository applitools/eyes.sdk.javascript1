const assert = require('assert')
const assertRejects = require('assert-rejects')
const {startFakeEyesServer} = require('@applitools/sdk-fake-eyes-server')
const MockDriver = require('../utils/MockDriver')
const FakeEyesClassic = require('../utils/FakeEyesClassic')
const FakeCheckSettings = require('../utils/FakeCheckSettings')

describe('ClassicRunner', () => {
  let server, serverUrl, driver, eyes

  before(async () => {
    driver = new MockDriver()
    eyes = new FakeEyesClassic()
    server = await startFakeEyesServer({logger: eyes._logger, matchMode: 'never'})
    serverUrl = `http://localhost:${server.port}`
    eyes.setServerUrl(serverUrl)
  })

  beforeEach(async () => {
    await eyes.open(driver, 'FakeApp', 'FakeTest')
  })

  afterEach(async () => {
    await eyes.abort()
  })

  after(async () => {
    await server.close()
  })

  it('getAllTestResults should throw exception', async () => {
    await eyes.check('diff', FakeCheckSettings.window())
    await eyes.close(false)

    const throwEx = true
    await assertRejects(eyes.getRunner().getAllTestResults(throwEx), err => {
      assert.strictEqual(err.name, 'NewTestError')
      return true
    })
  })

  it("getAllTestResults shouldn't throw exception", async () => {
    await eyes.check('diff', FakeCheckSettings.window())
    await eyes.close(false)

    const throwEx = false
    await eyes.getRunner().getAllTestResults(throwEx)
  })
})
