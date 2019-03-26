'use strict';

require('chromedriver'); // eslint-disable-line node/no-unpublished-require
const { Builder, Capabilities, By } = require('selenium-webdriver');
const { Eyes, Target, ConsoleLogHandler, RectangleSize, Region } = require('../index'); // should be replaced to '@applitools/eyes-selenium'

(async () => {
  // Open a Chrome browser.
  const driver = new Builder()
    .withCapabilities(Capabilities.chrome())
    .build();

  // Initialize the eyes SDK and set your private API key.
  const eyes = new Eyes();
  // eyes.setApiKey('Your API Key');
  eyes.setLogHandler(new ConsoleLogHandler(false));

  try {
    // Start the test and set the browser's viewport size to 800x600.
    await eyes.open(driver, 'Eyes Examples', 'My advanced JavaScript test!', new RectangleSize(800, 600));

    // Navigate the browser to the "test pages" web-site.
    await driver.get('http://applitools.github.io/demo/TestPages/FramesTestPage/');

    // Region by rect, equivalent to eyes.checkFrame()
    await eyes.check('Region by rect', Target.region(new Region(50, 50, 200, 200)));

    // Region by element, equivalent to eyes.checkRegionByElement()
    await eyes.check('Region by element', Target.region(driver.findElement(By.css('body > h1'))));

    // Region by locator, equivalent to eyes.checkRegionBy()
    await eyes.check('Region by locator', Target.region(By.id('overflowing-div-image')));

    // Entire element by element, equivalent to eyes.checkElement()
    await eyes.check('Entire element by element', Target.region(driver.findElement(By.id('overflowing-div-image'))).fully());

    // Entire element by locator, equivalent to eyes.checkElementBy()
    await eyes.check('Entire element by locator', Target.region(By.id('overflowing-div')).fully());

    // Entire frame by locator, equivalent to eyes.checkFrame()
    await eyes.check('Entire frame by locator', Target.frame(By.name('frame1')));

    // Entire region in frame by frame name and region locator, equivalent to eyes.checkRegionInFrame()
    await eyes.check('Entire region in frame by frame name and region locator', Target.region(By.id('inner-frame-div'), 'frame1').fully());

    // End the test.
    await eyes.close();
  } finally {
    // Close the browser.
    await driver.quit();

    // If the test was aborted before eyes.close was called ends the test as aborted.
    await eyes.abortIfNotClosed();
  }
})();
