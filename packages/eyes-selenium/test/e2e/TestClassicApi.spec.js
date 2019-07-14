'use strict';

const { By } = require('selenium-webdriver');
const { TestsDataProvider } = require('./setup/TestsDataProvider');
const { TestSetup } = require('./setup/TestSetup');

let /** @type {Eyes} */ eyes, /** @type {EyesWebDriver} */ driver;
const testedPageUrl = 'http://applitools.github.io/demo/TestPages/FramesTestPage/';

const dataProvider = TestsDataProvider.dp();
dataProvider.forEach((row) => {
  const testSetup = new TestSetup('TestClassicApi', 'Eyes Selenium SDK - Classic API', testedPageUrl);
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

    it('TestCheckWindow', async function () {
      await eyes.checkWindow('Window', undefined);
    });

    it('TestCheckRegion', async function () {
      await eyes.checkRegionBy(By.id('overflowing-div'), 'Region', undefined, true);
    });

    it('TestCheckFrame', async function () {
      await eyes.checkFrame('frame1', undefined, 'frame1');
    });

    it('TestCheckRegionInFrame', async function () {
      await eyes.checkRegionInFrame('frame1', By.id('inner-frame-div'), undefined, 'Inner frame div', true);
    });

    it('TestCheckRegion2', async function () {
      await eyes.checkRegionBy(By.id('overflowing-div-image'), 'minions', undefined, true);
    });

    it('TestCheckInnerFrame', async function () {
      await driver.switchTo().defaultContent();
      await driver.switchTo().frame(driver.findElement(By.name('frame1')));
      await eyes.checkFrame('frame1-1', undefined, 'inner-frame');
    });
  });
});
