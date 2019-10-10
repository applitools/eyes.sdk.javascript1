'use strict';

const { By } = require('selenium-webdriver');
const { TestsDataProvider } = require('./setup/TestsDataProvider');
const { TestSetup } = require('./setup/TestSetup');
const { Target, FloatingMatchSettings, Region, AccessibilityMatchSettings, AccessibilityRegionType, AccessibilityLevel } = require('../../index');

let /** @type {Eyes} */ eyes, /** @type {EyesWebDriver} */ driver;
const testedPageUrl = 'http://applitools.github.io/demo/TestPages/FramesTestPage/';

const dataProvider = TestsDataProvider.dp();
dataProvider.forEach((row) => {
  const testSetup = new TestSetup('TestFluentApi', 'Eyes Selenium SDK - Fluent API', testedPageUrl);
  testSetup.setData(...row, false);

  describe(testSetup.toString(), function () {
    beforeEach(async function () {
      await testSetup.beforeMethod(this.currentTest.title, () => {
        eyes.getDefaultMatchSettings().setAccessibilityValidation(AccessibilityLevel.AAA);
      });
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
        .ignoreCaret()
        .ignoreRegions(new Region(50, 50, 100, 100)));

      testSetup.setExpectedIgnoreRegions(new Region(50, 50, 100, 100));
    });

    it('TestCheckRegionWithIgnoreRegion_Fluent', async function () {
      await eyes.check('Fluent - Region with Ignore region', Target.region(By.id('overflowing-div'))
        .ignoreRegions(new Region(50, 50, 100, 100)));

      testSetup.setExpectedIgnoreRegions(new Region(50, 50, 100, 100));
    });

    it('TestCheckWindow_Fluent', async function () {
      await eyes.check('Fluent - Window', Target.window());
    });

    it('TestCheckFrame_Fluent', async function () {
      await eyes.check('Fluent - Frame', Target.frame('frame1'));
    });

    it('TestCheckFrame_Fully_Fluent', async function () {
      await eyes.check('Fluent - Full Frame', Target.frame('frame1').fully());
    });

    it('TestCheckWindowWithIgnoreBySelector_Fluent', async function () {
      await eyes.check('Fluent - Window with ignore region by selector', Target.window()
        .ignoreRegions(By.id('overflowing-div')));

      testSetup.setExpectedIgnoreRegions(new Region(8, 80, 304, 184));
    });

    it('TestCheckWindowWithIgnoreBySelector_Centered_Fluent', async function () {
      await eyes.check('Fluent - Window with ignore region by selector centered', Target.window()
        .ignoreRegions(By.id('centered')));

      testSetup.setExpectedIgnoreRegions(new Region(122, 928, 456, 306));
    });

    it('TestCheckWindowWithIgnoreBySelector_Stretched_Fluent', async function () {
      await eyes.check('Fluent - Window with ignore region by selector stretched', Target.window()
        .ignoreRegions(By.id('stretched')));

      testSetup.setExpectedIgnoreRegions(new Region(8, 1270, 690, 206));
    });

    it('TestCheckWindowWithFloatingBySelector_Fluent', async function () {
      await eyes.check('Fluent - Window with floating region by selector', Target.window()
        .floatingRegion(By.id('overflowing-div'), 3, 3, 20, 30));

      testSetup.setExpectedIgnoreRegions(new FloatingMatchSettings({ left: 8, top: 80, width: 304, height: 184, maxUpOffset: 3, maxDownOffset: 3, maxLeftOffset: 20, maxRightOffset: 30 }));
    });

    it('TestCheckRegionByCoordinates_Fluent', async function () {
      await eyes.check('Fluent - Region by coordinates', Target.region(new Region(50, 70, 90, 110)));
    });

    it('TestCheckOverflowingRegionByCoordinates_Fluent', async function () {
      await eyes.check('Fluent - Region by overflowing coordinates', Target.region(new Region(50, 110, 90, 550)));
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

    it('TestScrollbarsHiddenAndReturned_Fluent', async function () {
      await eyes.check('Fluent - Window (Before)', Target.window().fully());

      await eyes.check('Fluent - Inner frame div', Target.frame('frame1')
        .region(By.id('inner-frame-div'))
        .fully());

      await eyes.check('Fluent - Window (After)', Target.window().fully());
    });

    it('TestCheckFullWindowWithMultipleIgnoreRegionsBySelector_Fluent', async function () {
      await eyes.check('Fluent - Region by element', Target.window().fully().ignoreRegions(By.css('.ignore')));
      testSetup.setExpectedIgnoreRegions(
        new Region(122, 928, 456, 306),
        new Region(8, 1270, 690, 206),
        new Region(10, 284, 800, 500)
      );
    });

    // TODO: not supported in JS yet
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

    it('TestCheckWindowWithFloatingByRegion_Fluent', async function () {
      await eyes.check('Fluent - Window with floating region by region', Target.window()
        .floatingRegion(new Region(10, 10, 20, 20), 3, 3, 20, 30));

      testSetup.setExpectedFloatingsRegions(new FloatingMatchSettings({ left: 10, top: 10, width: 20, height: 20, maxUpOffset: 3, maxDownOffset: 3, maxLeftOffset: 20, maxRightOffset: 30 }));
    });

    it('TestCheckElementFully_Fluent', async function () {
      const element = await driver.findElement(By.id('overflowing-div-image'));
      await eyes.check('Fluent - Region by element - fully', Target.region(element).fully());
    });

    it('TestCheckRegionBySelectorAfterManualScroll_Fluent', async function () {
      await driver.executeScript('window.scrollBy(0,900);');
      await eyes.check('Fluent - Region by selector after manual scroll', Target.region(By.id('centered')));
    });

    it('TestSimpleRegion', async function () {
      await eyes.check(undefined, Target.window().region(new Region(50, 50, 100, 100)));
    });

    it('TestAccessibilityRegions', async function () {
      const config = eyes.getConfiguration();
      config.setAccessibilityValidation(AccessibilityLevel.AAA);
      eyes.setConfiguration(config);

      await eyes.check(undefined, Target.window().accessibilityRegion(By.className('ignore'), AccessibilityRegionType.LargeText));

      testSetup.setExpectedAccessibilityRegions(
        new AccessibilityMatchSettings({ left: 122, top: 928, width: 456, height: 306, type: AccessibilityRegionType.LargeText }),
        new AccessibilityMatchSettings({ left: 8, top: 1270, width: 690, height: 206, type: AccessibilityRegionType.LargeText }),
        new AccessibilityMatchSettings({ left: 10, top: 284, width: 800, height: 500, type: AccessibilityRegionType.LargeText })
      );
      testSetup.addExpectedProperty('AccessibilityLevel', AccessibilityLevel.AAA);
    });
  });
});
