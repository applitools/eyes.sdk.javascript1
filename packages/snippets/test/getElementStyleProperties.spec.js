const playwright = require('playwright')
const assert = require('assert')
const {getElementStyleProperties} = require('../dist/index')

describe('getElementStyleProperties', () => {
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

    it('return element style properties', async () => {
      await page.goto(url)
      const element = await page.$('#static')
      await page.evaluate(element => (element.style.backgroundColor = 'red'), element)
      const {backgroundColor} = await page.evaluate(getElementStyleProperties, {
        element,
        properties: ['backgroundColor'],
      })
      assert.deepStrictEqual(backgroundColor, 'red')
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

    it('return element style properties', async () => {
      await driver.url(url)
      const element = await driver.$('#static')
      await driver.execute(function(element) {
        element.style.backgroundColor = 'red'
      }, element)
      const {backgroundColor} = await driver.execute(getElementStyleProperties, {
        element,
        properties: ['backgroundColor'],
      })
      assert.deepStrictEqual(backgroundColor, 'red')
    })
  })
})
