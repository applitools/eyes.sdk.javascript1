'use strict'
const Axios = require('axios')
const zlib = require('zlib')
const GeneralUtils = require('../utils/GeneralUtils')
const ArgumentGuard = require('../utils/ArgumentGuard')
const RenderingInfo = require('./RenderingInfo')
const RunningSession = require('./RunningSession')
const {
  configureAxios,
  delayRequest,
  handleRequestResponse,
  handleRequestError,
} = require('./requestHelpers')
const TestResults = require('../TestResults')
const MatchResult = require('../match/MatchResult')

const RunningRender = require('../renderer/RunningRender')
const RenderStatusResults = require('../renderer/RenderStatusResults')

/**
 * @typedef {import('../geometry/Region').RegionObject} RegionObject
 */

/**
 * @typedef {import('../logging/LogEvent').LogEvent} LogEvent
 */

// Constants
const EYES_API_PATH = '/api/sessions'
const DEFAULT_TIMEOUT_MS = 300000 // ms (5 min)
const REDUCED_TIMEOUT_MS = 15000 // ms (15 sec)
const RETRY_REQUEST_INTERVAL = 500 // 0.5s
const DELAY_BEFORE_POLLING = [].concat(
  Array(5).fill(500), // 5 tries with delay 0.5s
  Array(5).fill(1000), // 5 tries with delay 1s
  Array(5).fill(2000), // 5 tries with delay 2s
  5000, // all next tries with delay 5s
)
const CONCURRENCY_BACKOFF = [].concat(
  Array(5).fill(2000), // 5 tries with delay 2s (total 10s)
  Array(4).fill(5000), // 4 tries with delay 5s (total 20s)
  10000, // all next tries with delay 10s
)

const DEFAULT_HEADERS = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
}

const HTTP_STATUS_CODES = {
  CREATED: 201,
  ACCEPTED: 202,
  OK: 200,
  GONE: 410,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  GATEWAY_TIMEOUT: 504,
}

const AZURE_RETRY_CONFIG = {
  delayBeforeRetry: 500,
  retry: 5,
}

const REQUEST_GUID = GeneralUtils.guid()
let requestCounter = 0
function createRequestId() {
  return `${++requestCounter}--${REQUEST_GUID}`
}

/**
 * Creates a bytes representation of the given JSON.
 *
 * @private
 * @param {object} jsonData - The data from for which to create the bytes representation.
 * @return {Buffer} - a buffer of bytes which represents the stringified JSON, prefixed with size.
 */
const createDataBytes = jsonData => {
  const dataStr = JSON.stringify(jsonData)
  const dataLen = Buffer.byteLength(dataStr, 'utf8')

  // The result buffer will contain the length of the data + 4 bytes of size
  const result = Buffer.alloc(dataLen + 4)
  result.writeUInt32BE(dataLen, 0)
  result.write(dataStr, 4, dataLen)
  return result
}

/**
 * Provides an API for communication with the Applitools server.
 */
