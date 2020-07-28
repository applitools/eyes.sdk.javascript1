'use strict'

const assert = require('assert')
const assertRejects = require('assert-rejects')
const {startFakeEyesServer} = require('@applitools/sdk-fake-eyes-server')
const {EyesWrappedDriver} = require('../../index')
const MockDriver = require('../utils/MockDriver')
const FakeEyesClassic = require('../utils/FakeEyesClassic')
const FakeCheckSettings = require('../utils/FakeCheckSettings')

describe('EyesClassic', () => {
  let server, serverUrl, driver, eyes

  before(async () => {
    driver = new MockDriver()
    eyes = new FakeEyesClassic()
    server = await startFakeEyesServer({logger: eyes._logger, matchMode: 'always'})
    serverUrl = `http://localhost:${server.port}`
    eyes.setServerUrl(serverUrl)
  })

  after(async () => {
    await server.close()
  })

  describe('#open()', () => {
    it('should return EyesWebDriver', async () => {
      driver = await eyes.open(driver, 'FakeApp', 'FakeTest')
      assert.strictEqual(driver instanceof EyesWrappedDriver, true)
      await eyes.close()
    })

    it('should throw IllegalState: Eyes not open', async () => {
      await assertRejects(
        eyes.check('test', FakeCheckSettings.window()),
        /IllegalState: Eyes not open/,
      )
    })
  })

  describe('#close()', () => {
    it('should throw if an internal exception happened during close(false)', async () => {
      eyes._serverConnector.stopSession = () => Promise.reject('some error')
      eyes.setMatchTimeout(0)
      await eyes.open(driver, 'FakeApp', 'FakeTest')
      await eyes.check(FakeCheckSettings.window())
      await assertRejects(eyes.close(false), /^some error$/)
    })
  })

  describe('should work wait before viewport screenshot after setWaitBeforeScreenshots', () => {
    let checkTimestamp, networkTimestamp, duration, eyes

    const thrownScreenshotDone = Symbol()
    before(async () => {
      eyes = new Proxy(new FakeEyesClassic(), {
        get(target, key, receiver) {
          if (key === 'checkWindowBase') {
            checkTimestamp = Date.now()
          } else if (key === '_ensureRunningSession') {
            networkTimestamp = Date.now()
          } else if (key === 'getScreenshot') {
            const screenshotTimestamp = Date.now()
            duration =
              screenshotTimestamp - checkTimestamp - (screenshotTimestamp - networkTimestamp)
            throw thrownScreenshotDone
          }
          return Reflect.get(target, key, receiver)
        },
      })
      await eyes.open(driver, 'FakeApp', 'FakeTest')
    })

    afterEach(() => {
      eyes.setWaitBeforeScreenshots(undefined)
    })

    it('should wait default amount of time', async () => {
      const delay = eyes.getWaitBeforeScreenshots()
      try {
        await eyes.check('wait', FakeCheckSettings.window())
      } catch (caught) {
        if (caught === thrownScreenshotDone) {
          assert(duration >= delay && duration <= delay + 10)
        } else {
          assert.fail()
        }
      }
    })

    it('should wait specified amount of time', async () => {
      const delay = 500
      try {
        eyes.setWaitBeforeScreenshots(delay)
        await eyes.check('wait', FakeCheckSettings.window())
      } catch (caught) {
        if (caught === thrownScreenshotDone) {
          assert(duration >= delay && duration <= delay + 10)
        } else {
          assert.fail()
        }
      }
    })

    it('should wait default amount of time set null', async () => {
      const delay = eyes.getWaitBeforeScreenshots()
      try {
        eyes.setWaitBeforeScreenshots(null)
        await eyes.check('wait', FakeCheckSettings.window())
      } catch (caught) {
        if (caught === thrownScreenshotDone) {
          assert(duration >= delay && duration <= delay + 10)
        } else {
          assert.fail()
        }
      }
    })
  })
})
