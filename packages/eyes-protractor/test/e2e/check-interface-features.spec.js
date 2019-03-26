'use strict';

const {
  ConsoleLogHandler,
  MatchLevel,
  Region,
  RectangleSize,
  FloatingMatchSettings,
} = require('@applitools/eyes-sdk-core');
const { Target } = require('@applitools/eyes-selenium');
const { Eyes } = require('../../index');

let eyes = null;
describe('Eyes.Protractor.JavaScript - check-interface-features', function () {
  beforeAll(function () {
    eyes = new Eyes();
    eyes.setLogHandler(new ConsoleLogHandler(true));
  });

  it('test check interface features', async function () {
    await eyes.open(browser, global.appName, global.testName, new RectangleSize(1000, 700));

    await browser.get('https://astappiev.github.io/test-html-pages/');

    // Entire window, equivalent to eyes.checkWindow()
    await eyes.check('Entire window', Target.window()
      .matchLevel(MatchLevel.Layout)
      .ignoreRegions(by.id('overflowing-div'))
      .ignoreRegions(element(by.name('frame1')))
      .ignoreRegions(new Region(400, 100, 50, 50), new Region(400, 200, 50, 100))
      .floatingRegion(new FloatingMatchSettings({ left: 500, top: 100, width: 75, height: 100, maxUpOffset: 25, maxDownOffset: 10, maxLeftOffset: 30, maxRightOffset: 15 }))
      .floatingRegion(by.id('overflowing-div-image'), 5, 25, 10, 25));

    // Region by rect, equivalent to eyes.checkFrame()
    await eyes.check('Region by rect', Target.region(new Region(50, 50, 200, 200))
      .floatingRegion(new FloatingMatchSettings({ left: 50, top: 50, width: 60, height: 50, maxUpOffset: 10, maxDownOffset: 10, maxLeftOffset: 10, maxRightOffset: 10 })));

    await eyes.close();
  });

  afterEach(async function () {
    await eyes.abortIfNotClosed();
  });
});
