const playwright = require('playwright')
const assert = require('assert')
const {scrollTo} = require('../dist/index')

describe('scrollTo', () => {
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
      await page.evaluate(scrollTo, {element, offset: {x: 10, y: 11}})
      const offset = await page.evaluate(
        element => ({x: element.scrollLeft, y: element.scrollTop}),
        element,
      )
      assert.deepStrictEqual(offset, {x: 10, y: 11})
    })

    it('default element', async () => {
      await page.goto(url)
      await page.evaluate(scrollTo, {offset: {x: 10, y: 11}})
      const offset = await page.evaluate(() => ({
        x: document.documentElement.scrollLeft,
        y: document.documentElement.scrollTop,
      }))
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
      await driver.execute(scrollTo, {element, offset: {x: 10, y: 11}})
      const offset = await driver.execute(function(element) {
        return {x: element.scrollLeft, y: element.scrollTop}
      }, element)
      assert.deepStrictEqual(offset, {x: 10, y: 11})
    })

    it('default element', async () => {
      await driver.url(url)
      await driver.execute(scrollTo, {offset: {x: 10, y: 11}})
      const offset = await driver.execute(function() {
        return {
          x: document.documentElement.scrollLeft,
          y: document.documentElement.scrollTop,
        }
      })
      assert.deepStrictEqual(offset, {x: 10, y: 11})
    })
  })
})
