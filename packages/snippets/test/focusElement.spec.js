const assert = require('assert')
const {focusElement} = require('../dist/index')

describe('focusElement', () => {
  const url = 'https://applitools.github.io/demo/TestPages/SnippetsTestPage/'

  describe('chrome', () => {
    let page

    before(async function() {
      page = await global.getDriver('chrome')
      if (!page) {
        this.skip()
      }
    })

    it('focus element', async () => {
      await page.goto(url)
      const element = await page.$('#focusable')
      const isBlurred = await page.evaluate(element => element !== document.activeElement, element)
      assert.ok(isBlurred)
      await page.evaluate(focusElement, [element])
      const isFocused = await page.evaluate(element => element === document.activeElement, element)
      assert.ok(isFocused)
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

      it('focus element', async () => {
        await driver.url(url)
        const element = await driver.$('#focusable')
        const isBlurred = await driver.execute(function(element) {
          return element !== document.activeElement
        }, element)
        assert.ok(isBlurred)
        await driver.execute(focusElement, [element])
        const isFocused = await driver.execute(function(element) {
          return element === document.activeElement
        }, element)
        assert.ok(isFocused)
      })
    })
  }
})
