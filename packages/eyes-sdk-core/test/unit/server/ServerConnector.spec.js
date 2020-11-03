'use strict'

const assert = require('assert')
const assertRejects = require('assert-rejects')
const settle = require('axios/lib/core/settle')
const {startFakeEyesServer} = require('@applitools/sdk-fake-eyes-server')
const {
  ServerConnector,
  Logger,
  Configuration,
  GeneralUtils,
  SessionStartInfo,
} = require('../../../')
const {presult} = require('../../../lib/troubleshoot/utils')
const logger = new Logger(process.env.APPLITOOLS_SHOW_LOGS)

function getServerConnector(config = {}) {
  return new ServerConnector({
    getAgentId: () => '',
    logger,
    configuration: new Configuration(config),
  })
}

describe('ServerConnector', () => {
  it('sends startSession request', async () => {
    const {port, close} = await startFakeEyesServer({logger})
    try {
      const serverUrl = `http://localhost:${port}`
      const serverConnector = getServerConnector({serverUrl})
      const appIdOrName = 'ServerConnector unit test'
      const scenarioIdOrName = "doesn't throw exception on server failure"
      const batchId = String(Date.now())
      const runningSession = await serverConnector.startSession({
        appIdOrName,
        scenarioIdOrName,
        environment: {displaySize: {width: 1, height: 2}},
        batchInfo: {
          id: batchId,
        },
      })
      const sessionId = `${appIdOrName}__${scenarioIdOrName}`
      assert.deepStrictEqual(runningSession.toJSON(), {
        baselineId: `${sessionId}__baseline`,
        batchId,
        id: `${sessionId}__running`,
        isNew: true, // TODO make configurable in fake-eyes-server
        renderingInfo: undefined,
        sessionId,
        url: `${sessionId}__url`,
      })
    } finally {
      await close()
    }
  })

  it('retry startSession if it blocked by concurrency', async () => {
    const serverConnector = getServerConnector()
    assert.deepStrictEqual(serverConnector._axios.defaults.concurrencyBackoff, [
      2000,
      2000,
      2000,
      2000,
      2000,
      5000,
      5000,
      5000,
      5000,
      10000,
    ])
    serverConnector._axios.defaults.concurrencyBackoff = [50, 50, 100, 100, 100]
    let retries = 0
    let timeoutPassed = false
    const timeoutId = setTimeout(() => (timeoutPassed = true), 1000)
    serverConnector._axios.defaults.adapter = async config =>
      new Promise((resolve, reject) => {
        retries += 1
        if (retries >= 7) {
          clearTimeout(timeoutId)
          assert.strictEqual(timeoutPassed, false)
          return settle(resolve, reject, {
            status: 200,
            config,
            data: {
              id: 'id',
              sessionId: 'sessionId',
              batchId: 'batchId',
              baselineId: 'baselineId',
              isNew: true,
              url: 'url',
            },
            headers: {},
            request: {},
          })
        }
        const data = JSON.parse(config.data)
        assert.strictEqual(data.startInfo.concurrencyVersion, 1)
        assert.strictEqual(data.startInfo.agentSessionId, guid)
        return settle(resolve, reject, {status: 503, config, data: {}, headers: {}, request: {}})
      })
    const guid = GeneralUtils.guid()
    const runningSession = await serverConnector.startSession(
      new SessionStartInfo({
        agentId: 'agentId',
        appIdOrName: 'appIdOrName',
        scenarioIdOrName: 'scenarioIdOrName',
        environment: {displaySize: {width: 1, height: 2}},
        batchInfo: {id: 'batchId'},
        defaultMatchSettings: {},
        agentSessionId: guid,
      }),
    )
    assert.strictEqual(retries, 7)
    assert.deepStrictEqual(runningSession.toJSON(), {
      id: 'id',
      sessionId: 'sessionId',
      batchId: 'batchId',
      baselineId: 'baselineId',
      isNew: true,
      renderingInfo: undefined,
      url: 'url',
    })
  })

  // [trello] https://trello.com/c/qjmAw1Sc/160-storybook-receiving-an-inconsistent-typeerror
  it("doesn't throw exception on server failure", async () => {
    const {port, close} = await startFakeEyesServer({logger, hangUp: true})
    try {
      const serverUrl = `http://localhost:${port}`
      const serverConnector = getServerConnector({serverUrl})
      const [err] = await presult(serverConnector.startSession({}))
      assert.deepStrictEqual(err, new Error('socket hang up'))
    } finally {
      await close()
    }
  })

  it('getUserAgents works', async () => {
    const {port, close} = await startFakeEyesServer({logger})
    try {
      const serverUrl = `http://localhost:${port}`
      const serverConnector = getServerConnector({serverUrl})
      await serverConnector.renderInfo()
      const userAgents = await serverConnector.getUserAgents()
      assert.deepStrictEqual(userAgents, {
        chrome: 'chrome-ua',
        'chrome-1': 'chrome-1-ua',
        'chrome-2': 'chrome-2-ua',
        firefox: 'firefox-ua',
        'firefox-1': 'firefox-1-ua',
        'firefox-2': 'firefox-2-ua',
        safari: 'safari-ua',
        'safari-2': 'safari-2-ua',
        'safari-1': 'safari-1-ua',
        edge: 'edge-ua',
        ie: 'ie-ua',
        ie10: 'ie10-ua',
      })
    } finally {
      await close()
    }
  })

  it('uploadScreenshot uploads to resultsUrl webhook', async () => {
    assert.ok(process.env.APPLITOOLS_API_KEY)
    const serverConnector = getServerConnector()
    const renderingInfo = await serverConnector.renderInfo()
    const id = GeneralUtils.guid()
    const buffer = Buffer.from('something')
    const result = await serverConnector.uploadScreenshot(id, buffer)
    assert.strictEqual(result, renderingInfo.getResultsUrl().replace('__random__', id))
  })

  it('uploadScreenshot uses correct retry configuration', async () => {
    const serverConnector = getServerConnector()
    let actualConfig
    serverConnector._axios.defaults.adapter = async config => {
      if (config.url == 'https://eyesapi.applitools.com/api/sessions/renderinfo') {
        return {
          status: 200,
          config,
          data: {resultsUrl: ''},
        }
      } else {
        actualConfig = config
        return {
          status: 201,
          config,
        }
      }
    }
    await serverConnector.renderInfo()
    await serverConnector.uploadScreenshot('id', {})
    assert.strictEqual(actualConfig.delayBeforeRetry, 500)
    assert.strictEqual(actualConfig.retry, 5)
  })

  it('postDomSnapshot uses correct retry configuration', async () => {
    const serverConnector = getServerConnector()
    let actualConfig
    serverConnector._axios.defaults.adapter = async config => {
      if (config.url == 'https://eyesapi.applitools.com/api/sessions/renderinfo') {
        return {
          status: 200,
          config,
          data: {resultsUrl: ''},
        }
      } else {
        actualConfig = config
        return {
          status: 201,
          config,
        }
      }
    }
    await serverConnector.renderInfo()
    const buffer = Buffer.from('something')
    await serverConnector.postDomSnapshot('id', buffer)
    assert.strictEqual(actualConfig.delayBeforeRetry, 500)
    assert.strictEqual(actualConfig.retry, 5)
  })

  it('long request waits right amount of time', async () => {
    const serverConnector = getServerConnector()
    const ANSWER_AFTER = 8 // requests
    const timeouts = []
    let timestampBefore
    serverConnector._axios.defaults.adapter = async config => {
      const response = {status: 200, config, data: {}, headers: {}, request: {}}
      if (config.url === 'http://long-request.url') {
        response.status = 202
        response.headers.location = 'http://polling.url'
        timestampBefore = Date.now()
      } else if (config.isPollingRequest) {
        const timestampAfter = Date.now()
        timeouts.push(timestampAfter - timestampBefore)
        timestampBefore = timestampAfter
        response.status = config.repeat < ANSWER_AFTER - 1 ? 200 : 201
      }
      return response
    }
    const delayBeforePolling = [].concat(Array(3).fill(100), Array(3).fill(200), 500)
    await serverConnector._axios.request({
      url: 'http://long-request.url',
      delayBeforePolling,
    })
    assert.strictEqual(timeouts.length, ANSWER_AFTER)
    timeouts.forEach((timeout, index) => {
      const expectedTimeout = delayBeforePolling[Math.min(index, delayBeforePolling.length - 1)]
      assert(timeout >= expectedTimeout && timeout <= expectedTimeout + 10)
    })
  })

  it('check polling protocol', async () => {
    const serverConnector = getServerConnector()
    const MAX_POLLS_COUNT = 2
    const RES_DATA = {createdAt: Date.now()}
    let pollingWasStarted = false
    let pollsCount = 0
    let pollingWasFinished = false
    serverConnector._axios.defaults.adapter = async config => {
      const response = {status: 200, config, data: {}, headers: {}, request: {}}
      if (!pollingWasStarted) {
        response.status = 202
        response.headers.location = 'http://polling.url'
        pollingWasStarted = true
      } else if (config.url === 'http://polling.url') {
        pollsCount += 1
        if (pollsCount >= MAX_POLLS_COUNT) {
          response.status = 201
          response.headers.location = 'http://finish-polling.url'
        } else {
          response.status = 200
        }
      } else if (config.url === 'http://finish-polling.url') {
        response.status = 200
        response.data = RES_DATA
        pollingWasFinished = true
      }
      return response
    }
    const result = await serverConnector._axios.request({
      url: 'http://long-request.url',
    })

    assert(pollingWasStarted)
    assert.strictEqual(pollsCount, MAX_POLLS_COUNT)
    assert(pollingWasFinished)
    assert.deepStrictEqual(result.data, RES_DATA)
  })

  // NOTE: this can be deleted when Eyes server stops being backwards compatible with old SDK's that don't support long running tasks
  it('sends special request headers for all requests', async () => {
    const serverConnector = getServerConnector()
    serverConnector._axios.defaults.adapter = async config => ({
      status: 200,
      config,
      data: config.headers,
      headers: {},
      request: {},
    })

    const {data} = await serverConnector._axios.request({url: 'http://bla.url'})

    assert.strictEqual(data['Eyes-Expect'], '202+location')
    assert.ok(data['Eyes-Date'])
  })

  // NOTE: this can be deleted when Eyes server stops being backwards compatible with old SDK's that don't support long running tasks
  it("doesn't send special request headers for polling requests", async () => {
    const serverConnector = getServerConnector()
    serverConnector._axios.defaults.adapter = async config => ({
      status: 202,
      config,
      data: config.headers,
      headers: {},
      request: {},
    })

    const {data} = await serverConnector._axios.request({
      url: 'http://polling.url',
      isPollingRequest: true,
    })

    assert.strictEqual(data['Eyes-Expect'], undefined)
    assert.strictEqual(data['Eyes-Date'], undefined)
  })

  it('does NOT mark RunningSession as new if there is no isNew in the payload and response status is 200', async () => {
    const serverConnector = getServerConnector()
    serverConnector._axios.defaults.adapter = async config => ({
      status: 200,
      data: {},
      config,
    })

    const runningSession = await serverConnector.startSession({})
    assert.strictEqual(runningSession.getIsNew(), false)
  })

  it('marks RunningSession as new if there is no isNew in the payload and response status is 201', async () => {
    const serverConnector = getServerConnector()
    serverConnector._axios.defaults.adapter = async config => ({
      status: 201,
      data: {},
      config,
    })

    const runningSession = await serverConnector.startSession({})
    assert.strictEqual(runningSession.getIsNew(), true)
  })

  it('sets RunningSession.isNew with the value of isNew in the payload', async () => {
    const serverConnector = getServerConnector()
    serverConnector._axios.defaults.adapter = async config => ({
      status: 200,
      data: {isNew: true},
      config,
    })

    const runningSessionWithIsNewTrue = await serverConnector.startSession({})
    assert.strictEqual(runningSessionWithIsNewTrue.getIsNew(), true)

    serverConnector._axios.defaults.adapter = async config => ({
      status: 200,
      data: {isNew: false},
      config,
    })

    const runningSessionWithIsNewFalse = await serverConnector.startSession({})
    assert.strictEqual(runningSessionWithIsNewFalse.getIsNew(), false)
  })

  it('retry request before throw', async () => {
    const serverConnector = getServerConnector()
    let tries = 0
    serverConnector._axios.defaults.adapter = async config => {
      tries += 1
      throw {config, code: 'ENOTFOUND'}
    }

    await assertRejects(serverConnector.startSession({}), 'ENOTFOUND')
    assert.strictEqual(tries, 6)
  })

  it('logEvent', async () => {
    const events = [
      {timestamp: new Date().toISOString(), level: 'Notice', event: 'test 1'},
      {timestamp: new Date().toISOString(), level: 'Notice', event: 'test 2'},
    ]
    const serverConnector = getServerConnector()
    serverConnector._axios.defaults.adapter = async config => {
      assert.deepStrictEqual(config.data, JSON.stringify({events}))
      return {
        status: 200,
        config,
      }
    }
    await serverConnector.logEvents(events)
  })
})
