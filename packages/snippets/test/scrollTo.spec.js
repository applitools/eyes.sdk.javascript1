const assert = require('assert')
const {scrollTo} = require('../dist/index')

describe('scrollTo', () => {
  const url = 'https://applitools.github.io/demo/TestPages/SnippetsTestPage/'

  describe('chrome', () => {
    let page

    before(async function() {
      page = await global.getDriver('chrome')
      if (!page) {
        this.skip()
      }
    })

    it('specific element', async () => {
      await page.goto(url)
      const element = await page.$('#scrollable')
      await page.evaluate(scrollTo, [element, {x: 10, y: 11}])
      const offset = await page.evaluate(
        element => ({x: element.scrollLeft, y: element.scrollTop}),
        element,
      )
      assert.deepStrictEqual(offset, {x: 10, y: 11})
    })

    it('default element', async () => {
      await page.goto(url)
      await page.evaluate(scrollTo, [undefined, {x: 10, y: 11}])
      const offset = await page.evaluate(() => ({
        x: document.documentElement.scrollLeft,
        y: document.documentElement.scrollTop,
      }))
      assert.deepStrictEqual(offset, {x: 10, y: 11})
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

      it('specific element', async () => {
        await driver.url(url)
        const element = await driver.$('#scrollable')
        await driver.execute(scrollTo, [element, {x: 10, y: 11}])
        const offset = await driver.execute(function(element) {
          return {x: element.scrollLeft, y: element.scrollTop}
        }, element)
        assert.deepStrictEqual(offset, {x: 10, y: 11})
      })

      it('default element', async () => {
        await driver.url(url)
        await driver.execute(scrollTo, [undefined, {x: 10, y: 11}])
        const offset = await driver.execute(function() {
          return {
            x: document.documentElement.scrollLeft,
            y: document.documentElement.scrollTop,
          }
        })
        assert.deepStrictEqual(offset, {x: 10, y: 11})
      })
    })
  }
})
