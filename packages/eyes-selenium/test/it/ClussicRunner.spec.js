'use strict';

require('chromedriver');
const assert = require('assert');
const { Builder, Capabilities } = require('selenium-webdriver');
const { Options: ChromeOptions } = require('selenium-webdriver/chrome');
const { Eyes, ClassicRunner, Target, Configuration, BatchInfo, ConsoleLogHandler } = require('../../index');

function initializeEyes(runner) {
  const eyes = new Eyes(runner);
  eyes.setLogHandler(new ConsoleLogHandler(false));

  const configuration = new Configuration();
  // configuration.setProxy('http://localhost:8888');
  configuration.setAppName('ClassicRunner');
  configuration.setTestName('Test ClassicRunner');
  configuration.setBatch(new BatchInfo("ClassicRunner batch"));

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

describe('ClassicRunner', function () {
  this.timeout(5 * 60 * 1000);

  it('test multiple pages and get merged results', async function () {
    const urlsToTest = [
      'https://applitools.com/helloworld',
      'http://applitools-dom-capture-origin-1.surge.sh/testWithIframe.html',
      'http://applitools.github.io/demo/TestPages/FramesTestPage/',
    ];

    const runner = new ClassicRunner();
    for (const url of urlsToTest) {
      await runTest(url, runner);
    }

    const results = await runner.getAllTestResults(false);
    assert.strictEqual(results.getAllResults().length, 3);
  });
});
