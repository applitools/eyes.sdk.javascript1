const playwright = require('playwright')
const assert = require('assert')
const {setElementAttribute} = require('../dist/index')

describe('setElementAttribute', () => {
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

    it('set element attribute', async () => {
      await page.goto(url)
      const element = await page.$('#static')
      await page.evaluate(setElementAttribute, {
        element,
        attr: 'data-attr',
        value: 'some value',
      })
      const actualAttr = await page.evaluate(element => element.getAttribute('data-attr'), element)
      assert.deepStrictEqual(actualAttr, 'some value')
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

    it('set element attribute', async () => {
      await driver.url(url)
      const element = await driver.$('#static')
      await driver.execute(setElementAttribute, {
        element,
        attr: 'data-attr',
        value: 'some value',
      })
      const actualAttr = await driver.execute(function(element) {
        return element.getAttribute('data-attr')
      }, element)
      assert.deepStrictEqual(actualAttr, 'some value')
    })
  })
})
