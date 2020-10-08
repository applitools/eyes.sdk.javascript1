const assert = require('assert')
const {getElementInnerOffset} = require('../dist/index')

describe('getElementInnerOffset', () => {
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
      await page.evaluate(element => {
        element.style.transform = 'translate(-10px, -11px)'
        element.scrollTo(10, 11)
      }, element)
      const offset = await page.evaluate(getElementInnerOffset, [element])
      assert.deepStrictEqual(offset, {x: 20, y: 22})
    })

    it('default element', async () => {
      await page.goto(url)
      await page.evaluate(() => {
        document.documentElement.style.transform = 'translate(-10px, -11px)'
        document.documentElement.scrollTo(10, 11)
      })
      const offset = await page.evaluate(getElementInnerOffset)
      assert.deepStrictEqual(offset, {x: 20, y: 22})
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
        await driver.execute(function(element) {
          element.style.transform = 'translate(-10px, -11px)'
          element.scrollLeft = 10
          element.scrollTop = 11
        }, element)
        const offset = await driver.execute(getElementInnerOffset, [element])
        assert.deepStrictEqual(offset, {x: 20, y: 22})
      })

      it('default element', async () => {
        await driver.url(url)
        await driver.execute(function() {
          document.documentElement.style.transform = 'translate(-10px, -11px)'
          document.documentElement.scrollLeft = 10
          document.documentElement.scrollTop = 11
        })
        const offset = await driver.execute(getElementInnerOffset)
        assert.deepStrictEqual(offset, {x: 20, y: 22})
      })
    })
  }
})
