const playwright = require('playwright')
const assert = require('assert')
const {getElementContentSize} = require('../dist/index')

describe('getElementContentSize', () => {
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

    it('return size of scrollable element', async () => {
      await page.goto(url)
      const element = await page.$('#scrollable')
      const size = await page.evaluate(getElementContentSize, {element})
      assert.deepStrictEqual(size, {width: 600, height: 600})
    })

    it('return size of static element', async () => {
      await page.goto(url)
      const element = await page.$('#static')
      const size = await page.evaluate(getElementContentSize, {element})
      assert.deepStrictEqual(size, {width: 294, height: 294})
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

    it('return size of scrollable element', async () => {
      await driver.url(url)
      const element = await driver.$('#scrollable')
      const size = await driver.execute(getElementContentSize, {element})
      assert.deepStrictEqual(size, {width: 566, height: 566})
    })

    it('return size of static element', async () => {
      await driver.url(url)
      const element = await driver.$('#static')
      const size = await driver.execute(getElementContentSize, {element})
      assert.deepStrictEqual(size, {width: 294, height: 294})
    })
  })
})
