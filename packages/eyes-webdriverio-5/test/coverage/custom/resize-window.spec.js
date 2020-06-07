// Trello 382
// https://trello.com/c/UBr0w3UF

const {remote} = require('webdriverio')
const {_Target, _By, Eyes} = require('../../..')
const specs = require('../../../src/SpecWrappedDriver')

describe.skip('Check Region IE11', () => {
  let eyes
  let browser

  beforeEach(async () => {
    const browserOptions = {
      capabilities: {
        browserName: 'internet explorer',
        browserVersion: '11.285',
        platformName: 'Windows 10',
        'sauce:options': {
          screenResolution: '1920x1080',
          username: process.env.SAUCE_USERNAME,
          accesskey: process.env.SAUCE_ACCESS_KEY,
        },
      },
    }
    browser = await remote(browserOptions)
  })

  afterEach(async () => {
    await eyes.abortIfNotClosed()
    await browser.deleteSession()
  })

  it('captures an image of the element', async function() {
    const size = await specs.getWindowSize(browser)
  })
})
