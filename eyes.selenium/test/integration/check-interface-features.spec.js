'use strict';

require('chromedriver');
const { Builder, By } = require('selenium-webdriver');
const { ConsoleLogHandler, MatchLevel, Region, RectangleSize, FloatingMatchSettings } = require('@applitools/eyes.sdk.core');
const { Eyes, Target } = require('../../index');

let driver, eyes;
describe('Eyes.Selenium.JavaScript - check-interface-features', function () {
  this.timeout(5 * 60 * 1000);

  before(async function () {
    driver = await new Builder().forBrowser('chrome').build();

    eyes = new Eyes();
    eyes.setLogHandler(new ConsoleLogHandler(true));
  });

  it('test check interface features', async function () {
    await eyes.open(driver, this.test.parent.title, this.test.title, new RectangleSize(1000, 700));

    await driver.get('https://astappiev.github.io/test-html-pages/');

    // Entire window, equivalent to eyes.checkWindow()
    await eyes.check('Entire window', Target.window()
      .matchLevel(MatchLevel.Layout)
      .ignore(By.id('overflowing-div'))
      .ignore(driver.findElement(By.name('frame1')))
      .ignores(new Region(400, 100, 50, 50), new Region(400, 200, 50, 100))
      .floating(new FloatingMatchSettings(500, 100, 75, 100, 25, 10, 30, 15))
      .floating(By.id('overflowing-div-image'), 5, 25, 10, 25));

    // Region by rect, equivalent to eyes.checkFrame()
    await eyes.check('Region by rect', Target.region(new Region(50, 50, 200, 200))
      .floating(new FloatingMatchSettings(50, 50, 60, 50, 10, 10, 10, 10)));

    await eyes.close();
  });

  afterEach(async function () {
    await driver.quit();
    await eyes.abortIfNotClosed();
  });
});
