'use strict';

const { BatchInfo } = require('./BatchInfo');
const { PropertyData } = require('./PropertyData');
const { ProxySettings } = require('./ProxySettings');
const { RectangleSize } = require('../geometry/RectangleSize');
const { ArgumentGuard } = require('../utils/ArgumentGuard');
const { TypeUtils } = require('../utils/TypeUtils');

const MIN_MATCH_TIMEOUT = 500;

const DEFAULT_VALUES = {
  isDisabled: false,
  matchTimeout: 2000, // ms
  serverUrl: 'https://eyesapi.applitools.com',
  compareWithParentBranch: false,
  saveFailedTests: false,
  saveNewTests: true,
  ignoreBaseline: false,
  sendDom: false,
};

class Configuration {
  /**
   * @param {Configuration|object} [configuration]
   */
  constructor(configuration) {
    /** @type {boolean} */
    this._showLogs = undefined;
    /** @type {boolean} */
    this._saveDebugData = undefined;

    /** @type {string} */
    this._appName = undefined;
    /** @type {string} */
    this._testName = undefined;
    /** @type {boolean} */
    this._isDisabled = undefined;
    /** @type {number} */
    this._matchTimeout = undefined;
    /** @type {SessionType} */
    this._sessionType = undefined;
    /** @type {RectangleSize} */
    this._viewportSize = undefined;
    /** @type {string} */
    this._agentId = undefined;

    /** @type {string} */
    this._apiKey = undefined;
    /** @type {string} */
    this._serverUrl = undefined;
    /** @type {ProxySettings} */
    this._proxySettings = undefined;
    /** @type {number} */
    this._connectionTimeout = undefined;
    /** @type {boolean} */
    this._removeSession = undefined;

    /** @type {BatchInfo} */
    this._batch = undefined;

    /** @type {PropertyData[]} */
    this._properties = [];

    /** @type {string} */
    this._baselineEnvName = undefined;
    /** @type {string} */
    this._environmentName = undefined;

    /** @type {string} */
    this._branchName = undefined;
    /** @type {string} */
    this._parentBranchName = undefined;
    /** @type {string} */
    this._baselineBranchName = undefined;
    /** @type {boolean} */
    this._compareWithParentBranch = undefined;

    /** @type {boolean} */
    this._saveFailedTests = undefined;
    /** @type {boolean} */
    this._saveNewTests = undefined;
    /** @type {boolean} */
    this._ignoreBaseline = undefined;
    /** @type {boolean} */
    this._saveDiffs = undefined;
    /** @type {boolean} */
    this._sendDom = undefined;

    if (configuration) {
      this.mergeConfig(configuration);
    }
  }

  /**
   * @return {boolean}
   */
  get showLogs() {
    return this._showLogs;
  }

  /**
   * @param {boolean} value
   */
  set showLogs(value) {
    ArgumentGuard.isBoolean(value, 'showLogs');
    this._showLogs = value;
  }

  /**
   * @return {boolean}
   */
  get saveDebugData() {
    return this._saveDebugData;
  }

  /**
   * @param {boolean} value
   */
  set saveDebugData(value) {
    ArgumentGuard.isBoolean(value, 'saveDebugData');
    this._saveDebugData = value;
  }

  /**
   * @return {string} - The currently set API key or {@code null} if no key is set.
   */
  get apiKey() {
    return TypeUtils.getOrDefault(this._apiKey, process.env.APPLITOOLS_API_KEY);
  }

  /**
   * Sets the API key of your applitools Eyes account.
   *
   * @param {string} value - The api key to be used.
   */
  set apiKey(value) {
    ArgumentGuard.isString(value, 'apiKey');
    ArgumentGuard.alphanumeric(value, 'apiKey');
    this._apiKey = value;
  }

  /**
   * @return {string} - The URI of the eyes server.
   */
  get serverUrl() {
    return TypeUtils.getOrDefault(this._serverUrl, process.env.APPLITOOLS_SERVER_URL || DEFAULT_VALUES.serverUrl);
  }

  /**
   * Sets the current server URL used by the rest client.
   *
   * @param {string} value - The URI of the rest server, or {@code null} to use the default server.
   */
  set serverUrl(value) {
    ArgumentGuard.isString(value, 'serverUrl', false);
    this._serverUrl = value;
  }

  /**
   * @return {ProxySettings} - The current proxy settings, or {@code undefined} if no proxy is set.
   */
  get proxy() {
    return this._proxySettings;
  }

  /**
   * Sets the proxy settings to be used by the rest client.
   *
   * @param {ProxySettings|ProxySettingsObject|string|boolean} value - The ProxySettings object or proxy url to be used.
   *   Use {@code false} to disable proxy (even if it set via env variables). Use {@code null} to reset proxy settings.
   */
  set proxy(value) {
    // noinspection IfStatementWithTooManyBranchesJS
    if (TypeUtils.isNull(value)) {
      this._proxySettings = undefined;
    } else if (value === false || TypeUtils.isString(value)) {
      this._proxySettings = new ProxySettings(value);
    } else if (value instanceof ProxySettings) {
      this._proxySettings = value;
    } else {
      this._proxySettings = new ProxySettings(value.url, value.username, value.password);
    }
  }

