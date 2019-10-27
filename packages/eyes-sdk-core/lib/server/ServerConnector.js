'use strict';

const axios = require('axios');
const zlib = require('zlib');

const { GeneralUtils, TypeUtils, ArgumentGuard, DateTimeUtils } = require('@applitools/eyes-common');

const { RenderingInfo } = require('./RenderingInfo');
const { RunningSession } = require('./RunningSession');
const { TestResults } = require('../TestResults');
const { MatchResult } = require('../match/MatchResult');

const { RunningRender } = require('../renderer/RunningRender');
const { RenderStatusResults } = require('../renderer/RenderStatusResults');

// Constants
const EYES_API_PATH = '/api/sessions';
const RETRY_REQUEST_INTERVAL = 500; // ms
const LONG_REQUEST_DELAY_MS = 2000; // ms
const MAX_LONG_REQUEST_DELAY_MS = 10000; // ms
const DEFAULT_TIMEOUT_MS = 300000; // ms (5 min)
const REDUCED_TIMEOUT_MS = 15000; // ms (15 sec)
const LONG_REQUEST_DELAY_MULTIPLICATIVE_INCREASE_FACTOR = 1.5;

const DEFAULT_HEADERS = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
};

const HTTP_STATUS_CODES = {
  CREATED: 201,
  ACCEPTED: 202,
  OK: 200,
  GONE: 410,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  GATEWAY_TIMEOUT: 504,
};

const HTTP_FAILED_CODES = [
  HTTP_STATUS_CODES.NOT_FOUND,
  HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
  HTTP_STATUS_CODES.BAD_GATEWAY,
  HTTP_STATUS_CODES.GATEWAY_TIMEOUT,
];

const REQUEST_FAILED_CODES = [
  'ECONNRESET',
  'ECONNABORTED',
  'ETIMEDOUT',
  'ENOTFOUND',
];

/**
 * @typedef {{data: *, status: number, statusText: string, headers: *, request: *}} AxiosResponse
 */

/**
 * @private
 * @param {ServerConnector} self
 * @param {string} name
 * @param {object} options
 * @param {number} [retry=1]
 * @param {boolean} [delayBeforeRetry=false]
 * @return {Promise<AxiosResponse>}
 */
async function sendRequest(self, name, options, retry = 1, delayBeforeRetry = false) {
  if (options.data instanceof Buffer && options.data.length === 0) {
    // This 'if' fixes a bug in Axios whereby Axios doesn't send a content-length when the buffer is of length 0.
    // This behavior makes the rendering-grid's nginx get stuck as it doesn't know when the body ends.
    // https://github.com/axios/axios/issues/1701
    options.data = '';
  }

  // eslint-disable-next-line max-len
  self._logger.verbose(`ServerConnector.${name} will now call to ${options.url} with params ${JSON.stringify(options.params)}`);
  try {
    const response = await axios(options);

    // eslint-disable-next-line max-len
    self._logger.verbose(`ServerConnector.${name} - result ${response.statusText}, status code ${response.status}, url ${options.url}`);
    return response;
  } catch (err) {
    let reasonMsg = err.message;
    if (err.response && err.response.statusText) {
      reasonMsg += ` (${err.response.statusText})`;
    }

    // eslint-disable-next-line max-len
    self._logger.log(`ServerConnector.${name} - ${options.method} failed on ${options.url}: ${reasonMsg} with params ${JSON.stringify(options.params).slice(0, 100)} body:\n${err.response && err.response.data}`);
    self._logger.verbose(`ServerConnector.${name} - failure body:\n${err.response && err.response.data}`);

    if (retry > 0 && ((err.response && HTTP_FAILED_CODES.includes(err.response.status)) || REQUEST_FAILED_CODES.includes(err.code))) {
      if (delayBeforeRetry) {
        await GeneralUtils.sleep(RETRY_REQUEST_INTERVAL);
        return sendRequest(self, name, options, retry - 1, delayBeforeRetry);
      }

      return sendRequest(self, name, options, retry - 1, delayBeforeRetry);
    }

    throw new Error(reasonMsg);
  }
}

