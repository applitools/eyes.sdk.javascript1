const assertRejects = require('assert-rejects')
const {startFakeEyesServer} = require('@applitools/sdk-fake-eyes-server')
const MockDriver = require('../utils/MockDriver')
const FakeEyesFactory = require('../utils/FakeEyesFactory')
const FakeCheckSettings = require('../utils/FakeCheckSettings')
const {ElementNotFoundError} = require('../../index')

describe('Bad Selectors', () => {
  let server, serverUrl, driver, eyes

  before(async () => {
    driver = new MockDriver()
    driver.mockElement('element0')
    eyes = new FakeEyesFactory()
    server = await startFakeEyesServer({logger: eyes._logger, matchMode: 'always'})
    serverUrl = `http://localhost:${server.port}`
    eyes.setServerUrl(serverUrl)
  })

  after(async () => {
    await server.close()
  })

  afterEach(async () => {
    await eyes.abort()
  })

  it('check region with bad selector', async () => {
    await eyes.open(driver, 'FakeApp', 'FakeTest')
    await assertRejects(
      eyes.check('', FakeCheckSettings.region('element that does not exist')),
      ElementNotFoundError,
    )
  })

  it('test check region with bad ignore selector', async () => {
    await eyes.open(driver, 'FakeApp', 'FakeTest')
    await eyes.check('', FakeCheckSettings.window().ignore('element that does not exist'))
    await eyes.close()
  })
})