  /**
   * @return {number} - The timeout for web requests (in milliseconds).
   */
  get connectionTimeout() {
    return this._connectionTimeout;
  }

  /**
   * Sets the connect and read timeouts for web requests.
   *
   * @param {number} value - Connect/Read timeout in milliseconds. 0 equals infinity.
   */
  set connectionTimeout(value) {
    ArgumentGuard.greaterThanOrEqualToZero(value, 'connectionTimeout', true);
    this._connectionTimeout = value;
  }

  /**
   * @return {boolean} - Whether sessions are removed immediately after they are finished.
   */
  get removeSession() {
    return this._removeSession;
  }

  /**
   * Whether sessions are removed immediately after they are finished.
   *
   * @param {boolean} value
   */
  set removeSession(value) {
    ArgumentGuard.isBoolean(value, 'removeSession');
    this._removeSession = value;
  }

  /**
   * @return {boolean} - The currently compareWithParentBranch value
   */
  get compareWithParentBranch() {
    return TypeUtils.getOrDefault(this._compareWithParentBranch, DEFAULT_VALUES.compareWithParentBranch);
  }

  /**
   * @param {boolean} value - New compareWithParentBranch value, default is false
   */
  set compareWithParentBranch(value) {
    ArgumentGuard.isBoolean(value, 'compareWithParentBranch');
    this._compareWithParentBranch = value;
  }

  /**
   * @return {boolean} - The currently ignoreBaseline value
   */
  get ignoreBaseline() {
    return TypeUtils.getOrDefault(this._ignoreBaseline, DEFAULT_VALUES.ignoreBaseline);
  }

  /**
   * @param {boolean} value - New ignoreBaseline value, default is false
   */
  set ignoreBaseline(value) {
    ArgumentGuard.isBoolean(value, 'ignoreBaseline');
    this._ignoreBaseline = value;
  }

  /**
   * @return {boolean} - True if new tests are saved by default.
   */
  get saveNewTests() {
    return TypeUtils.getOrDefault(this._saveNewTests, DEFAULT_VALUES.saveNewTests);
  }

