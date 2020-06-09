'use strict'

require('chromedriver')
const {getDriver} = require('../coverage/custom/util/TestSetup')
const {Eyes, Target, ConsoleLogHandler, StitchMode} = require('../../index')

let /** @type {WebDriver} */ driver, /** @type {Eyes} */ eyes
describe('Check CSS Stitching', () => {
  before(async () => {
    driver = await getDriver('CHROME')

    eyes = new Eyes()
    eyes.setLogHandler(new ConsoleLogHandler(false))
    eyes.setStitchMode(StitchMode.CSS)
  })

  beforeEach(async function() {
    driver = await eyes.open(driver, this.test.parent.title, this.currentTest.title, {
      width: 600,
      height: 500,
    })
  })

  it('with check window', async () => {
    await driver.get('https://applitools.github.io/demo/TestPages/FramesTestPage/')
    await eyes.check('Window', Target.window().fully())
    return eyes.close()
  })

  it('works for pages with bottom popup', async () => {
    await driver.get('https://applitools.github.io/demo/TestPages/PopupTestPage/')
    await eyes.check('Window', Target.window().fully())
    return eyes.close()
  })

  afterEach(async () => eyes.abort())

  after(() => driver.quit())
})
