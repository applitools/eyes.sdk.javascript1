'use strict';

require('chromedriver');
const { Builder, By } = require('selenium-webdriver');
const { Options: ChromeOptions } = require('selenium-webdriver/chrome');
const { Eyes, Target, ConsoleLogHandler } = require('../../index');

let /** @type {WebDriver} */ driver, /** @type {Eyes} */ eyes;
describe('TestDynamicPages', function () {
  this.timeout(5 * 60 * 1000);

  before(function () {
    driver = new Builder().forBrowser('chrome').setChromeOptions(new ChromeOptions().headless()).build();

    eyes = new Eyes();
    eyes.setLogHandler(new ConsoleLogHandler(false));
    // eyes.setProxy('http://localhost:8888');
  });

  beforeEach(async function () {
    driver = await eyes.open(driver, this.test.parent.title, this.currentTest.title, { width: 1200, height: 800 });
  });

  // TODO: fix "Request body larger than maxBodyLength limit". Locally works fine 😕
  // it('TestNbcNews', async function () {
  //   await driver.get('https://www.nbcnews.com/');
  //   await eyes.check('NBC News Test', Target.window().fully().sendDom());
  //   await eyes.close(false);
  // });

  it('TestEbay', async function () {
    await driver.get('https://www.ebay.com/');
    await eyes.check('ebay Test', Target.window().fully().sendDom());
    await await driver.findElement(By.linkText('Electronics')).click();
    await eyes.check('ebay Test - Electroincs', Target.window().fully().sendDom());
    await await driver.findElement(By.linkText('Smart Home')).click();
    await eyes.check('ebay Test - Electroincs > Smart Home', Target.window().fully().sendDom());
    await eyes.close(false);
  });

  it('TestAliExpress', async function () {
    await driver.get('https://www.aliexpress.com/');
    await eyes.check('AliExpress Test', Target.window().fully().sendDom());
    await eyes.close(false);
  });

  // TODO: fix "Cannot read property 'width' of undefined" at EyesWebElementPromise.getRect (lib/wrappers/EyesWebElement.js:347:34). Locally works fine too 😕
  // it('TestBestBuy', async function () {
  //   await driver.get('https://www.bestbuy.com/site/apple-macbook-pro-13-display-intel-core-i5-8-gb-memory-256gb-flash-storage-silver/6936477.p?skuId=6936477');
  //   await await driver.findElement(By.css('.us-link')).click();
  //   await eyes.check('BestBuy Test', Target.window().fully().sendDom());
  //   await eyes.close(false);
  // });

  afterEach(async function () {
    return eyes.abort();
  });

  after(function () {
    return driver.quit();
  });
});
