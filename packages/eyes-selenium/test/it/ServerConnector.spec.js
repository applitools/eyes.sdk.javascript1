'use strict'

require('chromedriver')
const {getDriver} = require('../coverage/custom/util/TestSetup')
const {Eyes, Target, RectangleSize} = require('../../index')

let /** @type {WebDriver} */ driver, /** @type {Eyes} */ eyes
describe('ServerConnector', () => {
  before(async () => {
    driver = await getDriver('CHROME')
    eyes = new Eyes()
  })

  it('deleteSession', async function() {
    await eyes.open(
      driver,
      this.test.parent.title,
      this.test.title,
      new RectangleSize({width: 800, height: 599}),
    )

    await driver.get('https://applitools.com/helloworld')

    await eyes.check('Hello', Target.window())

    const results = await eyes.close()

    await results.deleteSession()
  })

  afterEach(async () => {
    await driver.quit()
    await eyes.abort()
  })
})
