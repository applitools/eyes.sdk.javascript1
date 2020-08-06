const playwright = require('playwright')
const assert = require('assert')
const {getElementProperties} = require('../dist/index')

describe('getElementProperties', () => {
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

    it('return element properties', async () => {
      await page.goto(url)
      const element = await page.$('#static')
      const {tagName} = await page.evaluate(getElementProperties, {
        element,
        properties: ['tagName'],
      })
      assert.deepStrictEqual(tagName, 'DIV')
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

    it('return element properties', async () => {
      await driver.url(url)
      const element = await driver.$('#static')
      const {tagName} = await driver.execute(getElementProperties, {
        element,
        properties: ['tagName'],
      })
      assert.deepStrictEqual(tagName, 'DIV')
    })
  })
})
