const assert = require('assert')
const {startFakeEyesServer} = require('@applitools/sdk-fake-eyes-server')
const MockDriver = require('../utils/MockDriver')
const FakeEyesClassic = require('../utils/FakeEyesClassic')
const FakeCheckSettings = require('../utils/FakeCheckSettings')

describe('MarkScrollRootElement', () => {
  let server, serverUrl, driver, eyes

  before(async () => {
    driver = new MockDriver()
    driver.mockElement('scroll-root-element')
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

  it('scroll root element is marked', async () => {
    const scrollRootElement = await driver.findElement('scroll-root-element')
    await eyes.check(
      'diff',
      FakeCheckSettings.window()
        .scrollRootElement(scrollRootElement)
        .fully(),
    )
    await eyes.close(false)

    assert.ok(scrollRootElement.attrs.isApplitoolsScroll)
  })
})
