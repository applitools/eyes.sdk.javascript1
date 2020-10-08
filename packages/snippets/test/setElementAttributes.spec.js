const assert = require('assert')
const {setElementAttributes} = require('../dist/index')

describe('setElementAttributes', () => {
  const url = 'https://applitools.github.io/demo/TestPages/SnippetsTestPage/'

  describe('chrome', () => {
    let page

    before(async function() {
      page = await global.getDriver('chrome')
      if (!page) {
        this.skip()
      }
    })

    it('set element attribute', async () => {
      await page.goto(url)
      const element = await page.$('#static')
      await page.evaluate(setElementAttributes, [element, {'data-attr': 'some value'}])
      const actualAttr = await page.evaluate(element => element.getAttribute('data-attr'), element)
      assert.deepStrictEqual(actualAttr, 'some value')
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

      it('set element attribute', async () => {
        await driver.url(url)
        const element = await driver.$('#static')
        await driver.execute(setElementAttributes, [element, {'data-attr': 'some value'}])
        const actualAttr = await driver.execute(function(element) {
          return element.getAttribute('data-attr')
        }, element)
        assert.deepStrictEqual(actualAttr, 'some value')
      })
    })
  }
})
