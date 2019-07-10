'use strict';

const { ConsoleLogHandler, RectangleSize } = require('@applitools/eyes-sdk-core');
const { Target } = require('@applitools/eyes-selenium');
const { Eyes } = require('../../index');

let eyes = null;
describe('Eyes.Protractor.JavaScript - check window', function () {
  beforeAll(function () {
    eyes = new Eyes();
    eyes.setLogHandler(new ConsoleLogHandler(true));
    eyes.setHideScrollbars(true);
  });

  it('test check window methods', async function () {
    await eyes.open(browser, global.appName, global.testName, new RectangleSize(800, 560));

    await browser.get('https://astappiev.github.io/test-html-pages/');

    await eyes.check('Partial window', Target.window());

    await eyes.check('Entire window', Target.window().fully());

    await eyes.close();
  });

  afterEach(async function () {
    await eyes.abort();
  });
});
