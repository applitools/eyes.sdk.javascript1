require('chromedriver')
var webdriver = require('selenium-webdriver')
var Builder = webdriver.Builder

var SeleniumSDK = require('../../../index')
var ConsoleLogHandler = SeleniumSDK.ConsoleLogHandler
var Target = SeleniumSDK.Target
var Eyes = SeleniumSDK.Eyes

var driver = null,
  eyes = null
describe('Eyes.Selenium.JavaScript - Selenium', function() {
  this.timeout(5 * 60 * 1000)

  before(function() {
    driver = new Builder()
      .withCapabilities({
        browserName: 'chrome',
        'goog:chromeOptions': {
          args: ['headless'],
        },
      })
      .build()

    eyes = new Eyes()
    eyes.setApiKey(process.env.APPLITOOLS_API_KEY)
    eyes.setLogHandler(new ConsoleLogHandler(true))
  })

  beforeEach(function() {
    var appName = this.test.parent.title
    var testName = this.currentTest.title

    return eyes.open(driver, appName, testName, {width: 800, height: 560}).then(function(browser) {
      driver = browser
    })
  })

  it('hide scrollbars selenium', function() {
    driver.get('https://astappiev.github.io/test-html-pages/')

    eyes.setHideScrollbars(true)
    eyes.setScrollRootElement(webdriver.By.id('overflowing-div-image'))
    eyes.check('Entire window', Target.window().fully(true))

    return eyes.close()
  })

  afterEach(function() {
    return driver.quit().then(function() {
      return eyes.abort()
    })
  })
})
