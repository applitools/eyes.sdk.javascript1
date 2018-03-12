'use strict';

const axios = require('axios');

const ProxySettings = require('./ProxySettings');
const RunningSession = require('./RunningSession');
const TestResults = require('../TestResults');
const MatchResult = require('../match/MatchResult');
const GeneralUtils = require('../utils/GeneralUtils');
const ArgumentGuard = require('../ArgumentGuard');

const RenderingInfo = require('../renderer/RenderingInfo');
const RunningRender = require('../renderer/RunningRender');
const RenderStatusResults = require('../renderer/RenderStatusResults');

// Constants
const DEFAULT_TIMEOUT_MS = 300000; // 5 min
const EYES_API_PATH = '/api/sessions';
const LONG_REQUEST_DELAY_MS = 2000; // ms
const MAX_LONG_REQUEST_DELAY_MS = 10000; // ms
const LONG_REQUEST_DELAY_MULTIPLICATIVE_INCREASE_FACTOR = 1.5;
const DEFAULT_HEADERS = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
};

const HTTP_STATUS_CODES = {
    CREATED: 201,
    ACCEPTED: 202,
    OK: 200,
    GONE: 410,
    NOT_FOUND: 404
};

/**
 * Provides an API for communication with the Applitools server.
 */
class ServerConnector {

    /**
     * @param {PromiseFactory} promiseFactory An object which will be used for creating deferreds/promises.
     * @param {Logger} logger
     * @param {String} serverUrl
     **/
    constructor(promiseFactory, logger, serverUrl) {
        this._promiseFactory = promiseFactory;
        this._logger = logger;
        this._serverUrl = serverUrl;
        this._apiKey = null;

        this._renderingServerUrl = null;
        this._renderingAuthToken = null;

        this._proxySettings = null;
        this._httpOptions = {
            proxy: null,
            headers: DEFAULT_HEADERS,
            timeout: DEFAULT_TIMEOUT_MS,
            responseType: 'json',
            params: {}
        };
    }

    /**
     * Sets the current server URL used by the rest client.
     *
     * @param serverUrl {String} The URI of the rest server.
     */
    setServerUrl(serverUrl) {
        ArgumentGuard.notNull(serverUrl, "serverUrl");
        this._serverUrl = serverUrl;
    }

    /**
     * @return {String} The URI of the eyes server.
     */
    getServerUrl() {
        return this._serverUrl;
    }

    /**
     * Sets the API key of your applitools Eyes account.
     *
     * @param {String} apiKey The api key to set.
     */
    setApiKey(apiKey) {
        ArgumentGuard.notNull(apiKey, "apiKey");
        this._apiKey = apiKey;
    }

    /**
     *
     * @return {String} The currently set API key or {@code null} if no key is set.
     */
    getApiKey() {
        return this._apiKey;
    }

