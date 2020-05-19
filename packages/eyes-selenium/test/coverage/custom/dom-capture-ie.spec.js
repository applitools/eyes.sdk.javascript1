// re: https://trello.com/c/EQD3JUOf
const {Builder} = require('selenium-webdriver')
const {Eyes, Target} = require('../../..')
const {assertImage} = require('./util/ApiAssertions')
const {sauceUrl} = require('./util/TestSetup')

describe('JS Coverage Tests - Selenium 4', async () => {
  let eyes
  let driver

  before(async () => {
    const capabilities = {
      browserName: 'internet explorer',
      browserVersion: '11.285',
      platformName: 'Windows 10',
      'sauce:options': {
        screenResolution: '1920x1080',
        username: process.env.SAUCE_USERNAME,
        accesskey: process.env.SAUCE_ACCESS_KEY,
      },
    }
    driver = await new Builder()
      .withCapabilities(capabilities)
      .usingServer(sauceUrl)
      .build()
    eyes = new Eyes()
  })

  after(async () => {
    await driver.quit()
    await eyes.abortIfNotClosed()
  })

  it('dom-capture-ie-11', async function() {
    eyes.setMatchTimeout(0)
    await driver.get('http://applitools-dom-capture-origin-1.surge.sh/ie.html')
    await eyes.open(driver, this.test.parent.title, 'dom-capture-ie-11')
    await eyes.check(undefined, Target.window())
    const results = await eyes.close(false)
    await assertImage(results, {
      hasDom: true,
    })
  })
})
