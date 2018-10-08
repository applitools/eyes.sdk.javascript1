'use strict';

const { Builder, Capabilities, By } = require('selenium-webdriver');
const { ConsoleLogHandler, BatchInfo } = require('@applitools/eyes.sdk.core');
const { TestUtils } = require('../../eyes.selenium/test/TestUtils');
const { Eyes, Target, StitchMode } = require('../../eyes.selenium/index');

describe('AndroidTest', function () {
  this.timeout(50 * 60 * 1000);

  const batchInfo = new BatchInfo('Java3 Tests');

  const dataProvider = [];
  dataProvider.push(...TestUtils.cartesianProduct(
    'Google Pixel GoogleAPI Emulator',
    ['portrait', 'landscape'],
    '7.1',
    [false, true]
  ));

  dataProvider.forEach(row => {
    const [deviceName, deviceOrientation, platformVersion, fully] = row;

    let testName = `${deviceName} ${platformVersion} ${deviceOrientation}`;
    if (fully) testName += ' fully';

    it(testName, function () {
      const eyes = new Eyes();
      eyes.setBatch(batchInfo);

      const caps = Capabilities.iphone();
      caps.set('appiumVersion', '1.7.2');
      caps.set('deviceName', deviceName);
      caps.set('deviceOrientation', deviceOrientation);
      caps.set('platformVersion', platformVersion);
      caps.set('platformName', 'Android');
      caps.set('browserName', 'Chrome');

      caps.set('username', process.env.SAUCE_USERNAME);
      caps.set('accesskey', process.env.SAUCE_ACCESS_KEY);

      const sauceUrl = 'http://ondemand.saucelabs.com/wd/hub';
      const driver = new Builder().withCapabilities(caps).usingServer(sauceUrl).build();

      eyes.setLogHandler(new ConsoleLogHandler(true));
      eyes.setStitchMode(StitchMode.SCROLL);

      eyes.addProperty('Orientation', deviceOrientation);
      eyes.addProperty('Stitched', fully ? 'True' : 'False');

      return eyes.open(driver, 'Eyes Selenium SDK - Android Chrome Cropping', testName).then(driver => {
        driver.get('https://www.applitools.com/customers');

        eyes.check('Initial view', Target.region(By.css('body')).fully(fully));
        return eyes.close();
      }).then(() => {
        eyes.abortIfNotClosed();

        return driver.quit();
      });
    });
  });
});
