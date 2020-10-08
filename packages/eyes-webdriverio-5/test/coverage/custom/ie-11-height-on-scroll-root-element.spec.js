// re: https://trello.com/c/Y0Q6QAHK
const {remote} = require('webdriverio')
const {Target, By, Eyes, ConsoleLogHandler} = require('../../..')

describe('calculating scrollRootElement offset errors on IE11', async () => {
  let eyes
  let browser

  before(async () => {
    const browserOptions = {
      host: 'ondemand.saucelabs.com',
      hostname: 'ondemand.saucelabs.com',
      port: 80,
      path: '/wd/hub',
      capabilities: {
        browserName: 'internet explorer',
        platformName: 'Windows 10',
        browserVersion: '11.285',
        'sauce:options': {
          seleniumVersion: '3.141.59',
          iedriverVersion: '3.141.59',
          username: process.env.SAUCE_USERNAME,
          accesskey: process.env.SAUCE_ACCESS_KEY,
          baseUrl: `http://${process.env.SAUCE_USERNAME}:${process.env.SAUCE_ACCESS_KEY}@ondemand.saucelabs.com:80/wd/hub`,
        },
      },
    }
    browser = await remote(browserOptions)
    eyes = new Eyes()
    eyes.setLogHandler(new ConsoleLogHandler(true))
  })

  after(async () => {
    await eyes.abortIfNotClosed()
  })

  it('checkWindow.fully on IE11', async function() {
    await browser.url('https://www.asos.com/search/?q=jeans')
    await eyes.open(browser, this.test.parent.title, 'checkWindow.fully on IE11')
    let plp = await browser.$('#chrome-app-container')
    await plp.waitForExist()

    let welcomeMessage = await browser.$('#chrome-welcome-mat > div > div > button')
    await welcomeMessage.click()

    await eyes.check(
      'Search landing page',
      Target.region(By.css('#chrome-app-container'))
        //.scrollRootElement(By.cssSelector('#chrome-app-container'))
        .fully()
        .timeout(0),
    )
    await eyes.close(false)
  })
})
