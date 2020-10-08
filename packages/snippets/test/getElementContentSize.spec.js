const assert = require('assert')
const {getElementContentSize} = require('../dist/index')

describe('getElementContentSize', () => {
  const url = 'https://applitools.github.io/demo/TestPages/SnippetsTestPage/'

  describe('chrome', () => {
    let page

    before(async function() {
      page = await global.getDriver('chrome')
      if (!page) {
        this.skip()
      }
    })

    it('return size of scrollable element', async () => {
      await page.goto(url)
      const element = await page.$('#scrollable')
      const size = await page.evaluate(getElementContentSize, [element])
      assert.deepStrictEqual(size, {width: 600, height: 600})
    })

    it('return size of static element', async () => {
      await page.goto(url)
      const element = await page.$('#static')
      const size = await page.evaluate(getElementContentSize, [element])
      assert.deepStrictEqual(size, {width: 294, height: 294})
    })
  })

  for (const name of ['internet explorer', 'ios safari']) {
    const expectedSizes = {
      'internet explorer': {width: 566, height: 566},
      'ios safari': {width: 600, height: 600},
    }

    describe(name, () => {
      let driver

      before(async function() {
        driver = await global.getDriver(name)
        if (!driver) {
          this.skip()
        }
      })

      it('return size of scrollable element', async () => {
        await driver.url(url)
        const element = await driver.$('#scrollable')
        const size = await driver.execute(getElementContentSize, [element])
        assert.deepStrictEqual(size, expectedSizes[name])
      })

      it('return size of static element', async () => {
        await driver.url(url)
        const element = await driver.$('#static')
        const size = await driver.execute(getElementContentSize, [element])
        assert.deepStrictEqual(size, {width: 294, height: 294})
      })
    })
  }
})
