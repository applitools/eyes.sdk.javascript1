'use strict';

const { By } = require('selenium-webdriver');
const { TestsDataProvider } = require('./setup/TestsDataProvider');
const { TestSetup } = require('./setup/TestSetup');
const { Target } = require('../../index');

let /** @type {Eyes} */ eyes, /** @type {EyesWebDriver} */ driver;
const testedPageUrl = 'http://applitools.github.io/demo/TestPages/DomTest/dom_capture.html';

const dataProvider = TestsDataProvider.dp();
dataProvider.forEach((row) => {
  const testSetup = new TestSetup('TestDomSending', 'Eyes Selenium SDK - Dom Sending', testedPageUrl);
  testSetup.setData(...row, false);

  testSetup.getEyes().setSendDom(true);

  describe(testSetup.toString(), function () {
    beforeEach(async function () {
      await testSetup.beforeMethod(this.currentTest.title);
      eyes = testSetup.getEyes();
      driver = testSetup.getDriver();
    });

    afterEach(async function () {
      await testSetup.afterMethod();
    });

    it('TestDomOfTestPage', async function () {
      await eyes.check('A Window', Target.window());
    });

    it('TestDomOfApplitoolsPage', async function () {
      await driver.get('https://applitools.com');
      await eyes.check('A Window', Target.window());
    });

    it('TestDomOfBookingPage', async function () {
      await driver.get('https://booking.com');
      await driver.findElement(By.css('input.sb-searchbox__input.sb-destination__input')).sendKeys('Kiev, Ukraine');
      await driver.findElement(By.css('button.sb-searchbox__button')).click();
      await driver.sleep(200);
      await eyes.check('A Window', Target.window());
    });
  });
});
