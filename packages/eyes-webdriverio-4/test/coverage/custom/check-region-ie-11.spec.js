// Trello 211
// https://trello.com/c/jRumCWJp/211-wdio4-the-checkregion-for-ie11-is-not-captured-correctly
const {remote} = require('webdriverio')
const {By, Target, Eyes /* , ConsoleLogHandler */} = require('../../../index')

describe('Check Region IE11', () => {
  let eyes
  let driver

  beforeEach(async () => {
    const browserOptions = {
      host: 'hub-cloud.browserstack.com',
      user: process.env.BROWSERSTACK_USERNAME,
      key: process.env.BROWSERSTACK_ACCESS_KEY,
      desiredCapabilities: {
        os: 'Windows',
        os_version: '10',
        browser: 'IE',
        browser_version: '11.0',
      },
    }
    driver = remote(browserOptions)
    await driver.init()
    eyes = new Eyes()
    // eyes.setLogHandler(new ConsoleLogHandler(true))
    eyes.setApiKey(process.env.APPLITOOLS_API_KEY)
  })

  afterEach(async () => {
    driver & (await driver.end())
    eyes && (await eyes.abortIfNotClosed())
  })

  it('captures an image of the element', async function() {
    await driver.url('https://applitools.com/helloworld')
    await eyes.open(driver, this.test.parent.title, this.test.title)
    await eyes.check(undefined, Target.region(By.css('.section:nth-of-type(2)')))
    await eyes.close()
  })
})