/**
 * @private
 * @param {ServerConnector} self
 * @param {string} name
 * @param {object} options
 * @param {number} delay
 * @return {Promise<AxiosResponse>}
 */
async function longRequestLoop(self, name, options, delay) {
  // eslint-disable-next-line no-param-reassign
  delay = Math.min(MAX_LONG_REQUEST_DELAY_MS, Math.floor(delay * LONG_REQUEST_DELAY_MULTIPLICATIVE_INCREASE_FACTOR));
  self._logger.verbose(`${name}: Still running... Retrying in ${delay} ms`);

  await GeneralUtils.sleep(delay);
  options.headers['Eyes-Date'] = DateTimeUtils.toRfc1123DateTime(); // eslint-disable-line no-param-reassign

  const response = await sendRequest(self, name, options);
  if (response.status !== HTTP_STATUS_CODES.OK) {
    return response;
  }
  return longRequestLoop(self, name, options, delay);
}

/**
 * @private
 * @param {ServerConnector} self
 * @param {string} name
 * @param {AxiosResponse} response
 * @return {Promise<AxiosResponse>}
 */
async function longRequestCheckStatus(self, name, response) {
  switch (response.status) {
    case HTTP_STATUS_CODES.OK: {
      return response;
    }
    case HTTP_STATUS_CODES.ACCEPTED: {
      const options = self._createHttpOptions({
        method: 'GET',
        url: response.headers.location,
      });
      const requestResponse = await longRequestLoop(self, name, options, LONG_REQUEST_DELAY_MS);
      return longRequestCheckStatus(self, name, requestResponse);
    }
    case HTTP_STATUS_CODES.CREATED: {
      const options = self._createHttpOptions({
        method: 'DELETE',
        url: response.headers.location,
        headers: { 'Eyes-Date': DateTimeUtils.toRfc1123DateTime() },
      });
      return sendRequest(self, name, options);
    }
    case HTTP_STATUS_CODES.GONE: {
      throw new Error('The server task has gone.');
    }
    default: {
      throw new Error(`Unknown error during long request: ${JSON.stringify(response)}`);
    }
  }
}

/**
 * @private
 * @param {ServerConnector} self
 * @param {string} name
 * @param {object} options
 * @return {Promise<AxiosResponse>}
 */
async function sendLongRequest(self, name, options = {}) {
  // extend headers of the request
  options.headers['Eyes-Expect'] = '202+location'; // eslint-disable-line no-param-reassign
  options.headers['Eyes-Date'] = DateTimeUtils.toRfc1123DateTime(); // eslint-disable-line no-param-reassign

  const response = await sendRequest(self, name, options);
  return longRequestCheckStatus(self, name, response);
}

/**
 * Creates a bytes representation of the given JSON.
 *
 * @private
 * @param {object} jsonData - The data from for which to create the bytes representation.
 * @return {Buffer} - a buffer of bytes which represents the stringified JSON, prefixed with size.
 */
const createDataBytes = (jsonData) => {
  const dataStr = JSON.stringify(jsonData);
  const dataLen = Buffer.byteLength(dataStr, 'utf8');

  // The result buffer will contain the length of the data + 4 bytes of size
  const result = Buffer.alloc(dataLen + 4);
  result.writeUInt32BE(dataLen, 0);
  result.write(dataStr, 4, dataLen);
  return result;
};

/**
 * Provides an API for communication with the Applitools server.
 */
class ServerConnector {
  /**
   * @param {Logger} logger
   * @param {Configuration} configuration
   */
  constructor(logger, configuration) {
    this._logger = logger;
    this._configuration = configuration;

    /** @type {RenderingInfo} */
    this._renderingInfo = undefined;

    this._httpOptions = {
      proxy: undefined,
      headers: DEFAULT_HEADERS,
      timeout: DEFAULT_TIMEOUT_MS,
      responseType: 'json',
      params: {},
    };
  }

