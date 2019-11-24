'use strict';

// Import chromedriver
require('chromedriver');

// Import Selenium Webdriver
const { Builder, Capabilities, By } = require('selenium-webdriver');

// Import Applitools SDK and relevant methods
const { Eyes, Target, VisualGridRunner, Configuration, BrowserType, DeviceName, ScreenOrientation } = require('../../index');

(async () => {
  // Open a Chrome browser.
  const driver = new Builder()
    .withCapabilities(Capabilities.chrome())
    .build();

  // Initialize the eyes SDK and set your private API key.
  const eyes = new Eyes(new VisualGridRunner()); // Add a runner if you want to use VisualGrid service

  // How, you have an ability to use new Configuration class to setup everything
  // It has all configuration methods from Eyes class and more (to setup emulation devices)
  const config = new Configuration();

  // Add your API key
  // config.setApiKey('{APPLITOOLS_API_KEY}'); // 👈🏼 REPLACE ME!

  // Set the App name and the Test name
  config.setAppName('Demo app');
  config.setTestName('JS Smoke test');

  // Set concurrent sessions (upto 100, depending on your license)
  config.setConcurrentSessions(4);

  // Add Chrome browser with two different viewports
  config.addBrowser(800, 600, BrowserType.CHROME);
  config.addBrowser(700, 500, BrowserType.CHROME);

  // Add Firefox browser with two different viewports
  config.addBrowser(1200, 800, BrowserType.FIREFOX);
  config.addBrowser(1600, 1200, BrowserType.FIREFOX);

  // Add iPhone 4 with Portrait mode
  config.addDeviceEmulation(DeviceName.iPhone_4, ScreenOrientation.PORTRAIT);

  // Set the config to eyes
  eyes.setConfiguration(config);

  try {
    // Start the test. All configuration you have set above
    await eyes.open(driver);

    // Navigate the browser to the "hello world!" web-site.
    await driver.get('https://demo.applitools.com');

    // ⭐️To see visual bugs, change the above URL to:
    // https://demo.applitools.com/index_v2.html and run the test again

    // Visual checkpoint #1.
    await eyes.check('Login Page', Target.window().fully());

    // Click the "Click me!" button.
    await driver.findElement(By.id('log-in')).click();

    // Visual checkpoint #2.
    await eyes.check('Click!', Target.window().fully());

    console.log(
      `Please wait, we are now..
      1. Uploading the app's resources (html, css, images)
      2. Rendering them in different browsers, emulators
      3. Analyzing them using our A.I. 

      ...you should see the result within 15 - 60 seconds depending on your internet speed, # combinations and how heavy your app is.`
    );

    // End the test.
    // const results = await eyes.close(); // will return only first TestResults, but as we have multiple browsers, we need more results

    // This will return all results as an array
    const results = await eyes.getRunner().getAllTestResults();

    console.log(results);
  } catch (e) {
    // When you use VisualGrid, we don't throw an error on validation mismatch
    console.error(e);
  } finally {
    // Close the browser.
    await driver.quit();

    // If the test was aborted before eyes.close was called ends the test as aborted.
    await eyes.abortIfNotClosed();
  }
})();
