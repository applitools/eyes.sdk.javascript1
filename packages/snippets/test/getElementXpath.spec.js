const playwright = require('playwright')
const assert = require('assert')
const {getElementXpath} = require('../dist/index')

describe('getElementXpath', () => {
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

    it('return element xpath', async () => {
      await page.goto(url)
      const frame = await page.frame('frame')
      const element = await frame.$('.b4')
      const xpath = await frame.evaluate(getElementXpath, {element})
      assert.deepStrictEqual(xpath, '/HTML[1]/BODY[1]/DIV[1]/DIV[1]/DIV[1]/DIV[1]')
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

    it('return element xpath', async () => {
      await driver.url(url)
      await driver.switchToFrame(await driver.$('iframe[name="frame"]'))
      const element = await driver.$('.b4')
      const xpath = await driver.execute(getElementXpath, {element})
      assert.deepStrictEqual(xpath, '/HTML[1]/BODY[1]/DIV[1]/DIV[1]/DIV[1]/DIV[1]')
    })
  })
})
