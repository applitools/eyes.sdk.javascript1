const playwright = require('playwright')
const assert = require('assert')
const {blurElement} = require('../dist/index')

describe('blurElement', () => {
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

    it('blur element', async () => {
      await page.goto(url)
      const element = await page.$('#focusable')
      await element.click()
      const isFocused = await page.evaluate(element => element === document.activeElement, element)
      assert.ok(isFocused)
      await page.evaluate(blurElement, {element})
      const isBlurred = await page.evaluate(element => element !== document.activeElement, element)
      assert.ok(isBlurred)
    })

    it('blur active element', async () => {
      await page.goto(url)
      const element = await page.$('#focusable')
      await element.click()
      const isFocused = await page.evaluate(element => element === document.activeElement, element)
      assert.ok(isFocused)
      await page.evaluate(blurElement)
      const isBlurred = await page.evaluate(element => element !== document.activeElement, element)
      assert.ok(isBlurred)
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

    it('blur element', async () => {
      await driver.url(url)
      const element = await driver.$('#focusable')
      await element.click()
      const isFocused = await driver.execute(function(element) {
        return element === document.activeElement
      }, element)
      assert.ok(isFocused)
      await driver.execute(blurElement, {element})
      const isBlurred = await driver.execute(function(element) {
        return element !== document.activeElement
      }, element)
      assert.ok(isBlurred)
    })

    it('blur active element', async () => {
      await driver.url(url)
      const element = await driver.$('#focusable')
      await element.click()
      const isFocused = await driver.execute(function(element) {
        return element === document.activeElement
      }, element)
      assert.ok(isFocused)
      await driver.execute(blurElement)
      const isBlurred = await driver.execute(function(element) {
        return element !== document.activeElement
      }, element)
      assert.ok(isBlurred)
    })
  })
})
