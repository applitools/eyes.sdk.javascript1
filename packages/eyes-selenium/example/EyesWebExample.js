'use strict';

require('chromedriver'); // eslint-disable-line node/no-unpublished-require
const { Builder, Capabilities, By } = require('selenium-webdriver');
const { Eyes, Target, ConsoleLogHandler, BatchInfo } = require('../index'); // should be replaced to '@applitools/eyes-selenium'

(async () => {
  // Open a Chrome browser.
  const driver = new Builder()
    // .usingServer('http://localhost:4444/wd/hub')
    .withCapabilities(Capabilities.chrome())
    .build();

  // Initialize the eyes SDK and set your private API key.
  const eyes = new Eyes();
  // eyes.setApiKey('Your API Key');
  eyes.setLogHandler(new ConsoleLogHandler(false));
  // eyes.setProxy('http://localhost:8888');

  const batchInfo = new BatchInfo();
  batchInfo.setSequenceName('alpha sequence');
  eyes.setBatch(batchInfo);

  try {
    // Start the test and set the browser's viewport size to 800x600.
    await eyes.open(driver, 'Eyes Examples', 'My first Javascript test!', { width: 800, height: 600 });

    // Navigate the browser to the "hello world!" web-site.
    await driver.get('https://applitools.com/helloworld');

    // Visual checkpoint #1.
    await eyes.check('Main Page', Target.window());

    // Click the "Click me!" button.
    await driver.findElement(By.css('button')).click();

    // Visual checkpoint #2.
    await eyes.check('Click!', Target.window());

    // End the test.
    await eyes.close();
  } finally {
    // Close the browser.
    await driver.quit();

    // If the test was aborted before eyes.close was called ends the test as aborted.
    await eyes.abort();
  }
})();
