const assert = require('assert')
const {isElementScrollable} = require('../dist/index')

describe('isElementScrollable', () => {
  const url = 'https://applitools.github.io/demo/TestPages/SnippetsTestPage/'

  describe('chrome', () => {
    let page

    before(async function() {
      page = await global.getDriver('chrome')
      if (!page) {
        this.skip()
      }
    })

    it('scrollable element', async () => {
      await page.goto(url)
      const element = await page.$('#scrollable')
      const isScrollable = await page.evaluate(isElementScrollable, [element])
      assert.ok(isScrollable)
    })

    it('not scrollable element', async () => {
      await page.goto(url)
      const element = await page.$('#static')
      const isScrollable = await page.evaluate(isElementScrollable, [element])
      assert.ok(!isScrollable)
    })
  })

  for (const name of ['internet explorer', 'ios safari']) {
    describe(name, () => {
      let driver

      before(async function() {
        driver = await global.getDriver(name)
        if (!driver) {
          this.skip()
        }
      })

      it('scrollable element', async () => {
        await driver.url(url)
        const element = await driver.$('#scrollable')
        const isScrollable = await driver.execute(isElementScrollable, [element])
        assert.ok(isScrollable)
      })

      it('not scrollable element', async () => {
        await driver.url(url)
        const element = await driver.$('#static')
        const isScrollable = await driver.execute(isElementScrollable, [element])
        assert.ok(!isScrollable)
      })
    })
  }
})
