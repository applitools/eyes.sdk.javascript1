'use strict';

require('chromedriver');
const { Builder, By } = require('selenium-webdriver');
const { Options: ChromeOptions } = require('selenium-webdriver/chrome');
const { Eyes, Target, SeleniumConfiguration, BrowserType, ConsoleLogHandler, Region } = require('../../index');

let /** @type {WebDriver} */ driver, /** @type {Eyes} */ eyes;
describe('VisualGridCheckFluent', function () {
  this.timeout(5 * 60 * 1000);

  before(async function () {
    driver = new Builder().forBrowser('chrome').setChromeOptions(new ChromeOptions().headless()).build();

    eyes = new Eyes(undefined, undefined, true);
    eyes.setApiKey(process.env.APPLITOOLS_API_KEY);
    eyes.setLogHandler(new ConsoleLogHandler(false));
    // eyes.setProxy('http://localhost:8888');

    await driver.get('http://applitools.github.io/demo/TestPages/FramesTestPage/');
  });

  beforeEach(async function () {
    const configuration = new SeleniumConfiguration();
    configuration.appName = this.test.parent.title;
    configuration.testName = this.currentTest.title;
    configuration.addBrowser(1200, 800, BrowserType.CHROME);
    configuration.addBrowser(1200, 800, BrowserType.FIREFOX);
    eyes.setConfiguration(configuration);

    driver = await eyes.open(driver);
  });

  it('TestCheckWindow', async function () {
    await eyes.check('Window', Target.window());
    return eyes.close();
  });

  it('TestCheckWindowFully', async function () {
    await eyes.check('Full Window', Target.window().fully());
    return eyes.close();
  });

  it('TestCheckRegion', async function () {
    await eyes.check('Region by selector', Target.region(By.id('overflowing-div')).ignoreRegions(new Region(50, 50, 100, 100)));
    return eyes.close();
  });

  it('TestCheckRegionFully', async function () {
    await eyes.check('Region Fully', Target.region(By.id('overflowing-div-image')).fully());
    return eyes.close();
  });

  // it('TestCheckFrame', async function () {
  //   await eyes.check('Frame', Target.frame('frame1'));
  //   return eyes.close();
  // });

  // it('TestCheckFrameFully', async function () {
  //   await eyes.check('Full Frame', Target.frame('frame1').fully());
  //   return eyes.close();
  // });

  // it('TestCheckRegionInFrame', async function () {
  //   await eyes.check('Region in Frame', Target.frame('frame1').region(By.id('inner-frame-div')).fully());
  //   return eyes.close();
  // });

  afterEach(async function () {
    return eyes.abortIfNotClosed();
  });

  after(function () {
    return driver.quit();
  });
});
