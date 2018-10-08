'use strict';

const { Builder } = require('selenium-webdriver');
const { ConsoleLogHandler, RectangleSize } = require('@applitools/eyes.sdk.core');
const { Eyes, Target } = require('../../index');

let driver, eyes;
describe('Eyes.Selenium.JavaScript - hide scrollbars', () => {
  before(async function () {
    driver = await new Builder()
      .forBrowser('chrome')
      .usingServer('http://localhost:4444/wd/hub')
      .build();

    eyes = new Eyes();
    eyes.setLogHandler(new ConsoleLogHandler(true));
    eyes.setHideScrollbars(true);
    // eyes.setSaveDebugScreenshots(true);
  });

  it('hide scrollbars selenium', async function () {
    await eyes.open(driver, this.test.parent.title, this.test.title, new RectangleSize(800, 560));

    await driver.get('https://astappiev.github.io/test-html-pages/');

    // eyes.setHideScrollbars(true);
    // eyes.setScrollRootElement(By.id('overflowing-div-image'));
    await eyes.check('Entire window', Target.window().fully(true));

    await eyes.close();
  });

  afterEach(async function () {
    await driver.quit();
    await eyes.abortIfNotClosed();
  });
});