class ServerConnector {
  /**
   * @param {Logger} logger
   * @param {Configuration} configuration
   */
  constructor({logger, configuration, getAgentId}) {
    this._logger = logger
    this._configuration = configuration

    /** @type {RenderingInfo} */
    this._renderingInfo = undefined

    this._axios = Axios.create({
      withApiKey: true,
      retry: 5,
      repeat: 0,
      delayBeforeRetry: 200,
      delayBeforePolling: DELAY_BEFORE_POLLING,
      concurrencyBackoff: CONCURRENCY_BACKOFF,
      createRequestId,
      proxy: undefined,
      headers: DEFAULT_HEADERS,
      timeout: DEFAULT_TIMEOUT_MS,
      responseType: 'json',
      maxContentLength: 200 * 1024 * 1024, // 200 MB
    })

    this._axios.interceptors.request.use(async config => {
      const axiosConfig = Object.assign({}, this._axios.defaults, config)
      axiosConfig.requestId = axiosConfig.createRequestId()
      configureAxios({
        axiosConfig,
        configuration: this._configuration,
        logger: this._logger,
        agentId: getAgentId(),
      })

      const dataLength = axiosConfig.data && axiosConfig.data.length
      const dataLengthStr = dataLength ? ` and body length ${axiosConfig.data.length}` : ''

      this._logger.verbose(
        `axios request interceptor - ${axiosConfig.name} [${axiosConfig.requestId}${
          axiosConfig.originalRequestId ? ` retry of ${axiosConfig.originalRequestId}` : ''
        }] will now call to ${axiosConfig.url} with params ${JSON.stringify(
          axiosConfig.params,
        )}${dataLengthStr}`,
      )

      await delayRequest({axiosConfig, logger})

      return axiosConfig
    })
    this._axios.interceptors.response.use(
      response => handleRequestResponse({response, axios: this._axios, logger: this._logger}),
      err => handleRequestError({err, axios: this._axios, logger: this._logger}),
    )
  }

  /**
   * @return {RenderingInfo}
   */
  getRenderingInfo() {
    return this._renderingInfo
  }

  /**
   * @param {RenderingInfo} renderingInfo
   */
  setRenderingInfo(renderingInfo) {
    ArgumentGuard.notNull(renderingInfo, 'renderingInfo')
    this._renderingInfo = renderingInfo
  }

  /**
   * Starts a new running session in the agent. Based on the given parameters, this running session will either be
   * linked to an existing session, or to a completely new session.
   *
   * @param {SessionStartInfo} sessionStartInfo - The start parameters for the session.
   * @return {Promise<RunningSession>} - RunningSession object which represents the current running session
   */
  async startSession(sessionStartInfo) {
    ArgumentGuard.notNull(sessionStartInfo, 'sessionStartInfo')
    this._logger.verbose(`ServerConnector.startSession called with: ${sessionStartInfo}`)

    const config = {
      name: 'startSession',
      method: 'POST',
      url: GeneralUtils.urlConcat(this._configuration.getServerUrl(), EYES_API_PATH, '/running'),
      data: {
        startInfo: sessionStartInfo,
      },
    }

    const response = await this._axios.request(config)
    const validStatusCodes = [HTTP_STATUS_CODES.OK, HTTP_STATUS_CODES.CREATED]
    if (validStatusCodes.includes(response.status)) {
      const runningSession = new RunningSession(response.data)
      if (response.data.isNew === undefined) {
        runningSession.setIsNew(response.status === HTTP_STATUS_CODES.CREATED)
      }
      this._logger.verbose('ServerConnector.startSession - post succeeded', runningSession)
      return runningSession
    }

    throw new Error(`ServerConnector.startSession - unexpected status (${response.statusText})`)
  }

  /**
   * Stops the running session.
   *
   * @param {RunningSession} runningSession - The running session to be stopped.
   * @param {boolean} isAborted
   * @param {boolean} save
   * @return {Promise<TestResults>} - TestResults object for the stopped running session
   */
  async stopSession(runningSession, isAborted, save) {
    ArgumentGuard.notNull(runningSession, 'runningSession')
    this._logger.verbose(
      `ServerConnector.stopSession called with ${JSON.stringify({
        isAborted,
        updateBaseline: save,
      })} for session: ${runningSession}`,
    )

    const config = {
      name: 'stopSession',
      method: 'DELETE',
      url: GeneralUtils.urlConcat(
        this._configuration.getServerUrl(),
        EYES_API_PATH,
        '/running',
        encodeURIComponent(runningSession.getId()),
      ),
      params: {
        aborted: isAborted,
        updateBaseline: save,
      },
    }

    const response = await this._axios.request(config)
    const validStatusCodes = [HTTP_STATUS_CODES.OK]
    if (validStatusCodes.includes(response.status)) {
      const testResults = new TestResults(response.data)
      this._logger.verbose('ServerConnector.stopSession - post succeeded', testResults)
      return testResults
    }

    throw new Error(`ServerConnector.stopSession - unexpected status (${response.statusText})`)
  }

