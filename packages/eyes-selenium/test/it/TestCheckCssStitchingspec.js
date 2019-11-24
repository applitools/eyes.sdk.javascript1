'use strict';

require('chromedriver');
const { Builder, By } = require('selenium-webdriver');
const { Options: ChromeOptions } = require('selenium-webdriver/chrome');
const { Eyes, Target, ConsoleLogHandler, StitchMode } = require('../../index');

let /** @type {WebDriver} */ driver, /** @type {Eyes} */ eyes;
describe('TestCheckCssStitching', function () {
  this.timeout(5 * 60 * 1000);

  before(async function () {
    driver = new Builder().forBrowser('chrome').setChromeOptions(new ChromeOptions().headless()).build();

    eyes = new Eyes();
    eyes.setLogHandler(new ConsoleLogHandler(false));
    eyes.setStitchMode(StitchMode.CSS);
    // eyes.setProxy('http://localhost:8888');

    await driver.get('https://applitools.github.io/demo/TestPages/FramesTestPage/');
  });

  beforeEach(async function () {
    driver = await eyes.open(driver, this.test.parent.title, this.currentTest.title, { width: 600, height: 500 });
  });

  it('TestCheckWindow', async function () {
    await eyes.check('Window', Target.window().fully());
    return eyes.close();
  });

  afterEach(async function () {
    return eyes.abort();
  });

  after(function () {
    return driver.quit();
  });
});
