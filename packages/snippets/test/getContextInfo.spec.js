const playwright = require('playwright')
const assert = require('assert')
const {getContextInfo} = require('../dist/index')

describe('getContextInfo', () => {
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

    it('return context info', async () => {
      await page.goto(url)
      const frame = await page.frame('frame')
      const contextInfo = await frame.evaluate(getContextInfo)
      const documentElement = await frame.evaluate('document.documentElement')
      assert.deepStrictEqual(contextInfo, {
        isRoot: false,
        isCORS: false,
        selector: '/HTML[1]/BODY[1]/DIV[1]/IFRAME[1]',
        documentElement,
      })
    })

    it('return top context info', async () => {
      await page.goto(url)
      const contextInfo = await page.evaluate(getContextInfo)
      const documentElement = await page.evaluate('document.documentElement')
      assert.deepStrictEqual(contextInfo, {
        isRoot: true,
        isCORS: false,
        selector: null,
        documentElement,
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

    it('return context info', async () => {
      await driver.url(url)
      await driver.switchToFrame(await driver.$('iframe[name="frame"]'))
      const contextInfo = await driver.execute(getContextInfo)
      const documentElement = await driver.execute('return document.documentElement')
      assert.deepStrictEqual(contextInfo, {
        isRoot: false,
        isCORS: false,
        selector: '/HTML[1]/BODY[1]/DIV[1]/IFRAME[1]',
        documentElement,
      })
    })

    it('return top context info', async () => {
      await driver.url(url)
      const contextInfo = await driver.execute(getContextInfo)
      const documentElement = await driver.execute('return document.documentElement')
      assert.deepStrictEqual(contextInfo, {
        isRoot: true,
        isCORS: false,
        selector: null,
        documentElement,
      })
    })
  })
})
