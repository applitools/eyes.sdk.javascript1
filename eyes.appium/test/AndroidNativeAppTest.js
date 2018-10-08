'use strict';

const { Builder, Capabilities, By } = require('selenium-webdriver');
const { ConsoleLogHandler } = require('@applitools/eyes.sdk.core');
const { Eyes, Target } = require('../../eyes.selenium/index');

let driver, /** @type Eyes */ eyes;
describe('Android Appium Demo', function () {
  before(function () {
    const dc = new Capabilities();
    dc.set('platformName', 'Android');
    dc.set('platformVersion', '6.0');
    dc.set('deviceName', 'Google Nexus 5');
    dc.set('automationName', 'uiautomator2');

    dc.set('app', 'https://applitools.bintray.com/Examples/app-debug.apk');

    dc.set('appPackage', 'com.applitoolstest');
    dc.set('appActivity', 'com.applitoolstest.ScrollActivity');
    dc.set('newCommandTimeout', 600);

    driver = new Builder()
      .withCapabilities(dc)
      .usingServer('http://127.0.0.1:4723/wd/hub')
      .build();

    eyes = new Eyes();
    eyes.setLogHandler(new ConsoleLogHandler(true));
    // eyes.setScrollToRegion(true);
  });

  it('Basic checkWindow', function () {
    return eyes.open(driver, this.test.parent.title, this.test.title).then(driver => {
      driver.sleep(10000);

      // MobileBy.AndroidUIAutomator("new UiSelector().scrollable(true)")
      const scrollableElement = driver.findElement(By.className('new UiSelector().scrollable(true)'));

      eyes.check('Main window with ignore', Target.region(scrollableElement).ignore(scrollableElement));

      return eyes.close(false);
    });
  });

  afterEach(async function () {
    await driver.quit();
    await eyes.abortIfNotClosed();
  });
});