  /**
   * @param {object} requestOptions
   * @param {boolean} isIncludeApiKey
   * @param {boolean} isMergeDefaultOptions
   * @return {object}
   * @protected
   */
  _createHttpOptions(requestOptions, isIncludeApiKey = true, isMergeDefaultOptions = true) {
    let options = requestOptions;
    if (isMergeDefaultOptions) {
      options = GeneralUtils.mergeDeep(this._httpOptions, options);
    } else if (options.params === undefined) {
      options.params = {};
    }

    if (isIncludeApiKey) {
      options.params.apiKey = this._configuration.getApiKey();
    }

    if (TypeUtils.isNotNull(this._configuration.getRemoveSession())) {
      options.params.removeSession = this._configuration.getRemoveSession();
    }

    if (TypeUtils.isNotNull(this._configuration.getConnectionTimeout())) {
      options.timeout = this._configuration.getConnectionTimeout();
    }

    if (TypeUtils.isNotNull(this._configuration.getProxy())) {
      options.proxy = this._configuration.getProxy().toProxyObject();
    }

    options.maxContentLength = 20 * 1024 * 1024;

    return options;
  }

  /**
   * @return {RenderingInfo}
   */
  getRenderingInfo() {
    return this._renderingInfo;
  }

  /**
   * @param {RenderingInfo} renderingInfo
   */
  setRenderingInfo(renderingInfo) {
    ArgumentGuard.notNull(renderingInfo, 'renderingInfo');
    this._renderingInfo = renderingInfo;
  }

  /**
   * Starts a new running session in the agent. Based on the given parameters, this running session will either be
   * linked to an existing session, or to a completely new session.
   *
   * @param {SessionStartInfo} sessionStartInfo - The start parameters for the session.
   * @return {Promise<RunningSession>} - RunningSession object which represents the current running session
   */
  async startSession(sessionStartInfo) {
    ArgumentGuard.notNull(sessionStartInfo, 'sessionStartInfo');
    this._logger.verbose(`ServerConnector.startSession called with: ${sessionStartInfo}`);

    const options = this._createHttpOptions({
      method: 'POST',
      url: GeneralUtils.urlConcat(this._configuration.getServerUrl(), EYES_API_PATH, '/running'),
      data: {
        startInfo: sessionStartInfo,
      },
    });

    const response = await sendRequest(this, 'startSession', options);
    const validStatusCodes = [HTTP_STATUS_CODES.OK, HTTP_STATUS_CODES.CREATED];
    if (validStatusCodes.includes(response.status)) {
      const runningSession = new RunningSession(response.data);
      runningSession.setNewSession(response.status === HTTP_STATUS_CODES.CREATED);
      this._logger.verbose('ServerConnector.startSession - post succeeded', runningSession);
      return runningSession;
    }

    throw new Error(`ServerConnector.startSession - unexpected status (${response.statusText})`);
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
    ArgumentGuard.notNull(runningSession, 'runningSession');
    // eslint-disable-next-line max-len
    this._logger.verbose(`ServerConnector.stopSession called with ${JSON.stringify({ isAborted, updateBaseline: save })} for session: ${runningSession}`);

    const options = this._createHttpOptions({
      method: 'DELETE',
      url: GeneralUtils.urlConcat(this._configuration.getServerUrl(), EYES_API_PATH, '/running', runningSession.getId()),
      params: {
        aborted: isAborted,
        updateBaseline: save,
      },
    });

    const response = await sendLongRequest(this, 'stopSession', options);
    const validStatusCodes = [HTTP_STATUS_CODES.OK];
    if (validStatusCodes.includes(response.status)) {
      const testResults = new TestResults(response.data);
      this._logger.verbose('ServerConnector.stopSession - post succeeded', testResults);
      return testResults;
    }

    throw new Error(`ServerConnector.stopSession - unexpected status (${response.statusText})`);
  }

  /**
   * Stops the running batch sessions.
   *
   * @param {string} batchId - The batchId to be stopped.
   * @return {Promise<void>}
   */
  async deleteBatchSessions(batchId) {
    ArgumentGuard.notNull(batchId, 'batchId');
    this._logger.verbose(`ServerConnector.deleteBatchSessions called for batchId: ${batchId}`);

    const options = this._createHttpOptions({
      method: 'DELETE',
      url: GeneralUtils.urlConcat(this._configuration.getServerUrl(), EYES_API_PATH, '/batches', batchId, '/close/bypointerid'),
    });

    const response = await sendRequest(this, 'deleteBatchSessions', options);
    const validStatusCodes = [HTTP_STATUS_CODES.OK];
    if (validStatusCodes.includes(response.status)) {
      this._logger.verbose('ServerConnector.deleteBatchSessions - delete succeeded');
      return;
    }

    throw new Error(`ServerConnector.deleteBatchSessions - unexpected status (${response.statusText})`);
  }

