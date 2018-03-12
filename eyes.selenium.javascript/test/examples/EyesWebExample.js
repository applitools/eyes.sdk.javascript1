require('chromedriver');
const {Builder, Capabilities, By} = require('selenium-webdriver');
const {ConsoleLogHandler, RectangleSize} = require('@applitools/eyes.sdk.core');
const {Eyes, Target} = require('../../index'); // should be replaced to '@applitools/eyes.selenium'

(async () => {
    // Open a Chrome browser.
    const driver = new Builder()
        .withCapabilities(Capabilities.chrome())
        .build();

    // Initialize the eyes SDK and set your private API key.
    const eyes = new Eyes();
    eyes.setApiKey(process.env.APPLITOOLS_API_KEY);
    eyes.setLogHandler(new ConsoleLogHandler(false));

    try {
        // Start the test and set the browser's viewport size to 800x600.
        await eyes.open(driver, 'Hello World!', 'My first Javascript test!', new RectangleSize(800, 600));

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
        await eyes.abortIfNotClosed();
    }
})();