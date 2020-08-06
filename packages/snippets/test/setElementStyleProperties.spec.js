const playwright = require('playwright')
const assert = require('assert')
const {setElementStyleProperties} = require('../dist/index')

describe('setElementStyleProperties', () => {
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

    it('set element style properties', async () => {
      await page.goto(url)
      const element = await page.$('#scrollable')
      const {overflow} = await page.evaluate(setElementStyleProperties, {
        element,
        properties: {overflow: 'hidden'},
      })
      assert.deepStrictEqual(overflow, '')
      const actualOverflow = await page.evaluate(element => element.style.overflow, element)
      assert.deepStrictEqual(actualOverflow, 'hidden')
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

    it('set element style properties', async () => {
      await driver.url(url)
      const element = await driver.$('#scrollable')
      const {overflow} = await driver.execute(setElementStyleProperties, {
        element,
        properties: {overflow: 'hidden'},
      })
      assert.deepStrictEqual(overflow, '')
      const actualOverflow = await driver.execute(function(element) {
        return element.style.overflow
      }, element)
      assert.deepStrictEqual(actualOverflow, 'hidden')
    })
  })
})
