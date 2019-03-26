'use strict';

require('chromedriver'); // eslint-disable-line node/no-unpublished-require
const { Builder, Capabilities, By } = require('selenium-webdriver');
const { Eyes, VisualGridRunner, Target, ConsoleLogHandler, SeleniumConfiguration, BrowserType, DeviceName, ScreenOrientation } = require('../index'); // should be replaced to '@applitools/eyes-selenium'

(async () => {
  // Open a Chrome browser.
  const driver = new Builder()
    .withCapabilities(Capabilities.chrome())
    .build();

  // Initialize the eyes SDK and set your private API key.
  const eyes = new Eyes(new VisualGridRunner());
  // eyes.setApiKey('Your API Key');
  eyes.setLogHandler(new ConsoleLogHandler(false));

  try {
    const configuration = new SeleniumConfiguration();
    configuration.concurrentSessions = 3;
    configuration.appName = 'Eyes Examples';
    configuration.testName = 'My first Javascript test!';
    configuration.addBrowser(1200, 800, BrowserType.CHROME);
    configuration.addBrowser(1200, 800, BrowserType.FIREFOX);
    configuration.addDevice(DeviceName.iPhone_4, ScreenOrientation.PORTRAIT);
    eyes.setConfiguration(configuration);

    // Start the test and set the browser's viewport size to 800x600.
    // await eyes.open(driver, 'Eyes Examples', 'My first Javascript test!', { width: 800, height: 600 }); // also will work without configuration with a single browser
    await eyes.open(driver);

    // Navigate the browser to the "hello world!" web-site.
    await driver.get('https://applitools.com/helloworld');

    // Visual checkpoint #1.
    await eyes.check('Main Page', Target.window());

    // Click the "Click me!" button.
    await driver.findElement(By.css('button')).click();

    // Visual checkpoint #2.
    await eyes.check('Click!', Target.window());

    // End the test.
    // const results = await eyes.close(); // will return only first TestResults, but as we have two browsers, we need more results
    const results = await eyes.getRunner().getAllResults();
    console.log(results); // eslint-disable-line
  } finally {
    // Close the browser.
    await driver.quit();

    // If the test was aborted before eyes.close was called ends the test as aborted.
    await eyes.abortIfNotClosed();
  }
})();
