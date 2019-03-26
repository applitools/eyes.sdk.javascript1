'use strict';

const { By } = require('selenium-webdriver');
const { TestsDataProvider } = require('./setup/TestsDataProvider');
const { TestSetup } = require('./setup/TestSetup');
const { Target, FloatingMatchSettings, Region } = require('../../index');

let /** @type {Eyes} */ eyes, /** @type {EyesWebDriver} */ driver;
const testedPageUrl = 'http://applitools.github.io/demo/TestPages/FramesTestPage/';

const dataProvider = TestsDataProvider.dp();
dataProvider.forEach(row => {
  const testSetup = new TestSetup('TestFluentApi', 'Eyes Selenium SDK - Fluent API', testedPageUrl);
  testSetup.setData(...row, false);

  describe(testSetup.toString(), function () {
    beforeEach(async function () {
      await testSetup.beforeMethod(this.currentTest.title);
      eyes = testSetup.getEyes();
      driver = testSetup.getDriver();
    });

    afterEach(async function () {
      await testSetup.afterMethod();
    });

    it('TestCheckWindowWithIgnoreRegion_Fluent', async function () {
      await driver.findElement(By.css('input')).sendKeys('My Input');
      await eyes.check('Fluent - Window with Ignore region', Target.window()
        .fully()
        .timeout(5000)
        .ignoreRegions(new Region(50, 50, 100, 100)));

      testSetup.setExpectedIgnoreRegions(new Region(50, 50, 100, 100));
    });

    it('TestCheckRegionWithIgnoreRegion_Fluent', async function () {
      await eyes.check('Fluent - Region with Ignore region', Target.region(By.id('overflowing-div'))
        .ignoreRegions(new Region(50, 50, 100, 100)));

      testSetup.setExpectedIgnoreRegions(new Region(50, 50, 100, 100));
    });

    it('TestCheckFrame_Fully_Fluent', async function () {
      await eyes.check('Fluent - Full Frame', Target.frame('frame1').fully());
    });

    it('TestCheckFrame_Fluent', async function () {
      await eyes.check('Fluent - Frame', Target.frame('frame1'));
    });

    // it('TestCheckFrameInFrame_Fully_Fluent', async function () {
    //   await eyes.check('Fluent - Full Frame in Frame', Target.frame('frame1')
    //     .frame('frame1-1')
    //     .fully());
    // });

    it('TestCheckRegionInFrame_Fluent', async function () {
      await eyes.check('Fluent - Region in Frame', Target.frame('frame1')
        .region(By.id('inner-frame-div'))
        .fully());
    });

    // it('TestCheckRegionInFrameInFrame_Fluent', async function () {
    //   await eyes.check('Fluent - Region in Frame in Frame', Target.frame('frame1')
    //     .frame('frame1-1')
    //     .region(By.css('img'))
    //     .fully());
    // });

    it('TestScrollbarsHiddenAndReturned_Fluent', async function () {
      await eyes.check('Fluent - Window (Before)', Target.window().fully());

      await eyes.check(
        'Fluent - Inner frame div',
        Target.frame('frame1')
          .region(By.id('inner-frame-div'))
          .fully()
      );

      await eyes.check('Fluent - Window (After)', Target.window().fully());
    });

    it('TestCheckRegionInFrame2_Fluent', async function () {
      await eyes.check('Fluent - Inner frame div 1', Target.frame('frame1')
        .region(By.id('inner-frame-div'))
        .fully()
        .timeout(5000)
        .ignoreRegions(new Region(50, 50, 100, 100)));

      await eyes.check('Fluent - Inner frame div 2', Target.frame('frame1')
        .region(By.id('inner-frame-div'))
        .fully()
        .ignoreRegions(new Region(50, 50, 100, 100))
        .ignoreRegions(new Region(70, 170, 90, 90)));

      await eyes.check('Fluent - Inner frame div 3', Target.frame('frame1')
        .region(By.id('inner-frame-div'))
        .fully()
        .timeout(5000));

      await eyes.check('Fluent - Inner frame div 4', Target.frame('frame1')
        .region(By.id('inner-frame-div'))
        .fully());

      await eyes.check('Fluent - Full frame with floating region', Target.frame('frame1')
        .fully()
        .layout()
        .floatingRegion(new Region(200, 200, 150, 150), 25, 25, 25, 25));
    });

    // it('TestCheckFrameInFrame_Fully_Fluent2', async function () {
    //   await eyes.check('Fluent - Window', Target.window()
    //     .fully());
    //
    //   await eyes.check('Fluent - Full Frame in Frame 2', Target.frame('frame1')
    //     .frame('frame1-1')
    //     .fully());
    // });

    it('TestCheckWindowWithIgnoreBySelector_Fluent', async function () {
      await eyes.check('Fluent - Window with ignore region by selector', Target.window()
        .ignoreRegions(By.id('overflowing-div')));
    });

    it('TestCheckWindowWithFloatingBySelector_Fluent', async function () {
      await eyes.check('Fluent - Window with floating region by selector', Target.window()
        .floatingRegion(By.id('overflowing-div'), 3, 3, 20, 30));
    });

    it('TestCheckWindowWithFloatingByRegion_Fluent', async function () {
      await eyes.check('Fluent - Window with floating region by region', Target.window()
        .floatingRegion(new Region(10, 10, 20, 20), 3, 3, 20, 30));

      testSetup.setExpectedFloatingsRegions(new FloatingMatchSettings({ left: 10, top: 10, width: 20, height: 20, maxUpOffset: 3, maxDownOffset: 3, maxLeftOffset: 20, maxRightOffset: 30 }));
    });

    it('TestCheckElementFully_Fluent', async function () {
      const element = await driver.findElement(By.id('overflowing-div-image'));
      await eyes.check('Fluent - Region by element - fully', Target.region(element).fully());
    });

    it('TestCheckElementWithIgnoreRegionByElementOutsideTheViewport_Fluent', async function () {
      const element = await driver.findElement(By.id('overflowing-div-image'));
      const ignoreElement = await driver.findElement(By.id('overflowing-div'));
      testSetup.setExpectedIgnoreRegions();
      await eyes.check('Fluent - Region by element', Target.region(element).ignoreRegions(ignoreElement));
    });

    it('TestCheckElementWithIgnoreRegionBySameElement_Fluent', async function () {
      const element = await driver.findElement(By.id('overflowing-div-image'));
      await eyes.check('Fluent - Region by element', Target.region(element).ignoreRegions(element));
      testSetup.setExpectedIgnoreRegions(new Region(0, 0, 304, 184));
    });

    it('TestCheckFullWindowWithMultipleIgnoreRegionsBySelector_Fluent', async function () {
      await eyes.check('Fluent - Region by element', Target.window().fully().ignoreRegions(By.css('.ignore')));
      testSetup.setExpectedIgnoreRegions(
        new Region(172, 928, 456, 306),
        new Region(8, 1270, 784, 206),
        new Region(10, 284, 302, 182)
      );
    });

    // it('TestCheckMany', async function () {
    //   await eyes.check(
    //     Target.region(By.id("overflowing-div-image")).withName("overflowing div image"),
    //     Target.region(By.id("overflowing-div")).withName("overflowing div"),
    //     Target.region(By.id("overflowing-div-image")).fully().withName("overflowing div image (fully)"),
    //     Target.frame("frame1").frame("frame1-1").fully().withName("Full Frame in Frame"),
    //     Target.frame("frame1").withName("frame1"),
    //     Target.region(new Region(30, 50, 300, 620)).withName("rectangle")
    //   );
    // });
  });
});
