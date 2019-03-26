'use strict';

require('chromedriver');
const { Builder } = require('selenium-webdriver');
const { Options: ChromeOptions } = require('selenium-webdriver/chrome');
const { Eyes, Target, SeleniumConfiguration, BrowserType, RectangleSize, BatchInfo, Region, CorsIframeHandle } = require('../../index');

let /** @type {WebDriver} */ driver;
describe('VisualGridSimple', function () {
  this.timeout(5 * 60 * 1000);

  before(async function () {
    driver = await new Builder().forBrowser('chrome').setChromeOptions(new ChromeOptions().headless()).build();
  });

  it('VisualGridTestPage', async function () {
    await driver.get('https://applitools.github.io/demo/TestPages/VisualGridTestPage');

    const eyes = new Eyes(undefined, undefined, true);
    eyes.setBatch(new BatchInfo('EyesRenderingBatch'));
    eyes.setCorsIframeHandle(CorsIframeHandle.BLANK);
    // eyes.setProxy('http://127.0.0.1:8888');

    const configuration = new SeleniumConfiguration();
    configuration.testName = 'Open Concurrency with Batch 2';
    configuration.appName = 'RenderingGridIntegration';
    configuration.addBrowser(800, 600, BrowserType.CHROME);
    configuration.addBrowser(700, 500, BrowserType.CHROME);
    configuration.addBrowser(400, 300, BrowserType.CHROME);
    eyes.setConfiguration(configuration);

    await eyes.open(driver);

    await eyes.setViewportSize(new RectangleSize({ width: 800, height: 600 }));

    await eyes.check('window', Target.window().ignoreRegions(new Region(200, 200, 50, 100)));

    await eyes.check('region', Target.region(new Region(200, 200, 50, 100)));

    await eyes.check('selector', Target.region('#scroll1'));

    await eyes.close();
  });

  after(async function () {
    if (driver != null) {
      await driver.quit();
    }
  });
});
