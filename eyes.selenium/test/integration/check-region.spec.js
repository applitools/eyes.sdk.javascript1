'use strict';

require('chromedriver');
const { Builder, By } = require('selenium-webdriver');
const { ConsoleLogHandler, RectangleSize, Region } = require('@applitools/eyes.sdk.core');
const { Eyes, Target } = require('../../index');

let driver, eyes;
describe('Eyes.Selenium.JavaScript - check region', function () {
  this.timeout(5 * 60 * 1000);

  before(async function () {
    driver = await new Builder().forBrowser('chrome').build();

    eyes = new Eyes();
    eyes.setLogHandler(new ConsoleLogHandler(true));
  });

  it('test check region methods', async function () {
    await eyes.open(driver, this.test.parent.title, this.test.title, new RectangleSize(800, 560));

    await driver.get('https://astappiev.github.io/test-html-pages/');

    // Region by rect, equivalent to eyes.checkFrame()
    await eyes.check('Region by rect', Target.region(new Region(50, 50, 200, 200)));

    // Region by element, equivalent to eyes.checkRegionByElement()
    await eyes.check('Region by element', Target.region(driver.findElement(By.css('body > h1'))));

    // Region by locator, equivalent to eyes.checkRegionBy()
    await eyes.check('Region by locator', Target.region(By.id('overflowing-div-image')));

    // Entire element by element, equivalent to eyes.checkElement()
    await eyes.check('Entire element by element', Target.region(driver.findElement(By.id('overflowing-div-image'))).fully());

    // Entire element by locator, equivalent to eyes.checkElementBy()
    await eyes.check('Entire element by locator', Target.region(By.id('overflowing-div')).fully());

    // Entire frame by locator, equivalent to eyes.checkFrame()
    await eyes.check('Entire frame by locator', Target.frame(By.name('frame1')));

    // Entire region in frame by frame name and region locator, equivalent to eyes.checkRegionInFrame()
    await eyes.check('Entire region in frame by frame name and region locator', Target.region(By.id('inner-frame-div'), 'frame1').fully());

    await eyes.close();
  });

  afterEach(async function () {
    await driver.quit();
    await eyes.abortIfNotClosed();
  });
});
