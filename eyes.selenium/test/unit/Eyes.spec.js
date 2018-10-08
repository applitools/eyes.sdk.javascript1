'use strict';

require('chromedriver');
const assert = require('assert');

const { Builder } = require('selenium-webdriver');
const { RectangleSize } = require('@applitools/eyes.sdk.core');
const { Eyes, EyesWebDriver, Target } = require('../../index');

let driver, eyes;
describe('Eyes', function () {
  this.timeout(60 * 1000);

  beforeEach(async function () {
    driver = await new Builder().forBrowser('chrome').build();

    eyes = new Eyes();
  });

  describe('#open()', function () {
    it('should return EyesWebDriver', async function () {
      driver = await eyes.open(driver, this.test.parent.title, this.test.title, new RectangleSize(800, 560));
      assert.equal(driver instanceof EyesWebDriver, true);
      await eyes.close();
    });

    it('should throw IllegalState: Eyes not open', async function () {
      try {
        await eyes.check('test', Target.window());
      } catch (err) {
        assert.equal(err.message, 'IllegalState: Eyes not open');
      }
    });
  });

  afterEach(async function () {
    await driver.quit();
    await eyes.abortIfNotClosed();
  });
});
