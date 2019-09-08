'use strict';

const fs = require('fs');
const path = require('path');
const rmrf = require('rimraf');

const SCREENSHOTS_PATH = '/.applitools__screenshots';

const {
  TypeUtils,
  ArgumentGuard,
  MutableImage,
} = require('@applitools/eyes-common');

const {
  EyesBase,
  MatchResult,
  NullRegionProvider,
  EyesScreenshot,
} = require('@applitools/eyes-sdk-core');

const testcafe = require('testcafe');

const VERSION = require('../package.json').version;

class Eyes extends EyesBase {
  constructor({ t, configuration, ClientFunction = testcafe.ClientFunction } = {}) {
    ArgumentGuard.notNull(t, 't');
    const serverUrl = (configuration && configuration.getServerUrl) ? configuration.getServerUrl() : undefined;
    const isDisabled = (configuration && configuration.getIsDisabled) ? configuration.getIsDisabled() : undefined;
    super(serverUrl, isDisabled, configuration);
    this._t = t;

    this._getTitleClientFunction = ClientFunction(() => document.title).with({ boundTestRun: this._t }); /* globals document */
    this._getUserAgentClientFunction = ClientFunction(() => navigator.userAgent).with({ boundTestRun: this._t }); /* globals navigator */
  }

  /**
   * Starts a test.
   *
   * @param {string} appName - The application being tested.
   * @param {string} testName - The test's name.
   * @param {RectangleSize} [imageSize] - Determines the resolution used for the baseline. {@code null} will
   *   automatically grab the resolution from the image.
   * @return {Promise}
   */
  open(appName, testName, viewportSize) {
    return super.openBase(appName, testName, viewportSize);
  }

  /**
   * Perform visual validation
   *
   * @param {string} name - A name to be associated with the match
   * @param {CheckSettings} checkSettings - Target instance which describes whether we want a window/region/frame
   * @return {Promise<TestResults>} - A promise which is resolved when the validation is finished.
   */
  async check(name, checkSettings) {
    if (this._configuration.getIsDisabled()) {
      this._logger.log(`check('${name}', ${checkSettings}): Ignored`);
      return new MatchResult();
    }

    ArgumentGuard.notNull(checkSettings, 'checkSettings');
    ArgumentGuard.isValidState(this._isOpen, 'Eyes not open');

    if (TypeUtils.isNotNull(name)) {
      checkSettings.withName(name);
    } else {
      name = checkSettings.getName();
    }

    this._logger.verbose(`check(${checkSettings}) - begin`);

    const source = ''; // TODO get current url from test cafe
    const result = await this.checkWindowBase(new NullRegionProvider(), name, false, checkSettings, source);

    // TODO stuff ?

    return result;
  }

  /**
   * @param {boolean} [throwEx]
   * @return {Promise<TestResults>}
   */
  close(throwEx = true) {
    return super.close(throwEx);
    // const results = await super.close(throwEx);

    // TODO needed?
    // if (this._runner) {
    //   this._runner._allTestResult.push(results);
    // }

    // return results;
  }

  /**
   * @return {string} - The base agent id of the SDK.
   */
  getBaseAgentId() {
    return `eyes.testcafe/${VERSION}`;
  }

  /**
   * The inferred string is in the format "source:info" where source is either "useragent" or "pos".
   * Information associated with a "useragent" source is a valid browser user agent string. Information associated with
   * a "pos" source is a string of the format "process-name;os-name" where "process-name" is the name of the main
   * module of the executed process and "os-name" is the OS name.
   *
   * @return {Promise<string>} - The inferred environment string or {@code null} if none is available.
   */
  async getInferredEnvironment() {
    try {
      const userAgent = await this._getUserAgentClientFunction();
      return `useragent:${userAgent}`;
    } catch (ignored) {
      return undefined;
    }
  }

  /**
   * An updated screenshot.
   *
   * @return {Promise<EyesScreenshot>}
   */
  async getScreenshot() {
    const filename = Math.random().toString().slice(2);
    const filepath = path.resolve(SCREENSHOTS_PATH, filename);
    const screenshotPath = await this._t.takeScreenshot(filepath);
    this._logger.log('screenshot created at', screenshotPath);
    try {
      const buff = fs.readFileSync(screenshotPath);
      const mutableImage = new MutableImage(buff);
      return new EyesScreenshot(mutableImage);
    } finally {
      const screenshotFolder = path.dirname(screenshotPath);
      rmrf.sync(screenshotFolder);
      this._logger.log('screenshot folder deleted at', screenshotFolder);
    }
  }

  /**
   * The current title of of the AUT.
   *
   * @protected
   * @abstract
   * @return {Promise<string>}
   */
  getTitle() {
    return this._getTitleClientFunction();
  }
}

exports.Eyes = Eyes;
