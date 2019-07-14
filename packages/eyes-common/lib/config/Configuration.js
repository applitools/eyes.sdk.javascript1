'use strict';

const { BatchInfo } = require('./BatchInfo');
const { PropertyData } = require('./PropertyData');
const { ProxySettings } = require('./ProxySettings');
const { ImageMatchSettings } = require('./ImageMatchSettings');
const { RectangleSize } = require('../geometry/RectangleSize');
const { ArgumentGuard } = require('../utils/ArgumentGuard');
const { TypeUtils } = require('../utils/TypeUtils');
const { GeneralUtils } = require('../utils/GeneralUtils');

const MIN_MATCH_TIMEOUT = 500;

const DEFAULT_VALUES = {
  isDisabled: false,
  matchTimeout: 2000, // ms
  serverUrl: 'https://eyesapi.applitools.com',
  compareWithParentBranch: false,
  saveFailedTests: false,
  saveNewTests: true,
  ignoreBaseline: false,
  sendDom: true,
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

    /** @type {string} */
    this._hostApp = undefined;
    /** @type {string} */
    this._hostOS = undefined;
    /** @type {string} */
    this._hostAppInfo = undefined;
    /** @type {string} */
    this._hostOSInfo = undefined;
    /** @type {string} */
    this._deviceInfo = undefined;

    /** @type {ImageMatchSettings} */
    this._defaultMatchSettings = new ImageMatchSettings();

    if (configuration) {
      this.mergeConfig(configuration);
    }
  }

  /**
   * @return {boolean}
   */
  getShowLogs() {
    return this._showLogs;
  }

  /**
   * @param {boolean} value
   * @return {this}
   */
  setShowLogs(value) {
    ArgumentGuard.isBoolean(value, 'showLogs');
    this._showLogs = value;
    return this;
  }

  /**
   * @return {boolean}
   */
  getSaveDebugData() {
    return this._saveDebugData;
  }

  /**
   * @param {boolean} value
   * @return {this}
   */
  setSaveDebugData(value) {
    ArgumentGuard.isBoolean(value, 'saveDebugData');
    this._saveDebugData = value;
    return this;
  }

  /**
   * @return {string} - The currently set API key or {@code null} if no key is set.
   */
  getApiKey() {
    return TypeUtils.getOrDefault(this._apiKey, GeneralUtils.getEnvValue('API_KEY'));
  }

  /**
   * Sets the API key of your applitools Eyes account.
   *
   * @param {string} value - The api key to be used.
   * @return {this}
   */
  setApiKey(value) {
    ArgumentGuard.isString(value, 'apiKey');
    ArgumentGuard.alphanumeric(value, 'apiKey');
    this._apiKey = value;
    return this;
  }

  /**
   * @return {string} - The URI of the eyes server.
   */
  getServerUrl() {
    return TypeUtils.getOrDefault(this._serverUrl, GeneralUtils.getEnvValue('SERVER_URL') || DEFAULT_VALUES.serverUrl);
  }

  /**
   * Sets the current server URL used by the rest client.
   *
   * @param {string} value - The URI of the rest server, or {@code null} to use the default server.
   * @return {this}
   */
  setServerUrl(value) {
    ArgumentGuard.isString(value, 'serverUrl', false);
    this._serverUrl = value;
    return this;
  }

  /**
   * @return {ProxySettings} - The current proxy settings, or {@code undefined} if no proxy is set.
   */
  getProxy() {
    return this._proxySettings;
  }

  /**
   * Sets the proxy settings to be used by the rest client.
   *
   * @param {ProxySettings|ProxySettingsObject|string|boolean} value - The ProxySettings object or proxy url to be used.
   *   Use {@code false} to disable proxy (even if it set via env variables). Use {@code null} to reset proxy settings.
   * @return {this}
   */
  setProxy(value) {
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
    return this;
  }

  /**
   * @return {number} - The timeout for web requests (in milliseconds).
   */
  getConnectionTimeout() {
    return this._connectionTimeout;
  }

  /**
   * Sets the connect and read timeouts for web requests.
   *
   * @param {number} value - Connect/Read timeout in milliseconds. 0 equals infinity.
   * @return {this}
   */
  setConnectionTimeout(value) {
    ArgumentGuard.greaterThanOrEqualToZero(value, 'connectionTimeout', true);
    this._connectionTimeout = value;
    return this;
  }

  /**
   * @return {boolean} - Whether sessions are removed immediately after they are finished.
   */
  getRemoveSession() {
    return this._removeSession;
  }

  /**
   * Whether sessions are removed immediately after they are finished.
   *
   * @param {boolean} value
   * @return {this}
   */
  setRemoveSession(value) {
    ArgumentGuard.isBoolean(value, 'removeSession');
    this._removeSession = value;
    return this;
  }

  /**
   * @return {boolean} - The currently compareWithParentBranch value
   */
  getCompareWithParentBranch() {
    return TypeUtils.getOrDefault(this._compareWithParentBranch, DEFAULT_VALUES.compareWithParentBranch);
  }

  /**
   * @param {boolean} value - New compareWithParentBranch value, default is false
   * @return {this}
   */
  setCompareWithParentBranch(value) {
    ArgumentGuard.isBoolean(value, 'compareWithParentBranch');
    this._compareWithParentBranch = value;
    return this;
  }

  /**
   * @return {boolean} - The currently ignoreBaseline value
   */
  getIgnoreBaseline() {
    return TypeUtils.getOrDefault(this._ignoreBaseline, DEFAULT_VALUES.ignoreBaseline);
  }

  /**
   * @param {boolean} value - New ignoreBaseline value, default is false
   * @return {this}
   */
  setIgnoreBaseline(value) {
    ArgumentGuard.isBoolean(value, 'ignoreBaseline');
    this._ignoreBaseline = value;
    return this;
  }

  /**
   * @return {boolean} - True if new tests are saved by default.
   */
  getSaveNewTests() {
    return TypeUtils.getOrDefault(this._saveNewTests, DEFAULT_VALUES.saveNewTests);
  }

  /**
   * Used for automatic save of a test run. New tests are automatically saved by default.
   *
   * @param {boolean} value - True if new tests should be saved by default. False otherwise.
   * @return {this}
   */
  setSaveNewTests(value) {
    ArgumentGuard.isBoolean(value, 'saveNewTests');
    this._saveNewTests = value;
    return this;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @return {boolean} - True if failed tests are saved by default.
   */
  getSaveFailedTests() {
    return TypeUtils.getOrDefault(this._saveFailedTests, DEFAULT_VALUES.saveFailedTests);
  }

  /**
   * Set whether or not failed tests are saved by default.
   *
   * @param {boolean} value - True if failed tests should be saved by default, false otherwise.
   * @return {this}
   */
  setSaveFailedTests(value) {
    ArgumentGuard.isBoolean(value, 'saveFailedTests');
    this._saveFailedTests = value;
    return this;
  }

  /**
   * @return {number} - The maximum time in ms {@link #checkWindowBase(RegionProvider, string, boolean, number)} waits
   *   for a match.
   */
  getMatchTimeout() {
    return TypeUtils.getOrDefault(this._matchTimeout, DEFAULT_VALUES.matchTimeout);
  }

  /**
   * Sets the maximum time (in ms) a match operation tries to perform a match.
   * @param {number} value - Total number of ms to wait for a match.
   * @return {this}
   */
  setMatchTimeout(value) {
    ArgumentGuard.greaterThanOrEqualToZero(value, 'matchTimeout', true);

    if (value !== 0 && MIN_MATCH_TIMEOUT > value) {
      throw new TypeError(`Match timeout must be set in milliseconds, and must be > ${MIN_MATCH_TIMEOUT}`);
    }

    this._matchTimeout = value;
    return this;
  }

  /**
   * @return {boolean} - Whether eyes is disabled.
   */
  getIsDisabled() {
    return TypeUtils.getOrDefault(this._isDisabled, DEFAULT_VALUES.isDisabled);
  }

  /**
   * @param {boolean} value - If true, all interactions with this API will be silently ignored.
   * @return {this}
   */
  setIsDisabled(value) {
    ArgumentGuard.isBoolean(value, 'isDisabled', false);
    this._isDisabled = value;
    return this;
  }

  /**
   * @return {BatchInfo}
   */
  getBatch() {
    if (this._batch === undefined) {
      this._batch = new BatchInfo();
    }

    return this._batch;
  }

  /**
   * Sets the batch in which context future tests will run or {@code null} if tests are to run standalone.
   *
   * @param {BatchInfo|BatchInfoObject} value
   * @return {this}
   */
  setBatch(value) {
    this._batch = value ? new BatchInfo(value) : undefined;
    return this;
  }

  /**
   * @return {PropertyData[]}
   */
  getProperties() {
    return this._properties;
  }

  /**
   * @signature `setProperties(properties)`
   * @sigparam {PropertyData[]} properties - A list of PropertyData instances
   *
   * @signature `setProperties(properties)`
   * @sigparam {PropertyDataObject[]} properties - A list of property data objects
   *
   * @param {PropertyData[]|PropertyDataObject[]} value
   * @return {this}
   */
  setProperties(value) {
    ArgumentGuard.isArray(value, 'properties');

    for (const data of value) {
      this._properties.push(new PropertyData(data));
    }
    return this;
  }

  /**
   * Adds a property to be sent to the server.
   *
   * @signature `addProperty(property)`
   * @sigparam {PropertyData|PropertyDataObject} property - The name and value are taken from the object passed
   *
   * @signature`addProperty(propertyName, propertyValue)`
   * @sigparam {string} propertyName - The name of the property
   * @sigparam {string} propertyValue - The value of the property
   *
   * @param {PropertyData|string} propertyOrName - The property name or PropertyData object.
   * @param {string} [propertyValue] - The property value.
   * @return {this}
   */
  addProperty(propertyOrName, propertyValue) {
    this._properties.push(new PropertyData(propertyOrName, propertyValue));
    return this;
  }

  /**
   * @return {string}
   */
  getBranchName() {
    return TypeUtils.getOrDefault(this._branchName, GeneralUtils.getEnvValue('BRANCH'));
  }

  /**
   * @param {string} value
   * @return {this}
   */
  setBranchName(value) {
    ArgumentGuard.isString(value, 'branchName');
    this._branchName = value;
    return this;
  }

  /**
   * @return {string}
   */
  getAgentId() {
    return this._agentId;
  }

  /**
   * @param {string} value
   * @return {this}
   */
  setAgentId(value) {
    ArgumentGuard.isString(value, 'agentId');
    this._agentId = value;
    return this;
  }

  /**
   * @return {string}
   */
  getParentBranchName() {
    return TypeUtils.getOrDefault(this._parentBranchName, GeneralUtils.getEnvValue('PARENT_BRANCH'));
  }

  /**
   * @param {string} value
   * @return {this}
   */
  setParentBranchName(value) {
    ArgumentGuard.isString(value, 'parentBranchName');
    this._parentBranchName = value;
    return this;
  }

  /**
   * @return {string}
   */
  getBaselineBranchName() {
    return TypeUtils.getOrDefault(this._baselineBranchName, GeneralUtils.getEnvValue('BASELINE_BRANCH'));
  }

  /**
   * @param {string} value
   * @return {this}
   */
  setBaselineBranchName(value) {
    ArgumentGuard.isString(value, 'baselineBranchName');
    this._baselineBranchName = value;
    return this;
  }

  /**
   * @return {string}
   */
  getBaselineEnvName() {
    return this._baselineEnvName;
  }

  /**
   * @param {string} value
   * @return {this}
   */
  setBaselineEnvName(value) {
    ArgumentGuard.isString(value, 'baselineEnvName', false);
    this._baselineEnvName = value ? value.trim() : undefined;
    return this;
  }

  /**
   * @return {string}
   */
  getEnvironmentName() {
    return this._environmentName;
  }

  /**
   * @param {string} value
   * @return {this}
   */
  setEnvironmentName(value) {
    ArgumentGuard.isString(value, 'environmentName', false);
    this._environmentName = value ? value.trim() : undefined;
    return this;
  }

  /**
   * @return {boolean}
   */
  getSaveDiffs() {
    return this._saveDiffs;
  }

  /**
   * @param {boolean} value
   * @return {this}
   */
  setSaveDiffs(value) {
    ArgumentGuard.isBoolean(value, 'saveDiffs');
    this._saveDiffs = value;
    return this;
  }

  /**
   * @return {boolean}
   */
  getSendDom() {
    return TypeUtils.getOrDefault(this._sendDom, DEFAULT_VALUES.sendDom);
  }

  /**
   * @param {boolean} value
   * @return {this}
   */
  setSendDom(value) {
    ArgumentGuard.isBoolean(value, 'sendDom');
    this._sendDom = value;
    return this;
  }

  /**
   * @return {string} - The host OS as set by the user.
   */
  getHostApp() {
    return this._hostApp;
  }

  /**
   * Sets the host application - overrides the one in the agent string.
   *
   * @param {string} value - The application running the AUT (e.g., Chrome).
   */
  setHostApp(value) {
    if (TypeUtils.isNull(value)) {
      this._hostApp = undefined;
    } else {
      this._hostApp = value.trim();
    }
    return this;
  }

  /**
   * @return {string} - The host OS as set by the user.
   */
  getHostOS() {
    return this._hostOS;
  }

  /**
   * Sets the host OS name - overrides the one in the agent string.
   *
   * @param {string} value - The host OS running the AUT.
   */
  setHostOS(value) {
    if (TypeUtils.isNull(value)) {
      this._hostOS = undefined;
    } else {
      this._hostOS = value.trim();
    }
    return this;
  }

  /**
   * @return {string} - The host OS as set by the user.
   */
  getHostAppInfo() {
    return this._hostAppInfo;
  }

  /**
   * Sets the host application - overrides the one in the agent string.
   *
   * @param {string} value - The application running the AUT (e.g., Chrome).
   */
  setHostAppInfo(value) {
    if (TypeUtils.isNull(value)) {
      this._hostAppInfo = undefined;
    } else {
      this._hostAppInfo = value.trim();
    }
    return this;
  }

  /**
   * @return {string} - The host OS as set by the user.
   */
  getHostOSInfo() {
    return this._hostOSInfo;
  }

  /**
   * Sets the host OS name - overrides the one in the agent string.
   *
   * @param {string} value - The host OS running the AUT.
   */
  setHostOSInfo(value) {
    if (TypeUtils.isNull(value)) {
      this._hostOSInfo = undefined;
    } else {
      this._hostOSInfo = value.trim();
    }
    return this;
  }

  /**
   * @return {string} - The application name running the AUT.
   */
  getDeviceInfo() {
    return this._deviceInfo;
  }

  /**
   * Sets the host application - overrides the one in the agent string.
   *
   * @param {string} value - The application running the AUT (e.g., Chrome).
   * @return {this}
   */
  setDeviceInfo(value) {
    if (TypeUtils.isNull(value)) {
      this._deviceInfo = undefined;
    } else {
      this._deviceInfo = value.trim();
    }
    return this;
  }

  /**
   * @return {string}
   */
  getAppName() {
    return this._appName;
  }

  /**
   * The default app name if no current name was provided. If this is {@code null} then there is no default appName.
   *
   * @param {string} value
   * @return {this}
   */
  setAppName(value) {
    ArgumentGuard.isString(value, 'appName', false);
    this._appName = value;
    return this;
  }

  /**
   * @return {string}
   */
  getTestName() {
    return this._testName;
  }

  /**
   * @param {string} value
   * @return {this}
   */
  setTestName(value) {
    ArgumentGuard.isString(value, 'testName', false);
    this._testName = value;
    return this;
  }

  /**
   * @return {RectangleSize}
   */
  getViewportSize() {
    return this._viewportSize;
  }

  /**
   * @param {RectangleSize|RectangleSizeObject} value
   * @return {this}
   */
  setViewportSize(value) {
    if (TypeUtils.isNull(value)) {
      this._viewportSize = undefined;
    } else {
      this._viewportSize = new RectangleSize(value);
    }
    return this;
  }

  /**
   * @return {SessionType}
   */
  getSessionType() {
    return this._sessionType;
  }

  /**
   * @param {SessionType} value
   * @return {this}
   */
  setSessionType(value) {
    this._sessionType = value;
    return this;
  }

  /**
   * @return {ImageMatchSettings} - The match settings used for the session.
   */
  getDefaultMatchSettings() {
    return this._defaultMatchSettings;
  }

  /**
   * Updates the match settings to be used for the session.
   *
   * @param {ImageMatchSettings|object} value - The match settings to be used for the session.
   * @return {this}
   */
  setDefaultMatchSettings(value) {
    ArgumentGuard.notNull(value, 'defaultMatchSettings');
    this._defaultMatchSettings = new ImageMatchSettings(value);
    return this;
  }

  /**
   * @return {MatchLevel} - The test-wide match level.
   */
  getMatchLevel() {
    return this._defaultMatchSettings.getMatchLevel();
  }

  /**
   * The test-wide match level to use when checking application screenshot with the expected output.
   *
   * @param {MatchLevel} value - The test-wide match level to use when checking application screenshot with the
   *   expected output.
   * @return {this}
   */
  setMatchLevel(value) {
    this._defaultMatchSettings.setMatchLevel(value);
    return this;
  }

  /**
   * @return {boolean} - The test-wide useDom to use in match requests.
   */
  getUseDom() {
    return this._defaultMatchSettings.getUseDom();
  }

  /**
   * The test-wide useDom to use.
   *
   * @param {boolean} value - The test-wide useDom to use in match requests.
   * @return {this}
   */
  setUseDom(value) {
    this._defaultMatchSettings.setUseDom(value);
    return this;
  }

  /**
   * @return {boolean} - The test-wide enablePatterns to use in match requests.
   */
  getEnablePatterns() {
    return this._defaultMatchSettings.getEnablePatterns();
  }

  /**
   * The test-wide enablePatterns to use.
   *
   * @param {boolean} value - The test-wide enablePatterns to use in match requests.
   * @return {this}
   */
  setEnablePatterns(value) {
    this._defaultMatchSettings.setEnablePatterns(value);
    return this;
  }

  /**
   * @return {boolean} - The test-wide ignoreDisplacements to use in match requests.
   */
  getIgnoreDisplacements() {
    return this._defaultMatchSettings.getIgnoreDisplacements();
  }

  /**
   * The test-wide ignoreDisplacements to use.
   *
   * @param {boolean} value - The test-wide ignoreDisplacements to use in match requests.
   * @return {this}
   */
  setIgnoreDisplacements(value) {
    this._defaultMatchSettings.setIgnoreDisplacements(value);
    return this;
  }

  /**
   * @return {boolean} - Whether to ignore or the blinking caret or not when comparing images.
   */
  getIgnoreCaret() {
    return this._defaultMatchSettings.getIgnoreCaret();
  }

  /**
   * Sets the ignore blinking caret value.
   *
   * @param {boolean} value - The ignore value.
   * @return {this}
   */
  setIgnoreCaret(value) {
    this._defaultMatchSettings.setIgnoreCaret(value);
    return this;
  }

  /**
   * @param {Configuration|object} other
   */
  mergeConfig(other) {
    Object.keys(other).forEach((prop) => {
      let privateProp = prop;
      if (prop === 'proxy') {
        privateProp = '_proxySettings';
      } else if (!prop.startsWith('_')) {
        privateProp = `_${prop}`;
      }

      if (Object.prototype.hasOwnProperty.call(this, privateProp) && other[prop] !== undefined) {
        const publicProp = prop.startsWith('_') ? prop.slice(1) : prop;
        const setterName = `set${publicProp.charAt(0).toUpperCase()}${publicProp.slice(1)}`;
        if (typeof this[setterName] === 'function') {
          this[setterName](other[prop]);
        } else {
          this[privateProp] = other[prop];
        }
      }
    });
  }

  /**
   * @override
   */
  toJSON() {
    return GeneralUtils.toPlain(this);
  }

  /**
   * @return {Configuration}
   */
  cloneConfig() {
    return new Configuration(this);
  }
}

exports.Configuration = Configuration;
