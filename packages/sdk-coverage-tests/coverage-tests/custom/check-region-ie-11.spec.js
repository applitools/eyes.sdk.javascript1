// Trello 211
// https://trello.com/c/jRumCWJp/211-wdio4-the-checkregion-for-ie11-is-not-captured-correctly

const cwd = process.cwd()
const path = require('path')
const spec = require(path.resolve(cwd, 'src/SpecWrappedDriver'))
const {Target} = require(cwd)
const {getEyes, sauceUrl} = require('../util/TestSetup')

describe('Check Region IE11', () => {
  let eyes
  let driver

  beforeEach(async () => {
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
    driver = await spec.build({capabilities, serverUrl: sauceUrl})
    eyes = getEyes()
  })

  afterEach(async () => {
    await spec.cleanup(driver)
    await eyes.abortIfNotClosed()
  })

  it('captures an image of the element', async function() {
    await spec.visit(driver, 'https://applitools.com/helloworld')
    await eyes.open(driver, this.test.parent.title, this.test.title)
    await eyes.check(undefined, Target.region('.section:nth-of-type(2)'))
    await eyes.close()
  })
})
