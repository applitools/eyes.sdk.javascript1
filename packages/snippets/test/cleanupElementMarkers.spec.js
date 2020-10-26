const assert = require('assert')
const {cleanupElementMarkers, setElementMarkers} = require('../dist/index')

describe('cleanupElementMarkers', () => {
  const url = 'https://applitools.github.io/demo/TestPages/SnippetsTestPage/'

  describe('chrome', () => {
    let page

    before(async function() {
      page = await global.getDriver('chrome')
      if (!page) {
        this.skip()
      }
    })

    it('cleanupElementMarkers', async () => {
      await page.goto(url)
      const elements = await page.$$('#scrollable,#static,#fixed')
      const ids = ['1', '2', '3']
      await page.evaluate(setElementMarkers, [elements, ids])
      const selector = ids.map(id => `[data-applitools-marker="${id}"]`).join(', ')
      const markedElements = await page.$$(selector)
      assert.strictEqual(markedElements.length, 3)
      await page.evaluate(cleanupElementMarkers, [elements])
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

      it('cleanupElementMarkers', async () => {
        await driver.url(url)
        const elements = await driver.$$('#scrollable,#static,#fixed')
        const ids = ['1', '2', '3']
        await driver.execute(setElementMarkers, [elements, ids])
        const selector = ids.map(id => `[data-applitools-marker="${id}"]`).join(', ')
        const markedElements = await driver.$$(selector)
        assert.strictEqual(markedElements.length, 3)
        await driver.execute(cleanupElementMarkers, [elements])
        const markedElementsAfterCleanup = await driver.$$(selector)
        assert.strictEqual(markedElementsAfterCleanup.length, 0)
      })
    })
  }
})
