'use strict';

require('chromedriver');
const assertRejects = require('assert-rejects');
const { Builder, By, NoSuchElementError } = require('selenium-webdriver');
const { Options: ChromeOptions } = require('selenium-webdriver/chrome');
const { Eyes, VisualGridRunner, Target, RectangleSize } = require('../../index');

let /** @type {WebDriver} */ driver;
describe('TestBadSelectors', function () {
  this.timeout(5 * 60 * 1000);

  before(async function () {
    driver = await new Builder().forBrowser('chrome').setChromeOptions(new ChromeOptions().headless()).build();
  });

  it('TestCheckRegionWithBadSelector', async function () {
    await driver.get('https://applitools.github.io/demo/TestPages/VisualGridTestPage/');

    const eyes = new Eyes(new VisualGridRunner());
    await eyes.open(driver, 'Applitools Eyes JavaScript SDK', this.test.title, new RectangleSize(1200, 800));

    await assertRejects((async () => {
      await eyes.check('window', Target.region(By.css('#element_that_does_not_exist')));

      await eyes.close();
    })(), NoSuchElementError);
  });

  it('TestCheckRegionWithBadIgnoreSelector', async function () {
    await driver.get('https://applitools.github.io/demo/TestPages/VisualGridTestPage/');

    const eyes = new Eyes(new VisualGridRunner());
    // eyes.setLogHandler(new ConsoleLogHandler(false));
    // eyes.setProxy('http://localhost:8888');
    await eyes.open(driver, 'Applitools Eyes JavaScript SDK', this.test.title, new RectangleSize(1200, 800));

    await eyes.check('window', Target.window().ignoreRegions(By.css('body>p:nth-of-type(14)'))
      .beforeRenderScreenshotHook('var p = document.querySelector(\'body>p:nth-of-type(14)\'); p.parentNode.removeChild(p);'));

    await eyes.close();
  });

  after(async function () {
    if (driver != null) {
      await driver.quit();
    }
  });
});
