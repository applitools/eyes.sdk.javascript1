const assert = require('assert')
const {getElementComputedStyleProperties} = require('../dist/index')

describe('getElementComputedStyleProperties', () => {
  const url = 'https://applitools.github.io/demo/TestPages/SnippetsTestPage/'

  describe('chrome', () => {
    let page

    before(async function() {
      page = await global.getDriver('chrome')
      if (!page) {
        this.skip()
      }
    })

    it('return element computed style properties', async () => {
      await page.goto(url)
      const element = await page.$('#static')
      const computedStyleProperties = await page.evaluate(getElementComputedStyleProperties, [
        element,
        ['background-color', 'border-top-width'],
      ])
      assert.deepStrictEqual(computedStyleProperties, ['rgb(0, 128, 128)', '3px'])
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

      it('return element computed style properties', async () => {
        await driver.url(url)
        const element = await driver.$('#static')
        const computedStyleProperties = await driver.execute(getElementComputedStyleProperties, [
          element,
          ['background-color', 'border-top-width'],
        ])
        assert.deepStrictEqual(computedStyleProperties, ['rgb(0, 128, 128)', '3px'])
      })
    })
  }
})
