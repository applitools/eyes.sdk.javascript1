const assert = require('assert')
const {getElementProperties} = require('../dist/index')

describe('getElementProperties', () => {
  const url = 'https://applitools.github.io/demo/TestPages/SnippetsTestPage/'

  describe('chrome', () => {
    let page

    before(async function() {
      page = await global.getDriver('chrome')
      if (!page) {
        this.skip()
      }
    })

    it('return element properties', async () => {
      await page.goto(url)
      const element = await page.$('#static')
      const {tagName} = await page.evaluate(getElementProperties, [element, ['tagName']])
      assert.deepStrictEqual(tagName, 'DIV')
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

      it('return element properties', async () => {
        await driver.url(url)
        const element = await driver.$('#static')
        const {tagName} = await driver.execute(getElementProperties, [element, ['tagName']])
        assert.deepStrictEqual(tagName, 'DIV')
      })
    })
  }
})
