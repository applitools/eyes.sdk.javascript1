'use strict';

require('chromedriver');
const assert = require('assert');
const { expect } = require('chai').use(require('chai-image-assert')(__dirname));

const { Builder, Capabilities } = require('selenium-webdriver');
const { Options: ChromeOptions } = require('selenium-webdriver/chrome');

const { Eyes, EyesWebDriver, Target } = require('../../index');


let driver, eyes;
describe('Eyes', function () {
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
      try {
        await eyes.check('test', Target.window());
        assert.fail();
      } catch (err) {
        assert(err.message, 'IllegalState: Eyes not open');
      }
    });
  });

  afterEach(async function () {
    await eyes.abortIfNotClosed();
  });

  after(async function () {
    await driver.quit();
  });

  describe('generateCheckSnapshot', function () {
    this.timeout(60 * 1000);

    before(async function () {
      await driver.navigate().to('http://applitools.github.io/demo/');

      await eyes.setDriver(driver);
      eyes.setHideScrollbars(true);

      await eyes.setViewportSize({ width: 300, height: 300 });
      // eslint-disable-next-line no-unused-expressions
      expect(!eyes._isOpen).to.be.true;
    });

    it('should return full page capture', async function () {
      const snapshot = await eyes.generateCheckSnapshot('', Target.window().fully());
      expect(snapshot).to.matchImage('full-page');
    });

    it('should return a region capture', async function () {
      const snapshot = await eyes.generateCheckSnapshot('', Target.region({ top: 100, left: 100, width: 100, height: 100 }));
      expect(snapshot).to.matchImage('region');
    });

    it('should return a viewport capture', async function () {
      const snapshot = await eyes.generateCheckSnapshot('', Target.window());
      expect(snapshot).to.matchImage('viewport');
    });
  });
});
