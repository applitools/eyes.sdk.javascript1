const assert = require('assert')
const {getDocumentSize} = require('../dist/index')

describe('getDocumentSize', () => {
  const url = 'https://applitools.github.io/demo/TestPages/SnippetsTestPage/'

  describe('chrome', () => {
    let page

    before(async function() {
      page = await global.getDriver('chrome')
      if (!page) {
        this.skip()
      }
    })

    it('return document size', async () => {
      await page.goto(url)
      const size = await page.evaluate(getDocumentSize)
      assert.deepStrictEqual(size, {width: 3000, height: 3000})
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

      it('return document size', async () => {
        await driver.url(url)
        const size = await driver.execute(getDocumentSize)
        assert.deepStrictEqual(size, {width: 3000, height: 3000})
      })
    })
  }
})