  /**
   * Stops the running batch sessions.
   *
   * @param {string} batchId - The batchId to be stopped.
   * @return {Promise<void>}
   */
  async deleteBatchSessions(batchId) {
    ArgumentGuard.notNull(batchId, 'batchId')
    this._logger.verbose(`ServerConnector.deleteBatchSessions called for batchId: ${batchId}`)

    const config = {
      name: 'deleteBatchSessions',
      method: 'DELETE',
      url: GeneralUtils.urlConcat(
        this._configuration.getServerUrl(),
        EYES_API_PATH,
        '/batches',
        batchId,
        '/close/bypointerid',
      ),
    }

    const response = await this._axios.request(config)
    const validStatusCodes = [HTTP_STATUS_CODES.OK]
    if (validStatusCodes.includes(response.status)) {
      this._logger.verbose('ServerConnector.deleteBatchSessions - delete succeeded')
      return
    }

    throw new Error(
      `ServerConnector.deleteBatchSessions - unexpected status (${response.statusText})`,
    )
  }

  /**
   * Deletes the given test result
   *
   * @param {TestResults} testResults - The session to delete by test results.
   * @return {Promise}
   */
  async deleteSession(testResults) {
    ArgumentGuard.notNull(testResults, 'testResults')
    this._logger.verbose(`ServerConnector.deleteSession called with ${JSON.stringify(testResults)}`)

    const config = {
      name: 'deleteSession',
      method: 'DELETE',
      url: GeneralUtils.urlConcat(
        this._configuration.getServerUrl(),
        EYES_API_PATH,
        '/batches/',
        testResults.getBatchId(),
        '/',
        testResults.getId(),
      ),
      params: {
        accessToken: testResults.getSecretToken(),
      },
    }

    const response = await this._axios.request(config)
    const validStatusCodes = [HTTP_STATUS_CODES.OK]
    if (validStatusCodes.includes(response.status)) {
      this._logger.verbose('ServerConnector.deleteSession - delete succeeded')
      return
    }

    throw new Error(`ServerConnector.stopSession - unexpected status (${response.statusText})`)
  }

  async uploadScreenshot(id, screenshot) {
    const url = this._renderingInfo.getResultsUrl().replace('__random__', id)
    const config = {
      name: 'uploadScreenshot',
      method: 'PUT',
      url,
      data: screenshot,
      headers: {
        Date: new Date().toISOString(),
        'x-ms-blob-type': 'BlockBlob',
        'content-type': 'application/octet-stream',
      },
      ...AZURE_RETRY_CONFIG,
    }

    const response = await this._axios.request(config)
    if (response.status !== HTTP_STATUS_CODES.CREATED) {
      throw new Error(
        `ServerConnector.uploadScreenshot - unexpected status (${response.statusText})`,
      )
    }

    return url
  }

