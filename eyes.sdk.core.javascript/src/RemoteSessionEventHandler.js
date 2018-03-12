'use strict';

const axios = require('axios');

const GeneralUtils = require('./utils/GeneralUtils');
const SessionEventHandler = require('./SessionEventHandler');

// Constants
const DEFAULT_CONNECTION_TIMEOUT_MS = 30000;
const SERVER_SUFFIX = '/applitools/sessions';

module.exports.createSessionEventHandler = (serverUrl, accessKey) => {

    const sessionHandler = SessionEventHandler.createSessionEventHandler();

    sessionHandler._defaultHttpOptions = {
        strictSSL: false,
        baseUrl: GeneralUtils.urlConcat(serverUrl, SERVER_SUFFIX),
        json: true,
        qs: {}
    };

    // get/set timeout
    GeneralUtils.definePropertyWithDefaultConfig(sessionHandler, "timeout",
        function () { return this._defaultHttpOptions.timeout; },
        function (timeout) { this._defaultHttpOptions.timeout = timeout; }
    );

    // get/set serverUrl
    GeneralUtils.definePropertyWithDefaultConfig(sessionHandler, "serverUrl",
        function () { return this._serverUrl; },
        function (serverUrl) {
            this._serverUrl = serverUrl;
            this._defaultHttpOptions.baseUrl = GeneralUtils.urlConcat(serverUrl, SERVER_SUFFIX);
        }
    );

    // get/set accessKey
    GeneralUtils.definePropertyWithDefaultConfig(sessionHandler, "accessKey",
        function () { return this._defaultHttpOptions.qs.accessKey; },
        function (accessKey) { this._defaultHttpOptions.qs.accessKey = accessKey; }
    );

    // setting the properties' values.
    sessionHandler.timeout = DEFAULT_CONNECTION_TIMEOUT_MS;
    sessionHandler.serverUrl = serverUrl;
    sessionHandler.accessKey = accessKey;


    // *** Overriding callbacks
    const _sendNotification = (requestOptions, resolve, reject) => axios(requestOptions).then(() => resolve(response.statusCode)).catch(err => reject(err));

    sessionHandler.testStarted = function (autSessionId) {
        return this._promiseFactory.makePromise((resolve, reject) => {
            const options = Object.create(this._defaultHttpOptions);
            options.uri = "";
            options.data = {autSessionId: autSessionId};
            options.method = "post";
            _sendNotification(options, resolve, reject);
        });
    };

    sessionHandler.testEnded = function (autSessionId, testResults) {
        return this._promiseFactory.makePromise((resolve, reject) => {
            const options = Object.create(this._defaultHttpOptions);
            options.uri = autSessionId;
            options.data = {action: "testEnd", testResults: testResults};
            options.method = 'put';
            _sendNotification(options, resolve, reject);
        });
    };

    sessionHandler.initStarted = function (autSessionId) {
        return this._promiseFactory.makePromise((resolve, reject) => {
            const options = Object.create(this._defaultHttpOptions);
            options.uri = autSessionId;
            options.data = {action: 'initStart'};
            options.method = "put";
            _sendNotification(options, resolve, reject);
        });
    };

    sessionHandler.initEnded = function (autSessionId) {
        return this._promiseFactory.makePromise((resolve, reject) => {
            const options = Object.create(this._defaultHttpOptions);
            options.uri = autSessionId;
            options.data = {action: "initEnd"};
            options.method = 'put';
            _sendNotification(options, resolve, reject);
        });
    };

    sessionHandler.setSizeWillStart = function (autSessionId, size) {
        return this._promiseFactory.makePromise((resolve, reject) => {
            const options = Object.create(this._defaultHttpOptions);
            options.uri = autSessionId;
            options.data = {action: "setSizeStart", size: size};
            options.method = "put";
            _sendNotification(options, resolve, reject);
        });
    };

    sessionHandler.setSizeEnded = function (autSessionId) {
        return this._promiseFactory.makePromise((resolve, reject) => {
            const options = Object.create(this._defaultHttpOptions);
            options.uri = autSessionId;
            options.data = {action: "setSizeEnd"};
            options.method = 'put';
            _sendNotification(options, resolve, reject);
        });
    };

    sessionHandler.validationWillStart = function (autSessionId, validationInfo) {
        return this._promiseFactory.makePromise((resolve, reject) => {
            const options = Object.create(this._defaultHttpOptions);
            options.uri = `${autSessionId}/validations`;
            options.data = validationInfo.toObject();
            options.method = 'post';
            _sendNotification(options, resolve, reject);
        });
    };

    sessionHandler.validationEnded = function (autSessionId, validationId, validationResult) {
        return this._promiseFactory.makePromise((resolve, reject) => {
            const options = Object.create(this._defaultHttpOptions);
            options.uri = `${autSessionId}/validations/${validationId}`;
            options.data = {action: "validationEnd", asExpected: validationResult.asExpected};
            options.method = 'put';
            _sendNotification(options, resolve, reject);
        });
    };

    return sessionHandler;
};
