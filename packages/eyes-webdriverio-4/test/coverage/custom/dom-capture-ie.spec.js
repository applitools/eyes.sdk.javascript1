// re: https://trello.com/c/EQD3JUOf
const {remote} = require('webdriverio')
const {Eyes, Target} = require('../../..')
const {assertImage} = require('./util/ApiAssertions')

describe('JS Coverage Tests - WDIO4', async () => {
  let eyes
  let browser

  before(async () => {
    const browserOptions = {
      host: 'ondemand.saucelabs.com',
      hostname: 'ondemand.saucelabs.com',
      port: 80,
      path: '/wd/hub',
      desiredCapabilities: {
        browserName: 'internet explorer',
        browserVersion: '11.285',
        platformName: 'Windows 10',
        username: process.env.SAUCE_USERNAME,
        accesskey: process.env.SAUCE_ACCESS_KEY,
        screenResolution: '1920x1080',
      },
    }
    browser = remote(browserOptions)
    await browser.init()
    eyes = new Eyes()
    eyes.setLogHandler()
  })

  after(async () => {
    await browser.end()
    await eyes.abortIfNotClosed()
  })

  it('dom-capture-ie-11', async function() {
    eyes.setMatchTimeout(0)
    await browser.url('http://applitools-dom-capture-origin-1.surge.sh/ie.html')
    await eyes.open(browser, this.test.parent.title, 'dom-capture-ie-11')
    await eyes.check(undefined, Target.window())
    const results = await eyes.close(false)
    await assertImage(results, {
      hasDom: true,
    })
  })
})