  /**
   * Matches the current window (held by the WebDriver) to the expected window.
   *
   * @param {RunningSession} runningSession - The current agent's running session.
   * @param {MatchWindowData} matchWindowData - Encapsulation of a capture taken from the application.
   * @return {Promise<MatchResult>} - The results of the window matching.
   */
  async matchWindow(runningSession, matchWindowData) {
    ArgumentGuard.notNull(runningSession, 'runningSession')
    ArgumentGuard.notNull(matchWindowData, 'matchWindowData')
    this._logger.verbose(
      `ServerConnector.matchWindow called with ${matchWindowData} for session: ${runningSession}`,
    )

    const config = {
      name: 'matchWindow',
      method: 'POST',
      url: GeneralUtils.urlConcat(
        this._configuration.getServerUrl(),
        EYES_API_PATH,
        '/running',
        encodeURIComponent(runningSession.getId()),
      ),
      headers: {},
      data: matchWindowData,
    }

    if (matchWindowData.getAppOutput().getScreenshot64()) {
      // if there is screenshot64, then we will send application/octet-stream body instead of application/json
      const screenshot64 = matchWindowData.getAppOutput().getScreenshot64()
      matchWindowData.getAppOutput().setScreenshot64(null) // remove screenshot64 from json
      config.headers['Content-Type'] = 'application/octet-stream'

      config.data = Buffer.concat([createDataBytes(matchWindowData), screenshot64])
      matchWindowData.getAppOutput().setScreenshot64(screenshot64)
    }

    const response = await this._axios.request(config)
    const validStatusCodes = [HTTP_STATUS_CODES.OK]
    if (validStatusCodes.includes(response.status)) {
      const matchResult = new MatchResult(response.data)
      this._logger.verbose('ServerConnector.matchWindow - post succeeded', matchResult)
      return matchResult
    }

    throw new Error(`ServerConnector.matchWindow - unexpected status (${response.statusText})`)
  }

  async matchWindowAndClose(runningSession, matchWindowData) {
    if (this._matchWindowAndCloseFallback) {
      this._logger.verbose(
        'ServerConnector.matchWindowAndClose was not found in the previous call. Fallback is used',
      )
      await this.matchWindow(runningSession, matchWindowData)
      return this.stopSession(runningSession, false, matchWindowData.getUpdateBaselineIfNew())
    }
    ArgumentGuard.notNull(runningSession, 'runningSession')
    ArgumentGuard.notNull(matchWindowData, 'matchWindowData')
    this._logger.verbose(
      `ServerConnector.matchWindowAndClose called with ${matchWindowData} for session: ${runningSession}`,
    )

    const config = {
      name: 'matchWindow',
      method: 'POST',
      url: GeneralUtils.urlConcat(
        this._configuration.getServerUrl(),
        EYES_API_PATH,
        '/running',
        encodeURIComponent(runningSession.getId()),
        '/matchandend',
      ),
      headers: {},
      data: matchWindowData,
      dontRetryOn404: true,
    }

    if (matchWindowData.getAppOutput().getScreenshot64()) {
      // if there is screenshot64, then we will send application/octet-stream body instead of application/json
      const screenshot64 = matchWindowData.getAppOutput().getScreenshot64()
      matchWindowData.getAppOutput().setScreenshot64(null) // remove screenshot64 from json
      config.headers['Content-Type'] = 'application/octet-stream'

      config.data = Buffer.concat([createDataBytes(matchWindowData), screenshot64])
      matchWindowData.getAppOutput().setScreenshot64(screenshot64)
    }

    let response
    try {
      response = await this._axios.request(config)
    } catch (err) {
      response = err.response || {}
    }
    const validStatusCodes = [HTTP_STATUS_CODES.OK]
    if (validStatusCodes.includes(response.status)) {
      const testResults = new TestResults(response.data)
      this._logger.verbose('ServerConnector.matchWindowAndClose - post succeeded', testResults)
      return testResults
    } else if (response.status === HTTP_STATUS_CODES.NOT_FOUND) {
      this._matchWindowAndCloseFallback = true
      this._logger.verbose('ServerConnector.matchWindowAndClose was not found. Fallback is used')
      await this.matchWindow(runningSession, matchWindowData)
      return this.stopSession(runningSession, false, matchWindowData.getUpdateBaselineIfNew())
    }

    throw new Error(
      `ServerConnector.matchWindowAndClose - unexpected status (${response.statusText})`,
    )
  }