  /**
   * Used for automatic save of a test run. New tests are automatically saved by default.
   *
   * @param {boolean} value - True if new tests should be saved by default. False otherwise.
   */
  set saveNewTests(value) {
    ArgumentGuard.isBoolean(value, 'saveNewTests');
    this._saveNewTests = value;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @return {boolean} - True if failed tests are saved by default.
   */
  get saveFailedTests() {
    return TypeUtils.getOrDefault(this._saveFailedTests, DEFAULT_VALUES.saveFailedTests);
  }

  /**
   * Set whether or not failed tests are saved by default.
   *
   * @param {boolean} value - True if failed tests should be saved by default, false otherwise.
   */
  set saveFailedTests(value) {
    ArgumentGuard.isBoolean(value, 'saveFailedTests');
    this._saveFailedTests = value;
  }

  /**
   * @return {number} - The maximum time in ms {@link #checkWindowBase(RegionProvider, string, boolean, number)} waits
   *   for a match.
   */
  get matchTimeout() {
    return TypeUtils.getOrDefault(this._matchTimeout, DEFAULT_VALUES.matchTimeout);
  }

  /**
   * Sets the maximum time (in ms) a match operation tries to perform a match.
   * @param {number} value - Total number of ms to wait for a match.
   */
  set matchTimeout(value) {
    ArgumentGuard.greaterThanOrEqualToZero(value, 'matchTimeout', true);

    if (value !== 0 && MIN_MATCH_TIMEOUT > value) {
      throw new TypeError(`Match timeout must be set in milliseconds, and must be > ${MIN_MATCH_TIMEOUT}`);
    }

    this._matchTimeout = value;
  }

  /**
   * @return {boolean} - Whether eyes is disabled.
   */
  get isDisabled() {
    return TypeUtils.getOrDefault(this._isDisabled, DEFAULT_VALUES.isDisabled);
  }

  /**
   * @param {boolean} value - If true, all interactions with this API will be silently ignored.
   */
  set isDisabled(value) {
    ArgumentGuard.isBoolean(value, 'isDisabled', false);
    this._isDisabled = value;
  }

  /**
   * @return {BatchInfo}
   */
  get batch() {
    if (this._batch === undefined) {
      this._batch = new BatchInfo();
    }

    return this._batch;
  }

  /**
   * Sets the batch in which context future tests will run or {@code null} if tests are to run standalone.
   *
   * @param {BatchInfo|BatchInfoObject} value
   */
  set batch(value) {
    this._batch = value ? new BatchInfo(value) : undefined;
  }

  /**
   * @return {PropertyData[]}
   */
  get properties() {
    return this._properties;
  }

  /**
   * @param {PropertyData[]|PropertyDataObject[]} value
   */
  set properties(value) {
    ArgumentGuard.isArray(value, 'properties');

    for (const data of value) {
      this._properties.push(new PropertyData(data));
    }
  }

  /**
   * Adds a property to be sent to the server.
   *
   * @param {PropertyData|string} propertyOrName - The property name or PropertyData object.
   * @param {string} [propertyValue] - The property value.
   */
  addProperty(propertyOrName, propertyValue) {
    this._properties.push(new PropertyData(propertyOrName, propertyValue));
  }

  /**
   * @return {string}
   */
  get branchName() {
    return TypeUtils.getOrDefault(this._branchName, process.env.APPLITOOLS_BRANCH);
  }

  /**
   * @param {string} value
   */
  set branchName(value) {
    ArgumentGuard.isString(value, 'branchName');
    this._branchName = value;
  }

  /**
   * @return {string}
   */
  get agentId() {
    return this._agentId;
  }

  /**
   * @param {string} value
   */
  set agentId(value) {
    ArgumentGuard.isString(value, 'agentId');
    this._agentId = value;
  }

  /**
   * @return {string}
   */
  get parentBranchName() {
    return TypeUtils.getOrDefault(this._parentBranchName, process.env.APPLITOOLS_PARENT_BRANCH);
  }

  /**
   * @param {string} value
   */
  set parentBranchName(value) {
    ArgumentGuard.isString(value, 'parentBranchName');
    this._parentBranchName = value;
  }

  /**
   * @return {string}
   */
  get baselineBranchName() {
    return TypeUtils.getOrDefault(this._baselineBranchName, process.env.APPLITOOLS_BASELINE_BRANCH);
  }

  /**
   * @param {string} value
   */
  set baselineBranchName(value) {
    ArgumentGuard.isString(value, 'baselineBranchName');
    this._baselineBranchName = value;
  }

  /**
   * @return {string}
   */
  get baselineEnvName() {
    return this._baselineEnvName;
  }

  /**
   * @param {string} value
   */
  set baselineEnvName(value) {
    ArgumentGuard.isString(value, 'baselineEnvName', false);
    this._baselineEnvName = value ? value.trim() : undefined;
  }

  /**
   * @return {string}
   */
  get environmentName() {
    return this._environmentName;
  }

  /**
   * @param {string} value
   */
  set environmentName(value) {
    ArgumentGuard.isString(value, 'environmentName', false);
    this._environmentName = value ? value.trim() : undefined;
  }

  /**
   * @return {boolean}
   */
  get saveDiffs() {
    return this._saveDiffs;
  }

  /**
   * @param {boolean} value
   */
  set saveDiffs(value) {
    ArgumentGuard.isBoolean(value, 'saveDiffs');
    this._saveDiffs = value;
  }

  /**
   * @return {boolean}
   */
  get sendDom() {
    return TypeUtils.getOrDefault(this._sendDom, DEFAULT_VALUES.sendDom);
  }

  /**
   * @param {boolean} value
   */
  set sendDom(value) {
    ArgumentGuard.isBoolean(value, 'sendDom');
    this._sendDom = value;
  }

  /**
   * @return {string}
   */
  get appName() {
    return this._appName;
  }

  /**
   * The default app name if no current name was provided. If this is {@code null} then there is no default appName.
   *
   * @param {string} value
   */
  set appName(value) {
    ArgumentGuard.isString(value, 'appName', false);
    this._appName = value;
  }

  /**
   * @return {string}
   */
  get testName() {
    return this._testName;
  }

  /**
   * @param {string} value
   */
  set testName(value) {
    ArgumentGuard.isString(value, 'testName', false);
    this._testName = value;
  }

  /**
   * @return {RectangleSize}
   */
  get viewportSize() {
    return this._viewportSize;
  }

  /**
   * @param {RectangleSize|RectangleSizeObject} value
   */
  set viewportSize(value) {
    if (TypeUtils.isNull(value)) {
      this._viewportSize = undefined;
    } else {
      this._viewportSize = new RectangleSize(value);
    }
  }

  /**
   * @return {SessionType}
   */
  get sessionType() {
    return this._sessionType;
  }

  /**
   * @param {SessionType} value
   */
  set sessionType(value) {
    this._sessionType = value;
  }

  /**
   * @param {Configuration|object} other
   */
  mergeConfig(other) {
    Object.keys(other).forEach(prop => {
      let privateProp = prop;
      if (prop === 'proxy') {
        privateProp = '_proxySettings';
      } else if (!prop.startsWith('_')) {
        privateProp = `_${prop}`;
      }

      if (this.hasOwnProperty(privateProp) && other[prop] !== undefined) {
        this[prop] = other[prop];
      }
    });
  }

  /**
   * @return {Configuration}
   */
  cloneConfig() {
    return new Configuration(this);
  }
}

exports.Configuration = Configuration;