  /**
   * Deletes the given test result
   *
   * @param {TestResults} testResults - The session to delete by test results.
   * @return {Promise}
   */
  async deleteSession(testResults) {
    ArgumentGuard.notNull(testResults, 'testResults');
    this._logger.verbose(`ServerConnector.deleteSession called with ${JSON.stringify(testResults)}`);

    const options = this._createHttpOptions({
      method: 'DELETE',
      url: GeneralUtils.urlConcat(this._configuration.getServerUrl(), EYES_API_PATH, '/batches/', testResults.getBatchId(), '/', testResults.getId()),
      params: {
        accessToken: testResults.getSecretToken(),
      },
    });

    const response = await sendRequest(this, 'deleteSession', options);
    const validStatusCodes = [HTTP_STATUS_CODES.OK];
    if (validStatusCodes.includes(response.status)) {
      this._logger.verbose('ServerConnector.deleteSession - delete succeeded');
      return;
    }

    throw new Error(`ServerConnector.stopSession - unexpected status (${response.statusText})`);
  }

  /**
   * Matches the current window (held by the WebDriver) to the expected window.
   *
   * @param {RunningSession} runningSession - The current agent's running session.
   * @param {MatchWindowData} matchWindowData - Encapsulation of a capture taken from the application.
   * @return {Promise<MatchResult>} - The results of the window matching.
   */
  async matchWindow(runningSession, matchWindowData) {
    ArgumentGuard.notNull(runningSession, 'runningSession');
    ArgumentGuard.notNull(matchWindowData, 'matchWindowData');
    this._logger.verbose(`ServerConnector.matchWindow called with ${matchWindowData} for session: ${runningSession}`);

    const options = this._createHttpOptions({
      method: 'POST',
      url: GeneralUtils.urlConcat(this._configuration.getServerUrl(), EYES_API_PATH, '/running', runningSession.getId()),
      data: matchWindowData,
    });

    if (matchWindowData.getAppOutput().getScreenshot64()) {
      // if there is screenshot64, then we will send application/octet-stream body instead of application/json
      const screenshot64 = matchWindowData.getAppOutput().getScreenshot64();
      matchWindowData.getAppOutput().setScreenshot64(null); // remove screenshot64 from json
      options.headers['Content-Type'] = 'application/octet-stream';
      // noinspection JSValidateTypes
      options.data = Buffer.concat([createDataBytes(matchWindowData), screenshot64]);
      matchWindowData.getAppOutput().setScreenshot64(screenshot64);
    }

    const response = await sendLongRequest(this, 'matchWindow', options);
    const validStatusCodes = [HTTP_STATUS_CODES.OK];
    if (validStatusCodes.includes(response.status)) {
      const matchResult = new MatchResult(response.data);
      this._logger.verbose('ServerConnector.matchWindow - post succeeded', matchResult);
      return matchResult;
    }

    throw new Error(`ServerConnector.matchWindow - unexpected status (${response.statusText})`);
  }