  /**
   * Replaces an actual image in the current running session.
   *
   * @param {RunningSession} runningSession - The current agent's running session.
   * @param {number} stepIndex - The zero based index of the step in which to replace the actual image.
   * @param {MatchWindowData} matchWindowData - Encapsulation of a capture taken from the application.
   * @return {Promise<MatchResult>} - The results of the window matching.
   */
  async replaceWindow(runningSession, stepIndex, matchWindowData) {
    ArgumentGuard.notNull(runningSession, 'runningSession')
    ArgumentGuard.notNull(matchWindowData, 'matchWindowData')
    this._logger.verbose(
      `ServerConnector.replaceWindow called with ${matchWindowData} for session: ${runningSession}`,
    )

    const config = {
      name: 'replaceWindow',
      method: 'PUT',
      url: GeneralUtils.urlConcat(
        this._configuration.getServerUrl(),
        EYES_API_PATH,
        '/running',
        runningSession.getId(),
        stepIndex,
      ),
      headers: {
        'Content-Type': 'application/octet-stream',
      },
      data: Buffer.concat([
        createDataBytes(matchWindowData),
        matchWindowData.getAppOutput().getScreenshot64(),
      ]),
    }

    const response = await this._axios.request(config)
    const validStatusCodes = [HTTP_STATUS_CODES.OK]
    if (validStatusCodes.includes(response.status)) {
      const matchResult = new MatchResult(response.data)
      this._logger.verbose('ServerConnector.replaceWindow - post succeeded', matchResult)
      return matchResult
    }

    throw new Error(`ServerConnector.replaceWindow - unexpected status (${response.statusText})`)
  }

  /**
   * Initiate a rendering using RenderingGrid API
   *
   * @return {Promise<RenderingInfo>} - The results of the render request
   */
  async renderInfo() {
    this._logger.verbose('ServerConnector.renderInfo called.')

    const config = {
      name: 'renderInfo',
      method: 'GET',
      url: GeneralUtils.urlConcat(this._configuration.getServerUrl(), EYES_API_PATH, '/renderinfo'),
    }

    const response = await this._axios.request(config)
    const validStatusCodes = [HTTP_STATUS_CODES.OK]
    if (validStatusCodes.includes(response.status)) {
      this._renderingInfo = new RenderingInfo(response.data)
      this._logger.verbose('ServerConnector.renderInfo - post succeeded', this._renderingInfo)
      return this._renderingInfo
    }

    throw new Error(`ServerConnector.renderInfo - unexpected status (${response.statusText})`)
  }

  async batchInfo(batchId) {
    ArgumentGuard.notNullOrEmpty(batchId, 'batchId')
    this._logger.verbose('ServerConnector.batchInfo called.')

    const config = {
      name: 'batchInfo',
      method: 'GET',
      url: GeneralUtils.urlConcat(
        this._configuration.getServerUrl(),
        EYES_API_PATH,
        '/batches',
        batchId,
        'config/bypointerId',
      ),
    }

    const response = await this._axios.request(config)
    const validStatusCodes = [HTTP_STATUS_CODES.OK]
    if (validStatusCodes.includes(response.status)) {
      this._logger.verbose('ServerConnector.batchInfo - post succeeded', response.data)
      return response.data
    }

    throw new Error(`ServerConnector.batchInfo - unexpected status (${response.statusText})`)
  }

  /**
   * Initiate a rendering using RenderingGrid API
   *
   * @param {RenderRequest[]|RenderRequest} renderRequest - The current agent's running session.
   * @return {Promise<RunningRender[]|RunningRender>} - The results of the render request
   */
  async render(renderRequest) {
    ArgumentGuard.notNull(renderRequest, 'renderRequest')
    this._logger.verbose(`ServerConnector.render called with ${renderRequest}`)

    const isBatch = Array.isArray(renderRequest)
    const config = {
      name: 'render',
      withApiKey: false,
      method: 'POST',
      url: GeneralUtils.urlConcat(this._renderingInfo.getServiceUrl(), '/render'),
      headers: {
        'X-Auth-Token': this._renderingInfo.getAccessToken(),
      },
      data: isBatch ? renderRequest : [renderRequest],
    }

    const response = await this._axios.request(config)
    const validStatusCodes = [HTTP_STATUS_CODES.OK]
    if (validStatusCodes.includes(response.status)) {
      let runningRender = Array.from(response.data).map(
        resultsData => new RunningRender(resultsData),
      )
      if (!isBatch) {
        runningRender = runningRender[0]
      }

      this._logger.verbose('ServerConnector.render - post succeeded', runningRender)
      return runningRender
    }

    throw new Error(`ServerConnector.render - unexpected status (${response.statusText})`)
  }

