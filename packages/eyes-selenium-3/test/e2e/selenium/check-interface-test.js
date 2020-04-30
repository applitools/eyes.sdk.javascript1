require('chromedriver')
var webdriver = require('selenium-webdriver')
var Builder = webdriver.Builder
var By = webdriver.By

var SeleniumSDK = require('../../../index')
var ConsoleLogHandler = SeleniumSDK.ConsoleLogHandler
var MatchLevel = SeleniumSDK.MatchLevel
var Eyes = SeleniumSDK.Eyes
var Target = SeleniumSDK.Target

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
      //.usingServer('http://localhost:4444/wd/hub')
      .build()

    eyes = new Eyes()
    eyes.setApiKey(process.env.APPLITOOLS_API_KEY)
    eyes.setLogHandler(new ConsoleLogHandler(true))
    eyes.getLogHandler().setPrintSessionId(true)
    eyes.setStitchMode(Eyes.StitchMode.CSS)
    eyes.setForceFullPageScreenshot(true)
  })

  beforeEach(function() {
    var appName = this.test.parent.title
    var testName = this.currentTest.title

    return eyes.open(driver, appName, testName, {width: 1000, height: 700}).then(function(browser) {
      driver = browser
    })
  })

  it('check interface', async function() {
    await driver.get('https://astappiev.github.io/test-html-pages/')

    // Entire window, equivalent to eyes.checkWindow()
    eyes.check(
      'Entire window',
      Target.window()
        .matchLevel(MatchLevel.Layout)
        .ignore(By.id('overflowing-div'))
        .ignore({element: driver.findElement(By.name('frame1'))})
        .ignore(
          {left: 400, top: 100, width: 50, height: 50},
          {left: 400, top: 200, width: 50, height: 100},
        )
        .floating({
          left: 500,
          top: 100,
          width: 75,
          height: 100,
          maxLeftOffset: 25,
          maxRightOffset: 10,
          maxUpOffset: 30,
          maxDownOffset: 15,
        })
        .floating({
          element: By.id('overflowing-div-image'),
          maxLeftOffset: 5,
          maxRightOffset: 25,
          maxUpOffset: 10,
          maxDownOffset: 25,
        }),
      // .floating({element: driver.findElement(By.tagName("h1")), maxLeftOffset: 10, maxRightOffset: 10, maxUpOffset: 10, maxDownOffset: 10})
    )

    // Region by rect, equivalent to eyes.checkFrame()
    eyes.check(
      'Region by rect',
      Target.region({left: 50, top: 50, width: 200, height: 200}),
      // .floating({left: 50, top: 50, width: 60, height: 50, maxLeftOffset: 10, maxRightOffset: 10, maxUpOffset: 10, maxDownOffset: 10})
      // .floating({left: 150, top: 75, width: 60, height: 50, maxLeftOffset: 10, maxRightOffset: 10, maxUpOffset: 10, maxDownOffset: 10})
    )

    // Region by element, equivalent to eyes.checkRegionByElement()
    eyes.check('Region by element', Target.region(driver.findElement(By.css('body > h1'))))

    // Region by locator, equivalent to eyes.checkRegionBy()
    eyes.check('Region by locator', Target.region(By.id('overflowing-div-image')))

    // Entire element by element, equivalent to eyes.checkElement()
    eyes.check(
      'Entire element by element',
      Target.region(driver.findElement(By.id('overflowing-div-image'))).fully(),
    )

    // Entire element by locator, equivalent to eyes.checkElementBy()
    eyes.check('Entire element by locator', Target.region(By.id('overflowing-div')).fully())

    // Entire frame by locator, equivalent to eyes.checkFrame()
    eyes.check('Entire frame by locator', Target.frame(By.name('frame1')))

    // Entire region in frame by frame name and region locator, equivalent to eyes.checkRegionInFrame()
    eyes.check(
      'Entire region in frame by frame name and region locator',
      Target.region(By.id('inner-frame-div'), 'frame1').fully(),
    )

    return eyes.close()
  })

  afterEach(function() {
    return driver.quit().then(function() {
      return eyes.abort()
    })
  })
})