  /**
   * Matches the current window in single request.
   *
   * @param {MatchSingleWindowData} matchSingleWindowData - Encapsulation of a capture taken from the application.
   * @return {Promise<TestResults>} - The results of the window matching.
   */
  async matchSingleWindow(matchSingleWindowData) {
    ArgumentGuard.notNull(matchSingleWindowData, 'matchSingleWindowData');
    this._logger.verbose(`ServerConnector.matchSingleWindow called with ${matchSingleWindowData}`);

    const options = this._createHttpOptions({
      method: 'POST',
      url: GeneralUtils.urlConcat(this._configuration.getServerUrl(), EYES_API_PATH),
      data: matchSingleWindowData,
    });

    if (matchSingleWindowData.getAppOutput().getScreenshot64()) {
      // if there is screenshot64, then we will send application/octet-stream body instead of application/json
      const screenshot64 = matchSingleWindowData.getAppOutput().getScreenshot64();
      matchSingleWindowData.getAppOutput().setScreenshot64(null); // remove screenshot64 from json
      options.headers['Content-Type'] = 'application/octet-stream';
      // noinspection JSValidateTypes
      options.data = Buffer.concat([createDataBytes(matchSingleWindowData), screenshot64]);
      matchSingleWindowData.getAppOutput().setScreenshot64(screenshot64);
    }

    const response = await sendLongRequest(this, 'matchSingleWindow', options);
    const validStatusCodes = [HTTP_STATUS_CODES.OK];
    if (validStatusCodes.includes(response.status)) {
      const testResults = new TestResults(response.data);
      this._logger.verbose('ServerConnector.matchSingleWindow - post succeeded', testResults);
      return testResults;
    }

    throw new Error(`ServerConnector.matchSingleWindow - unexpected status (${response.statusText})`);
  }