  async renderGetRenderJobInfo(renderRequests) {
    ArgumentGuard.notNull(renderRequests, 'renderRequests')
    this._logger.verbose(`ServerConnector.renderGetRenderJobInfo called with ${renderRequests}`)

    const config = {
      name: 'renderGetRenderJobInfo',
      withApiKey: false,
      method: 'POST',
      url: GeneralUtils.urlConcat(this._renderingInfo.getServiceUrl(), '/job-info'),
      headers: {
        'X-Auth-Token': this._renderingInfo.getAccessToken(),
      },
      data: renderRequests,
    }

    const response = await this._axios.request(config)
    const validStatusCodes = [HTTP_STATUS_CODES.OK]
    if (validStatusCodes.includes(response.status)) {
      this._logger.verbose('ServerConnector.renderGetRenderJobInfo - post succeeded', response.data)
      return response.data
    }

    throw new Error(
      `ServerConnector.renderGetRendererInfo - unexpected status (${response.statusText})`,
    )
  }

  /**
   * Checks if resources already exist on the server
   *
   * @param {RGridResource[]} resources - The resource to use
   * @return {Promise<boolean[]>} - Whether resource exists on the server or not
   */
  async renderCheckResources(resources) {
    ArgumentGuard.notNull(resources, 'resources')
    const hashes = resources.map(resource => resource.getHashAsObject())
    this._logger.verbose(
      `ServerConnector.renderCheckResources called with resources - ${hashes.map(
        ({hash}) => hash,
      )}`,
    )

    const config = {
      name: 'renderCheckResources',
      withApiKey: false,
      method: 'POST',
      url: GeneralUtils.urlConcat(
        this._renderingInfo.getServiceUrl(),
        '/resources/query/resources-exist/',
      ),
      headers: {
        'X-Auth-Token': this._renderingInfo.getAccessToken(),
      },
      params: {
        'render-id': GeneralUtils.guid(),
      },
      data: hashes,
    }

    const response = await this._axios.request(config)
    const validStatusCodes = [HTTP_STATUS_CODES.OK]
    if (validStatusCodes.includes(response.status)) {
      this._logger.verbose('ServerConnector.renderCheckResources - request succeeded')
      return response.data
    }

    throw new Error(
      `ServerConnector.renderCheckResources - unexpected status (${response.statusText})`,
    )
  }

  /**
   * Upload resource to the server
   *
   * @param {RGridResource} resource - The resource to upload
   * @return {Promise<boolean>} - True if resource was uploaded
   */
  async renderPutResource(resource) {
    ArgumentGuard.notNull(resource, 'resource')
    ArgumentGuard.notNull(resource.getContent(), 'resource.getContent()')
    this._logger.verbose(
      `ServerConnector.putResource called with resource#${resource.getSha256Hash()}`,
    )

    const config = {
      name: 'renderPutResource',
      withApiKey: false,
      method: 'PUT',
      url: GeneralUtils.urlConcat(
        this._renderingInfo.getServiceUrl(),
        '/resources/sha256/',
        resource.getSha256Hash(),
      ),
      headers: {
        'X-Auth-Token': this._renderingInfo.getAccessToken(),
        'Content-Type': resource.getContentType(),
      },
      maxContentLength: 15.5 * 1024 * 1024, // 15.5 MB  (VG limit is 16MB)
      params: {
        'render-id': GeneralUtils.guid(),
      },
      data: resource.getContent(),
    }

    const response = await this._axios.request(config)
    const validStatusCodes = [HTTP_STATUS_CODES.OK]
    if (validStatusCodes.includes(response.status)) {
      this._logger.verbose(
        'ServerConnector.putResource - request succeeded. Response:',
        response.data,
      )
      return true
    }

    throw new Error(
      `ServerConnector.putResource - unexpected status (${
        response.statusText
      }) for resource ${resource.getUrl() || ''} ${resource.getContentType()}`,
    )
  }

