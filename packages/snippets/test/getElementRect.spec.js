const assert = require('assert')
const {getElementRect} = require('../dist/index')

describe('getElementRect', () => {
  const url = 'https://applitools.github.io/demo/TestPages/SnippetsTestPage/'

  describe('chrome', () => {
    let page

    before(async function() {
      page = await global.getDriver('chrome')
      if (!page) {
        this.skip()
      }
    })

    it('return static element client rect', async () => {
      await page.goto(url)
      const element = await page.$('#static')
      const offset = await page.evaluate(getElementRect, [element, true])
      assert.deepStrictEqual(offset, {x: 303, y: 3, width: 294, height: 294})
    })

    it('return static element rect', async () => {
      await page.goto(url)
      const element = await page.$('#static')
      const offset = await page.evaluate(getElementRect, [element])
      assert.deepStrictEqual(offset, {x: 300, y: 0, width: 300, height: 300})
    })

    it('return fixed element rect', async () => {
      await page.goto(url)
      const element = await page.$('#fixed')
      await page.evaluate(() => scrollTo(500, 500))
      const offset = await page.evaluate(getElementRect, [element])
      assert.deepStrictEqual(offset, {x: 500, y: 300, width: 300, height: 300})
    })

    it('return fixed element child rect', async () => {
      await page.goto(url)
      const element = await page.$('#fixed-child')
      await page.evaluate(() => scrollTo(500, 500))
      const offset = await page.evaluate(getElementRect, [element])
      assert.deepStrictEqual(offset, {x: 530, y: 330, width: 240, height: 240})
    })
  })

  for (const name of ['internet explorer', 'ios safari']) {
    const expectedRects = {
      'internet explorer': {
        fixed: {x: 483, y: 283, width: 300, height: 300},
        child: {x: 513, y: 313, width: 240, height: 240},
      },
      'ios safari': {
        fixed: {x: 75, y: 335, width: 300, height: 300},
        child: {x: 105, y: 365, width: 240, height: 240},
      },
    }

    describe(name, () => {
      let driver

      before(async function() {
        driver = await global.getDriver(name)
        if (!driver) {
          this.skip()
        }
      })

      it('return static element client rect', async () => {
        await driver.url(url)
        const element = await driver.$('#static')
        const offset = await driver.execute(getElementRect, [element, true])
        assert.deepStrictEqual(offset, {x: 303, y: 3, width: 294, height: 294})
      })

      it('return static element rect', async () => {
        await driver.url(url)
        const element = await driver.$('#static')
        const offset = await driver.execute(getElementRect, [element])
        assert.deepStrictEqual(offset, {x: 300, y: 0, width: 300, height: 300})
      })

      it('return fixed element rect', async () => {
        await driver.url(url)
        const element = await driver.$('#fixed')
        await driver.execute('scrollTo(500, 500)')
        const offset = await driver.execute(getElementRect, [element])
        assert.deepStrictEqual(offset, expectedRects[name].fixed)
      })

      it('return fixed element child rect', async () => {
        await driver.url(url)
        const element = await driver.$('#fixed-child')
        await driver.execute('scrollTo(500, 500)')
        const offset = await driver.execute(getElementRect, [element])
        assert.deepStrictEqual(offset, expectedRects[name].child)
      })
    })
  }
})
