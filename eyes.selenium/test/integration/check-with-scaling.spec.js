'use strict';

require('chromedriver');
const { Builder, By } = require('selenium-webdriver');
const { Options } = require('selenium-webdriver/chrome');
const { ConsoleLogHandler, RectangleSize } = require('@applitools/eyes.sdk.core');
const { Eyes, Target } = require('../../index');

let driver, eyes;
describe('Eyes.Selenium.JavaScript - check-with-scaling', function () {
  this.timeout(5 * 60 * 1000);

  before(async function () {
    const options = new Options().addArguments('--force-device-scale-factor=1.25');
    // noinspection JSCheckFunctionSignatures
    driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();

    eyes = new Eyes();
    eyes.setLogHandler(new ConsoleLogHandler(true));
  });

  it('test check with scaling', async function () {
    await eyes.open(driver, this.test.parent.title, this.test.title, new RectangleSize(800, 560));

    await driver.get('https://astappiev.github.io/test-html-pages/');

    await eyes.check('Entire window', Target.window().fully());

    await eyes.check('Text block', Target.region(By.id('overflowing-div')).fully());

    await eyes.check('Minions', Target.region(By.id('overflowing-div-image')).fully());

    await eyes.close();
  });

  afterEach(async function () {
    await driver.quit();
    await eyes.abortIfNotClosed();
  });
});