  /**
   * Get the rendering status for current render
   *
   * @param {RunningRender} runningRender - The running render
   * @param {boolean} [delayBeforeRequest=false] - If {@code true}, then the request will be delayed
   * @return {Promise<RenderStatusResults>} - The render's status
   */
  renderStatus(runningRender, delayBeforeRequest = false) {
    return this.renderStatusById(runningRender.getRenderId(), delayBeforeRequest)
  }

  /**
   * Get the rendering status for current render
   *
   * @param {string[]|string} renderId - The running renderId
   * @param {boolean} [delayBeforeRequest=false] - If {@code true}, then the request will be delayed
   * @return {Promise<RenderStatusResults[]|RenderStatusResults>} - The render's status
   */
  async renderStatusById(renderId, delayBeforeRequest = false) {
    ArgumentGuard.notNull(renderId, 'renderId')
    this._logger.verbose(`ServerConnector.renderStatus called for render: ${renderId}`)

    const isBatch = Array.isArray(renderId)
    const config = {
      name: 'renderStatus',
      retry: 3,
      delay: delayBeforeRequest ? RETRY_REQUEST_INTERVAL : null,
      delayBeforeRetry: RETRY_REQUEST_INTERVAL,
      withApiKey: false,
      method: 'POST',
      url: GeneralUtils.urlConcat(this._renderingInfo.getServiceUrl(), '/render-status'),
      headers: {
        'X-Auth-Token': this._renderingInfo.getAccessToken(),
      },
      timeout: REDUCED_TIMEOUT_MS,
      data: isBatch ? renderId : [renderId],
    }

    const response = await this._axios.request(config)
    const validStatusCodes = [HTTP_STATUS_CODES.OK]
    if (validStatusCodes.includes(response.status)) {
      let renderStatus = Array.from(response.data).map(
        resultsData => new RenderStatusResults(resultsData || {}),
      )
      if (!isBatch) {
        renderStatus = renderStatus[0] // eslint-disable-line prefer-destructuring
      }

      this._logger.verbose(
        `ServerConnector.renderStatus - get succeeded for ${renderId} -`,
        renderStatus,
      )
      return renderStatus
    }

    throw new Error(`ServerConnector.renderStatus - unexpected status (${response.statusText})`)
  }

  /**
   * @param {string} domJson
   * @return {Promise<string>}
   */
  async postDomSnapshot(id, domJson) {
    ArgumentGuard.notNull(domJson, 'domJson')
    this._logger.verbose('ServerConnector.postDomSnapshot called')
    const url = this._renderingInfo.getResultsUrl().replace('__random__', id)

    const config = {
      name: 'postDomSnapshot',
      method: 'PUT',
      url,
      data: zlib.gzipSync(Buffer.from(domJson)),
      headers: {
        Date: new Date().toISOString(),
        'x-ms-blob-type': 'BlockBlob',
        'Content-Type': 'application/octet-stream',
      },
      ...AZURE_RETRY_CONFIG,
    }

    const response = await this._axios.request(config)
    if (response.status !== HTTP_STATUS_CODES.CREATED) {
      throw new Error(
        `ServerConnector.postDomSnapshot - unexpected status (${response.statusText})`,
      )
    }

    this._logger.verbose('ServerConnector.postDomSnapshot - post succeeded')
    return url
  }