  // noinspection JSValidateJSDoc
  /**
   * Replaces an actual image in the current running session.
   *
   * @param {RunningSession} runningSession - The current agent's running session.
   * @param {number} stepIndex - The zero based index of the step in which to replace the actual image.
   * @param {MatchWindowData} matchWindowData - Encapsulation of a capture taken from the application.
   * @return {Promise<MatchResult>} - The results of the window matching.
   */
  async replaceWindow(runningSession, stepIndex, matchWindowData) {
    ArgumentGuard.notNull(runningSession, 'runningSession');
    ArgumentGuard.notNull(matchWindowData, 'matchWindowData');
    this._logger.verbose(`ServerConnector.replaceWindow called with ${matchWindowData} for session: ${runningSession}`);

    const options = this._createHttpOptions({
      method: 'PUT',
      url: GeneralUtils.urlConcat(this._configuration.getServerUrl(), EYES_API_PATH, '/running', runningSession.getId(), stepIndex),
      headers: {
        'Content-Type': 'application/octet-stream',
      },
      data: Buffer.concat([createDataBytes(matchWindowData), matchWindowData.getAppOutput().getScreenshot64()]),
    });

    const response = await sendLongRequest(this, 'replaceWindow', options);
    const validStatusCodes = [HTTP_STATUS_CODES.OK];
    if (validStatusCodes.includes(response.status)) {
      const matchResult = new MatchResult(response.data);
      this._logger.verbose('ServerConnector.replaceWindow - post succeeded', matchResult);
      return matchResult;
    }

    throw new Error(`ServerConnector.replaceWindow - unexpected status (${response.statusText})`);
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Initiate a rendering using RenderingGrid API
   *
   * @return {Promise<RenderingInfo>} - The results of the render request
   */
  async renderInfo() {
    this._logger.verbose('ServerConnector.renderInfo called.');

    const options = this._createHttpOptions({
      method: 'GET',
      url: GeneralUtils.urlConcat(this._configuration.getServerUrl(), EYES_API_PATH, '/renderinfo'),
    });

    const response = await sendRequest(this, 'renderInfo', options);
    const validStatusCodes = [HTTP_STATUS_CODES.OK];
    if (validStatusCodes.includes(response.status)) {
      this._renderingInfo = new RenderingInfo(response.data);
      this._logger.verbose('ServerConnector.renderInfo - post succeeded', this._renderingInfo);
      return this._renderingInfo;
    }

    throw new Error(`ServerConnector.renderInfo - unexpected status (${response.statusText})`);
  }

  /**
   * Initiate a rendering using RenderingGrid API
   *
   * @param {RenderRequest[]|RenderRequest} renderRequest - The current agent's running session.
   * @return {Promise<RunningRender[]|RunningRender>} - The results of the render request
   */
  async render(renderRequest) {
    ArgumentGuard.notNull(renderRequest, 'renderRequest');
    this._logger.verbose(`ServerConnector.render called with ${renderRequest}`);

    const isBatch = Array.isArray(renderRequest);
    const options = this._createHttpOptions({
      method: 'POST',
      url: GeneralUtils.urlConcat(this._renderingInfo.getServiceUrl(), '/render'),
      headers: {
        'X-Auth-Token': this._renderingInfo.getAccessToken(),
      },
      data: isBatch ? renderRequest : [renderRequest],
    }, false);

    const response = await sendRequest(this, 'render', options);
    const validStatusCodes = [HTTP_STATUS_CODES.OK];
    if (validStatusCodes.includes(response.status)) {
      let runningRender = Array.from(response.data).map(resultsData => new RunningRender(resultsData));
      if (!isBatch) {
        runningRender = runningRender[0]; // eslint-disable-line prefer-destructuring
      }

      this._logger.verbose('ServerConnector.render - post succeeded', runningRender);
      return runningRender;
    }

    throw new Error(`ServerConnector.render - unexpected status (${response.statusText})`);
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Check if resource exists on the server
   *
   * @param {RunningRender} runningRender - The running render (for second request only)
   * @param {RGridResource} resource - The resource to use
   * @return {Promise<boolean>} - Whether resource exists on the server or not
   */
  async renderCheckResource(runningRender, resource) {
    ArgumentGuard.notNull(runningRender, 'runningRender');
    ArgumentGuard.notNull(resource, 'resource');
    // eslint-disable-next-line max-len
    this._logger.verbose(`ServerConnector.checkResourceExists called with resource#${resource.getSha256Hash()} for render: ${runningRender}`);

    const options = this._createHttpOptions({
      method: 'HEAD',
      url: GeneralUtils.urlConcat(this._renderingInfo.getServiceUrl(), '/resources/sha256/', resource.getSha256Hash()),
      headers: {
        'X-Auth-Token': this._renderingInfo.getAccessToken(),
      },
      params: {
        'render-id': runningRender.getRenderId(),
      },
    }, false);

    const response = await sendRequest(this, 'renderCheckResource', options);
    const validStatusCodes = [HTTP_STATUS_CODES.OK, HTTP_STATUS_CODES.NOT_FOUND];
    if (validStatusCodes.includes(response.status)) {
      this._logger.verbose('ServerConnector.checkResourceExists - request succeeded');
      return response.status === HTTP_STATUS_CODES.OK;
    }

    throw new Error(`ServerConnector.checkResourceExists - unexpected status (${response.statusText})`);
  }

  /**
   * Upload resource to the server
   *
   * @param {RunningRender} runningRender - The running render (for second request only)
   * @param {RGridResource} resource - The resource to upload
   * @return {Promise<boolean>} - True if resource was uploaded
   */
  async renderPutResource(runningRender, resource) {
    ArgumentGuard.notNull(runningRender, 'runningRender');
    ArgumentGuard.notNull(resource, 'resource');
    ArgumentGuard.notNull(resource.getContent(), 'resource.getContent()');
    // eslint-disable-next-line max-len
    this._logger.verbose(`ServerConnector.putResource called with resource#${resource.getSha256Hash()} for render: ${runningRender}`);

    const options = this._createHttpOptions({
      method: 'PUT',
      url: GeneralUtils.urlConcat(this._renderingInfo.getServiceUrl(), '/resources/sha256/', resource.getSha256Hash()),
      headers: {
        'X-Auth-Token': this._renderingInfo.getAccessToken(),
        'Content-Type': resource.getContentType(),
      },
      maxContentLength: 15.5 * 1024 * 1024, // 15.5 MB  (VG limit is 16MB)
      params: {
        'render-id': runningRender.getRenderId(),
      },
      data: resource.getContent(),
    }, false);

    const response = await sendRequest(this, 'renderPutResource', options);
    const validStatusCodes = [HTTP_STATUS_CODES.OK];
    if (validStatusCodes.includes(response.status)) {
      this._logger.verbose('ServerConnector.putResource - request succeeded. Response:', response.data);
      return true;
    }

    throw new Error(`ServerConnector.putResource - unexpected status (${response.statusText})`);
  }

  /**
   * Get the rendering status for current render
   *
   * @param {RunningRender} runningRender - The running render
   * @param {boolean} [delayBeforeRequest=false] - If {@code true}, then the request will be delayed
   * @return {Promise<RenderStatusResults>} - The render's status
   */
  renderStatus(runningRender, delayBeforeRequest = false) {
    return this.renderStatusById(runningRender.getRenderId(), delayBeforeRequest);
  }

  /**
   * Get the rendering status for current render
   *
   * @param {string[]|string} renderId - The running renderId
   * @param {boolean} [delayBeforeRequest=false] - If {@code true}, then the request will be delayed
   * @return {Promise<RenderStatusResults[]|RenderStatusResults>} - The render's status
   */
  async renderStatusById(renderId, delayBeforeRequest = false) {
    ArgumentGuard.notNull(renderId, 'renderId');
    this._logger.verbose(`ServerConnector.renderStatus called for render: ${renderId}`);

    const isBatch = Array.isArray(renderId);
    const options = this._createHttpOptions({
      method: 'POST',
      url: GeneralUtils.urlConcat(this._renderingInfo.getServiceUrl(), '/render-status'),
      headers: {
        'X-Auth-Token': this._renderingInfo.getAccessToken(),
      },
      timeout: REDUCED_TIMEOUT_MS,
      data: isBatch ? renderId : [renderId],
    }, false);

    if (delayBeforeRequest) {
      this._logger.verbose(`ServerConnector.renderStatus request delayed for ${RETRY_REQUEST_INTERVAL} ms.`);
      await GeneralUtils.sleep(RETRY_REQUEST_INTERVAL);
    }

    const response = await sendRequest(this, 'renderStatus', options, 3, true);
    const validStatusCodes = [HTTP_STATUS_CODES.OK];
    if (validStatusCodes.includes(response.status)) {
      let renderStatus = Array.from(response.data).map(resultsData => new RenderStatusResults(resultsData || {}));
      if (!isBatch) {
        renderStatus = renderStatus[0]; // eslint-disable-line prefer-destructuring
      }

      this._logger.verbose(`ServerConnector.renderStatus - get succeeded for ${renderId} -`, renderStatus);
      return renderStatus;
    }

    throw new Error(`ServerConnector.renderStatus - unexpected status (${response.statusText})`);
  }

  /**
   * @param {string} domJson
   * @return {Promise<string>}
   */
  async postDomSnapshot(domJson) {
    ArgumentGuard.notNull(domJson, 'domJson');
    this._logger.verbose('ServerConnector.postDomSnapshot called');

    const options = this._createHttpOptions({
      method: 'POST',
      url: GeneralUtils.urlConcat(this._configuration.getServerUrl(), EYES_API_PATH, '/running/data'),
      headers: {
        'Content-Type': 'application/octet-stream',
      },
    });

    options.data = zlib.gzipSync(Buffer.from(domJson));

    const response = await sendRequest(this, 'postDomSnapshot', options);
    const validStatusCodes = [HTTP_STATUS_CODES.OK, HTTP_STATUS_CODES.CREATED];
    if (validStatusCodes.includes(response.status)) {
      this._logger.verbose('ServerConnector.postDomSnapshot - post succeeded');
      return response.headers.location;
    }

    throw new Error(`ServerConnector.postDomSnapshot - unexpected status (${response.statusText})`);
  }

  /**
   * @param {string} url
   * @param {boolean} [isSecondRetry=true]
   * @return {Promise<*>}
   */
  async downloadResource(url, isSecondRetry = true) {
    ArgumentGuard.notNull(url, 'url');
    this._logger.verbose(`ServerConnector.downloadResource called with url: ${url}`);

    const options = this._createHttpOptions({ url }, false, false);

    try {
      const response = await axios(options);

      // eslint-disable-next-line max-len
      this._logger.verbose(`ServerConnector.downloadResource - result ${response.statusText}, status code ${response.status}, url ${options.url}`);
      return response.data;
    } catch (err) {
      let reasonMsg = err.message;
      if (err.response && err.response.statusText) {
        reasonMsg += ` (${err.response.statusText})`;
      }

      // eslint-disable-next-line max-len
      this._logger.log(`ServerConnector.downloadResource - failed on ${options.url}: ${reasonMsg}`);

      if (isSecondRetry) {
        return this.downloadResource(url, false);
      }

      throw new Error(reasonMsg);
    }
  }
}

exports.ServerConnector = ServerConnector;
