require('chromedriver')
var {By, Builder} = require('selenium-webdriver')
var {ConsoleLogHandler, Target, Eyes} = require('../../../index')
var chrome = require('selenium-webdriver/chrome')

var driver = null,
  eyes = null
describe('TestFloatingRegion', function() {
  this.timeout(5 * 60 * 1000)

  before(function() {
    var options = new chrome.Options().addArguments('--headless')
    driver = new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .build()

    eyes = new Eyes()
    eyes.setStitchMode('CSS')
    // eyes.setForceFullPageScreenshot(true);
    eyes.setApiKey(process.env.APPLITOOLS_API_KEY)
    eyes.setLogHandler(new ConsoleLogHandler(true))
  })

  beforeEach(function() {
    var appName = this.test.parent.title
    var testName = this.currentTest.title

    return eyes.open(driver, appName, testName).then(function(browser) {
      driver = browser
    })
  })

  it('TestBootstrapModal', function() {
    driver.get('https://getbootstrap.com/docs/4.3/components/modal/')

    // the viewport size by default is set on createSession, but screenshot captured before and region can be moved
    eyes.setViewportSize({width: 1000, height: 600})

    // click "Open modal"
    driver.findElement(By.xpath('/html/body/div/div/main/div[13]/button')).click()

    // wait some time to finish animation
    driver.sleep(3000)

    // Capture modal window region
    eyes.check(
      'Modal-Content',
      Target.region(By.css('#exampleModalScrollable > div > div.modal-content')),
    )

    // Execute this part only after first check is resolved.
    driver.controlFlow().execute(function() {
      // Capture only scrollable part
      var modalBodyElement = By.css(
        '#exampleModalScrollable > div > div.modal-content > div.modal-body',
      )
      eyes.setScrollRootElement(modalBodyElement)
      eyes.check('Scrollable Modal-Body', Target.region(modalBodyElement).fully())
    })

    return eyes.close()
  })

  afterEach(function() {
    return driver.quit().then(function() {
      return eyes.abort()
    })
  })
})