    /**
     * Sets the current rendering server URL used by the client.
     *
     * @param serverUrl {String} The URI of the rendering server.
     */
    setRenderingServerUrl(serverUrl) {
        ArgumentGuard.notNull(serverUrl, "serverUrl");
        this._renderingServerUrl = serverUrl;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @return {String} The URI of the rendering server.
     */
    getRenderingServerUrl() {
        return this._renderingServerUrl;
    }

    /**
     * Sets the API key of your applitools Eyes account.
     *
     * @param {String} authToken The api key to set.
     */
    setRenderingAuthToken(authToken) {
        ArgumentGuard.notNull(authToken, "authToken");
        this._renderingAuthToken = authToken;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     *
     * @return {String} The currently set API key or {@code null} if no key is set.
     */
    getRenderingAuthToken() {
        return this._renderingAuthToken;
    }

    /**
     * Sets the proxy settings to be used by the rest client.
     *
     * @param {ProxySettings|String} arg1 The proxy setting or url to be used. If {@code null} then no proxy is set.
     * @param {String} [username]
     * @param {String} [password]
     */
    setProxy(arg1, username, password) {
        if (!arg1) {
            this._proxySettings = undefined;
            delete this._httpOptions.proxy;
            return;
        }

        if (arg1 instanceof ProxySettings) {
            this._proxySettings = arg1;
        } else {
            this._proxySettings = new ProxySettings(arg1, username, password);
        }

        this._httpOptions.proxy = this._proxySettings.toProxyObject();
    }

    /**
     * @return {ProxySettings} The current proxy settings, or {@code null} if no proxy is set.
     */
    getProxy() {
        return this._proxySettings;
    }

    /**
     * Whether sessions are removed immediately after they are finished.
     *
     * @param shouldRemove {Boolean}
     */
    setRemoveSession(shouldRemove) {
        this._httpOptions.params.removeSession = shouldRemove;
    }

    /**
     * @return {Boolean} Whether sessions are removed immediately after they are finished.
     */
    getRemoveSession() {
        return !!this._httpOptions.params.removeSession;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Sets the connect and read timeouts for web requests.
     *
     * @param {int} timeout Connect/Read timeout in milliseconds. 0 equals infinity.
     */
    setTimeout(timeout) {
        ArgumentGuard.greaterThanOrEqualToZero(timeout, "timeout");
        this._httpOptions.timeout = timeout;
    }

    /**
     *
     * @return {int} The timeout for web requests (in seconds).
     */
    getTimeout() {
        return this._httpOptions.timeout;
    }

    /**
     * Starts a new running session in the agent. Based on the given parameters,
     * this running session will either be linked to an existing session, or to
     * a completely new session.
     *
     * @param {SessionStartInfo} sessionStartInfo The start parameters for the session.
     * @return {Promise.<RunningSession>} RunningSession object which represents the current running session
     */
    startSession(sessionStartInfo) {
        ArgumentGuard.notNull(sessionStartInfo, "sessionStartInfo");
        this._logger.verbose(`ServerConnector.startSession called with: ${sessionStartInfo}`);

        const that = this;
        const uri = GeneralUtils.urlConcat(this._serverUrl, EYES_API_PATH, '/running');
        const options = {
            params: {
                apiKey: that._apiKey,
            },
            data: {startInfo: sessionStartInfo}
        };

        return sendRequest(that, 'startSession', uri, 'post', options).then(response => {
            const validStatusCodes = [HTTP_STATUS_CODES.OK, HTTP_STATUS_CODES.CREATED];
            if (validStatusCodes.includes(response.status)) {
                that._logger.verbose('ServerConnector.startSession - post succeeded', response.data);
                const runningSession = RunningSession.fromObject(response.data);
                runningSession.setNewSession(response.status === HTTP_STATUS_CODES.CREATED);
                return runningSession;
            }

            throw new Error(`ServerConnector.startSession - unexpected status (${response.statusText})`);
        });
    }

    /**
     * Stops the running session.
     *
     * @param {RunningSession} runningSession The running session to be stopped.
     * @param {Boolean} isAborted
     * @param {Boolean} save
     * @return {Promise.<TestResults>} TestResults object for the stopped running session
     */
    stopSession(runningSession, isAborted, save) {
        ArgumentGuard.notNull(runningSession, "runningSession");
        this._logger.verbose(`ServerConnector.stopSession called with isAborted: ${isAborted}, save: ${save} for session: ${runningSession}`);

        const that = this;
        const uri = GeneralUtils.urlConcat(this._serverUrl, EYES_API_PATH, '/running', runningSession.getId());
        const options = {
            params: {
                apiKey: that._apiKey,
                aborted: isAborted,
                updateBaseline: save
            }
        };

        return sendLongRequest(that, 'stopSession', uri, 'delete', options).then(response => {
            const validStatusCodes = [HTTP_STATUS_CODES.OK];
            if (validStatusCodes.includes(response.status)) {
                that._logger.verbose('ServerConnector.stopSession - post succeeded', response.data);
                return TestResults.fromObject(response.data);
            }

            throw new Error(`ServerConnector.stopSession - unexpected status (${response.statusText})`);
        });
    }

    /**
     * Matches the current window (held by the WebDriver) to the expected window.
     *
     * @param {RunningSession} runningSession The current agent's running session.
     * @param {MatchWindowData} matchWindowData Encapsulation of a capture taken from the application.
     * @return {Promise.<MatchResult>} The results of the window matching.
     */
    matchWindow(runningSession, matchWindowData) {
        ArgumentGuard.notNull(runningSession, "runningSession");
        ArgumentGuard.notNull(matchWindowData, "matchWindowData");
        this._logger.verbose(`ServerConnector.matchWindow called with ${matchWindowData} for session: ${runningSession}`);

        const that = this;
        const uri = GeneralUtils.urlConcat(this._serverUrl, EYES_API_PATH, '/running', runningSession.getId());
        let options = {
            params: {
                apiKey: that._apiKey,
            },
            data: matchWindowData
        };

        if (matchWindowData.getAppOutput().getScreenshot64()) {
            // if there is screenshot64, then we will send application/octet-stream body instead of application/json
            const screenshot64 = matchWindowData.getAppOutput().getScreenshot64();
            matchWindowData.getAppOutput().setScreenshot64(null); // remove screenshot64 from json
            options.contentType = 'application/octet-stream';
            // noinspection JSValidateTypes
            options.data = Buffer.concat([createDataBytes(matchWindowData), screenshot64]);
            matchWindowData.getAppOutput().setScreenshot64(screenshot64);
        }

        return sendLongRequest(that, 'matchWindow', uri, 'post', options).then(response => {
            const validStatusCodes = [HTTP_STATUS_CODES.OK];
            if (validStatusCodes.includes(response.status)) {
                that._logger.verbose('ServerConnector.matchWindow - post succeeded', response.data);
                return MatchResult.fromObject(response.data);
            }

            throw new Error(`ServerConnector.matchWindow - unexpected status (${response.statusText})`);
        });
    }

    /**
     * Matches the current window in single request.
     *
     * @param {MatchSingleWindowData} matchSingleWindowData Encapsulation of a capture taken from the application.
     * @return {Promise.<TestResults>} The results of the window matching.
     */
    matchSingleWindow(matchSingleWindowData) {
        ArgumentGuard.notNull(matchSingleWindowData, "matchSingleWindowData");
        this._logger.verbose(`ServerConnector.matchSingleWindow called with ${matchSingleWindowData}`);

        const that = this;
        const uri = GeneralUtils.urlConcat(this._serverUrl, EYES_API_PATH);
        let options = {
            params: {
                apiKey: that._apiKey,
            },
            data: matchSingleWindowData
        };

        if (matchSingleWindowData.getAppOutput().getScreenshot64()) {
            // if there is screenshot64, then we will send application/octet-stream body instead of application/json
            const screenshot64 = matchSingleWindowData.getAppOutput().getScreenshot64();
            matchSingleWindowData.getAppOutput().setScreenshot64(null); // remove screenshot64 from json
            options.contentType = 'application/octet-stream';
            // noinspection JSValidateTypes
            options.data = Buffer.concat([createDataBytes(matchSingleWindowData), screenshot64]);
            matchSingleWindowData.getAppOutput().setScreenshot64(screenshot64);
        }

        return sendLongRequest(that, 'matchSingleWindow', uri, 'post', options).then(response => {
            const validStatusCodes = [HTTP_STATUS_CODES.OK];
            if (validStatusCodes.includes(response.status)) {
                that._logger.verbose('ServerConnector.matchSingleWindow - post succeeded', response.data);
                return TestResults.fromObject(response.data);
            }

            throw new Error(`ServerConnector.matchSingleWindow - unexpected status (${response.statusText})`);
        });
    }

    //noinspection JSValidateJSDoc
    /**
     * Replaces an actual image in the current running session.
     *
     * @param {RunningSession} runningSession The current agent's running session.
     * @param {Number} stepIndex The zero based index of the step in which to replace the actual image.
     * @param {MatchWindowData} matchWindowData Encapsulation of a capture taken from the application.
     * @return {Promise.<MatchResult>} The results of the window matching.
     */
    replaceWindow(runningSession, stepIndex, matchWindowData) {
        ArgumentGuard.notNull(runningSession, "runningSession");
        ArgumentGuard.notNull(matchWindowData, "matchWindowData");
        this._logger.verbose(`ServerConnector.replaceWindow called with ${matchWindowData} for session: ${runningSession}`);

        const that = this;
        const uri = GeneralUtils.urlConcat(this._serverUrl, EYES_API_PATH, '/running', runningSession.getId(), String(stepIndex));
        const options = {
            contentType: 'application/octet-stream',
            params: {
                apiKey: that._apiKey,
            },
            data: Buffer.concat([createDataBytes(matchWindowData), matchWindowData.getAppOutput().getScreenshot64()])
        };

        return sendLongRequest(that, 'replaceWindow', uri, 'put', options).then(response => {
            const validStatusCodes = [HTTP_STATUS_CODES.OK];
            if (validStatusCodes.includes(response.status)) {
                that._logger.verbose('ServerConnector.replaceWindow - post succeeded', response.data);
                return MatchResult.fromObject(response.data);
            }

            throw new Error(`ServerConnector.replaceWindow - unexpected status (${response.statusText})`);
        });
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Initiate a rendering using RenderingGrid API
     *
     * @return {Promise.<RenderingInfo>} The results of the render request
     */
    renderInfo() {
        this._logger.verbose(`ServerConnector.renderInfo called.`);

        const that = this;
        const uri = GeneralUtils.urlConcat(this._serverUrl, EYES_API_PATH, '/renderinfo');
        const options = {
            params: {
                apiKey: that._apiKey,
            },
        };

        return sendRequest(that, 'renderInfo', uri, 'get', options).then(response => {
            const validStatusCodes = [HTTP_STATUS_CODES.OK];
            if (validStatusCodes.includes(response.status)) {
                that._logger.verbose('ServerConnector.renderInfo - post succeeded', response.data);
                return RenderingInfo.fromObject(response.data);
            }

            throw new Error(`ServerConnector.renderInfo - unexpected status (${response.statusText})`);
        });
    }

    /**
     * Initiate a rendering using RenderingGrid API
     *
     * @param {RenderRequest} renderRequest The current agent's running session.
     * @param {RunningRender} [runningRender] The running render (for second request only)
     * @return {Promise.<RunningRender>} The results of the render request
     */
    render(renderRequest, runningRender) {
        ArgumentGuard.notNull(renderRequest, "renderRequest");
        this._logger.verbose(`ServerConnector.render called with ${renderRequest} for render: ${runningRender}`);

        const that = this;
        const uri = GeneralUtils.urlConcat(this._renderingServerUrl, '/render');
        const options = {
            headers: {
                'X-Auth-Token': that._renderingAuthToken,
            },
            data: renderRequest.toJSON()
        };

        if (runningRender) {
            options.data.renderId = runningRender.getRenderId();
        }

        return sendRequest(that, 'render', uri, 'post', options).then(response => {
            const validStatusCodes = [HTTP_STATUS_CODES.OK];
            if (validStatusCodes.includes(response.status)) {
                that._logger.verbose('ServerConnector.render - post succeeded', response.data);
                return RunningRender.fromObject(response.data);
            }

            throw new Error(`ServerConnector.render - unexpected status (${response.statusText})`);
        });
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Check if resource exists on the server
     *
     * @param {RunningRender} runningRender The running render (for second request only)
     * @param {RGridResource} resource The resource to use
     * @return {Promise.<boolean>} Whether resource exists on the server or not
     */
    renderCheckResource(runningRender, resource) {
        ArgumentGuard.notNull(runningRender, "runningRender");
        ArgumentGuard.notNull(resource, "resource");
        this._logger.verbose(`ServerConnector.checkResourceExists called with resource#${resource.getSha256Hash()} for render: ${runningRender}`);

        const that = this;
        const uri = GeneralUtils.urlConcat(this._renderingServerUrl, `/resources/sha256/${resource.getSha256Hash()}`);
        const options = {
            headers: {
                'X-Auth-Token': that._renderingAuthToken,
            },
            params: {
                'render-id': runningRender.getRenderId(),
            },
        };

        return sendRequest(that, 'renderCheckResource', uri, 'HEAD', options).then(response => {
            const validStatusCodes = [HTTP_STATUS_CODES.OK, HTTP_STATUS_CODES.NOT_FOUND];
            if (validStatusCodes.includes(response.status)) {
                that._logger.verbose('ServerConnector.checkResourceExists - request succeeded');
                return response.status === HTTP_STATUS_CODES.OK;
            }

            throw new Error(`ServerConnector.checkResourceExists - unexpected status (${response.statusText})`);
        });
    }

    /**
     * Upload resource to the server
     *
     * @param {RunningRender} runningRender The running render (for second request only)
     * @param {RGridResource} resource The resource to upload
     * @return {Promise.<boolean>} True if resource was uploaded
     */
    renderPutResource(runningRender, resource) {
        ArgumentGuard.notNull(runningRender, "runningRender");
        ArgumentGuard.notNull(resource, "resource");
        this._logger.verbose(`ServerConnector.putResource called with resource#${resource.getSha256Hash()} for render: ${runningRender}`);

        const that = this;
        const uri = GeneralUtils.urlConcat(this._renderingServerUrl, `/resources/sha256/${resource.getSha256Hash()}`);
        const options = {
            contentType: resource.getContentType(),
            headers: {
                'X-Auth-Token': that._renderingAuthToken,
            },
            params: {
                'render-id': runningRender.getRenderId(),
            },
            data: resource.getContent()
        };

        return sendRequest(that, 'renderPutResource', uri, 'PUT', options).then(response => {
            const validStatusCodes = [HTTP_STATUS_CODES.OK];
            if (validStatusCodes.includes(response.status)) {
                that._logger.verbose('ServerConnector.putResource - request succeeded');
                return true;
            }

            throw new Error(`ServerConnector.putResource - unexpected status (${response.statusText})`);
        });
    }

    /**
     * Get the rendering status for current render
     *
     * @param {RunningRender} runningRender The running render
     * @return {Promise.<RenderStatusResults>} The render's status
     */
    renderStatus(runningRender) {
        ArgumentGuard.notNull(runningRender, "runningRender");
        this._logger.verbose(`ServerConnector.renderStatus called for render: ${runningRender}`);

        const that = this;
        const uri = GeneralUtils.urlConcat(this._renderingServerUrl, '/render-status');
        const options = {
            headers: {
                'X-Auth-Token': that._renderingAuthToken,
            },
            params: {
                'render-id': runningRender.getRenderId(),
            }
        };

        return sendRequest(that, 'renderStatus', uri, 'get', options).then(response => {
            const validStatusCodes = [HTTP_STATUS_CODES.OK];
            if (validStatusCodes.includes(response.status)) {
                that._logger.verbose('ServerConnector.renderStatus - get succeeded', response.data);
                return RenderStatusResults.fromObject(response.data);
            }

            throw new Error(`ServerConnector.renderStatus - unexpected status (${response.statusText})`);
        });
    }
}

/**
 * @private
 * @param {ServerConnector} that
 * @param {String} name
 * @param {String} uri
 * @param {String} method
 * @param {Object} options
 * @return {Promise.<AxiosResponse>}
 */
const sendLongRequest = (that, name, uri, method, options = {}) => {
    const headers = {
        'Eyes-Expect': '202+location',
        'Eyes-Date': GeneralUtils.toRfc1123DateTime()
    };

    // extend headers of the request
    options.headers = options.headers ? Object.assign(options.headers, headers) : headers;
    return sendRequest(that, name, uri, method, options).then(response => {
        return longRequestCheckStatus(that, name, response);
    });
};

/**
 * @private
 * @param {ServerConnector} that
 * @param {String} name
 * @param {AxiosResponse} response
 * @return {Promise.<AxiosResponse>}
 */
const longRequestCheckStatus = (that, name, response) => {
    switch (response.status) {
        case HTTP_STATUS_CODES.OK:
            return that._promiseFactory.resolve(response);
        case HTTP_STATUS_CODES.ACCEPTED:
            const uri = response.headers['location'];
            return longRequestLoop(that, name, uri, LONG_REQUEST_DELAY_MS).then(response => {
                return longRequestCheckStatus(that, name, response);
            });
        case HTTP_STATUS_CODES.CREATED:
            const deleteUri = response.headers['location'];
            const options = {params: {apiKey: that._apiKey}, headers: {'Eyes-Date': GeneralUtils.toRfc1123DateTime()}};
            return sendRequest(that, name, deleteUri, 'delete', options);
        case HTTP_STATUS_CODES.GONE:
            return that._promiseFactory.reject(new Error('The server task has gone.'));
        default:
            return that._promiseFactory.reject(new Error(`Unknown error processing long request: ${JSON.stringify(response)}`));
    }
};

/**
 * @private
 * @param {ServerConnector} that
 * @param {String} name
 * @param {String} uri
 * @param {int} delay
 * @return {Promise.<AxiosResponse>}
 */
const longRequestLoop = (that, name, uri, delay) => {
    delay = Math.min(MAX_LONG_REQUEST_DELAY_MS, Math.floor(delay * LONG_REQUEST_DELAY_MULTIPLICATIVE_INCREASE_FACTOR));
    that._logger.verbose(`${name}: Still running... Retrying in ${delay} ms`);

    return GeneralUtils.sleep(delay, that._promiseFactory).then(() => {
        const options = {params: {apiKey: that._apiKey}, headers: {'Eyes-Date': GeneralUtils.toRfc1123DateTime()}};
        return sendRequest(that, name, uri, 'get', options);
    }).then(response => {
        if (response.status !== HTTP_STATUS_CODES.OK) {
            return response;
        }

        return longRequestLoop(that, name, uri, delay);
    });
};

/**
 * @private
 * @param {ServerConnector} that
 * @param {String} name
 * @param {String} url
 * @param {String} method
 * @param {Object} options
 * @return {Promise.<AxiosResponse>}
 */
const sendRequest = (that, name, url, method, options = {}) => {
    const request = GeneralUtils.clone(that._httpOptions);
    request.url = url;
    request.method = method;
    if (options.params) { request.params = Object.assign(request.params, options.params); }
    if (options.headers) { request.headers = Object.assign(request.headers, options.headers); }
    if (options.data) { request.data = options.data; }
    if (options.contentType) { request.headers['Content-Type'] = options.contentType; }

    if (request.proxy && request.proxy.protocol === 'http:') {
        request.transport = require('http');
    }

    that._logger.verbose(`ServerConnector.${name} will now post call to ${request.url} with params ${JSON.stringify(request.params)}`);
    return axios(request).then((response) => {
        that._logger.verbose(`ServerConnector.${name} - result ${response.statusText}, status code ${response.status}`);
        return response;
    }).catch(error => {
        const reasonMessage = error.response && error.response.statusText ? error.response.statusText : error.message;
        that._logger.log(`ServerConnector.${name} - post failed: ${reasonMessage}`);
        throw error;
    });
};

/**
 * Creates a bytes representation of the given JSON.
 *
 * @private
 * @param {Object} jsonData The data from for which to create the bytes representation.
 * @return {Buffer} a buffer of bytes which represents the stringified JSON, prefixed with size.
 */
const createDataBytes = (jsonData) => {
    const dataStr = JSON.stringify(jsonData);
    const dataLen = Buffer.byteLength(dataStr, 'utf8');

    // The result buffer will contain the length of the data + 4 bytes of size
    const result = new Buffer(dataLen + 4);
    result.writeUInt32BE(dataLen, 0);
    result.write(dataStr, 4, dataLen);
    return result;
};

module.exports = ServerConnector;
