require('chromedriver')
var webdriver = require('selenium-webdriver')
var chrome = require('selenium-webdriver/chrome')
var Builder = webdriver.Builder
var By = webdriver.By

var SeleniumSDK = require('../../../index')
var ConsoleLogHandler = SeleniumSDK.ConsoleLogHandler
var Eyes = SeleniumSDK.Eyes

var driver = null,
  eyes = null
describe('Eyes.Selenium.JavaScript - Selenium', function() {
  this.timeout(5 * 60 * 1000)

  before(function() {
    var options = new chrome.Options().addArguments(
      '--force-device-scale-factor=1.25',
      '--headless',
    )
    driver = new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .build()

    eyes = new Eyes()
    eyes.setApiKey(process.env.APPLITOOLS_API_KEY)
    eyes.setLogHandler(new ConsoleLogHandler(true))
    eyes.getLogHandler().setPrintSessionId(true)
    eyes.setForceFullPageScreenshot(true)
  })

  beforeEach(function() {
    var appName = this.test.parent.title
    var testName = this.currentTest.title

    return eyes.open(driver, appName, testName, {width: 1000, height: 700}).then(function(browser) {
      driver = browser
    })
  })

  it('scaling methods', function() {
    driver.get('https://astappiev.github.io/test-html-pages/')

    eyes.checkWindow('Initial')

    eyes.checkElementBy(By.id('overflowing-div'), null, 'Text block')

    eyes.checkElementBy(By.id('overflowing-div-image'), null, 'Minions')

    return eyes.close()
  })

  afterEach(function() {
    return driver.quit().then(function() {
      return eyes.abort()
    })
  })
})
