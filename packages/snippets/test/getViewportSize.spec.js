const assert = require('assert')
const {getViewportSize} = require('../dist/index')

describe('getViewportSize', () => {
  const url = 'https://applitools.github.io/demo/TestPages/SnippetsTestPage/'

  describe('chrome', () => {
    let page

    before(async function() {
      page = await global.getDriver('chrome')
      if (!page) {
        this.skip()
      }
    })

    it('return viewport size', async () => {
      await page.goto(url)
      const viewportSize = await page.evaluate(getViewportSize)
      assert.deepStrictEqual(viewportSize, {width: 800, height: 600})
    })
  })

  for (const name of ['internet explorer', 'ios safari']) {
    const expectedViewportSizes = {
      'internet explorer': {width: 800, height: 600},
      'ios safari': {width: 375, height: 635},
    }

    describe(name, () => {
      let driver

      before(async function() {
        driver = await global.getDriver(name)
        if (!driver) {
          this.skip()
        }
      })

      it('return viewport size', async () => {
        await driver.url(url)
        const viewportSize = await driver.execute(getViewportSize)
        assert.deepStrictEqual(viewportSize, expectedViewportSizes[name])
      })
    })
  }
})
