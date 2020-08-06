const playwright = require('playwright')
const assert = require('assert')
const {getDocumentSize} = require('../dist/index')

describe('getDocumentSize', () => {
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

    it('return document size', async () => {
      await page.goto(url)
      const size = await page.evaluate(getDocumentSize)
      assert.deepStrictEqual(size, {width: 3000, height: 3000})
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

    it('return document size', async () => {
      await driver.url(url)
      const size = await driver.execute(getDocumentSize)
      assert.deepStrictEqual(size, {width: 3000, height: 3000})
    })
  })
})
