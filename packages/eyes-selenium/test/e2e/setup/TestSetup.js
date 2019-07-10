'use strict';

const path = require('path');
const axios = require('axios');
const assert = require('assert');
const { Capabilities, Builder } = require('selenium-webdriver');
const { ConsoleLogHandler, FileLogHandler, DateTimeUtils, BatchInfo, RectangleSize } = require('@applitools/eyes-common');
const { metadata } = require('@applitools/eyes-sdk-core');
const { StitchMode, Eyes } = require('../../../index');

class TestSetup {
  constructor(testClassName, testSuitName, testedPage = 'http://applitools.github.io/demo/TestPages/FramesTestPage/') {
    this._testClassName = testClassName;
    this._testSuitName = testSuitName;
    this._testedPageUrl = testedPage;

    this._caps = null;
    this._platform = null;
    this._forceFPS = null;

    /** @type {EyesWebDriver} */
    this._driver = undefined;
    /** @type {WebDriver} */
    this._webDriver = undefined;
    this._testedPageSize = new RectangleSize({ width: 800, height: 600 });
    this._desiredCaps = new Capabilities();

    this._expectedFloatingRegions = [];
    this._expectedIgnoreRegions = [];
    this._compareExpectedRegions = false;

    // Initialize the eyes SDK and set your private API key.
    this._eyes = new Eyes();

    // this._remoteSessionEventHandler = new RemoteSessionEventHandler('http://localhost:3000/', 'MyAccessKey');
    // this._remoteSessionEventHandler.setThrowExceptions(false);
    // this._eyes.addSessionEventHandler(this._remoteSessionEventHandler);

    this._logsPath = process.env.APPLITOOLS_LOGS_PATH;
    this._eyes.setLogHandler(new ConsoleLogHandler(false));

    this._eyes.setStitchMode(StitchMode.CSS);
    this._eyes.setHideScrollbars(true);

    const batchInfo = new BatchInfo('SeleniumJS Tests');
    this._eyes.setBatch(batchInfo);
  }

  setData(caps, platform, forceFPS) {
    this._caps = caps;
    this._platform = platform;
    this._forceFPS = forceFPS;
  }

  /**
   * @return {Eyes}
   */
  getEyes() {
    return this._eyes;
  }

  /**
   * @return {EyesWebDriver}
   */
  getDriver() {
    return this._driver;
  }

  getPlatform() {
    return this._platform;
  }

  getBrowserName() {
    return this._caps.getBrowserName();
  }

  setExpectedIgnoreRegions(...expectedIgnoreRegions) {
    this._expectedIgnoreRegions = expectedIgnoreRegions;
  }

  setExpectedFloatingsRegions(...expectedFloatingsRegions) {
    this._expectedFloatingRegions = expectedFloatingsRegions;
  }

  async beforeMethod(methodName) {
    const fps = this._forceFPS ? '_FPS' : '';
    let testName = methodName + fps;
    testName = testName.replace('[', '_').replace(' ', '_').replace(']', '');

    let seleniumServerUrl = process.env.SELENIUM_SERVER_URL;
    if (seleniumServerUrl === 'http://ondemand.saucelabs.com/wd/hub') {
      this._desiredCaps.set('username', process.env.SAUCE_USERNAME);
      this._desiredCaps.set('accesskey', process.env.SAUCE_ACCESS_KEY);
      this._desiredCaps.set('seleniumVersion', '3.11.0');

      if (this._caps.getBrowserName() === 'chrome') {
        this._desiredCaps.set('chromedriverVersion', '2.45');
      }

      this._desiredCaps.set('platform', this._platform);
      this._desiredCaps.set('name', `${testName} (${this._eyes.getFullAgentId()})`);

      this._caps.merge(this._desiredCaps);
    } else if (seleniumServerUrl === 'http://hub-cloud.browserstack.com/wd/hub') {
      // eslint-disable-next-line
      seleniumServerUrl = `http://${process.env.BROWSERSTACK_USERNAME}:${process.env.BROWSERSTACK_ACCESS_KEY}@hub-cloud.browserstack.com/wd/hub`;
      this._desiredCaps.set('platform', this._platform);
      this._desiredCaps.set('name', `${testName} (${this._eyes.getFullAgentId()})`);
    }

    // In case if need to test with scaling factor
    // this._caps.addArguments('--force-device-scale-factor=1.25')

    const extendedTestName = `${testName}_${this._caps.getBrowserName()}_${this._platform}_${DateTimeUtils.toLogFileDateTime()}`;

    // noinspection EmptyCatchBlockJS
    this._webDriver = await new Builder().withCapabilities(this._caps).usingServer(seleniumServerUrl).build();

    let logHandler;
    if (process.env.CI == null && this._logsPath != null) {
      const logPath = `${this._logsPath}${path.sep}javascript${path.sep}${extendedTestName}`;
      logHandler = new FileLogHandler(true, `${logPath}${path.sep}${testName}_${this._platform}.log`, true);
      this._eyes.setDebugScreenshotsPath(logPath);
      this._eyes.setDebugScreenshotsPrefix(`${testName}_`);
      this._eyes.setSaveDebugScreenshots(true);
    } else {
      logHandler = new ConsoleLogHandler(true);
    }

    const webDriverSession = await this._webDriver.getSession();
    this._eyes.setLogHandler(logHandler);
    this._eyes.addProperty('Selenium Session ID', webDriverSession.getId());
    this._eyes.addProperty('ForceFPS', this._forceFPS ? 'true' : 'false');
    this._eyes.addProperty('ScaleRatio', `${this._eyes.getScaleRatio()}`);
    this._eyes.addProperty('Agent ID', this._eyes.getFullAgentId());

    this._driver = await this._eyes.open(this._webDriver, this._testSuitName, testName, this._testedPageSize);

    await this._driver.get(this._testedPageUrl);

    this._eyes.setForceFullPageScreenshot(this._forceFPS);

    this._expectedIgnoreRegions = [];
    this._expectedFloatingRegions = [];
  }

  async afterMethod() {
    try {
      if (this._eyes.getIsOpen()) {
        const results = await this._eyes.close();
        const apiSessionUrl = results.getApiUrls().getSession();
        // eslint-disable-next-line
        const apiSessionUri = `${apiSessionUrl}?format=json&AccessToken=${results.getSecretToken()}&apiKey=${this._eyes.getApiKey()}`;

        const response = await axios.get(apiSessionUri);
        const resultObject = new metadata.SessionResults(response.data);
        const actualAppOutput = resultObject.getActualAppOutput();

        if (actualAppOutput.length > 0) {
          const imageMatchSettings = actualAppOutput[0].getImageMatchSettings();
          const floating = imageMatchSettings.getFloating();
          const ignoreRegions = imageMatchSettings.getIgnore();

          if (this._compareExpectedRegions) {
            if (this._expectedFloatingRegions.size() > 0) {
              assert.deepStrictEqual(floating, this._expectedFloatingRegions, 'Floating regions lists differ');
            }

            if (this._expectedIgnoreRegions.size() > 0) {
              assert.deepStrictEqual(ignoreRegions, this._expectedIgnoreRegions, 'Ignore regions lists differ');
            }
          }
        }
      }
    } catch (err) {
      console.log(err.stack); // eslint-disable-line no-console
    } finally {
      await this._eyes.abort();
      if (this._driver) {
        await this._driver.quit();
      }
    }
  }

  toString() {
    return `${this._testClassName} (${this._caps.getBrowserName()}, ${this._platform}, force FPS: ${this._forceFPS})`;
  }
}

exports.TestSetup = TestSetup;
