'use strict';

require('chromedriver');
const assert = require('assert');
const { Builder, Capabilities } = require('selenium-webdriver');
const { Options: ChromeOptions } = require('selenium-webdriver/chrome');
const { Eyes, VisualGridRunner, Target, Configuration, BrowserType, BatchInfo, ConsoleLogHandler, DeviceName, ScreenOrientation } = require('../../index');

function initializeEyes(runner) {
  const eyes = new Eyes(runner);
  eyes.setLogHandler(new ConsoleLogHandler(false));

  const configuration = new Configuration();
  // configuration.setProxy('http://localhost:8888');
  configuration.setAppName('VisualGridRunner');
  configuration.setTestName('Test VGRunner');
  configuration.setBatch(new BatchInfo("VGRunner batch"));
  configuration.addBrowser(800, 600, BrowserType.CHROME);
  configuration.addBrowser(700, 500, BrowserType.CHROME);
  configuration.addBrowser(1200, 800, BrowserType.FIREFOX);
  configuration.addBrowser(1600, 1200, BrowserType.FIREFOX);
  configuration.addDeviceEmulation(DeviceName.iPhone_4, ScreenOrientation.PORTRAIT);

  eyes.setConfiguration(configuration);
  return eyes;
}

async function runTest(url, runner) {
  const eyes = initializeEyes(runner);

  const webDriver = new Builder()
    .withCapabilities(Capabilities.chrome())
    .setChromeOptions(new ChromeOptions().headless())
    .build();

  try {
    await webDriver.get(url);
    await eyes.open(webDriver);
    await eyes.check('Main Page ' + url, Target.window());
    await eyes.closeAsync();
  } finally {
    await webDriver.quit();
  }
}

describe('VisualGridRunner', function () {
  this.timeout(5 * 60 * 1000);

  it('test multiple pages and get merged results', async function () {
    const urlsToTest = [
      'https://applitools.com/helloworld',
      'http://applitools-dom-capture-origin-1.surge.sh/testWithIframe.html',
      'http://applitools.github.io/demo/TestPages/FramesTestPage/',
    ];

    const runner = new VisualGridRunner(10);
    for (const url of urlsToTest) {
      await runTest(url, runner);
    }

    const results = await runner.getAllTestResults(false);
    assert.strictEqual(results.getAllResults().length, 15);
  });
});
