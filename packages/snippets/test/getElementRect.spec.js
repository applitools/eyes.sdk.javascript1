const playwright = require('playwright')
const assert = require('assert')
const {getElementRect} = require('../dist/index')

describe('getElementRect', () => {
  const url = 'https://applitools.github.io/demo/TestPages/SnippetsTestPage/'

  describe('chrome', () => {
    let browser, page

    before(async () => {
      browser = await playwright.chromium.launch()
      const context = await browser.newContext()
      page = await context.newPage()
    })

    after(async () => {
      await browser.close()
    })

    it('return static element client rect', async () => {
      await page.goto(url)
      const element = await page.$('#static')
      const offset = await page.evaluate(getElementRect, {element, isClient: true})
      assert.deepStrictEqual(offset, {x: 303, y: 3, width: 294, height: 294})
    })

    it('return static element rect', async () => {
      await page.goto(url)
      const element = await page.$('#static')
      const offset = await page.evaluate(getElementRect, {element})
      assert.deepStrictEqual(offset, {x: 300, y: 0, width: 300, height: 300})
    })

    it('return fixed element rect', async () => {
      await page.setViewportSize({width: 500, height: 500})
      await page.goto(url)
      const element = await page.$('#fixed')
      await page.evaluate(() => scrollTo(500, 500))
      const offset = await page.evaluate(getElementRect, {element})
      assert.deepStrictEqual(offset, {x: 200, y: 200, width: 300, height: 300})
    })

    it('return fixed element child rect', async () => {
      await page.setViewportSize({width: 500, height: 500})
      await page.goto(url)
      const element = await page.$('#fixed-child')
      await page.evaluate(() => scrollTo(500, 500))
      const offset = await page.evaluate(getElementRect, {element})
      assert.deepStrictEqual(offset, {x: 230, y: 230, width: 240, height: 240})
    })
  })

  describe('ie', () => {
    let driver

    before(async function() {
      driver = global.ieDriver
      if (!driver) {
        this.skip()
      }
    })

    it('return static element client rect', async () => {
      await driver.url(url)
      const element = await driver.$('#static')
      const offset = await driver.execute(getElementRect, {element, isClient: true})
      assert.deepStrictEqual(offset, {x: 303, y: 3, width: 294, height: 294})
    })

    it('return static element rect', async () => {
      await driver.url(url)
      const element = await driver.$('#static')
      const offset = await driver.execute(getElementRect, {element})
      assert.deepStrictEqual(offset, {x: 300, y: 0, width: 300, height: 300})
    })

    it('return fixed element rect', async () => {
      await driver.setWindowSize(500, 500)
      await driver.url(url)
      const element = await driver.$('#fixed')
      await driver.execute('scrollTo(500, 500)')
      const offset = await driver.execute(getElementRect, {element})
      assert.deepStrictEqual(offset, {x: 167, y: 97, width: 300, height: 300})
    })

    it('return fixed element child rect', async () => {
      await driver.setWindowSize(500, 500)
      await driver.url(url)
      const element = await driver.$('#fixed-child')
      await driver.execute('scrollTo(500, 500)')
      const offset = await driver.execute(getElementRect, {element})
      assert.deepStrictEqual(offset, {x: 197, y: 127, width: 240, height: 240})
    })
  })
})
