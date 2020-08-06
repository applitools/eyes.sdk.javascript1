const playwright = require('playwright')
const assert = require('assert')
const {getElementScrollOffset} = require('../dist/index')

describe('getElementScrollOffset', () => {
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

    it('specific element', async () => {
      await page.goto(url)
      const element = await page.$('#scrollable')
      await page.evaluate(element => element.scrollTo(10, 11), element)
      const offset = await page.evaluate(getElementScrollOffset, {element})
      assert.deepStrictEqual(offset, {x: 10, y: 11})
    })

    it('default element', async () => {
      await page.goto(url)
      await page.evaluate(() => document.documentElement.scrollTo(10, 11))
      const offset = await page.evaluate(getElementScrollOffset)
      assert.deepStrictEqual(offset, {x: 10, y: 11})
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

    it('specific element', async () => {
      await driver.url(url)
      const element = await driver.$('#scrollable')
      await driver.execute(function(element) {
        element.scrollLeft = 10
        element.scrollTop = 11
      }, element)
      const offset = await driver.execute(getElementScrollOffset, {element})
      assert.deepStrictEqual(offset, {x: 10, y: 11})
    })

    it('default element', async () => {
      await driver.url(url)
      await driver.execute(function() {
        document.documentElement.scrollLeft = 10
        document.documentElement.scrollTop = 11
      })
      const offset = await driver.execute(getElementScrollOffset)
      assert.deepStrictEqual(offset, {x: 10, y: 11})
    })
  })
})
