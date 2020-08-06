const playwright = require('playwright')
const assert = require('assert')
const {isElementScrollable} = require('../dist/index')

describe('isElementScrollable', () => {
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

    it('scrollable element', async () => {
      await page.goto(url)
      const element = await page.$('#scrollable')
      const isScrollable = await page.evaluate(isElementScrollable, {element})
      assert.ok(isScrollable)
    })

    it('not scrollable element', async () => {
      await page.goto(url)
      const element = await page.$('#static')
      const isScrollable = await page.evaluate(isElementScrollable, {element})
      assert.ok(!isScrollable)
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

    it('scrollable element', async () => {
      await driver.url(url)
      const element = await driver.$('#scrollable')
      const isScrollable = await driver.execute(isElementScrollable, {element})
      assert.ok(isScrollable)
    })

    it('not scrollable element', async () => {
      await driver.url(url)
      const element = await driver.$('#static')
      const isScrollable = await driver.execute(isElementScrollable, {element})
      assert.ok(!isScrollable)
    })
  })
})