  async getUserAgents() {
    const config = {
      name: 'getUserAgents',
      withApiKey: false,
      url: GeneralUtils.urlConcat(this._renderingInfo.getServiceUrl(), '/user-agents'),
      headers: {
        'X-Auth-Token': this._renderingInfo.getAccessToken(),
      },
    }

    const response = await this._axios.request(config)
    if (response.status === HTTP_STATUS_CODES.OK) {
      return response.data
    } else {
      throw new Error(`ServerConnector.getUserAgents - unexpected status (${response.statusText})`)
    }
  }

  /**
   * Visual locators
   * @template {string} TLocatorName
   * @param {Object} visualLocatorData
   * @param {string} visualLocatorData.appName
   * @param {string} visualLocatorData.imageUrl
   * @param {Readonly<TLocatorName[]>} visualLocatorData.locatorNames
   * @param {string} visualLocatorData.firstOnly
   * @return {Promise<{[TKey in TLocatorName]: RegionObject[]}>}
   */
  async postLocators(visualLocatorData) {
    ArgumentGuard.notNull(visualLocatorData, 'visualLocatorData')
    this._logger.verbose(
      `ServerConnector.postLocators called with ${JSON.stringify(visualLocatorData)}`,
    )

    const config = {
      name: 'postLocators',
      method: 'POST',
      url: GeneralUtils.urlConcat(this._configuration.getServerUrl(), 'api/locators/locate'),
      data: visualLocatorData,
    }

    const response = await this._axios.request(config)
    const validStatusCodes = [HTTP_STATUS_CODES.OK]
    if (validStatusCodes.includes(response.status)) {
      this._logger.verbose('ServerConnector.postLocators - post succeeded', response.data)
      return response.data
    }

    throw new Error(`ServerConnector.postLocators - unexpected status (${response.statusText})`)
  }

  async getEmulatedDevicesSizes() {
    this._logger.verbose(`ServerConnector.getEmulatedDevicesSizes`)

    const config = {
      name: 'getEmulatedDevicesSizes',
      method: 'GET',
      withApiKey: false,
      url: GeneralUtils.urlConcat(this._renderingInfo.getServiceUrl(), '/emulated-devices-sizes'),
    }

    const response = await this._axios.request(config)
    if (response.status === HTTP_STATUS_CODES.OK) {
      return response.data
    } else {
      throw new Error(
        `ServerConnector.getEmulatedDevicesSizes - unexpected status (${response.statusText})`,
      )
    }
  }

  async getIosDevicesSizes() {
    this._logger.verbose(`ServerConnector.getIosDevicesSizes`)

    const config = {
      name: 'getIosDevicesSizes',
      method: 'GET',
      url: GeneralUtils.urlConcat(this._renderingInfo.getServiceUrl(), '/ios-devices-sizes'),
    }

    const response = await this._axios.request(config)
    if (response.status === HTTP_STATUS_CODES.OK) {
      return response.data
    } else {
      throw new Error(
        `ServerConnector.getIosDevicesSizes - unexpected status (${response.statusText})`,
      )
    }
  }

  /**
   * @param {LogEvent[]} events
   * @return {Promise<string>}
   */
  async logEvents(events) {
    ArgumentGuard.isArray(events, 'events')
    this._logger.verbose(`ServerConnector.logEvents called with ${events.length} events`)

    const config = {
      name: 'logEvents',
      method: 'POST',
      url: GeneralUtils.urlConcat(this._configuration.getServerUrl(), EYES_API_PATH, '/log'),
      data: {events},
    }

    const response = await this._axios.request(config)
    if (response.status === HTTP_STATUS_CODES.OK) {
      this._logger.verbose('ServerConnector.logEvents - post succeeded', response.data)
      return response.data
    }

    throw new Error(`ServerConnector.logEvents - unexpected status (${response.statusText})`)
  }
}

module.exports = ServerConnector
