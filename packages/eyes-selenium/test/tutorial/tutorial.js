
'use strict';

require('chromedriver');
const { Builder, By } = require('selenium-webdriver');
const { Eyes, ClassicRunner, Target, RectangleSize } = require('../../index');

describe('DemoApp - ClassicRunner', function () {
  let runner, eyes, driver;

  beforeEach(async () => {
    // Initialize the Runner for your test.
    runner = new ClassicRunner();

    // Initialize the eyes SDK (IMPORTANT: make sure your API key is set in the APPLITOOLS_API_KEY env variable).
    eyes = new Eyes(runner);

    // Use Chrome browser
    driver = await new Builder()
      .forBrowser('chrome')
      // .setChromeOptions(new ChromeOptions().headless())
      .build();
  });

  it('Smoke Test', async () => {
    // Start the test by setting AUT's name, test name and viewport size (width X height)
    await eyes.open(driver, 'DemoApp - ClassicRunner', 'Smoke Test', new RectangleSize(600, 800));

    // Navigate the browser to the "ACME" demo app.
    await driver.get('https://demo.applitools.com');
    // await driver.get("https://demo.applitools.com/index_v2.html");
    // To see visual bugs after the first run, use the commented line above instead.

    // Visual checkpoint #1 - Check the login page.
    await eyes.check('Login Window', Target.window());

    // This will create a test with two test steps.
    await driver.findElement(By.id('log-in')).click();

    // Visual checkpoint #2 - Check the app page.
    await eyes.check('App Window', Target.window().fully());

    // End the test.
    await eyes.closeAsync();
  });

  afterEach(async () => {
    // Close the browser.
    await driver.quit();

    // If the test was aborted before eyes.close was called, ends the test as aborted.
    await eyes.abortIfNotClosed();

    // Wait and collect all test results
    const allTestResults = await runner.getAllTestResults();
    console.log(allTestResults);
  });
});
