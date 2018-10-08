'use strict';

require('chromedriver');
const { Builder, By, Browser } = require('selenium-webdriver');
const { ConsoleLogHandler, RectangleSize } = require('../../../eyes.sdk.core/index');
const { Eyes, Target, StitchMode } = require('../../index');

let driver, eyes;
describe('Eyes Selenium SDK', function () {
  this.timeout(5 * 60 * 1000);

  before(async function () {
    driver = await new Builder().forBrowser(Browser.CHROME).build();

    eyes = new Eyes();
    eyes.setForceFullPageScreenshot(true);
    eyes.setStitchMode(StitchMode.CSS);
    eyes.setLogHandler(new ConsoleLogHandler(true));
    // eyes.setDebugScreenshotsPath("c:\\temp\\logs");
    // eyes.setSaveDebugScreenshots(true);
  });

  it('WIX like test', async function () {
    await eyes.open(driver, this.test.parent.title, this.test.title, new RectangleSize(1024, 600))

    await driver.get('http://applitools.github.io/demo/TestPages/WixLikeTestPage/index.html');

    await eyes.check('map', Target.frame('frame1').region(By.tagName('img')));

    await eyes.close();
  });

  afterEach(async function () {
    await driver.quit();
    await eyes.abortIfNotClosed();
  });
});
