'use strict';

const { ConsoleLogHandler, RectangleSize } = require('@applitools/eyes-sdk-core');
const { Target } = require('@applitools/eyes-selenium');
const { Eyes } = require('../../index');

let eyes = null;
describe('Eyes.Protractor.JavaScript - click-sendkeys', function () {
  beforeAll(function () {
    eyes = new Eyes();
    eyes.setLogHandler(new ConsoleLogHandler(true));
  });

  it('test click and sendKeys methods methods', async function () {
    await eyes.open(browser, global.appName, global.testName, new RectangleSize(800, 560));

    await browser.get('https://astappiev.github.io/test-html-pages/');

    await eyes.check('Entire window', Target.window().fully());

    await element(by.name('name')).sendKeys('Test User');
    await element(by.name('email')).sendKeys('username@example.com');
    await element(by.id('submit-form')).click();

    await eyes.check('After submit form', Target.window().fully());

    await eyes.close();
  });

  afterEach(async function () {
    await eyes.abortIfNotClosed();
  });
});
