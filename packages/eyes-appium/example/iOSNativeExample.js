'use strict';

const { Builder, Capabilities } = require('selenium-webdriver');
const { ConsoleLogHandler } = require('@applitools/eyes-sdk-core');
const { Eyes, Target } = require('../index'); // should be replaced to '@applitools/eyes-appium'

(async () => {
  const caps = new Capabilities();
  caps.set('platformName', 'iOS');
  caps.set('deviceName', 'iPhone 7 Simulator');
  caps.set('platformVersion', '10.0');
  caps.set('app', 'https://store.applitools.com/download/iOS.TestApp.app.zip');
  caps.set('clearSystemFiles', true);
  caps.set('noReset', true);

  caps.set('username', process.env.SAUCE_USERNAME);
  caps.set('accesskey', process.env.SAUCE_ACCESS_KEY);

  // const seleniumServer = 'http://127.0.0.1:4723/wd/hub';
  const seleniumServer = 'https://ondemand.saucelabs.com:443/wd/hub';

  // Open the app.
  const driver = await new Builder()
    .withCapabilities(caps)
    .usingServer(seleniumServer)
    .build();

  // Initialize the eyes SDK and set your private API key.
  const eyes = new Eyes();
  // eyes.setApiKey('Your API Key');
  eyes.setLogHandler(new ConsoleLogHandler(false));

  try {
    // Start the test and set the browser's viewport size to 800x600.
    await eyes.open(driver, 'Eyes Examples', 'My first Appium native JavaScript test!');

    // Visual validation.
    await eyes.check('Contact list!', Target.window());

    // End the test.
    await eyes.close();
  } finally {
    // Close the browser.
    await driver.quit();

    // If the test was aborted before eyes.close was called ends the test as aborted.
    await eyes.abort();
  }
})();
