const assert = require('assert')
const {addPageMarker, cleanupPageMarker} = require('../dist/index')

describe('cleanupPageMarker', () => {
  const url = 'https://applitools.github.io/demo/TestPages/SnippetsTestPage/'

  describe('chrome', () => {
    let page

    before(async function() {
      page = await global.getDriver('chrome')
      if (!page) {
        this.skip()
      }
    })

    it('cleanup page marker', async () => {
      await page.url(url)
      await page.evaluate("document.body.style.transform = 'translate(-10px, -10px)'")
      await page.evaluate(addPageMarker)
      const element1 = await page.$('[data-applitools-marker]')
      assert.ok(element1)
      await page.evaluate(cleanupPageMarker)
      const element2 = await page.$('[data-applitools-marker]')
      assert.ok(!element2)
      const transform = await page.evaluate('document.body.style.transform')
      assert.strictEqual(transform, 'translate(-10px, -10px)')
    })
  })

  describe('ios safari', () => {
    let driver

    before(async function() {
      driver = await global.getDriver('ios safari')
      if (!driver) {
        this.skip()
      }
    })

    it('cleanup page marker', async () => {
      await driver.url(url)
      await driver.execute("document.body.style.transform = 'translate(-10px, -10px)'")
      await driver.execute(addPageMarker)
      const element1 = await driver.$('[data-applitools-marker]')
      assert.ok(element1.elementId)
      await driver.execute(cleanupPageMarker)
      const element2 = await driver.$('[data-applitools-marker]')
      assert.ok(!element2.elementId)
      const transform = await driver.execute('return document.body.style.transform')
      assert.strictEqual(transform, 'translate(-10px, -10px)')
    })
  })
})
