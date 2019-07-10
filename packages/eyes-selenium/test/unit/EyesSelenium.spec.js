'use strict';

require('chromedriver');
const assert = require('assert');
const assertRejects = require('assert-rejects');

const { Builder, Capabilities } = require('selenium-webdriver');
const { Options: ChromeOptions } = require('selenium-webdriver/chrome');

const { Eyes, EyesWebDriver, Target } = require('../../index');

let driver, eyes;
describe('EyesSelenium', function () {
  this.timeout(60 * 1000);

  before(async function () {
    const chromeOptions = new ChromeOptions();
    chromeOptions.addArguments('disable-infobars');
    chromeOptions.headless();
    driver = await new Builder()
      .withCapabilities(Capabilities.chrome())
      .setChromeOptions(chromeOptions)
      .build();

    eyes = new Eyes();
  });

  describe('#open()', function () {
    it('should return EyesWebDriver', async function () {
      driver = await eyes.open(driver, this.test.parent.title, this.test.title, { width: 800, height: 560 });
      assert.strictEqual(driver instanceof EyesWebDriver, true);
      await eyes.close();
    });

    it('should throw IllegalState: Eyes not open', async function () {
      await assertRejects(eyes.check('test', Target.window()), /IllegalState: Eyes not open/);
    });
  });

  afterEach(async function () {
    await eyes.abort();
  });

  after(async function () {
    await driver.quit();
  });
});
