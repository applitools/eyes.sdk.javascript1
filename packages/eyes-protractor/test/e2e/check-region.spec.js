'use strict';

const { ConsoleLogHandler, RectangleSize, Region } = require('@applitools/eyes-sdk-core');
const { Target } = require('@applitools/eyes-selenium');
const { Eyes } = require('../../index');

let eyes = null;
describe('Eyes.Protractor.JavaScript - check region', function () {
  beforeAll(function () {
    eyes = new Eyes();
    eyes.setLogHandler(new ConsoleLogHandler(true));
  });

  it('test check region methods', async function () {
    await eyes.open(browser, global.appName, global.testName, new RectangleSize(800, 560));

    await browser.get('https://astappiev.github.io/test-html-pages/');

    // Region by rect, equivalent to eyes.checkFrame()
    await eyes.check('Region by rect', Target.region(new Region(50, 50, 200, 200)));

    // Region by element, equivalent to eyes.checkRegionByElement()
    await eyes.check('Region by element', Target.region(element(by.css('body > h1'))));

    // Region by locator, equivalent to eyes.checkRegionBy()
    await eyes.check('Region by locator', Target.region(by.id('overflowing-div-image')));

    // Entire element by element, equivalent to eyes.checkElement()
    await eyes.check('Entire element by element', Target.region(element(by.id('overflowing-div-image'))).fully());

    // Entire element by locator, equivalent to eyes.checkElementBy()
    await eyes.check('Entire element by locator', Target.region(by.id('overflowing-div')).fully());

    // Entire frame by locator, equivalent to eyes.checkFrame()
    await eyes.check('Entire frame by locator', Target.frame(by.name('frame1')));

    // Entire region in frame by frame name and region locator, equivalent to eyes.checkRegionInFrame()
    await eyes.check('Entire region in frame by frame name and region locator', Target.region(by.id('inner-frame-div'), 'frame1').fully());

    await eyes.close();
  });

  afterEach(async function () {
    await eyes.abort();
  });
});
