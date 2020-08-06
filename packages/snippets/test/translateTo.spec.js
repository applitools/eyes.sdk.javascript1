const playwright = require('playwright')
const assert = require('assert')
const {translateTo} = require('../dist/index')

describe('translateTo', () => {
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
      await page.evaluate(translateTo, {element, offset: {x: 10, y: 11}})
      const transforms = await page.evaluate(
        element => ({
          transform: element.style.transform,
          webkitTransform: element.style.webkitTransform,
        }),
        element,
      )
      assert.deepStrictEqual(transforms, {
        transform: 'translate(-10px, -11px)',
        webkitTransform: 'translate(-10px, -11px)',
      })
    })

    it('default element', async () => {
      await page.goto(url)
      await page.evaluate(translateTo, {offset: {x: 10, y: 11}})
      const transforms = await page.evaluate(() => ({
        transform: document.documentElement.style.transform,
        webkitTransform: document.documentElement.style.webkitTransform,
      }))
      assert.deepStrictEqual(transforms, {
        transform: 'translate(-10px, -11px)',
        webkitTransform: 'translate(-10px, -11px)',
      })
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
      await driver.execute(translateTo, {element, offset: {x: 10, y: 11}})
      const transforms = await driver.execute(function(element) {
        return {
          transform: element.style.transform,
          webkitTransform: element.style.webkitTransform,
        }
      }, element)
      assert.deepStrictEqual(transforms, {
        transform: 'translate(-10px, -11px)',
        webkitTransform: 'translate(-10px, -11px)',
      })
    })

    it('default element', async () => {
      await driver.url(url)
      await driver.execute(translateTo, {offset: {x: 10, y: 11}})
      const transforms = await driver.execute(function() {
        return {
          transform: document.documentElement.style.transform,
          webkitTransform: document.documentElement.style.webkitTransform,
        }
      })
      assert.deepStrictEqual(transforms, {
        transform: 'translate(-10px, -11px)',
        webkitTransform: 'translate(-10px, -11px)',
      })
    })
  })
})
