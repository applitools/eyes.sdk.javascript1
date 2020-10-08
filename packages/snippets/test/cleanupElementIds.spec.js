const assert = require('assert')
const {cleanupElementIds, markElements} = require('../dist/index')

describe('cleanupElementIds', () => {
  const url = 'https://applitools.github.io/demo/TestPages/SnippetsTestPage/'

  describe('chrome', () => {
    let page

    before(async function() {
      page = await global.getDriver('chrome')
      if (!page) {
        this.skip()
      }
    })

    it('cleanupElementIds', async () => {
      await page.goto(url)
      const elements = await page.$$('#scrollable,#static,#fixed')
      const ids = ['aaa', 'bbb', 'ccc']
      await page.evaluate(markElements, [elements, ids])
      const selector =
        '[data-eyes-selector="aaa"],[data-eyes-selector="bbb"],[data-eyes-selector="ccc"]'
      const markedElements = await page.$$(selector)
      assert.strictEqual(markedElements.length, 3)
      await page.evaluate(cleanupElementIds, [elements])
      const markedElementsAfterCleanup = await page.$$(selector)
      assert.strictEqual(markedElementsAfterCleanup.length, 0)
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

      it('cleanupElementIds', async () => {
        await driver.url(url)
        const elements = await driver.$$('#scrollable,#static,#fixed')
        const ids = ['aaa', 'bbb', 'ccc']
        await driver.execute(markElements, [elements, ids])
        const selector =
          '[data-eyes-selector="aaa"],[data-eyes-selector="bbb"],[data-eyes-selector="ccc"]'
        const markedElements = await driver.$$(selector)
        assert.strictEqual(markedElements.length, 3)
        await driver.execute(cleanupElementIds, [elements])
        const markedElementsAfterCleanup = await driver.$$(selector)
        assert.strictEqual(markedElementsAfterCleanup.length, 0)
      })
    })
  }
})
