'use strict';

const { Builder, Capabilities } = require('selenium-webdriver');
const { ConsoleLogHandler } = require('@applitools/eyes.sdk.core');
const { Eyes } = require('../../eyes.selenium/index');

let driver, /** @type Eyes */ eyes;
describe('Contacts!', function () {
  before(function () {
    const capabilities = new Capabilities();
    capabilities.set('platformName', 'Android');
    capabilities.set('deviceName', 'Android Emulator');
    capabilities.set('platformVersion', '6.0');
    capabilities.set('app', 'http://saucelabs.com/example_files/ContactManager.apk');
    capabilities.set('clearSystemFiles', true);
    capabilities.set('noReset', true);
    const url = `https://${process.env.SAUCE_USERNAME}:${process.env.SAUCE_ACCESS_KEY}@ondemand.saucelabs.com:443/wd/hub`;

    // Open the app.
    driver = new Builder()
      .withCapabilities(capabilities)
      .usingServer(url)
      // .usingServer('http://127.0.0.1:4723/wd/hub')
      .build();

    // Initialize the eyes SDK and set your private API key.
    eyes = new Eyes();
    eyes.setLogHandler(new ConsoleLogHandler(true));
    // eyes.setSaveDebugScreenshots(true);
    // eyes.setForceFullPageScreenshot(true);
  });

  it('My first Appium native Java test!', function () {
    // Start the test.
    return eyes.open(driver, this.test.parent.title, this.test.title).then(driver => {

      // Visual validation.
      eyes.checkWindow('Contact list!');

      // End the test.
      return eyes.close();
    });
  });

  afterEach(async function () {
    await driver.quit();
    await eyes.abortIfNotClosed();
  });
});
