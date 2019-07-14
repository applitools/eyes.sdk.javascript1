'use strict';

const { By } = require('selenium-webdriver');
const { TestsDataProvider } = require('./setup/TestsDataProvider');
const { TestSetup } = require('./setup/TestSetup');
const { Target } = require('../../index');

let /** @type {Eyes} */ eyes, /** @type {EyesWebDriver} */ driver;
const testedPageUrl = 'http://applitools.github.io/demo/TestPages/WixLikeTestPage/index.html';

const dataProvider = TestsDataProvider.dp();
dataProvider.forEach((row) => {
  const testSetup = new TestSetup('TestSpecialCases', 'Eyes Selenium SDK - Special Cases', testedPageUrl);
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

    it('TestCheckRegionInAVeryBigFrame', async function () {
      await eyes.check('map', Target.frame('frame1').region(By.css('img')));
    });

    it('TestCheckRegionInAVeryBigFrameAfterManualSwitchToFrame', async function () {
      await driver.switchTo().frame('frame1');

      const element = await driver.findElement(By.css('img'));
      await driver.executeScript('arguments[0].scrollIntoView(true);', element);

      await eyes.check('', Target.region(By.css('img')));
    });
  });
});
