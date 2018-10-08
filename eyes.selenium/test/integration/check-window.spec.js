'use strict';

require('chromedriver');
const { Builder } = require('selenium-webdriver');
const { ConsoleLogHandler, RectangleSize } = require('@applitools/eyes.sdk.core');
const { Eyes, Target } = require('../../index');

let driver, eyes;
describe('Eyes.Selenium.JavaScript - check window', function () {
  this.timeout(5 * 60 * 1000);

  before(async function () {
    driver = await new Builder().forBrowser('chrome').build();

    eyes = new Eyes();
    eyes.setLogHandler(new ConsoleLogHandler(true));
    eyes.setHideScrollbars(true);
  });

  it('test check window methods', async function () {
    await eyes.open(driver, this.test.parent.title, this.test.title, new RectangleSize(800, 560));

    await driver.get('https://astappiev.github.io/test-html-pages/');

    await eyes.check('Partial window', Target.window());

    await eyes.check('Entire window', Target.window().fully());

    await eyes.close();
  });

  afterEach(async function () {
    await driver.quit();
    await eyes.abortIfNotClosed();
  });
});
