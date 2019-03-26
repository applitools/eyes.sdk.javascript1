'use strict';

require('chromedriver');
const assert = require('assert');
const { Builder } = require('selenium-webdriver');
const { PerformanceUtils } = require('@applitools/eyes-common');
const { Eyes, Target, ConsoleLogHandler } = require('../../index');

describe('MochaPerformanceTest', function () {
  let /** @type {WebDriver} */ driver, /** @type {Eyes} */ eyes;

  this.timeout(5 * 60 * 1000);

  beforeEach(async function () {
    const startDate = PerformanceUtils.start();
    driver = await new Builder().forBrowser('chrome').build();

    eyes = new Eyes();
    eyes.setLogHandler(new ConsoleLogHandler(false));
    eyes.setSendDom(false);
    console.log(`beforeEach done in ${startDate.end().summary}`);
  });

  afterEach(async function () {
    const startDate = PerformanceUtils.start();
    if (eyes._isOpen) {
      await eyes.close();
    }
    await driver.quit();
    console.log(`afterEach done in ${startDate.end().summary}`);
  });

  it('should run the test case fast', async function () {
    const startDateIt = PerformanceUtils.start();

    const startDate = PerformanceUtils.start();
    const _driver = await eyes.open(driver, 'Eyes.SDK.JavaScript', 'window full perf');
    console.log(`eyes.open done in ${startDate.end().summary}`);

    startDate.start();
    await _driver.get('https://applitools.com/helloworld');
    console.log(`driver.get done in ${startDate.end().summary}`);

    startDate.start();
    await eyes.setViewportSize({ width: 800, height: 600 });
    console.log(`eyes.setViewportSize done in ${startDate.end().summary}`);

    startDate.start();
    await eyes.check('check full page', Target.window().fully());
    console.log(`eyes.check done in ${startDate.end().summary}`);

    startDate.start();
    await eyes.close();
    console.log(`eyes.close done in ${startDate.end().summary}`);

    console.log(`total time ${startDateIt.end().summary}`);
    assert.ok(startDateIt.end().time <= 10 * 1000, 'Execution took too long...');
  });
});
