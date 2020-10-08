const assert = require('assert')
const {markElements} = require('../dist/index')

describe('markElements', () => {
  const url = 'https://applitools.github.io/demo/TestPages/SnippetsTestPage/'

  describe('chrome', () => {
    let page

    before(async function() {
      page = await global.getDriver('chrome')
      if (!page) {
        this.skip()
      }
    })

    it('markElements', async () => {
      await page.goto(url)
      const elements = await page.$$('#scrollable,#static,#fixed')
      const ids = ['aaa', 'bbb', 'ccc']
      await page.evaluate(markElements, [elements, ids])
      const markedElementIds = await page.evaluate(() =>
        [].map.call(
          document.querySelectorAll(
            '[data-eyes-selector="aaa"],[data-eyes-selector="bbb"],[data-eyes-selector="ccc"]',
          ),
          el => el.id,
        ),
      )
      assert.deepStrictEqual(markedElementIds, ['scrollable', 'static', 'fixed'])
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

      it('markElements', async () => {
        await driver.url(url)
        const elements = await driver.$$('#scrollable,#static,#fixed')
        const ids = ['aaa', 'bbb', 'ccc']
        await driver.execute(markElements, [elements, ids])
        const markedElementIds = await driver.execute(function() {
          return [].map.call(
            document.querySelectorAll('[data-eyes-selector="aaa"],[data-eyes-selector="bbb"],[data-eyes-selector="ccc"]'), // eslint-disable-line
            function(el) { return el.id }// eslint-disable-line
          )
        })
        assert.deepStrictEqual(markedElementIds, ['scrollable', 'static', 'fixed'])
      })
    })
  }
})
