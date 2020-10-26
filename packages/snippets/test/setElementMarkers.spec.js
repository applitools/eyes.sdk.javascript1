const assert = require('assert')
const {setElementMarkers} = require('../dist/index')

describe('setElementMarkers', () => {
  const url = 'https://applitools.github.io/demo/TestPages/SnippetsTestPage/'

  describe('chrome', () => {
    let page

    before(async function() {
      page = await global.getDriver('chrome')
      if (!page) {
        this.skip()
      }
    })

    it('setElementMarkers', async () => {
      await page.goto(url)
      const elements = await page.$$('#scrollable,#static,#fixed')
      const ids = ['1', '2', '3']
      await page.evaluate(setElementMarkers, [elements, ids])
      const results = await page.evaluate(
        ([elements, ids]) =>
          elements.map(
            (element, index) =>
              element === document.querySelector(`[data-applitools-marker="${ids[index]}"]`),
          ),
        [elements, ids],
      )
      assert.deepStrictEqual(results, Array(elements.length).fill(true))
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

      it('setElementMarkers', async () => {
        await driver.url(url)
        const elements = await driver.$$('#scrollable,#static,#fixed')
        const ids = ['1', '2', '3']
        await driver.execute(setElementMarkers, [elements, ids])
        const results = await driver.execute(
          function(elements, ids) {
            return elements.map(function(element, index) {
              return (
                element === document.querySelector('[data-applitools-marker="' + ids[index] + '"]')
              )
            })
          },
          elements,
          ids,
        )
        assert.deepStrictEqual(results, Array(elements.length).fill(true))
      })
    })
  }
})
