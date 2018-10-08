'use strict';

const axios = require('axios');

const { SessionEventHandler } = require('./SessionEventHandler');
const { GeneralUtils } = require('../utils/GeneralUtils');

// Constants
const DEFAULT_CONNECTION_TIMEOUT_MS = 30000;
const SERVER_SUFFIX = '/applitools/sessions';

// *** Overriding callbacks
function sendNotification(requestOptions, resolve, reject) {
  return axios(requestOptions)
    .then(response => resolve(response.status))
    .catch(err => reject(err));
}

class RemoteSessionEventHandler extends SessionEventHandler {
  constructor(serverUrl, accessKey) {
    super();

    this._httpOptions = {
      strictSSL: false,
      baseUrl: undefined,
      json: true,
      params: {
        accessKey,
      },
      timeout: DEFAULT_CONNECTION_TIMEOUT_MS,
    };

    this.setServerUrl(serverUrl);
  }

  setTimeout(value) {
    this._httpOptions.timeout = value;
  }

  getTimeout() {
    return this._httpOptions.timeout;
  }

  setServerUrl(value) {
    this._serverUrl = value;
    this._httpOptions.baseUrl = GeneralUtils.urlConcat(value, SERVER_SUFFIX);
  }

  getServerUrl() {
    return this._serverUrl;
  }

  setAccessKey(value) {
    this._httpOptions.params.accessKey = value;
  }

  getAccessKey() {
    return this._httpOptions.params.accessKey;
  }

  /** @inheritDoc */
  initStarted(autSessionId) {
    return new Promise((resolve, reject) => {
      const options = Object.create(this._httpOptions);
      options.uri = autSessionId;
      options.data = { action: 'initStart' };
      options.method = 'put';
      sendNotification(options, resolve, reject);
    });
  }

  /** @inheritDoc */
  initEnded(autSessionId) {
    return new Promise((resolve, reject) => {
      const options = Object.create(this._httpOptions);
      options.uri = autSessionId;
      options.data = { action: 'initEnd' };
      options.method = 'put';
      sendNotification(options, resolve, reject);
    });
  }

  /** @inheritDoc */
  setSizeWillStart(autSessionId, sizeToSet) {
    return new Promise((resolve, reject) => {
      const options = Object.create(this._httpOptions);
      options.uri = autSessionId;
      options.data = { action: 'setSizeStart', size: sizeToSet };
      options.method = 'put';
      sendNotification(options, resolve, reject);
    });
  }

  /** @inheritDoc */
  setSizeEnded(autSessionId) {
    return new Promise((resolve, reject) => {
      const options = Object.create(this._httpOptions);
      options.uri = autSessionId;
      options.data = { action: 'setSizeEnd' };
      options.method = 'put';
      sendNotification(options, resolve, reject);
    });
  }

  /** @inheritDoc */
  testStarted(autSessionId) {
    return new Promise((resolve, reject) => {
      const options = Object.create(this._httpOptions);
      options.uri = '';
      options.data = { autSessionId };
      options.method = 'post';
      sendNotification(options, resolve, reject);
    });
  }

  /** @inheritDoc */
  testEnded(autSessionId, testResults) {
    return new Promise((resolve, reject) => {
      const options = Object.create(this._httpOptions);
      options.uri = autSessionId;
      options.data = { action: 'testEnd', testResults };
      options.method = 'put';
      sendNotification(options, resolve, reject);
    });
  }

  /** @inheritDoc */
  validationWillStart(autSessionId, validationInfo) {
    return new Promise((resolve, reject) => {
      const options = Object.create(this._httpOptions);
      options.uri = `${autSessionId}/validations`;
      options.data = validationInfo.toObject();
      options.method = 'post';
      sendNotification(options, resolve, reject);
    });
  }

  /** @inheritDoc */
  validationEnded(autSessionId, validationId, validationResult) {
    return new Promise((resolve, reject) => {
      const options = Object.create(this._httpOptions);
      options.uri = `${autSessionId}/validations/${validationId}`;
      options.data = { action: 'validationEnd', asExpected: validationResult.getAsExpected() };
      options.method = 'put';
      sendNotification(options, resolve, reject);
    });
  }
}

exports.RemoteSessionEventHandler = RemoteSessionEventHandler;
