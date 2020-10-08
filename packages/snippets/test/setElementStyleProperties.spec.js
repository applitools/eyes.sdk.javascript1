const assert = require('assert')
const {setElementStyleProperties} = require('../dist/index')

describe('setElementStyleProperties', () => {
  const url = 'https://applitools.github.io/demo/TestPages/SnippetsTestPage/'

  describe('chrome', () => {
    let page

    before(async function() {
      page = await global.getDriver('chrome')
      if (!page) {
        this.skip()
      }
    })

    it('set element style properties', async () => {
      await page.goto(url)
      const element = await page.$('#scrollable')
      const {overflow} = await page.evaluate(setElementStyleProperties, [
        element,
        {overflow: 'hidden'},
      ])
      assert.deepStrictEqual(overflow, {value: '', important: false})
      const actualOverflow = await page.evaluate(element => element.style.overflow, element)
      assert.deepStrictEqual(actualOverflow, 'hidden')
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

      it('set element style properties', async () => {
        await driver.url(url)
        const element = await driver.$('#scrollable')
        const {overflow} = await driver.execute(setElementStyleProperties, [
          element,
          {overflow: 'hidden'},
        ])
        assert.deepStrictEqual(overflow, {value: '', important: false})
        const actualOverflow = await driver.execute(function(element) {
          return element.style.overflow
        }, element)
        assert.deepStrictEqual(actualOverflow, 'hidden')
      })
    })
  }
})
