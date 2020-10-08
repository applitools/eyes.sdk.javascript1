// re: https://trello.com/c/PrGEKzhJ
const {remote} = require('webdriverio')
const {Target, By, Eyes} = require('../../..')

describe.skip('Check Region, Chrome on Android', async () => {
  let eyes
  let browser

  before(async () => {
    const browserOptions = {
      host: 'ondemand.saucelabs.com',
      hostname: 'ondemand.saucelabs.com',
      port: 80,
      path: '/wd/hub',
      capabilities: {
        // -- android 1
        browserName: 'Chrome',
        deviceName: 'Google Pixel 3 XL GoogleAPI Emulator',
        deviceOrientation: 'portrait',
        platformVersion: '10.0',
        platformName: 'Android',
        appiumVersion: '1.16.0',
        // -- android 2
        //browserName: 'Chrome',
        //deviceName: 'Google Pixel 3 GoogleAPI Emulator',
        //deviceOrientation: 'portrait',
        //platformVersion: '10.0',
        //platformName: 'Android',
        //appiumVersion: '1.16.0',
        // -- android 3
        //browserName: 'Chrome',
        //deviceName: 'Samsung Galaxy S9 Plus HD GoogleAPI Emulator',
        //deviceOrientation: 'portrait',
        //platformVersion: '8.0',
        //platformName: 'Android',
        //appiumVersion: '1.16.0',
        newCommandTimeout: 600,
        username: process.env.SAUCE_USERNAME,
        accesskey: process.env.SAUCE_ACCESS_KEY,
        baseUrl: `http://${process.env.SAUCE_USERNAME}:${process.env.SAUCE_ACCESS_KEY}@ondemand.saucelabs.com:80/wd/hub`,
      },
    }
    browser = await remote(browserOptions)
    eyes = new Eyes()
    eyes.setApiKey(process.env.APPLITOOLS_API_KEY)
  })

  after(async () => {
    await eyes.abortIfNotClosed()
  })

  // TODO: replace with an example AUT we control
  it('captures element that fills the viewport which needs to be scrolled into view', async function() {
    await browser.url('https://www.asos.com/search/?q=jeans')
    await eyes.open(browser, this.test.parent.title, 'Check Region, Chrome on Android')
    let savedLists = await browser.$('#plp')
    await savedLists.waitForExist()
    let welcomeMessage = await browser.$('#chrome-welcome-mat > div > div > button')
    await welcomeMessage.click()
    await eyes.check(
      'element that fills the viewport which needs to be scrolled into view',
      Target.region(By.css('#plp')),
    )
    await eyes.close(true)
  })
})
