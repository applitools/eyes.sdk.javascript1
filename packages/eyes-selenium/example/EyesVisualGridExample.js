'use strict';

require('chromedriver'); // eslint-disable-line node/no-unpublished-require
const { Builder, Capabilities, By } = require('selenium-webdriver');
const { Eyes, VisualGridRunner, Target, ConsoleLogHandler, Configuration, BrowserType, DeviceName, ScreenOrientation, BatchInfo } = require('../index'); // should be replaced to '@applitools/eyes-selenium'

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
    const batchInfo = new BatchInfo();
    batchInfo.setSequenceName('alpha sequence');

    const configuration = new Configuration();
    configuration.setBatch(batchInfo);
    configuration.setConcurrentSessions(3);
    configuration.setAppName('Eyes Examples');
    configuration.setTestName('My first Javascript test!');
    configuration.addBrowser(1200, 800, BrowserType.CHROME);
    configuration.addBrowser(1200, 800, BrowserType.FIREFOX);
    configuration.addDeviceEmulation(DeviceName.iPhone_4, ScreenOrientation.PORTRAIT);
    // configuration.setProxy('http://localhost:8888');
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

    // If you want to make few tests in row, you can finish each test with `closeAsync` and then `getAllTestResults` after all tests
    // await eyes.closeAsync();

    // End the test.
    // const results = await eyes.close(); // will return only first TestResults, but as we have two browsers, we need more result
    const results = await eyes.getRunner().getAllTestResults();
    console.log(results); // eslint-disable-line
  } catch (e) {
    // if results failed, it goes here
    console.log('Error', e); // eslint-disable-line
  } finally {
    // Close the browser.
    await driver.quit();

    // If the test was aborted before eyes.close was called ends the test as aborted.
    await eyes.abort();
  }
})();
